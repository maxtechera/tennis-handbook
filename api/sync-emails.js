import { sql } from '@vercel/postgres';

// Helper function to submit a single email to Kit.com
async function submitEmailToKit(email, metadata = {}) {
  const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
  const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID_ES || process.env.CONVERTKIT_FORM_ID;
  
  if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
    throw new Error('Missing ConvertKit configuration');
  }
  
  try {
    const payload = {
      api_secret: CONVERTKIT_API_SECRET,
      email: email,
      fields: {
        source: metadata.source || 'database-sync',
        synced_at: new Date().toISOString(),
        session_id: metadata.sessionId || 'sync-process',
        ...metadata
      },
      tags: [
        'tennis-handbook',
        'database-sync',
        'spanish'
      ]
    };
    
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to subscribe');
    }
    
    return { 
      success: true, 
      subscriberId: data.subscription?.subscriber?.id
    };
    
  } catch (error) {
    console.error(`Kit.com submission error for ${email}:`, error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  // Enable CORS for scheduled tasks
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // This endpoint can be called via GET (for cron jobs) or POST
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Add simple auth for security
  const authToken = req.headers.authorization || req.query.token;
  if (process.env.SYNC_AUTH_TOKEN && authToken !== `Bearer ${process.env.SYNC_AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log('🔄 Starting email sync process...');
    
    // Check if database is available
    if (!process.env.POSTGRES_URL) {
      return res.status(200).json({ 
        success: true,
        message: 'No database configured (development mode)',
        synced: 0
      });
    }

    // First, let's add the kit_submitted column if it doesn't exist
    try {
      await sql`
        ALTER TABLE email_captures 
        ADD COLUMN IF NOT EXISTS kit_submitted BOOLEAN DEFAULT FALSE
      `;
      
      await sql`
        ALTER TABLE email_captures 
        ADD COLUMN IF NOT EXISTS kit_subscriber_id TEXT
      `;
      
      await sql`
        ALTER TABLE email_captures 
        ADD COLUMN IF NOT EXISTS kit_submitted_at TIMESTAMP
      `;
      
      await sql`
        ALTER TABLE email_captures 
        ADD COLUMN IF NOT EXISTS sync_attempts INTEGER DEFAULT 0
      `;
      
      await sql`
        ALTER TABLE email_captures 
        ADD COLUMN IF NOT EXISTS last_sync_error TEXT
      `;
    } catch (alterError) {
      console.log('Column might already exist:', alterError.message);
    }

    // Get unsynced emails (with retry limit)
    const unsyncedEmails = await sql`
      SELECT id, email, source, metadata, created_at, sync_attempts
      FROM email_captures
      WHERE kit_submitted = FALSE
      AND sync_attempts < 3
      ORDER BY created_at ASC
      LIMIT 50
    `;

    console.log(`📧 Found ${unsyncedEmails.rows.length} unsynced emails`);

    const results = {
      total: unsyncedEmails.rows.length,
      synced: 0,
      failed: 0,
      errors: []
    };

    // Process each email
    for (const row of unsyncedEmails.rows) {
      try {
        console.log(`Processing email: ${row.email.split('@')[0]}@***`);
        
        // Submit to Kit.com
        const kitResult = await submitEmailToKit(row.email, {
          source: row.source,
          original_capture_date: row.created_at,
          ...row.metadata
        });
        
        // Update database with success
        await sql`
          UPDATE email_captures
          SET 
            kit_submitted = TRUE,
            kit_subscriber_id = ${kitResult.subscriberId},
            kit_submitted_at = NOW(),
            last_sync_error = NULL
          WHERE id = ${row.id}
        `;
        
        results.synced++;
        console.log(`✅ Synced: ${row.email.split('@')[0]}@***`);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to sync email ${row.id}:`, error.message);
        
        // Update sync attempts and error
        await sql`
          UPDATE email_captures
          SET 
            sync_attempts = sync_attempts + 1,
            last_sync_error = ${error.message}
          WHERE id = ${row.id}
        `;
        
        results.failed++;
        results.errors.push({
          email: row.email.split('@')[0] + '@***',
          error: error.message
        });
      }
    }

    // Log summary
    console.log('📊 Sync Summary:', {
      total: results.total,
      synced: results.synced,
      failed: results.failed,
      timestamp: new Date().toISOString()
    });

    // Also sync wizard submissions that have email but aren't marked as synced
    try {
      const wizardEmailsResult = await sql`
        SELECT DISTINCT ws.session_id, ws.data->>'email' as email
        FROM wizard_submissions ws
        LEFT JOIN email_captures ec ON ec.email = ws.data->>'email'
        WHERE ws.data->>'email' IS NOT NULL
        AND ws.data->>'email' != ''
        AND (ec.kit_submitted IS NULL OR ec.kit_submitted = FALSE)
        LIMIT 20
      `;

      console.log(`🧙 Found ${wizardEmailsResult.rows.length} wizard emails to sync`);

      for (const wizardRow of wizardEmailsResult.rows) {
        if (!wizardRow.email) continue;
        
        try {
          // First insert into email_captures if not exists
          await sql`
            INSERT INTO email_captures (email, source, metadata)
            VALUES (${wizardRow.email}, 'wizard-sync', ${JSON.stringify({ sessionId: wizardRow.session_id })})
            ON CONFLICT (email) DO NOTHING
          `;
          
          // Then submit to Kit
          const kitResult = await submitEmailToKit(wizardRow.email, {
            source: 'wizard-sync',
            sessionId: wizardRow.session_id
          });
          
          // Update as synced
          await sql`
            UPDATE email_captures
            SET 
              kit_submitted = TRUE,
              kit_subscriber_id = ${kitResult.subscriberId},
              kit_submitted_at = NOW()
            WHERE email = ${wizardRow.email}
          `;
          
          results.synced++;
          
        } catch (error) {
          console.error(`Failed to sync wizard email:`, error.message);
        }
      }
    } catch (wizardError) {
      console.error('Error syncing wizard emails:', wizardError.message);
    }

    return res.status(200).json({ 
      success: true,
      message: `Email sync completed`,
      results: {
        ...results,
        errors: results.errors.slice(0, 5) // Only return first 5 errors
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Sync process error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'Sync process failed',
      message: error.message
    });
  }
}
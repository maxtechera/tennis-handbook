import { sql } from '@vercel/postgres';
import { generateConvertKitTags, generateCustomFields } from './utils/convertkit-tags.js';

// Helper function to submit to Kit.com (ConvertKit)
async function submitToKitCom(email, sessionId, wizardData = {}) {
  const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
  const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID_ES || process.env.CONVERTKIT_FORM_ID;
  
  if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
    console.error('Missing ConvertKit configuration');
    return { success: false, error: 'Missing configuration' };
  }
  
  try {
    // Generate comprehensive tags and custom fields
    const tagData = {
      email,
      source: 'wizard-start',
      language: 'es', // Spanish form primarily
      sessionId,
      wizardData,
      timestamp: new Date()
    };
    
    const tags = generateConvertKitTags(tagData);
    const customFields = generateCustomFields(tagData);
    
    const payload = {
      api_secret: CONVERTKIT_API_SECRET,
      email: email,
      fields: {
        ...customFields,
        source: 'wizard-start',
        wizard_started: 'yes',
        wizard_started_at: new Date().toISOString(),
        session_id: sessionId
      },
      tags: tags
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
      console.error('ConvertKit error:', data);
      return { success: false, error: data.message || 'Failed to subscribe' };
    }
    
    console.log('✅ Kit.com submission successful for:', email.split('@')[0] + '@***');
    
    // Return the download link if available
    // In Kit.com, you'd typically set up an automation to send the PDF
    // Here we'll return a success indicator
    return { 
      success: true, 
      subscriberId: data.subscription?.subscriber?.id,
      // You can add the actual download link here if Kit.com returns it
      // or if you have it configured in your environment
      downloadLink: process.env.PDF_DOWNLOAD_LINK || null
    };
    
  } catch (error) {
    console.error('Kit.com submission error:', error);
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://tenis.mtech.uy",
    "https://www.tenis.mtech.uy",
    "https://tennis-handbook.vercel.app",
    "https://tennis-workout.vercel.app",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || (origin && origin.startsWith("http://localhost:"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, sessionId, source = 'wizard', wizardData = {} } = req.body;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    
    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;
    
    // Get metadata
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    
    if (isDatabaseAvailable) {
      // Quick email capture - try with new columns first, fallback to basic
      try {
        await sql`
          INSERT INTO email_captures (
            email, 
            source, 
            metadata, 
            kit_submitted, 
            kit_subscriber_id, 
            kit_submitted_at,
            processing_started_at
          )
          VALUES (
            ${email}, 
            ${source}, 
            ${JSON.stringify({ sessionId })},
            FALSE,
            NULL,
            NULL,
            NOW()
          )
          ON CONFLICT (email) DO UPDATE SET
            source = EXCLUDED.source,
            metadata = EXCLUDED.metadata,
            processing_started_at = NOW()
        `;
      } catch (error) {
        // Fallback to basic columns if new columns don't exist
        if (error.code === '42703') { // column does not exist
          console.log('Using basic email_captures schema');
          await sql`
            INSERT INTO email_captures (
              email, 
              source, 
              metadata
            )
            VALUES (
              ${email}, 
              ${source}, 
              ${JSON.stringify({ sessionId })}
            )
            ON CONFLICT (email) DO UPDATE SET
              source = EXCLUDED.source,
              metadata = EXCLUDED.metadata
          `;
        } else {
          throw error;
        }
      }
      
      // Create wizard submission entry
      await sql`
        INSERT INTO wizard_submissions (
          session_id, 
          current_step,
          user_agent,
          ip_address,
          created_at
        ) VALUES (
          ${sessionId},
          0,
          ${userAgent},
          ${ip},
          NOW()
        )
        ON CONFLICT (session_id) DO NOTHING
      `;
      
      // Track conversion event
      await sql`
        INSERT INTO conversion_events (event_type, event_data, session_id)
        VALUES ('wizard_start', ${JSON.stringify({ email, source })}, ${sessionId})
      `;
    } else {
      // Development mode - just log the data
      console.log('📧 Email captured (development mode - no database):', {
        email: email.split('@')[0] + '@***',
        sessionId,
        source,
        timestamp: new Date().toISOString()
      });
    }
    
    // Submit to Kit.com (ConvertKit)
    console.log('📤 Submitting to Kit.com with comprehensive tags...');
    const kitResult = await submitToKitCom(email, sessionId, wizardData);
    
    if (!kitResult.success) {
      console.error('Kit.com submission failed:', kitResult.error);
      // Continue anyway - we don't want to block the user
    } else if (isDatabaseAvailable && kitResult.success) {
      // Update the email_captures table to mark as synced
      try {
        await sql`
          UPDATE email_captures
          SET 
            kit_submitted = TRUE,
            kit_subscriber_id = ${kitResult.subscriberId || null},
            kit_submitted_at = NOW()
          WHERE email = ${email}
        `;
        console.log('✅ Marked email as synced in database');
      } catch (updateError) {
        // If columns don't exist, just log and continue
        if (updateError.code === '42703') {
          console.log('Kit sync columns not available in production yet');
        } else {
          console.error('Failed to update sync status:', updateError);
        }
      }
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Email captured successfully',
      development: !isDatabaseAvailable,
      kitSubmitted: kitResult.success,
      downloadLink: kitResult.downloadLink,
      subscriberId: kitResult.subscriberId
    });
    
  } catch (error) {
    console.error('Error in wizard start:', error);
    
    // If database error in development, still succeed
    if (!process.env.POSTGRES_URL && error.code === 'missing_connection_string') {
      console.log('📧 Fallback: Email would be captured in production');
      return res.status(200).json({ 
        success: true,
        message: 'Email captured (development mode)',
        development: true
      });
    }
    
    return res.status(500).json({ error: 'Failed to capture email' });
  }
}
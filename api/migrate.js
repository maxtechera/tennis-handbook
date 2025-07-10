import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Security: Only allow POST method and add some basic auth
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Basic auth check
  const authToken = req.headers.authorization || req.body.token;
  if (!authToken || authToken !== `Bearer ${process.env.MIGRATION_SECRET || 'tennis-migrate-2025'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting database migration...');
    
    const results = [];
    
    // 1. Add ConvertKit sync columns to email_captures
    const emailCaptureColumns = [
      { name: 'kit_submitted', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'kit_subscriber_id', type: 'TEXT' },
      { name: 'kit_submitted_at', type: 'TIMESTAMP' },
      { name: 'sync_attempts', type: 'INTEGER DEFAULT 0' },
      { name: 'last_sync_error', type: 'TEXT' },
      { name: 'processing_started_at', type: 'TIMESTAMP' },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()' }
    ];
    
    for (const column of emailCaptureColumns) {
      try {
        await sql`
          ALTER TABLE email_captures 
          ADD COLUMN IF NOT EXISTS ${sql.identifier([column.name])} ${sql.raw(column.type)}
        `;
        results.push(`✅ Added column: email_captures.${column.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          results.push(`ℹ️  Column already exists: email_captures.${column.name}`);
        } else {
          results.push(`❌ Error adding email_captures.${column.name}: ${error.message}`);
        }
      }
    }
    
    // 2. Add unique constraint on email if it doesn't exist
    try {
      await sql`
        ALTER TABLE email_captures 
        ADD CONSTRAINT email_captures_email_unique UNIQUE (email)
      `;
      results.push('✅ Added unique constraint on email_captures.email');
    } catch (error) {
      if (error.message.includes('already exists')) {
        results.push('ℹ️  Email unique constraint already exists');
      } else {
        results.push(`❌ Error adding unique constraint: ${error.message}`);
      }
    }
    
    // 3. Update existing records with default values
    try {
      const updateResult = await sql`
        UPDATE email_captures 
        SET kit_submitted = FALSE 
        WHERE kit_submitted IS NULL
      `;
      results.push(`✅ Updated ${updateResult.count || 0} existing records with default kit_submitted value`);
    } catch (error) {
      results.push(`ℹ️  kit_submitted update skipped: ${error.message}`);
    }
    
    // 4. Add wizard submission columns if they don't exist
    const wizardColumns = [
      'micro_quiz',
      'goals_quiz', 
      'time_quiz',
      'focus_quiz',
      'personal_info',
      'tennis_experience',
      'training_goals',
      'schedule_preferences',
      'physical_profile',
      'welcome',
      'welcome_success',
      'personalization',
      'background',
      'challenges',
      'analyzing',
      'completion'
    ];
    
    for (const column of wizardColumns) {
      try {
        await sql`
          ALTER TABLE wizard_submissions 
          ADD COLUMN IF NOT EXISTS ${sql.identifier([column])} JSONB
        `;
        results.push(`✅ Added column: wizard_submissions.${column}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          results.push(`ℹ️  Column already exists: wizard_submissions.${column}`);
        } else {
          results.push(`❌ Error adding wizard_submissions.${column}: ${error.message}`);
        }
      }
    }
    
    // 5. Check final table structures
    try {
      const emailCapturesInfo = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'email_captures'
        ORDER BY ordinal_position
      `;
      
      const wizardSubmissionsInfo = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'wizard_submissions'
        ORDER BY ordinal_position
      `;
      
      results.push('📋 Migration completed successfully!');
      results.push(`email_captures table has ${emailCapturesInfo.rows.length} columns`);
      results.push(`wizard_submissions table has ${wizardSubmissionsInfo.rows.length} columns`);
      
    } catch (error) {
      results.push(`⚠️  Could not verify table structure: ${error.message}`);
    }
    
    return res.status(200).json({
      success: true,
      message: 'Database migration completed',
      results: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
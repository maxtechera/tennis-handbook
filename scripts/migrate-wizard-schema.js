import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateWizardSchema() {
  try {
    console.log('🔄 Starting wizard schema migration...');
    
    // Add new columns to wizard_submissions table
    const newColumns = [
      'micro_quiz',
      'goals_quiz', 
      'time_quiz',
      'focus_quiz',
      'welcome',
      'welcome_success',
      'personalization',
      'background',
      'challenges',
      'analyzing',
      'completion'
    ];
    
    for (const column of newColumns) {
      try {
        await sql`
          ALTER TABLE wizard_submissions 
          ADD COLUMN IF NOT EXISTS ${sql.identifier([column])} JSONB
        `;
        console.log(`✅ Added column: ${column}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Column already exists: ${column}`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Wizard schema migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateWizardSchema();
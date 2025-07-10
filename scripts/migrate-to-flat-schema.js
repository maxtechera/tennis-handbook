import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateToFlatSchema() {
  try {
    console.log('🔄 Starting migration to flat schema...');
    
    // Add new flat columns to wizard_submissions table
    const newColumns = [
      // User Profile
      { name: 'email', type: 'TEXT' },
      { name: 'name', type: 'TEXT' },
      { name: 'age', type: 'TEXT' },
      { name: 'gender', type: 'TEXT' },
      { name: 'location', type: 'TEXT' },
      { name: 'whatsapp', type: 'TEXT' },
      { name: 'language', type: 'TEXT DEFAULT \'en\'' },
      
      // Tennis Profile
      { name: 'tennis_level', type: 'TEXT' },
      { name: 'tennis_goal', type: 'TEXT' },
      { name: 'years_playing', type: 'TEXT' },
      { name: 'plays_competitively', type: 'BOOLEAN DEFAULT false' },
      { name: 'playing_style', type: 'TEXT' },
      { name: 'favorite_shot', type: 'TEXT' },
      
      // Training Preferences
      { name: 'time_availability', type: 'TEXT' },
      { name: 'preferred_times', type: 'TEXT[]' },
      { name: 'focus_areas', type: 'TEXT[]' },
      { name: 'primary_focus', type: 'TEXT' },
      { name: 'commitment_level', type: 'TEXT' },
      
      // Physical Profile
      { name: 'fitness_level', type: 'TEXT' },
      { name: 'main_challenges', type: 'TEXT[]' },
      { name: 'injuries', type: 'TEXT[]' },
      
      // Engagement Metrics
      { name: 'micro_quiz_engagement', type: 'INTEGER' },
      { name: 'goals_quiz_engagement', type: 'INTEGER' },
      { name: 'time_quiz_engagement', type: 'INTEGER' },
      { name: 'focus_quiz_engagement', type: 'INTEGER' },
      
      // Conversion Data
      { name: 'accepted_terms', type: 'BOOLEAN DEFAULT false' },
      { name: 'newsletter', type: 'BOOLEAN DEFAULT false' },
      { name: 'downloaded_pdf', type: 'BOOLEAN DEFAULT false' },
      
      // AI/Calculated fields
      { name: 'ai_recommendations', type: 'TEXT[]' },
      { name: 'personalized_path', type: 'TEXT' },
      
      // Tags for export
      { name: 'tags', type: 'TEXT[]' },
      
      // Raw data backup
      { name: 'raw_data', type: 'JSONB' },
      
      // Additional UTM fields
      { name: 'utm_content', type: 'TEXT' },
      { name: 'utm_term', type: 'TEXT' },
    ];
    
    // Add each column if it doesn't exist
    for (const column of newColumns) {
      try {
        await sql`
          ALTER TABLE wizard_submissions 
          ADD COLUMN IF NOT EXISTS ${sql.identifier([column.name])} ${sql.raw(column.type)}
        `;
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Column already exists: ${column.name}`);
        } else {
          console.error(`❌ Error adding column ${column.name}:`, error.message);
        }
      }
    }
    
    // Add new indexes
    const indexes = [
      { name: 'wizard_email_idx', column: 'email' },
      { name: 'segment_idx', column: 'user_segment' },
      { name: 'level_idx', column: 'tennis_level' },
      { name: 'goal_idx', column: 'tennis_goal' },
    ];
    
    for (const index of indexes) {
      try {
        await sql`
          CREATE INDEX IF NOT EXISTS ${sql.identifier([index.name])} 
          ON wizard_submissions(${sql.identifier([index.column])})
        `;
        console.log(`✅ Added index: ${index.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Index already exists: ${index.name}`);
        } else {
          console.error(`❌ Error adding index ${index.name}:`, error.message);
        }
      }
    }
    
    console.log('✅ Flat schema migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateToFlatSchema();
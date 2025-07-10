import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateEmailCapturesTable() {
  try {
    console.log('🔄 Starting email_captures table migration...');
    
    // Add ConvertKit sync columns
    const columnsToAdd = [
      { name: 'kit_submitted', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'kit_subscriber_id', type: 'TEXT' },
      { name: 'kit_submitted_at', type: 'TIMESTAMP' },
      { name: 'sync_attempts', type: 'INTEGER DEFAULT 0' },
      { name: 'last_sync_error', type: 'TEXT' },
      { name: 'processing_started_at', type: 'TIMESTAMP' },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()' }
    ];
    
    for (const column of columnsToAdd) {
      try {
        await sql`
          ALTER TABLE email_captures 
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
    
    // Update existing records to have default values
    try {
      await sql`
        UPDATE email_captures 
        SET kit_submitted = FALSE 
        WHERE kit_submitted IS NULL
      `;
      console.log('✅ Updated existing records with default kit_submitted value');
    } catch (error) {
      console.log('ℹ️  kit_submitted update skipped:', error.message);
    }
    
    // Add email uniqueness constraint if it doesn't exist
    try {
      await sql`
        ALTER TABLE email_captures 
        ADD CONSTRAINT email_captures_email_unique UNIQUE (email)
      `;
      console.log('✅ Added unique constraint on email');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Email unique constraint already exists');
      } else {
        console.error('❌ Error adding unique constraint:', error.message);
      }
    }
    
    // Check final table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'email_captures'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📋 Final email_captures table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`);
    });
    
    console.log('\n✅ Email captures table migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateEmailCapturesTable();
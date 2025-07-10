// Script to add app_stats table to existing database
// Run with: node scripts/add-app-stats-table.js

import { sql } from '@vercel/postgres';

async function addAppStatsTable() {
  try {
    console.log('Adding app_stats table...');
    
    // Create app_stats table
    await sql`
      CREATE TABLE IF NOT EXISTS app_stats (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        stat_type TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        session_id TEXT,
        user_id UUID REFERENCES users(id),
        metadata JSONB,
        user_agent TEXT,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Created app_stats table');
    
    // Create indexes one by one for Neon DB compatibility
    await sql`
      CREATE INDEX IF NOT EXISTS stat_type_idx ON app_stats(stat_type)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS stat_session_idx ON app_stats(session_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS stat_user_idx ON app_stats(user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS stat_created_idx ON app_stats(created_at)
    `;
    
    console.log('✅ Created indexes for app_stats');
    console.log('✨ App stats table added successfully!');
    
  } catch (error) {
    console.error('Error adding app_stats table:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  addAppStatsTable();
}
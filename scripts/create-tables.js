// Script to create database tables in Vercel Postgres
// Run with: node scripts/create-tables.js

import { sql } from '@vercel/postgres';

async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        convertkit_subscriber_id TEXT,
        convertkit_tags TEXT[],
        language TEXT DEFAULT 'en',
        country TEXT,
        whatsapp TEXT
      );
    `;
    console.log('✅ Created users table');
    
    // Create email index
    await sql`
      CREATE INDEX IF NOT EXISTS email_idx ON users(email);
    `;
    
    // Create wizard_submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS wizard_submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        session_id TEXT NOT NULL UNIQUE,
        current_step INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        personal_info JSONB,
        tennis_experience JSONB,
        training_goals JSONB,
        schedule_preferences JSONB,
        physical_profile JSONB,
        user_segment TEXT,
        user_agent TEXT,
        ip_address TEXT,
        referrer TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✅ Created wizard_submissions table');
    
    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS session_idx ON wizard_submissions(session_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS user_idx ON wizard_submissions(user_id)
    `;
    
    // Create email_captures table
    await sql`
      CREATE TABLE IF NOT EXISTS email_captures (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL,
        source TEXT NOT NULL,
        captured_at TIMESTAMP DEFAULT NOW() NOT NULL,
        converted_to_user BOOLEAN DEFAULT FALSE,
        metadata JSONB
      );
    `;
    console.log('✅ Created email_captures table');
    
    // Create index
    await sql`
      CREATE INDEX IF NOT EXISTS email_source_idx ON email_captures(email, source);
    `;
    
    // Create conversion_events table
    await sql`
      CREATE TABLE IF NOT EXISTS conversion_events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        event_type TEXT NOT NULL,
        event_data JSONB,
        session_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✅ Created conversion_events table');
    
    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS event_type_idx ON conversion_events(event_type)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS event_session_idx ON conversion_events(session_id)
    `;
    
    console.log('✨ All tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  createTables();
}
// Script to create database tables with flat schema for Neon DB
// Run with: node scripts/create-flat-tables.js

import { sql } from '@vercel/postgres';

async function createTables() {
  try {
    console.log('Creating database tables with flat schema...');
    
    // Drop existing tables if needed (comment out in production)
    console.log('Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS conversion_events CASCADE`;
    await sql`DROP TABLE IF EXISTS email_captures CASCADE`;
    await sql`DROP TABLE IF EXISTS wizard_submissions CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    
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
      )
    `;
    console.log('✅ Created users table');
    
    // Create email index
    await sql`
      CREATE INDEX IF NOT EXISTS email_idx ON users(email)
    `;
    
    // Create wizard_submissions table with flat schema
    await sql`
      CREATE TABLE IF NOT EXISTS wizard_submissions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        session_id TEXT NOT NULL UNIQUE,
        current_step INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        
        -- User Profile - Flat fields
        email TEXT,
        name TEXT,
        age TEXT,
        gender TEXT,
        location TEXT,
        whatsapp TEXT,
        language TEXT DEFAULT 'en',
        
        -- Tennis Profile - Flat fields
        tennis_level TEXT,
        tennis_goal TEXT,
        years_playing TEXT,
        plays_competitively BOOLEAN DEFAULT false,
        playing_style TEXT,
        favorite_shot TEXT,
        
        -- Training Preferences - Flat fields
        time_availability TEXT,
        preferred_times TEXT[],
        focus_areas TEXT[],
        primary_focus TEXT,
        commitment_level TEXT,
        
        -- Physical Profile - Flat fields
        fitness_level TEXT,
        main_challenges TEXT[],
        injuries TEXT[],
        
        -- Engagement Metrics - Flat fields
        micro_quiz_engagement INTEGER,
        goals_quiz_engagement INTEGER,
        time_quiz_engagement INTEGER,
        focus_quiz_engagement INTEGER,
        
        -- Conversion Data - Flat fields
        accepted_terms BOOLEAN DEFAULT false,
        newsletter BOOLEAN DEFAULT false,
        downloaded_pdf BOOLEAN DEFAULT false,
        
        -- AI/Calculated fields
        user_segment TEXT,
        ai_recommendations TEXT[],
        personalized_path TEXT,
        
        -- Tags for export
        tags TEXT[],
        
        -- Raw data backup
        raw_data JSONB,
        
        -- Metadata
        user_agent TEXT,
        ip_address TEXT,
        referrer TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_content TEXT,
        utm_term TEXT,
        
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    console.log('✅ Created wizard_submissions table with flat schema');
    
    // Create indexes one by one for Neon DB compatibility
    await sql`
      CREATE INDEX IF NOT EXISTS session_idx ON wizard_submissions(session_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS user_idx ON wizard_submissions(user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS wizard_email_idx ON wizard_submissions(email)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS segment_idx ON wizard_submissions(user_segment)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS level_idx ON wizard_submissions(tennis_level)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS goal_idx ON wizard_submissions(tennis_goal)
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
      )
    `;
    console.log('✅ Created email_captures table');
    
    // Create index
    await sql`
      CREATE INDEX IF NOT EXISTS email_source_idx ON email_captures(email, source)
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
      )
    `;
    console.log('✅ Created conversion_events table');
    
    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS event_type_idx ON conversion_events(event_type)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS event_session_idx ON conversion_events(session_id)
    `;
    
    console.log('✨ All tables created successfully with flat schema!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  createTables();
}
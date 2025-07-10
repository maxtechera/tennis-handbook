import { sql } from '@vercel/postgres';

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
    const { email, sessionId, source = 'wizard' } = req.body;
    
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
      // Quick email capture
      await sql`
        INSERT INTO email_captures (email, source, metadata)
        VALUES (${email}, ${source}, ${JSON.stringify({ sessionId })})
      `;
      
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
    
    return res.status(200).json({ 
      success: true,
      message: 'Email captured successfully',
      development: !isDatabaseAvailable
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
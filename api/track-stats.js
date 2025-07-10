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

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // Get total count for a specific stat type
    try {
      const { statType = 'balls_thrown' } = req.query;
      
      // Check if database is available
      if (!process.env.POSTGRES_URL) {
        // Return demo data in development
        return res.status(200).json({ 
          total: 42069,
          recent: 420,
          statType
        });
      }
      
      // Get total count from database
      const result = await sql`
        SELECT COALESCE(SUM(count), 0) as total
        FROM app_stats
        WHERE stat_type = ${statType}
      `;
      
      const total = parseInt(result.rows[0]?.total || 0);
      
      // Also get recent activity count (last 24 hours)
      const recentResult = await sql`
        SELECT COALESCE(SUM(count), 0) as recent
        FROM app_stats
        WHERE stat_type = ${statType}
        AND created_at >= NOW() - INTERVAL '24 HOURS'
      `;
      
      const recent = parseInt(recentResult.rows[0]?.recent || 0);
      
      return res.status(200).json({ 
        total,
        recent,
        statType
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return cached/default values on error
      return res.status(200).json({ 
        total: 1337,
        recent: 42,
        statType: req.query.statType || 'balls_thrown'
      });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { events } = req.body; // Array of events to batch process
    
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "Events array is required" });
    }
    
    // Check if database is available
    if (!process.env.POSTGRES_URL) {
      // Return success even without database
      return res.status(200).json({ 
        success: true,
        totals: {},
        eventsProcessed: events.length,
        demo: true
      });
    }
    
    // Get user agent and IP
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    
    // Process events in batch
    const promises = events.map(event => {
      const { statType, count = 1, sessionId, userId, metadata = {} } = event;
      
      return sql`
        INSERT INTO app_stats (
          stat_type, 
          count, 
          session_id, 
          user_id, 
          metadata, 
          user_agent, 
          ip_address
        )
        VALUES (
          ${statType},
          ${count},
          ${sessionId || null},
          ${userId || null},
          ${JSON.stringify(metadata)},
          ${userAgent},
          ${ip}
        )
      `;
    });
    
    await Promise.all(promises);
    
    // Get updated totals for the stat types
    const statTypes = [...new Set(events.map(e => e.statType))];
    const totals = {};
    
    for (const statType of statTypes) {
      const result = await sql`
        SELECT COALESCE(SUM(count), 0) as total
        FROM app_stats
        WHERE stat_type = ${statType}
      `;
      totals[statType] = parseInt(result.rows[0]?.total || 0);
    }
    
    return res.status(200).json({ 
      success: true, 
      totals,
      eventsProcessed: events.length 
    });
    
  } catch (error) {
    console.error('Error tracking stats:', error);
    // Still return success to not break the UI
    return res.status(200).json({ 
      success: true,
      error: error.message,
      eventsProcessed: 0
    });
  }
}
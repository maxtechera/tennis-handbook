import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface StatEvent {
  statType: string;
  count?: number;
  sessionId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface TrackStatsRequest {
  events: StatEvent[];
}

interface StatsResponse {
  total: number;
  recent: number;
  statType: string;
}

interface TrackStatsResponse {
  success: boolean;
  totals: Record<string, number>;
  eventsProcessed: number;
  demo?: boolean;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  if (allowedOrigins.includes(origin as string) || (origin && origin.startsWith("http://localhost:"))) {
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
        const response: StatsResponse = {
          total: 42069,
          recent: 420,
          statType: statType as string
        };
        return res.status(200).json(response);
      }
      
      // Get total count from database
      const result = await sql`
        SELECT COALESCE(SUM(count), 0) as total
        FROM app_stats
        WHERE stat_type = ${statType as string}
      `;
      
      const total = parseInt(result.rows[0]?.total || '0');
      
      // Also get recent activity count (last 24 hours)
      const recentResult = await sql`
        SELECT COALESCE(SUM(count), 0) as recent
        FROM app_stats
        WHERE stat_type = ${statType as string}
        AND created_at >= NOW() - INTERVAL '24 HOURS'
      `;
      
      const recent = parseInt(recentResult.rows[0]?.recent || '0');
      
      const response: StatsResponse = {
        total,
        recent,
        statType: statType as string
      };
      
      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      // Return cached/default values on error
      const response: StatsResponse = {
        total: 1337,
        recent: 42,
        statType: (req.query.statType as string) || 'balls_thrown'
      };
      return res.status(200).json(response);
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { events }: TrackStatsRequest = req.body; // Array of events to batch process
    
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "Events array is required" });
    }
    
    // Check if database is available
    if (!process.env.POSTGRES_URL) {
      // Return success even without database
      const response: TrackStatsResponse = {
        success: true,
        totals: {},
        eventsProcessed: events.length,
        demo: true
      };
      return res.status(200).json(response);
    }
    
    // Get user agent and IP
    const userAgent = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] as string) || 
              (req.headers['x-real-ip'] as string) || 
              'unknown';
    
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
    const statTypes = Array.from(new Set(events.map(e => e.statType)));
    const totals: Record<string, number> = {};
    
    for (const statType of statTypes) {
      const result = await sql`
        SELECT COALESCE(SUM(count), 0) as total
        FROM app_stats
        WHERE stat_type = ${statType}
      `;
      totals[statType] = parseInt(result.rows[0]?.total || '0');
    }
    
    const response: TrackStatsResponse = {
      success: true,
      totals,
      eventsProcessed: events.length
    };
    
    return res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Error tracking stats:', error);
    // Still return success to not break the UI
    const response: TrackStatsResponse = {
      success: true,
      error: error.message,
      eventsProcessed: 0,
      totals: {}
    };
    return res.status(200).json(response);
  }
}
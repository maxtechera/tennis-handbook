import { sql } from '@vercel/postgres';
import { devStorage } from './dev-storage.js';

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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { days = '7' } = req.query;
    const daysInt = parseInt(days);
    
    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;
    
    let analyticsData;
    
    if (isDatabaseAvailable) {
      // Get funnel stats from database
      const funnelStats = await sql`
        SELECT 
          COUNT(DISTINCT CASE WHEN event_type = 'wizard_start' THEN session_id END) as starts,
          COUNT(DISTINCT CASE WHEN event_type = 'email_capture' THEN session_id END) as emails,
          COUNT(DISTINCT CASE WHEN event_type = 'wizard_complete' THEN session_id END) as completes,
          COUNT(DISTINCT CASE WHEN event_type = 'pdf_download' THEN session_id END) as downloads
        FROM conversion_events
        WHERE created_at >= NOW() - INTERVAL '${daysInt} days'
      `;
      
      // Get completion rate by segment
      const segmentStats = await sql`
        SELECT 
          user_segment,
          COUNT(*) as total,
          COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed
        FROM wizard_submissions
        WHERE created_at >= NOW() - INTERVAL '${daysInt} days'
        AND user_segment IS NOT NULL
        GROUP BY user_segment
      `;
      
      // Get email capture sources
      const emailSources = await sql`
        SELECT 
          source,
          COUNT(*) as count
        FROM email_captures
        WHERE captured_at >= NOW() - INTERVAL '${daysInt} days'
        GROUP BY source
        ORDER BY count DESC
      `;
      
      // Calculate conversion rates
      const funnel = funnelStats.rows[0];
      const conversionRates = {
        emailCapture: funnel.starts > 0 
          ? ((funnel.emails / funnel.starts) * 100).toFixed(1) 
          : '0',
        completion: funnel.emails > 0 
          ? ((funnel.completes / funnel.emails) * 100).toFixed(1) 
          : '0',
        pdfDownload: funnel.completes > 0 
          ? ((funnel.downloads / funnel.completes) * 100).toFixed(1) 
          : '0',
      };
      
      analyticsData = {
        period: `${days} days`,
        funnel: {
          starts: funnel.starts || 0,
          emails: funnel.emails || 0,
          completes: funnel.completes || 0,
          downloads: funnel.downloads || 0,
        },
        conversionRates,
        segmentStats: segmentStats.rows,
        emailSources: emailSources.rows,
      };
    } else {
      // Development mode - use local storage
      analyticsData = devStorage.getAnalytics(daysInt);
      analyticsData.period = `${days} days`;
      analyticsData.development = true;
    }
    
    return res.status(200).json(analyticsData);
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    
    // If database error in development, use local storage
    if (!process.env.POSTGRES_URL && error.code === 'missing_connection_string') {
      const { days = '7' } = req.query;
      const analyticsData = devStorage.getAnalytics(parseInt(days));
      analyticsData.period = `${days} days`;
      analyticsData.development = true;
      
      return res.status(200).json(analyticsData);
    }
    
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
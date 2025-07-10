import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface FunnelStats {
  starts: number;
  emails: number;
  completes: number;
  downloads: number;
}

interface ConversionRates {
  emailCapture: string;
  completion: string;
  pdfDownload: string;
}

interface SegmentStat {
  user_segment: string;
  total: number;
  completed: number;
}

interface EmailSource {
  source: string;
  count: number;
}

interface AnalyticsResponse {
  period: string;
  funnel: FunnelStats;
  conversionRates: ConversionRates;
  segmentStats: SegmentStat[];
  emailSources: EmailSource[];
  development?: boolean;
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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { days = '7' } = req.query;
    const daysInt = parseInt(days as string);
    
    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;
    
    let analyticsData: AnalyticsResponse;
    
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
      const conversionRates: ConversionRates = {
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
        segmentStats: segmentStats.rows as SegmentStat[],
        emailSources: emailSources.rows as EmailSource[],
      };
    } else {
      // Development mode - return empty analytics
      analyticsData = {
        funnel: { starts: 0, emails: 0, completes: 0, downloads: 0 },
        conversionRates: {
          emailCapture: '0',
          completion: '0',
          pdfDownload: '0'
        },
        segmentStats: [],
        emailSources: [],
        period: `${days} days`,
        development: true
      };
    }
    
    return res.status(200).json(analyticsData);
    
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    
    // If database error in development, return empty data
    if (!process.env.POSTGRES_URL && error.code === 'missing_connection_string') {
      const { days = '7' } = req.query;
      
      return res.status(200).json({
        funnel: { starts: 0, emails: 0, completes: 0, downloads: 0 },
        conversionRates: {
          emailCapture: '0',
          completion: '0',
          pdfDownload: '0'
        },
        segmentStats: [],
        emailSources: [],
        period: `${days} days`,
        development: true
      });
    }
    
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}
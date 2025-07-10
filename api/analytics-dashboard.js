import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS for localhost development
  const origin = req.headers.origin;
  if (origin && origin.startsWith("http://localhost:")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Get various analytics
    const [
      totalUsers,
      segmentStats,
      levelStats,
      goalStats,
      tagStats,
      recentSubmissions,
      conversionRates
    ] = await Promise.all([
      // Total users
      sql`SELECT COUNT(DISTINCT email) as count FROM wizard_submissions`,
      
      // Segment breakdown
      sql`
        SELECT 
          user_segment,
          COUNT(*) as count
        FROM wizard_submissions
        WHERE user_segment IS NOT NULL
        GROUP BY user_segment
        ORDER BY count DESC
      `,
      
      // Tennis level breakdown
      sql`
        SELECT 
          tennis_level,
          COUNT(*) as count
        FROM wizard_submissions
        WHERE tennis_level IS NOT NULL
        GROUP BY tennis_level
        ORDER BY count DESC
      `,
      
      // Goal breakdown
      sql`
        SELECT 
          tennis_goal,
          COUNT(*) as count
        FROM wizard_submissions
        WHERE tennis_goal IS NOT NULL
        GROUP BY tennis_goal
        ORDER BY count DESC
      `,
      
      // Top tags
      sql`
        SELECT 
          unnest(tags) as tag,
          COUNT(*) as count
        FROM wizard_submissions
        WHERE tags IS NOT NULL
        GROUP BY tag
        ORDER BY count DESC
        LIMIT 20
      `,
      
      // Recent submissions
      sql`
        SELECT 
          session_id,
          email,
          name,
          tennis_level,
          tennis_goal,
          user_segment,
          created_at
        FROM wizard_submissions
        ORDER BY created_at DESC
        LIMIT 10
      `,
      
      // Conversion rates
      sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
          COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed,
          COUNT(CASE WHEN newsletter = true THEN 1 END) as newsletter,
          COUNT(CASE WHEN whatsapp IS NOT NULL THEN 1 END) as whatsapp,
          COUNT(CASE WHEN downloaded_pdf = true THEN 1 END) as pdf_downloads
        FROM wizard_submissions
      `
    ]);

    const stats = {
      total_users: totalUsers.rows[0].count,
      segments: segmentStats.rows,
      levels: levelStats.rows,
      goals: goalStats.rows,
      top_tags: tagStats.rows,
      recent_submissions: recentSubmissions.rows,
      conversion_rates: {
        email_capture: conversionRates.rows[0].with_email / conversionRates.rows[0].total * 100,
        completion: conversionRates.rows[0].completed / conversionRates.rows[0].total * 100,
        newsletter: conversionRates.rows[0].newsletter / conversionRates.rows[0].with_email * 100,
        whatsapp: conversionRates.rows[0].whatsapp / conversionRates.rows[0].with_email * 100,
        pdf_download: conversionRates.rows[0].pdf_downloads / conversionRates.rows[0].completed * 100
      }
    };

    return res.status(200).json(stats);
    
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Failed to get analytics' });
  }
}
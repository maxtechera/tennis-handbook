import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: Add simple auth for security
  const authToken = req.headers.authorization || req.query.token;
  if (process.env.SYNC_AUTH_TOKEN && authToken !== `Bearer ${process.env.SYNC_AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Check if database is available
    if (!process.env.POSTGRES_URL) {
      return res.status(200).json({ 
        success: true,
        message: 'No database configured (development mode)',
        stats: {
          total: 0,
          synced: 0,
          pending: 0,
          failed: 0
        }
      });
    }

    // Get sync statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN kit_submitted = TRUE THEN 1 END) as synced,
        COUNT(CASE WHEN kit_submitted = FALSE AND sync_attempts < 3 THEN 1 END) as pending,
        COUNT(CASE WHEN kit_submitted = FALSE AND sync_attempts >= 3 THEN 1 END) as failed
      FROM email_captures
    `;

    // Get recent sync activity
    const recentSyncs = await sql`
      SELECT 
        email,
        source,
        kit_submitted,
        kit_submitted_at,
        sync_attempts,
        last_sync_error
      FROM email_captures
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get failed syncs that need attention
    const failedSyncs = await sql`
      SELECT 
        email,
        source,
        sync_attempts,
        last_sync_error,
        created_at
      FROM email_captures
      WHERE kit_submitted = FALSE
      AND sync_attempts >= 3
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // Sanitize email addresses for privacy
    const sanitizeEmail = (email) => {
      const [name, domain] = email.split('@');
      return `${name.substring(0, 3)}***@${domain}`;
    };

    return res.status(200).json({ 
      success: true,
      stats: {
        total: parseInt(stats.rows[0].total),
        synced: parseInt(stats.rows[0].synced),
        pending: parseInt(stats.rows[0].pending),
        failed: parseInt(stats.rows[0].failed),
        syncRate: stats.rows[0].total > 0 
          ? Math.round((stats.rows[0].synced / stats.rows[0].total) * 100) 
          : 0
      },
      recentActivity: recentSyncs.rows.map(row => ({
        email: sanitizeEmail(row.email),
        source: row.source,
        synced: row.kit_submitted,
        syncedAt: row.kit_submitted_at,
        attempts: row.sync_attempts,
        error: row.last_sync_error
      })),
      failedSyncs: failedSyncs.rows.map(row => ({
        email: sanitizeEmail(row.email),
        source: row.source,
        attempts: row.sync_attempts,
        error: row.last_sync_error,
        capturedAt: row.created_at
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'Failed to get sync status',
      message: error.message
    });
  }
}
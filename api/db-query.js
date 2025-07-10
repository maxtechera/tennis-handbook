import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden in production' });
  }

  try {
    const { query } = req.body || {};
    
    if (!query) {
      // Show some useful queries
      return res.status(200).json({
        message: 'Send a POST request with { "query": "SELECT * FROM wizard_submissions LIMIT 10" }',
        examples: [
          "SELECT COUNT(*) FROM wizard_submissions",
          "SELECT * FROM wizard_submissions ORDER BY created_at DESC LIMIT 10",
          "SELECT tennis_level, COUNT(*) FROM wizard_submissions GROUP BY tennis_level",
          "SELECT email, name, tags FROM wizard_submissions WHERE newsletter = true",
          "SELECT DISTINCT unnest(tags) as tag, COUNT(*) FROM wizard_submissions GROUP BY tag ORDER BY COUNT DESC"
        ]
      });
    }

    // Execute query
    const result = await sql.query(query);
    
    return res.status(200).json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(f => f.name)
    });
    
  } catch (error) {
    console.error('Query error:', error);
    return res.status(500).json({ 
      error: error.message,
      hint: 'Check your SQL syntax'
    });
  }
}
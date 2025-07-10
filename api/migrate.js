export default async function handler(req, res) {
  // Security: Only allow POST method and add some basic auth
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Basic auth check
  const authToken = req.headers.authorization || req.body.token;
  if (!authToken || authToken !== `Bearer ${process.env.MIGRATION_SECRET || 'tennis-migrate-2025'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({
    success: true,
    message: 'Please use `npm run db:push` for schema migrations',
    instructions: 'Run `npm run db:push` locally to sync schema changes to the database',
    timestamp: new Date().toISOString()
  });
}
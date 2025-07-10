// Development setup endpoint - simulates database for local testing
export default async function handler(req, res) {
  // Enable CORS for testing
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const isDatabaseAvailable = !!process.env.POSTGRES_URL;
    const isConvertkitConfigured = !!(process.env.CONVERTKIT_API_SECRET && process.env.CONVERTKIT_FORM_ID);

    const setup = {
      environment: process.env.NODE_ENV || 'development',
      database: {
        available: isDatabaseAvailable,
        url: isDatabaseAvailable ? '✅ Configured' : '❌ Not configured (using development mode)',
        mode: isDatabaseAvailable ? 'production' : 'development'
      },
      convertkit: {
        available: isConvertkitConfigured,
        apiSecret: process.env.CONVERTKIT_API_SECRET ? '✅ Configured' : '❌ Not configured',
        formId: process.env.CONVERTKIT_FORM_ID ? '✅ Configured' : '❌ Not configured',
        formIdEs: process.env.CONVERTKIT_FORM_ID_ES ? '✅ Configured' : '❌ Not configured (optional)'
      },
      endpoints: {
        '/api/wizard-start': 'Email capture',
        '/api/wizard-save': 'Progress auto-save',
        '/api/wizard-complete': 'Completion with recommendations',
        '/api/analytics-wizard': 'Funnel analytics',
        '/api/test-db': 'Database connection test'
      },
      recommendations: [
        isDatabaseAvailable 
          ? '✅ Database ready - production mode'
          : '⚠️  Database not configured - using development mode (this is fine for local testing)',
        isConvertkitConfigured
          ? '✅ ConvertKit ready - emails will be sent'
          : '⚠️  ConvertKit not configured - emails will be logged to console',
        '🚀 Ready to test wizard flow!'
      ]
    };

    return res.status(200).json({
      success: true,
      message: 'Development setup check',
      setup,
      instructions: {
        localTesting: 'All APIs will work in development mode without database',
        productionSetup: 'Deploy to Vercel and add Postgres storage for production',
        configFiles: 'Copy .env.local.example to .env.local and add your ConvertKit keys'
      }
    });

  } catch (error) {
    console.error('Setup check error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
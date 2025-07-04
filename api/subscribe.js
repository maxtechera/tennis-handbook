// Vercel Serverless Function for Email Subscription
// Deploy this file to handle email signups

export default async function handler(req, res) {
  // Enable CORS for your domain
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tennishandbook.com',
    'https://www.tennishandbook.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'website', consent, timestamp, language = 'en' } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Check consent
  if (!consent) {
    return res.status(400).json({ error: 'Consent is required' });
  }

  // Rate limiting check (simple version)
  // In production, use a proper rate limiting service
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  try {
    // ConvertKit Integration
    const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
    // Support language-specific form IDs or fall back to default
    const formIdKey = language === 'es' ? 'CONVERTKIT_FORM_ID_ES' : 'CONVERTKIT_FORM_ID_EN';
    const CONVERTKIT_FORM_ID = process.env[formIdKey] || process.env.CONVERTKIT_FORM_ID;

    if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
      console.error('Missing ConvertKit configuration:', {
        hasSecret: !!CONVERTKIT_API_SECRET,
        hasFormId: !!CONVERTKIT_FORM_ID,
        language,
        formIdKey
      });
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Subscribe to ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'charset': 'utf-8'
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          email: email,
          fields: {
            source: source,
            language: language,
            signup_date: new Date().toISOString()
          },
          tags: [
            'tennis-handbook',
            source,
            language === 'es' ? 'spanish' : 'english'
          ]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('ConvertKit error:', data);
      
      // Handle specific ConvertKit errors
      if (data.errors && data.errors.email) {
        return res.status(400).json({ 
          error: 'This email is already subscribed!' 
        });
      }
      
      throw new Error(data.message || 'Failed to subscribe');
    }

    // Log success (without exposing email)
    console.log('New subscriber:', {
      email: email.split('@')[0] + '@***',
      source,
      language,
      timestamp: new Date().toISOString()
    });

    // Send success response
    return res.status(200).json({ 
      success: true,
      message: language === 'es' 
        ? 'ÂĦGracias por suscribirte! Revisa tu email.'
        : 'Thanks for subscribing! Check your email.'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    
    // Don't expose internal errors to client
    return res.status(500).json({ 
      error: language === 'es'
        ? 'Error al procesar la suscripciÃģn. Por favor, intenta de nuevo.'
        : 'Failed to process subscription. Please try again.',
      success: false
    });
  }
}

// Environment variables needed:
// CONVERTKIT_API_SECRET=sk_your_secret_key_here
// CONVERTKIT_FORM_ID=your_form_id_here
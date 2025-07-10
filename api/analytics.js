// Vercel Serverless Function for Analytics
// Simple analytics collection endpoint

export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:64725",
    "https://tenis.mtech.uy",
    "https://www.tenis.mtech.uy",
  ];

  const origin = req.headers.origin;
  
  // In development, allow all localhost origins
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment && origin && origin.startsWith("http://localhost:")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (isDevelopment) {
    // Fallback for development - allow any localhost
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event, category, label, value, properties = {} } = req.body;

    // Log analytics event (in production, send to analytics service)
    console.log("Analytics Event:", {
      event,
      category,
      label,
      value,
      properties,
      timestamp: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    // In production, you would:
    // 1. Send to Google Analytics Measurement Protocol
    // 2. Store in your own analytics database
    // 3. Forward to other analytics services (Mixpanel, Amplitude, etc.)

    // For ConvertKit specific events, you could also update subscriber tags
    if (event === "wizard_complete" && properties.email) {
      // Update ConvertKit subscriber with completion tag
      // This would use the ConvertKit API to add tags
    }

    return res.status(200).json({
      success: true,
      message: "Event tracked successfully",
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({
      error: "Failed to track event",
      success: false,
    });
  }
}

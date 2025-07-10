// Vercel Serverless Function for Analytics
// Simple analytics collection endpoint

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AnalyticsRequest {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface AnalyticsLogEntry {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  properties: Record<string, any>;
  timestamp: string;
  ip: string;
  userAgent: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  } else if (allowedOrigins.includes(origin as string)) {
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
    const { event, category, label, value, properties = {} }: AnalyticsRequest = req.body;

    // Get IP and user agent with proper typing
    const ip = (req.headers["x-forwarded-for"] as string) || 
              (req.connection?.remoteAddress as string) || 
              "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // Log analytics event (in production, send to analytics service)
    const logEntry: AnalyticsLogEntry = {
      event,
      category,
      label,
      value,
      properties,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    };

    console.log("Analytics Event:", logEntry);

    // In production, you would:
    // 1. Send to Google Analytics Measurement Protocol
    // 2. Store in your own analytics database
    // 3. Forward to other analytics services (Mixpanel, Amplitude, etc.)

    // For ConvertKit specific events, you could also update subscriber tags
    if (event === "wizard_complete" && properties.email) {
      // Update ConvertKit subscriber with completion tag
      // This would use the ConvertKit API to add tags
    }

    const response: AnalyticsResponse = {
      success: true,
      message: "Event tracked successfully",
    };

    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Analytics error:", error);
    
    const errorResponse: AnalyticsResponse = {
      success: false,
      message: "Failed to track event",
      error: "Failed to track event",
    };
    
    return res.status(500).json(errorResponse);
  }
}
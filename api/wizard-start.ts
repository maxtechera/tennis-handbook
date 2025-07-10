import { sql } from "@vercel/postgres";
import {
  db,
  emailCaptures,
  wizardSubmissions,
  conversionEvents,
} from "./db/index.js";
import { eq } from "drizzle-orm";
import {
  generateConvertKitTags,
  generateCustomFields,
} from "./utils/convertkit-tags.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface WizardStartRequest {
  email: string;
  sessionId: string;
  source?: string;
  wizardData?: Record<string, any>;
}

interface ConvertKitResult {
  success: boolean;
  error?: string;
  subscriberId?: string;
  downloadLink?: string | null;
}

// Helper function to submit to Kit.com (ConvertKit)
async function submitToKitCom(email: string, sessionId: string, wizardData: Record<string, any> = {}): Promise<ConvertKitResult> {
  const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
  const CONVERTKIT_FORM_ID =
    process.env.CONVERTKIT_FORM_ID_ES || process.env.CONVERTKIT_FORM_ID;

  if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
    console.error("Missing ConvertKit configuration");
    return { success: false, error: "Missing configuration" };
  }

  try {
    // Generate comprehensive tags and custom fields
    const tagData = {
      email,
      source: "wizard-start",
      language: "es", // Spanish form primarily
      sessionId,
      wizardData,
      timestamp: new Date(),
    };

    const tags = generateConvertKitTags(tagData);
    const customFields = generateCustomFields(tagData);

    const payload = {
      api_secret: CONVERTKIT_API_SECRET,
      email: email,
      fields: {
        ...customFields,
        source: "wizard-start",
        wizard_started: "yes",
        wizard_started_at: new Date().toISOString(),
        session_id: sessionId,
      },
      tags: tags,
    };

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("ConvertKit error:", data);
      return { success: false, error: (data as any).message || "Failed to subscribe" };
    }

    console.log(
      "✅ Kit.com submission successful for:",
      email.split("@")[0] + "@***"
    );

    // Return the download link if available
    // In Kit.com, you'd typically set up an automation to send the PDF
    // Here we'll return a success indicator
    return {
      success: true,
      subscriberId: (data as any).subscription?.subscriber?.id,
      // You can add the actual download link here if Kit.com returns it
      // or if you have it configured in your environment
      downloadLink: process.env.PDF_DOWNLOAD_LINK || null,
    };
  } catch (error: any) {
    console.error("Kit.com submission error:", error);
    return { success: false, error: error.message };
  }
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
  if (
    allowedOrigins.includes(origin as string) ||
    (origin && origin.startsWith("http://localhost:"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
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
    const { email, sessionId, source = "wizard", wizardData = {} }: WizardStartRequest = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;

    // Get metadata
    const userAgent = req.headers["user-agent"] || "";
    const ip =
      (req.headers["x-forwarded-for"] as string) || 
      (req.headers["x-real-ip"] as string) || 
      "unknown";

    if (isDatabaseAvailable) {
      // Simple email capture using Drizzle upsert
      try {
        await db
          .insert(emailCaptures)
          .values({
            email,
            source,
            metadata: { 
              sessionId,
              wizardStep: 'start',
              linkedToWizard: true 
            },
            kitSubmitted: false,
            processingStartedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: emailCaptures.email,
            set: {
              source,
              metadata: { 
              sessionId,
              wizardStep: 'start',
              linkedToWizard: true 
            },
              processingStartedAt: new Date(),
            },
          });
        console.log("✅ Email captured with Drizzle");
      } catch (error) {
        console.error("Email capture error:", error);
        // Fallback to basic insert if upsert fails
        try {
          const existing = await db
            .select()
            .from(emailCaptures)
            .where(eq(emailCaptures.email, email))
            .limit(1);
          if (existing.length > 0) {
            await db
              .update(emailCaptures)
              .set({
                source,
                metadata: { 
              sessionId,
              wizardStep: 'start',
              linkedToWizard: true 
            },
                processingStartedAt: new Date(),
              })
              .where(eq(emailCaptures.email, email));
          } else {
            await db.insert(emailCaptures).values({
              email,
              source,
              metadata: { 
              sessionId,
              wizardStep: 'start',
              linkedToWizard: true 
            },
              kitSubmitted: false,
              processingStartedAt: new Date(),
            });
          }
          console.log("✅ Email captured with Drizzle fallback");
        } catch (fallbackError) {
          console.error("Drizzle fallback failed:", fallbackError);
          throw fallbackError;
        }
      }

      // Create wizard submission entry using Drizzle
      try {
        await db
          .insert(wizardSubmissions)
          .values({
            sessionId,
            currentStep: 0,
            userAgent,
            ipAddress: ip,
            email,
          })
          .onConflictDoUpdate({
            target: wizardSubmissions.sessionId,
            set: {
              email, // Update email if provided
              userAgent,
              ipAddress: ip,
            }
          });
        console.log("✅ Wizard submission created/updated with Drizzle");
      } catch (error) {
        console.error("Wizard submission error:", error);
      }

      // Track conversion event using Drizzle
      try {
        await db.insert(conversionEvents).values({
          eventType: "wizard_start",
          eventData: { email, source },
          sessionId,
        });
        console.log("✅ Conversion event tracked with Drizzle");
      } catch (error) {
        console.error("Conversion event error:", error);
      }
    } else {
      // Development mode - just log the data
      console.log("📧 Email captured (development mode - no database):", {
        email: email.split("@")[0] + "@***",
        sessionId,
        source,
        timestamp: new Date().toISOString(),
      });
    }

    // Submit to Kit.com (ConvertKit)
    console.log("📤 Submitting to Kit.com with comprehensive tags...");
    const kitResult = await submitToKitCom(email, sessionId, wizardData);

    if (!kitResult.success) {
      console.error("Kit.com submission failed:", kitResult.error);
      // Continue anyway - we don't want to block the user
    } else if (isDatabaseAvailable && kitResult.success) {
      // Update the email_captures table to mark as synced using Drizzle
      try {
        const updateResult = await db
          .update(emailCaptures)
          .set({
            kitSubmitted: true,
            kitSubscriberId: kitResult.subscriberId || null,
            kitSubmittedAt: new Date(),
          })
          .where(eq(emailCaptures.email, email));

        console.log("✅ Marked email as synced with Drizzle");
      } catch (updateError) {
        console.error("Failed to update sync status:", updateError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Email captured successfully",
      development: !isDatabaseAvailable,
      kitSubmitted: kitResult.success,
      downloadLink: kitResult.downloadLink,
      subscriberId: kitResult.subscriberId,
    });
  } catch (error: any) {
    console.error("Error in wizard start:", error);

    // If database error in development, still succeed
    if (
      !process.env.POSTGRES_URL &&
      error.code === "missing_connection_string"
    ) {
      console.log("📧 Fallback: Email would be captured in production");
      return res.status(200).json({
        success: true,
        message: "Email captured (development mode)",
        development: true,
      });
    }

    return res.status(500).json({ error: "Failed to capture email" });
  }
}
import { sql } from "@vercel/postgres";
import { db, wizardSubmissions, emailCaptures } from "./db/index.js";
import { eq } from "drizzle-orm";
import { flattenWizardData } from "./utils/flatten-wizard-data.js";
import {
  generateConvertKitTags,
  generateCustomFields,
} from "./utils/convertkit-tags.js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface WizardSaveRequest {
  sessionId: string;
  step: number;
  data: Record<string, any>;
  metadata?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    referrer?: string;
  };
}

interface ConvertKitSyncResult {
  success: boolean;
  error?: string;
  subscriberId?: string;
}

// Helper function to sync wizard data to ConvertKit
async function syncToConvertKit(
  email: string,
  sessionId: string,
  wizardData: Record<string, any> = {},
  stepName: string = "wizard-save"
): Promise<ConvertKitSyncResult> {
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
      source: stepName,
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
        source: stepName,
        wizard_step_completed: stepName,
        wizard_updated_at: new Date().toISOString(),
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
      console.error("ConvertKit sync error:", data);
      return { success: false, error: data.message || "Failed to sync" };
    }

    console.log(
      `✅ ConvertKit sync successful for ${stepName}:`,
      email.split("@")[0] + "@***"
    );

    return {
      success: true,
      subscriberId: data.subscription?.subscriber?.id,
    };
  } catch (error: any) {
    console.error("ConvertKit sync error:", error);
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

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId, step, data, metadata = {} }: WizardSaveRequest = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Get user agent and IP
    const userAgent = req.headers["user-agent"] || "";
    const ip =
      (req.headers["x-forwarded-for"] as string) || 
      (req.headers["x-real-ip"] as string) || 
      "unknown";

    // Flatten the wizard data for easier storage and querying
    const flat = flattenWizardData(data);

    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;

    if (isDatabaseAvailable) {
      // Use Drizzle upsert to handle progressive data accumulation
      try {
        // Prepare update data, only including non-null/undefined values
        const updateData: Record<string, any> = {
          currentStep: step,
          userAgent,
          ipAddress: ip,
          rawData: data, // Store complete wizard data
          updatedAt: new Date(),
          // Metadata fields
          utmSource: metadata.utmSource || null,
          utmMedium: metadata.utmMedium || null,
          utmCampaign: metadata.utmCampaign || null,
          utmContent: metadata.utmContent || null,
          utmTerm: metadata.utmTerm || null,
          referrer: metadata.referrer || null,
        };

        // Add flat data fields only if they have values
        Object.entries(flat).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            updateData[key] = value;
          }
        });

        // Use Drizzle upsert for progressive data accumulation
        await db
          .insert(wizardSubmissions)
          .values({
            sessionId,
            ...updateData,
          })
          .onConflictDoUpdate({
            target: wizardSubmissions.sessionId,
            set: updateData, // Update with new data, preserving existing values
          });

        console.log("✅ Wizard data saved progressively with Drizzle");

        // Sync to ConvertKit if we have the email
        try {
          // Get the email from the wizard submission
          const existingSubmission = await db
            .select()
            .from(wizardSubmissions)
            .where(eq(wizardSubmissions.sessionId, sessionId))
            .limit(1);

          if (existingSubmission.length > 0 && existingSubmission[0].email) {
            const email = existingSubmission[0].email;
            const stepName = getCurrentStepName(step);

            console.log(
              `📤 Syncing wizard progress to ConvertKit for step: ${stepName}`
            );
            const kitResult = await syncToConvertKit(
              email,
              sessionId,
              data,
              stepName
            );

            if (kitResult.success) {
              console.log(`✅ ConvertKit sync successful for ${stepName}`);
            } else {
              console.error(
                `❌ ConvertKit sync failed for ${stepName}:`,
                kitResult.error
              );
            }
          }
        } catch (syncError) {
          console.error("❌ ConvertKit sync error:", syncError);
          // Don't block the main wizard save if sync fails
        }
      } catch (error) {
        console.error("❌ Wizard save error:", error);
        // Fallback to development mode logging
        console.log("📋 Wizard data (development mode):", {
          sessionId,
          step,
          dataKeys: Object.keys(data),
        });
      }
    } else {
      // Development mode - just log the data
      console.log("📋 Wizard data saved (development mode - no database):", {
        sessionId,
        step,
        dataKeys: Object.keys(data),
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wizard data saved successfully",
      development: !isDatabaseAvailable,
      convertkitSynced: isDatabaseAvailable, // Will be true if database is available and sync attempted
    });
  } catch (error: any) {
    console.error("Error saving wizard progress:", error);

    // If database error in development, still succeed
    if (
      !process.env.POSTGRES_URL &&
      error.code === "missing_connection_string"
    ) {
      console.log("📝 Fallback: Progress would be saved in production");
      return res.status(200).json({
        success: true,
        message: "Progress saved (development mode)",
        development: true,
      });
    }

    return res.status(500).json({ error: "Failed to save progress" });
  }
}

function getCurrentStepName(stepIndex: number): string {
  const stepNames = [
    "micro-quiz",
    "goals-quiz",
    "time-quiz",
    "focus-quiz",
    "analyzing",
    "welcome",
    "welcome-success",
    "personalization",
    "background",
    "challenges",
    "completion",
  ];
  return stepNames[stepIndex] || `step-${stepIndex}`;
}
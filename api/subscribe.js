// Vercel Serverless Function for Email Subscription
// Deploy this file to handle email signups

import { generateConvertKitTags, generateCustomFields } from './utils/convertkit-tags.js';

// Helper function to get content recommendations based on wizard data
function getContentRecommendations(wizardData) {
  const recommendations = [];
  const {
    tennisExperience = {},
    trainingGoals = {},
    schedulePreferences = {},
  } = wizardData;

  // Based on level
  if (tennisExperience.currentLevel === "beginner") {
    recommendations.push({
      path: "/docs/training-philosophy/overview",
      title: "Start with the Fundamentals",
      reason: "Perfect for building a strong foundation",
    });
  } else if (tennisExperience.currentLevel === "intermediate") {
    recommendations.push({
      path: "/docs/specialized/power-development",
      title: "Power Development Methods",
      reason: "Take your game to the next level",
    });
  } else if (
    tennisExperience.currentLevel === "advanced" ||
    tennisExperience.currentLevel === "competitive"
  ) {
    recommendations.push({
      path: "/docs/training-philosophy/ferrero-alcaraz-methods",
      title: "Elite Coaching Methods",
      reason: "Train like the pros",
    });
  }

  // Based on goals
  if (trainingGoals.primaryGoal === "fitness") {
    recommendations.push({
      path: "/docs/workouts/overview",
      title: "12-Week Training Program",
      reason: "Structured fitness progression",
    });
  } else if (trainingGoals.primaryGoal === "competition") {
    recommendations.push({
      path: "/docs/programming/competition-preparation",
      title: "Competition Preparation",
      reason: "Peak for your matches",
    });
  }

  // Based on injury history
  if (trainingGoals.injuryHistory) {
    recommendations.push({
      path: "/docs/specialized/tendon-health-science",
      title: "Injury Prevention Science",
      reason: "Stay healthy and strong",
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

// Legacy function kept for backward compatibility
// Now we use the comprehensive tagging system from convertkit-tags.js
function mapWizardDataToConvertKit(wizardData) {
  // Use the comprehensive tagging system
  const tagData = {
    email: '', // Will be set by caller
    source: 'wizard',
    language: wizardData?.personalInfo?.language || 'en',
    wizardData: wizardData,
    timestamp: new Date()
  };
  
  const tags = generateConvertKitTags(tagData);
  const customFields = generateCustomFields(tagData);
  
  return { customFields, tags };
}

export default async function handler(req, res) {
  // Enable CORS for your domain
  const allowedOrigins = [
    "*",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:56442",
    "https://tenis.mtech.uy",
    "https://www.tenis.mtech.uy",
    "https://tennis-handbook.vercel.app",
    "https://tennis-workout.vercel.app",
  ];

  const origin = req.headers.origin;

  // In development, allow all localhost origins
  const isDevelopment = process.env.NODE_ENV !== "production";

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

  const {
    email,
    name,
    source = "website",
    consent,
    timestamp,
    language = "en",
    // New fields for wizard data
    wizardData,
    whatsapp, // WhatsApp number for Spanish users
    isWizardSubmission = false,
    createImmediately = false,
    updateTags = false,
  } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Check consent
  if (!consent) {
    return res.status(400).json({ error: "Consent is required" });
  }

  // Rate limiting check (simple version)
  // In production, use a proper rate limiting service
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    // ConvertKit Integration
    const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
    // Support language-specific form IDs or fall back to default
    const formIdKey =
      language === "es" ? "CONVERTKIT_FORM_ID_ES" : "CONVERTKIT_FORM_ID_EN";
    const CONVERTKIT_FORM_ID =
      process.env[formIdKey] || process.env.CONVERTKIT_FORM_ID;

    // Development mode - allow testing without full ConvertKit setup
    const isDevelopment = process.env.NODE_ENV !== "production";

    console.log("🔄 Subscribe Request Started:", {
      timestamp: new Date().toISOString(),
      email: email.split("@")[0] + "@***",
      language,
      source,
      isWizardSubmission,
      createImmediately,
      updateTags,
      hasWizardData: !!wizardData,
      userAgent: req.headers["user-agent"]?.substring(0, 50),
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    });

    console.log("🔧 ConvertKit Configuration:", {
      hasSecret: !!CONVERTKIT_API_SECRET,
      secretLength: CONVERTKIT_API_SECRET?.length || 0,
      hasFormId: !!CONVERTKIT_FORM_ID,
      formId: CONVERTKIT_FORM_ID,
      language,
      formIdKey,
      isDevelopment,
      envKeys: Object.keys(process.env).filter(key => key.includes('CONVERTKIT')),
    });

    if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
      console.error("❌ Missing ConvertKit configuration:", {
        hasSecret: !!CONVERTKIT_API_SECRET,
        hasFormId: !!CONVERTKIT_FORM_ID,
        language,
        formIdKey,
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('CONVERTKIT')),
      });

      return res.status(500).json({ error: "Server configuration error" });
    }

    // Prepare ConvertKit data
    let fields = {
      source: source,
      language: language,
      signup_date: new Date().toISOString(),
    };

    // Add name if provided
    if (name) {
      fields.name = name;
    }

    let tags = [
      "tennis-handbook",
      source,
      language === "es" ? "spanish" : "english",
    ];

    console.log("📝 Initial ConvertKit Data:", {
      fields: fields,
      initialTags: tags,
      hasWizardData: !!wizardData,
      wizardDataKeys: wizardData ? Object.keys(wizardData) : [],
    });

    // Handle immediate creation (first step of wizard)
    if (createImmediately) {
      tags.push("onboarding-wizard-started");
      fields.wizard_started = "yes";
      fields.wizard_started_at = new Date().toISOString();
    }

    // Handle tag updates for existing subscribers
    if (updateTags && wizardData) {
      console.log("🏷️ Processing tag updates for existing subscriber");
      
      // Use comprehensive tagging system
      const tagData = {
        email: email,
        source: source,
        language: language,
        wizardData: wizardData,
        timestamp: new Date()
      };
      
      const comprehensiveTags = generateConvertKitTags(tagData);
      const comprehensiveFields = generateCustomFields(tagData);

      console.log("📊 Comprehensive tagging result:", {
        customFieldsCount: Object.keys(comprehensiveFields).length,
        wizardTagsCount: comprehensiveTags.length,
        sampleTags: comprehensiveTags.slice(0, 10),
        customFieldsKeys: Object.keys(comprehensiveFields),
      });

      // Merge custom fields
      fields = {
        ...fields,
        ...comprehensiveFields,
      };

      // Replace basic tags with comprehensive tags
      tags = comprehensiveTags;

      // Add WhatsApp if provided
      if (whatsapp) {
        fields.whatsapp = whatsapp;
        console.log("📱 WhatsApp number added for Spanish user");
      }

      tags.push("wizard-step-updated");
    }

    // If this is a wizard submission, process the wizard data
    if (isWizardSubmission && wizardData) {
      console.log("🧙‍♂️ Processing wizard submission with full comprehensive tagging");
      
      // Use comprehensive tagging system
      const tagData = {
        email: email,
        source: source,
        language: language || wizardData?.personalInfo?.language || 'en',
        wizardData: wizardData,
        timestamp: new Date()
      };
      
      const comprehensiveTags = generateConvertKitTags(tagData);
      const comprehensiveFields = generateCustomFields(tagData);

      console.log("📊 Full comprehensive tagging result:", {
        customFieldsCount: Object.keys(comprehensiveFields).length,
        wizardTagsCount: comprehensiveTags.length,
        sampleTags: comprehensiveTags.slice(0, 15),
        sampleCustomFields: Object.keys(comprehensiveFields).slice(0, 10),
        hasPersonalInfo: !!wizardData.personalInfo,
        hasTennisExperience: !!wizardData.tennisExperience,
        hasTrainingGoals: !!wizardData.trainingGoals,
        hasSchedulePreferences: !!wizardData.schedulePreferences,
        hasPhysicalProfile: !!wizardData.physicalProfile,
      });

      // Replace all fields with comprehensive fields
      fields = {
        ...fields,
        ...comprehensiveFields,
      };

      // Replace basic tags with comprehensive tags
      tags = comprehensiveTags;

      // Add WhatsApp if provided (for Spanish users)
      if (whatsapp) {
        fields.whatsapp = whatsapp;
        console.log("📱 WhatsApp number added for Spanish user");
      }

      // Determine email sequence based on segment and language
      const segment = wizardData?.tennisExperience?.currentLevel || "beginner";
      const isSpanish = wizardData?.personalInfo?.language === "es" || language === "es";

      console.log("🎯 Sequence determination:", {
        segment,
        isSpanish,
        hasInjuryHistory: !!wizardData?.trainingGoals?.injuryHistory,
      });

      // Add sequence tag (these are kept for email automation triggers)
      if (segment === "beginner" && isSpanish) {
        tags.push("sequence-spanish-beginner");
      } else if (segment === "competitive") {
        tags.push("sequence-competitive-edge");
      } else if (wizardData?.trainingGoals?.injuryHistory) {
        tags.push("sequence-injury-recovery");
      } else {
        tags.push(`sequence-${segment}-welcome`);
      }
    }

    // Final data before sending to ConvertKit
    const finalPayload = {
      api_secret: CONVERTKIT_API_SECRET,
      email: email,
      fields: fields,
      tags: tags,
    };

    console.log("📤 Sending to ConvertKit:", {
      url: `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      email: email.split("@")[0] + "@***",
      fieldsCount: Object.keys(fields).length,
      tagsCount: tags.length,
      tags: tags,
      sampleFields: Object.keys(fields).slice(0, 10),
      payloadSize: JSON.stringify(finalPayload).length,
    });

    // Subscribe to ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          charset: "utf-8",
        },
        body: JSON.stringify(finalPayload),
      }
    );

    const data = await response.json();
    
    console.log("📥 ConvertKit Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      responseDataKeys: Object.keys(data),
      hasSubscription: !!data.subscription,
      hasSubscriber: !!data.subscription?.subscriber,
      subscriberId: data.subscription?.subscriber?.id,
      responseSize: JSON.stringify(data).length,
    });

    if (!response.ok) {
      console.error("ConvertKit error:", data);

      // In development mode, if API key is invalid, return mock response
      if (
        isDevelopment &&
        (data.error === "Authorization Failed" ||
          data.message === "API Key not valid")
      ) {
        console.log(
          "Development mode: ConvertKit API key invalid, returning mock response"
        );

        // For testing error handling, uncomment the next 3 lines:
        // return res.status(400).json({
        //   error: "Test subscription error for frontend validation"
        // });

        const responseData = {
          success: true,
          message:
            language === "es"
              ? "¡Gracias por suscribirte! (Modo desarrollo - API inválida)"
              : "Thanks for subscribing! (Development mode - invalid API)",
          development: true,
          mock: true,
        };

        // Add personalization for wizard submissions
        if (isWizardSubmission && wizardData) {
          responseData.personalization = {
            segment: wizardData?.tennisExperience?.currentLevel || "beginner",
            recommendedContent: getContentRecommendations(wizardData),
          };
        }

        return res.status(200).json(responseData);
      }

      // Handle specific ConvertKit errors
      if (data.errors && data.errors.email) {
        return res.status(400).json({
          error: "This email is already subscribed!",
        });
      }

      throw new Error(data.message || "Failed to subscribe");
    }

    // Log success (without exposing email)
    console.log("✅ ConvertKit Success - New subscriber created:", {
      email: email.split("@")[0] + "@***",
      subscriberId: data.subscription?.subscriber?.id,
      subscriptionId: data.subscription?.id,
      source,
      language,
      isWizardSubmission,
      tagsApplied: tags.length,
      fieldsApplied: Object.keys(fields).length,
      formId: CONVERTKIT_FORM_ID,
      timestamp: new Date().toISOString(),
      subscriberState: data.subscription?.subscriber?.state,
      subscriberCreatedAt: data.subscription?.subscriber?.created_at,
    });

    // Track analytics event
    if (isWizardSubmission) {
      console.log("🎯 Wizard completion tracking:", {
        segment: wizardData?.tennisExperience?.currentLevel || "unknown",
        primaryGoal: wizardData?.trainingGoals?.primaryGoal || "unknown",
        commitment:
          wizardData?.schedulePreferences?.commitmentLevel || "unknown",
        subscriberId: data.subscription?.subscriber?.id,
        tagsApplied: tags.filter(tag => tag.startsWith('sequence-')),
      });
    }

    // Send success response with personalization hint
    const responseData = {
      success: true,
      message:
        language === "es"
          ? "¡Gracias por suscribirte! Revisa tu email."
          : "Thanks for subscribing! Check your email.",
    };

    // If wizard submission, add content recommendations
    if (isWizardSubmission && wizardData) {
      responseData.personalization = {
        segment: wizardData?.tennisExperience?.currentLevel || "beginner",
        recommendedContent: getContentRecommendations(wizardData),
      };
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Subscribe error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      email: email?.split("@")[0] + "@***",
      source,
      language,
      isWizardSubmission,
    });

    // Don't expose internal errors to client
    return res.status(500).json({
      error:
        language === "es"
          ? "Error al procesar la suscripciÃģn. Por favor, intenta de nuevo."
          : "Failed to process subscription. Please try again.",
      success: false,
      ...(process.env.NODE_ENV !== "production" && {
        debug: {
          error: error.message,
          stack: error.stack?.split("\n").slice(0, 3),
        },
      }),
    });
  }
};

// Environment variables needed:
// CONVERTKIT_API_SECRET=sk_your_secret_key_here
// CONVERTKIT_FORM_ID=your_form_id_here

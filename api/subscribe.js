// Vercel Serverless Function for Email Subscription
// Deploy this file to handle email signups

// Helper function to get content recommendations based on wizard data
function getContentRecommendations(wizardData) {
  const recommendations = [];
  const { tennisExperience = {}, trainingGoals = {}, schedulePreferences = {} } = wizardData;

  // Based on level
  if (tennisExperience.currentLevel === 'beginner') {
    recommendations.push({
      path: '/docs/training-philosophy/overview',
      title: 'Start with the Fundamentals',
      reason: 'Perfect for building a strong foundation',
    });
  } else if (tennisExperience.currentLevel === 'intermediate') {
    recommendations.push({
      path: '/docs/specialized/power-development',
      title: 'Power Development Methods',
      reason: 'Take your game to the next level',
    });
  } else if (tennisExperience.currentLevel === 'advanced' || tennisExperience.currentLevel === 'competitive') {
    recommendations.push({
      path: '/docs/training-philosophy/ferrero-alcaraz-methods',
      title: 'Elite Coaching Methods',
      reason: 'Train like the pros',
    });
  }

  // Based on goals
  if (trainingGoals.primaryGoal === 'fitness') {
    recommendations.push({
      path: '/docs/workouts/overview',
      title: '12-Week Training Program',
      reason: 'Structured fitness progression',
    });
  } else if (trainingGoals.primaryGoal === 'competition') {
    recommendations.push({
      path: '/docs/programming/competition-preparation',
      title: 'Competition Preparation',
      reason: 'Peak for your matches',
    });
  }

  // Based on injury history
  if (trainingGoals.injuryHistory) {
    recommendations.push({
      path: '/docs/specialized/tendon-health-science',
      title: 'Injury Prevention Science',
      reason: 'Stay healthy and strong',
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

// Helper function to map wizard data to ConvertKit format
function mapWizardDataToConvertKit(wizardData) {
  const {
    personalInfo = {},
    tennisExperience = {},
    trainingGoals = {},
    schedulePreferences = {},
    physicalProfile = {},
  } = wizardData;

  // Build custom fields for ConvertKit
  const customFields = {
    // Personal info
    name: personalInfo.name || '',
    language: personalInfo.language || 'en',
    country: personalInfo.country || '',
    
    // Tennis experience
    years_playing: tennisExperience.yearsPlaying || '',
    current_level: tennisExperience.currentLevel || '',
    plays_competitively: tennisExperience.playsCompetitively ? 'yes' : 'no',
    ranking: tennisExperience.ranking || '',
    has_coaching: tennisExperience.coachingHistory ? 'yes' : 'no',
    
    // Training goals
    primary_goal: trainingGoals.primaryGoal || '',
    secondary_goals: (trainingGoals.secondaryGoals || []).join(', '),
    specific_challenges: (trainingGoals.specificChallenges || []).join(', '),
    has_injuries: trainingGoals.injuryHistory ? 'yes' : 'no',
    injury_details: trainingGoals.injuryDetails || '',
    
    // Schedule preferences
    trainings_per_week: schedulePreferences.trainingsPerWeek || '',
    session_duration: schedulePreferences.sessionDuration || '',
    preferred_time: schedulePreferences.preferredTime || '',
    commitment_level: schedulePreferences.commitmentLevel || '',
    equipment_access: (schedulePreferences.equipmentAccess || []).join(', '),
    
    // Physical profile
    age: physicalProfile.age || '',
    fitness_level: physicalProfile.fitnessLevel || '',
    dominant_hand: physicalProfile.dominantHand || '',
    height: physicalProfile.height || '',
    weight: physicalProfile.weight || '',
    has_mobility_issues: physicalProfile.mobilityIssues ? 'yes' : 'no',
    
    // Metadata
    wizard_completed: 'yes',
    wizard_completed_at: new Date().toISOString(),
    signup_date: new Date().toISOString(),
  };

  // Generate tags based on user responses
  const tags = ['tennis-handbook', 'onboarding-wizard'];
  
  // Language tag
  tags.push(personalInfo.language === 'es' ? 'spanish' : 'english');
  
  // Level tags
  if (tennisExperience.currentLevel) {
    tags.push(`level-${tennisExperience.currentLevel}`);
  }
  
  // Goal tags
  if (trainingGoals.primaryGoal) {
    tags.push(`goal-${trainingGoals.primaryGoal}`);
  }
  
  // Commitment tags
  if (schedulePreferences.commitmentLevel) {
    tags.push(`commitment-${schedulePreferences.commitmentLevel}`);
  }
  
  // Special segments
  if (tennisExperience.playsCompetitively) {
    tags.push('competitive-player');
  }
  
  if (trainingGoals.injuryHistory) {
    tags.push('injury-recovery');
  }
  
  if (schedulePreferences.trainingsPerWeek >= 4) {
    tags.push('high-frequency-trainer');
  }
  
  if (physicalProfile.fitnessLevel === 'excellent') {
    tags.push('advanced-fitness');
  }

  return { customFields, tags };
}

export default async function handler(req, res) {
  // Enable CORS for your domain
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://tenis.mtech.uy",
    "https://www.tenis.mtech.uy",
    "https://tennis-handbook.vercel.app",
    "https://tennis-workout.vercel.app",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
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

  const {
    email,
    source = "website",
    consent,
    timestamp,
    language = "en",
    // New fields for wizard data
    wizardData,
    whatsapp, // WhatsApp number for Spanish users
    isWizardSubmission = false,
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

    if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
      console.error("Missing ConvertKit configuration:", {
        hasSecret: !!CONVERTKIT_API_SECRET,
        hasFormId: !!CONVERTKIT_FORM_ID,
        language,
        formIdKey,
      });
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Prepare ConvertKit data
    let fields = {
      source: source,
      language: language,
      signup_date: new Date().toISOString(),
    };
    
    let tags = [
      "tennis-handbook",
      source,
      language === "es" ? "spanish" : "english",
    ];

    // If this is a wizard submission, process the wizard data
    if (isWizardSubmission && wizardData) {
      const { customFields, tags: wizardTags } = mapWizardDataToConvertKit(wizardData);
      
      // Merge custom fields
      fields = {
        ...fields,
        ...customFields,
      };
      
      // Add wizard tags
      tags = [...tags, ...wizardTags];
      
      // Add WhatsApp if provided (for Spanish users)
      if (whatsapp) {
        fields.whatsapp = whatsapp;
        tags.push('whatsapp-enabled');
      }
    }

    // Subscribe to ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          charset: "utf-8",
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          email: email,
          fields: fields,
          tags: tags,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("ConvertKit error:", data);

      // Handle specific ConvertKit errors
      if (data.errors && data.errors.email) {
        return res.status(400).json({
          error: "This email is already subscribed!",
        });
      }

      throw new Error(data.message || "Failed to subscribe");
    }

    // Log success (without exposing email)
    console.log("New subscriber:", {
      email: email.split("@")[0] + "@***",
      source,
      language,
      isWizardSubmission,
      tagsCount: tags.length,
      timestamp: new Date().toISOString(),
    });

    // Track analytics event
    if (isWizardSubmission) {
      console.log("Wizard completion:", {
        segment: wizardData?.tennisExperience?.currentLevel || 'unknown',
        primaryGoal: wizardData?.trainingGoals?.primaryGoal || 'unknown',
        commitment: wizardData?.schedulePreferences?.commitmentLevel || 'unknown',
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
        segment: wizardData?.tennisExperience?.currentLevel || 'beginner',
        recommendedContent: getContentRecommendations(wizardData),
      };
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Subscribe error:", error);

    // Don't expose internal errors to client
    return res.status(500).json({
      error:
        language === "es"
          ? "Error al procesar la suscripciÃģn. Por favor, intenta de nuevo."
          : "Failed to process subscription. Please try again.",
      success: false,
    });
  }
}

// Environment variables needed:
// CONVERTKIT_API_SECRET=sk_your_secret_key_here
// CONVERTKIT_FORM_ID=your_form_id_here

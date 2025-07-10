import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface WizardCompleteRequest {
  sessionId: string;
  wizardData: {
    personalInfo?: {
      email: string;
      name?: string;
      language?: string;
      country?: string;
      whatsapp?: string;
    };
    'personal-info'?: {
      email: string;
      name?: string;
      language?: string;
      country?: string;
      whatsapp?: string;
    };
    'micro-quiz'?: Record<string, any>;
    'goals-quiz'?: Record<string, any>;
    'time-quiz'?: Record<string, any>;
    'focus-quiz'?: Record<string, any>;
    tennisExperience?: {
      currentLevel?: string;
      playsCompetitively?: boolean;
      yearsPlaying?: string;
    };
    trainingGoals?: {
      primaryGoal?: string;
      injuryHistory?: boolean;
    };
    schedulePreferences?: {
      commitmentLevel?: string;
    };
    physicalProfile?: {
      fitnessLevel?: string;
    };
    welcome?: Record<string, any>;
    'welcome-success'?: Record<string, any>;
    personalization?: Record<string, any>;
    background?: Record<string, any>;
    challenges?: Record<string, any>;
    analyzing?: Record<string, any>;
    completion?: Record<string, any>;
  };
}

interface ContentRecommendation {
  path: string;
  title: string;
  reason: string;
}

interface WizardCompleteResponse {
  success: boolean;
  message: string;
  userId: string | null;
  recommendations: ContentRecommendation[];
  segment: string;
  development?: boolean;
}

type UserSegment = 'beginner' | 'intermediate' | 'advanced' | 'competitive';

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
  if (allowedOrigins.includes(origin as string) || (origin && origin.startsWith("http://localhost:"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
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
    const { sessionId, wizardData }: WizardCompleteRequest = req.body;
    
    if (!sessionId || !wizardData) {
      return res.status(400).json({ 
        error: "Session ID and wizard data are required" 
      });
    }
    
    const email = wizardData.personalInfo?.email || wizardData['personal-info']?.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    const userSegment = calculateUserSegment(wizardData);
    let userId: string | null = null;
    
    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;
    
    if (isDatabaseAvailable) {
      // Create or update user
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${email} LIMIT 1
      `;
      
      if (existingUser.rows.length > 0) {
        // Update existing user
        userId = existingUser.rows[0].id;
        await sql`
          UPDATE users SET 
            name = COALESCE(${wizardData.personalInfo?.name || wizardData['personal-info']?.name}, name),
            language = COALESCE(${wizardData.personalInfo?.language || wizardData['personal-info']?.language}, language),
            country = COALESCE(${wizardData.personalInfo?.country || wizardData['personal-info']?.country}, country),
            whatsapp = COALESCE(${wizardData.personalInfo?.whatsapp || wizardData['personal-info']?.whatsapp}, whatsapp),
            updated_at = NOW()
          WHERE id = ${userId}
        `;
      } else {
        // Create new user
        const newUser = await sql`
          INSERT INTO users (email, name, language, country, whatsapp)
          VALUES (
            ${email},
            ${wizardData.personalInfo?.name || wizardData['personal-info']?.name || null},
            ${wizardData.personalInfo?.language || wizardData['personal-info']?.language || 'en'},
            ${wizardData.personalInfo?.country || wizardData['personal-info']?.country || null},
            ${wizardData.personalInfo?.whatsapp || wizardData['personal-info']?.whatsapp || null}
          )
          RETURNING id
        `;
        userId = newUser.rows[0].id;
      }
      
      // Update wizard submission with all data
      await sql`
        UPDATE wizard_submissions 
        SET 
          user_id = ${userId},
          completed_at = NOW(),
          micro_quiz = ${JSON.stringify(wizardData['micro-quiz'] || null)},
          goals_quiz = ${JSON.stringify(wizardData['goals-quiz'] || null)},
          time_quiz = ${JSON.stringify(wizardData['time-quiz'] || null)},
          focus_quiz = ${JSON.stringify(wizardData['focus-quiz'] || null)},
          personal_info = ${JSON.stringify(wizardData.personalInfo || wizardData['personal-info'] || null)},
          tennis_experience = ${JSON.stringify(wizardData.tennisExperience || null)},
          training_goals = ${JSON.stringify(wizardData.trainingGoals || null)},
          schedule_preferences = ${JSON.stringify(wizardData.schedulePreferences || null)},
          physical_profile = ${JSON.stringify(wizardData.physicalProfile || null)},
          welcome = ${JSON.stringify(wizardData.welcome || null)},
          welcome_success = ${JSON.stringify(wizardData['welcome-success'] || null)},
          personalization = ${JSON.stringify(wizardData.personalization || null)},
          background = ${JSON.stringify(wizardData.background || null)},
          challenges = ${JSON.stringify(wizardData.challenges || null)},
          analyzing = ${JSON.stringify(wizardData.analyzing || null)},
          completion = ${JSON.stringify(wizardData.completion || null)},
          user_segment = ${userSegment},
          updated_at = NOW()
        WHERE session_id = ${sessionId}
      `;
      
      // Track completion event
      await sql`
        INSERT INTO conversion_events (user_id, event_type, event_data, session_id)
        VALUES (
          ${userId},
          'wizard_complete',
          ${JSON.stringify({
            segment: userSegment,
            hasWhatsapp: !!(wizardData.personalInfo?.whatsapp || wizardData['personal-info']?.whatsapp),
            language: wizardData.personalInfo?.language || wizardData['personal-info']?.language || 'en'
          })},
          ${sessionId}
        )
      `;
    } else {
      // Development mode - just log the data
      userId = `dev-${Date.now()}`;
      
      console.log('✅ Wizard completed (development mode - no database):', {
        email: email.split('@')[0] + '@***',
        sessionId,
        userSegment,
        hasWhatsapp: !!(wizardData.personalInfo?.whatsapp || wizardData['personal-info']?.whatsapp),
        timestamp: new Date().toISOString()
      });
    }
    
    // Async ConvertKit sync
    syncToConvertKit(wizardData).catch((error: any) => {
      console.error('ConvertKit sync error:', error);
    });
    
    // Get recommendations
    const recommendations = getContentRecommendations(wizardData);
    
    return res.status(200).json({ 
      success: true,
      message: 'Wizard completed successfully',
      userId,
      recommendations,
      segment: userSegment
    });
    
  } catch (error: any) {
    console.error('Error completing wizard:', error);
    
    // If database error in development, still succeed with local recommendations
    if (!process.env.POSTGRES_URL && error.code === 'missing_connection_string') {
      console.log('✅ Fallback: Wizard would be completed in production');
      const recommendations = getContentRecommendations(req.body.wizardData);
      const userSegment = calculateUserSegment(req.body.wizardData);
      
      return res.status(200).json({ 
        success: true,
        message: 'Wizard completed (development mode)',
        recommendations,
        segment: userSegment,
        development: true
      });
    }
    
    return res.status(500).json({ error: 'Failed to complete wizard' });
  }
}

function calculateUserSegment(data: WizardCompleteRequest['wizardData']): UserSegment {
  const { tennisExperience, physicalProfile, schedulePreferences } = data;
  
  if (!tennisExperience) return 'beginner';
  
  if (
    tennisExperience.playsCompetitively &&
    tennisExperience.currentLevel !== 'beginner' &&
    physicalProfile?.fitnessLevel === 'excellent' &&
    schedulePreferences?.commitmentLevel === 'professional'
  ) {
    return 'competitive';
  }
  
  if (
    tennisExperience.currentLevel === 'advanced' ||
    (tennisExperience.yearsPlaying === '5+' && 
     physicalProfile?.fitnessLevel === 'good')
  ) {
    return 'advanced';
  }
  
  if (
    tennisExperience.currentLevel === 'intermediate' ||
    ['3-5', '1-3'].includes(tennisExperience.yearsPlaying || '')
  ) {
    return 'intermediate';
  }
  
  return 'beginner';
}

function getContentRecommendations(wizardData: WizardCompleteRequest['wizardData']): ContentRecommendation[] {
  const recommendations: ContentRecommendation[] = [];
  const { tennisExperience, trainingGoals } = wizardData;
  
  if (tennisExperience?.currentLevel === 'beginner') {
    recommendations.push({
      path: '/docs/training-philosophy/overview',
      title: 'Start with the Fundamentals',
      reason: 'Perfect for building a strong foundation',
    });
  } else if (tennisExperience?.currentLevel === 'intermediate') {
    recommendations.push({
      path: '/docs/specialized/power-development',
      title: 'Power Development Methods',
      reason: 'Take your game to the next level',
    });
  } else if (
    tennisExperience?.currentLevel === 'advanced' ||
    tennisExperience?.currentLevel === 'competitive'
  ) {
    recommendations.push({
      path: '/docs/training-philosophy/ferrero-alcaraz-methods',
      title: 'Elite Coaching Methods',
      reason: 'Train like the pros',
    });
  }
  
  if (trainingGoals?.primaryGoal === 'fitness') {
    recommendations.push({
      path: '/docs/workouts/overview',
      title: '12-Week Training Program',
      reason: 'Structured fitness progression',
    });
  } else if (trainingGoals?.primaryGoal === 'competition') {
    recommendations.push({
      path: '/docs/programming/competition-preparation',
      title: 'Competition Preparation',
      reason: 'Peak for your matches',
    });
  }
  
  if (trainingGoals?.injuryHistory) {
    recommendations.push({
      path: '/docs/specialized/tendon-health-science',
      title: 'Injury Prevention Science',
      reason: 'Stay healthy and strong',
    });
  }
  
  return recommendations.slice(0, 3);
}

async function syncToConvertKit(wizardData: WizardCompleteRequest['wizardData']): Promise<void> {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
    
  const response = await fetch(`${baseUrl}/api/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: wizardData.personalInfo?.email || wizardData['personal-info']?.email,
      name: wizardData.personalInfo?.name || wizardData['personal-info']?.name,
      language: wizardData.personalInfo?.language || wizardData['personal-info']?.language || 'en',
      whatsapp: wizardData.personalInfo?.whatsapp || wizardData['personal-info']?.whatsapp,
      source: 'wizard',
      consent: true,
      wizardData,
      isWizardSubmission: true,
    }),
  });
  
  if (!response.ok) {
    throw new Error('ConvertKit sync failed');
  }
}
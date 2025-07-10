import { sql } from '@vercel/postgres';
import { devStorage } from './dev-storage.js';

export default async function handler(req, res) {
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
  if (allowedOrigins.includes(origin) || (origin && origin.startsWith("http://localhost:"))) {
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
    const { sessionId, step, data, metadata = {} } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    
    // Get user agent and IP
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    
    // Calculate user segment if we have enough data
    const userSegment = calculateUserSegment(data);
    
    // Check if database is available
    const isDatabaseAvailable = process.env.POSTGRES_URL;
    
    if (isDatabaseAvailable) {
      // Check if submission exists
      const existing = await sql`
        SELECT id FROM wizard_submissions 
        WHERE session_id = ${sessionId}
        LIMIT 1
      `;
      
      if (existing.rows.length > 0) {
        // Update existing submission
        await sql`
          UPDATE wizard_submissions 
          SET 
            current_step = ${step},
            personal_info = ${JSON.stringify(data.personalInfo || null)},
            tennis_experience = ${JSON.stringify(data.tennisExperience || null)},
            training_goals = ${JSON.stringify(data.trainingGoals || null)},
            schedule_preferences = ${JSON.stringify(data.schedulePreferences || null)},
            physical_profile = ${JSON.stringify(data.physicalProfile || null)},
            user_segment = ${userSegment},
            user_agent = ${userAgent},
            ip_address = ${ip},
            utm_source = ${metadata.utmSource || null},
            utm_medium = ${metadata.utmMedium || null},
            utm_campaign = ${metadata.utmCampaign || null},
            referrer = ${metadata.referrer || null},
            updated_at = NOW()
          WHERE session_id = ${sessionId}
        `;
      } else {
        // Create new submission
        await sql`
          INSERT INTO wizard_submissions (
            session_id, current_step, personal_info, tennis_experience,
            training_goals, schedule_preferences, physical_profile,
            user_segment, user_agent, ip_address, utm_source, utm_medium,
            utm_campaign, referrer
          ) VALUES (
            ${sessionId}, ${step}, 
            ${JSON.stringify(data.personalInfo || null)},
            ${JSON.stringify(data.tennisExperience || null)},
            ${JSON.stringify(data.trainingGoals || null)},
            ${JSON.stringify(data.schedulePreferences || null)},
            ${JSON.stringify(data.physicalProfile || null)},
            ${userSegment}, ${userAgent}, ${ip},
            ${metadata.utmSource || null},
            ${metadata.utmMedium || null},
            ${metadata.utmCampaign || null},
            ${metadata.referrer || null}
          )
        `;
      }
      
      // Track step completion
      await sql`
        INSERT INTO conversion_events (event_type, event_data, session_id)
        VALUES (${`wizard_step_${step}`}, ${JSON.stringify({ step, hasData: Object.keys(data).length > 0 })}, ${sessionId})
      `;
    } else {
      // Development mode - use local storage
      devStorage.updateWizardSubmission(sessionId, {
        currentStep: step,
        personalInfo: data.personalInfo || null,
        tennisExperience: data.tennisExperience || null,
        trainingGoals: data.trainingGoals || null,
        schedulePreferences: data.schedulePreferences || null,
        physicalProfile: data.physicalProfile || null,
        userSegment,
        userAgent,
        ipAddress: ip,
        utmSource: metadata.utmSource || null,
        utmMedium: metadata.utmMedium || null,
        utmCampaign: metadata.utmCampaign || null,
        referrer: metadata.referrer || null
      });
      
      devStorage.addConversionEvent(`wizard_step_${step}`, { step, hasData: Object.keys(data).length > 0 }, sessionId);
      
      console.log('📝 Wizard progress saved (development):', {
        sessionId,
        step,
        userSegment,
        hasData: Object.keys(data).length > 0,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Progress saved'
    });
    
  } catch (error) {
    console.error('Error saving wizard progress:', error);
    
    // If database error in development, still succeed
    if (!process.env.POSTGRES_URL && error.code === 'missing_connection_string') {
      console.log('📝 Fallback: Progress would be saved in production');
      return res.status(200).json({ 
        success: true,
        message: 'Progress saved (development mode)',
        development: true
      });
    }
    
    return res.status(500).json({ error: 'Failed to save progress' });
  }
}

function calculateUserSegment(data) {
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
    ['3-5', '1-3'].includes(tennisExperience.yearsPlaying)
  ) {
    return 'intermediate';
  }
  
  return 'beginner';
}
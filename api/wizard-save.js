import { sql } from '@vercel/postgres';
import { devStorage } from './dev-storage.js';
import { flattenWizardData } from '../src/utils/flatten-wizard-data.js';

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
    
    // Flatten the wizard data for easier storage and querying
    const flat = flattenWizardData(data);
    
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
        // Update existing submission with flat data
        await sql`
          UPDATE wizard_submissions 
          SET 
            current_step = ${step},
            email = COALESCE(${flat.email}, email),
            name = COALESCE(${flat.name}, name),
            age = COALESCE(${flat.age}, age),
            gender = COALESCE(${flat.gender}, gender),
            location = COALESCE(${flat.location}, location),
            whatsapp = COALESCE(${flat.whatsapp}, whatsapp),
            language = COALESCE(${flat.language}, language),
            tennis_level = COALESCE(${flat.tennisLevel}, tennis_level),
            tennis_goal = COALESCE(${flat.tennisGoal}, tennis_goal),
            years_playing = COALESCE(${flat.yearsPlaying}, years_playing),
            plays_competitively = COALESCE(${flat.playsCompetitively}, plays_competitively),
            playing_style = COALESCE(${flat.playingStyle}, playing_style),
            favorite_shot = COALESCE(${flat.favoriteShot}, favorite_shot),
            time_availability = COALESCE(${flat.timeAvailability}, time_availability),
            preferred_times = COALESCE(${flat.preferredTimes}, preferred_times),
            focus_areas = COALESCE(${flat.focusAreas}, focus_areas),
            primary_focus = COALESCE(${flat.primaryFocus}, primary_focus),
            commitment_level = COALESCE(${flat.commitmentLevel}, commitment_level),
            fitness_level = COALESCE(${flat.fitnessLevel}, fitness_level),
            main_challenges = COALESCE(${flat.mainChallenges}, main_challenges),
            injuries = COALESCE(${flat.injuries}, injuries),
            micro_quiz_engagement = COALESCE(${flat.microQuizEngagement}, micro_quiz_engagement),
            goals_quiz_engagement = COALESCE(${flat.goalsQuizEngagement}, goals_quiz_engagement),
            time_quiz_engagement = COALESCE(${flat.timeQuizEngagement}, time_quiz_engagement),
            focus_quiz_engagement = COALESCE(${flat.focusQuizEngagement}, focus_quiz_engagement),
            accepted_terms = COALESCE(${flat.acceptedTerms}, accepted_terms),
            newsletter = COALESCE(${flat.newsletter}, newsletter),
            downloaded_pdf = COALESCE(${flat.downloadedPdf}, downloaded_pdf),
            user_segment = COALESCE(${flat.userSegment}, user_segment),
            ai_recommendations = COALESCE(${flat.aiRecommendations}, ai_recommendations),
            personalized_path = COALESCE(${flat.personalizedPath}, personalized_path),
            tags = COALESCE(${flat.tags}, tags),
            raw_data = ${JSON.stringify(flat.rawData)},
            user_agent = ${userAgent},
            ip_address = ${ip},
            utm_source = ${metadata.utmSource || null},
            utm_medium = ${metadata.utmMedium || null},
            utm_campaign = ${metadata.utmCampaign || null},
            utm_content = ${metadata.utmContent || null},
            utm_term = ${metadata.utmTerm || null},
            referrer = ${metadata.referrer || null},
            updated_at = NOW()
          WHERE session_id = ${sessionId}
        `;
      } else {
        // Create new submission with flat data
        await sql`
          INSERT INTO wizard_submissions (
            session_id, current_step, email, name, age, gender, location, whatsapp, language,
            tennis_level, tennis_goal, years_playing, plays_competitively, playing_style, favorite_shot,
            time_availability, preferred_times, focus_areas, primary_focus, commitment_level,
            fitness_level, main_challenges, injuries, micro_quiz_engagement, goals_quiz_engagement,
            time_quiz_engagement, focus_quiz_engagement, accepted_terms, newsletter, downloaded_pdf,
            user_segment, ai_recommendations, personalized_path, tags, raw_data,
            user_agent, ip_address, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer
          ) VALUES (
            ${sessionId}, ${step}, ${flat.email}, ${flat.name}, ${flat.age}, ${flat.gender}, 
            ${flat.location}, ${flat.whatsapp}, ${flat.language}, ${flat.tennisLevel}, 
            ${flat.tennisGoal}, ${flat.yearsPlaying}, ${flat.playsCompetitively}, 
            ${flat.playingStyle}, ${flat.favoriteShot}, ${flat.timeAvailability}, 
            ${flat.preferredTimes}, ${flat.focusAreas}, ${flat.primaryFocus}, 
            ${flat.commitmentLevel}, ${flat.fitnessLevel}, ${flat.mainChallenges}, 
            ${flat.injuries}, ${flat.microQuizEngagement}, ${flat.goalsQuizEngagement}, 
            ${flat.timeQuizEngagement}, ${flat.focusQuizEngagement}, ${flat.acceptedTerms}, 
            ${flat.newsletter}, ${flat.downloadedPdf}, ${flat.userSegment}, 
            ${flat.aiRecommendations}, ${flat.personalizedPath}, ${flat.tags}, 
            ${JSON.stringify(flat.rawData)}, ${userAgent}, ${ip},
            ${metadata.utmSource || null}, ${metadata.utmMedium || null},
            ${metadata.utmCampaign || null}, ${metadata.utmContent || null},
            ${metadata.utmTerm || null}, ${metadata.referrer || null}
          )
        `;
      }
      
      // Track step completion with detailed data
      const stepData = data[Object.keys(data).find(key => key !== 'personalInfo' && key !== 'tennisExperience' && key !== 'trainingGoals' && key !== 'schedulePreferences' && key !== 'physicalProfile') || ''];
      
      await sql`
        INSERT INTO conversion_events (event_type, event_data, session_id)
        VALUES (
          ${`wizard_step_${step}`}, 
          ${JSON.stringify({ 
            step, 
            stepName: getCurrentStepName(step),
            hasData: Object.keys(data).length > 0,
            dataKeys: Object.keys(data),
            timestamp: new Date().toISOString(),
            stepData: stepData || null
          })}, 
          ${sessionId}
        )
      `;
    } else {
      // Development mode - use local storage with flat data
      devStorage.updateWizardSubmission(sessionId, {
        currentStep: step,
        ...flat, // Spread all flat fields
        userAgent,
        ipAddress: ip,
        utmSource: metadata.utmSource || null,
        utmMedium: metadata.utmMedium || null,
        utmCampaign: metadata.utmCampaign || null,
        utmContent: metadata.utmContent || null,
        utmTerm: metadata.utmTerm || null,
        referrer: metadata.referrer || null
      });
      
      devStorage.addConversionEvent(`wizard_step_${step}`, { step, hasData: Object.keys(data).length > 0 }, sessionId);
      
      console.log('📝 Wizard progress saved (development):', {
        sessionId,
        step,
        userSegment: flat.userSegment,
        hasData: Object.keys(data).length > 0,
        timestamp: new Date().toISOString()
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Progress saved',
      tags: flat.tags // Return tags for debugging/testing
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

function getCurrentStepName(stepIndex) {
  const stepNames = [
    'micro-quiz',
    'goals-quiz', 
    'time-quiz',
    'focus-quiz',
    'analyzing',
    'welcome',
    'welcome-success',
    'personalization',
    'background',
    'challenges',
    'completion'
  ];
  return stepNames[stepIndex] || `step-${stepIndex}`;
}
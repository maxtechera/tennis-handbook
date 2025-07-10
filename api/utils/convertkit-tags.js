/**
 * Centralized tag generation for ConvertKit
 * This ensures consistent tagging across all sync points
 */

export function generateConvertKitTags(data = {}) {
  const tags = new Set(['tennis-handbook']); // Always include base tag
  
  // Extract data from various sources
  const {
    email,
    source,
    language,
    wizardData = {},
    metadata = {},
    sessionId,
    timestamp
  } = data;

  // Basic tags
  if (source) {
    tags.add(`source-${source}`);
  }
  
  // Language tags - Spanish users have 3x engagement!
  if (language === 'es' || email?.includes('.es') || email?.includes('.mx') || email?.includes('.ar')) {
    tags.add('spanish');
    tags.add('high-engagement-3x');
    tags.add('priority-segment');
  } else {
    tags.add('english');
  }

  // Wizard progress tags
  if (wizardData) {
    // Extract all wizard steps
    const { 
      'micro-quiz': microQuiz,
      'goals-quiz': goalsQuiz,
      'time-quiz': timeQuiz,
      'focus-quiz': focusQuiz,
      'experience-level': experienceLevel,
      'age-group': ageGroup,
      'training-frequency': trainingFrequency,
      personalInfo = {},
      tennisExperience = {},
      trainingGoals = {},
      schedulePreferences = {},
      physicalProfile = {}
    } = wizardData;

    // Micro quiz tags (tennis level)
    if (microQuiz?.level) {
      tags.add(`level-${microQuiz.level}`);
      tags.add(`segment-${microQuiz.level}`);
      
      // Special handling for advanced players
      if (['advanced', 'professional'].includes(microQuiz.level)) {
        tags.add('high-value-user');
        tags.add('advanced-content-eligible');
      }
    }

    // Goals tags
    if (goalsQuiz?.goal) {
      tags.add(`goal-${goalsQuiz.goal}`);
      
      // Goal-specific tags
      switch(goalsQuiz.goal) {
        case 'competitive':
          tags.add('competitive-player');
          tags.add('performance-focused');
          break;
        case 'fitness':
          tags.add('fitness-focused');
          tags.add('health-conscious');
          break;
        case 'professional':
          tags.add('pro-aspirant');
          tags.add('high-commitment');
          break;
        case 'recreational':
          tags.add('casual-player');
          tags.add('fun-focused');
          break;
      }
    }

    // Time commitment tags
    if (timeQuiz?.timeCommitment) {
      tags.add(`time-${timeQuiz.timeCommitment}`);
      
      if (timeQuiz.timeCommitment === 'high') {
        tags.add('dedicated-trainer');
        tags.add('daily-practice');
      }
    }

    // Focus area tags
    if (focusQuiz?.focusArea) {
      tags.add(`focus-${focusQuiz.focusArea}`);
      
      // Focus-specific tags
      switch(focusQuiz.focusArea) {
        case 'power':
          tags.add('power-development');
          tags.add('strength-training-interest');
          break;
        case 'technique':
          tags.add('technique-improvement');
          tags.add('form-focused');
          break;
        case 'endurance':
          tags.add('endurance-training');
          tags.add('cardio-focused');
          break;
        case 'mental':
          tags.add('mental-game');
          tags.add('psychology-interest');
          break;
      }
    }

    // Experience level tags (from step 9)
    if (experienceLevel?.experienceLevel) {
      tags.add(`experience-${experienceLevel.experienceLevel}`);
      
      if (experienceLevel.experienceLevel === 'competitive') {
        tags.add('tournament-player');
        tags.add('ranking-holder');
      }
    }

    // Age group tags
    if (ageGroup?.ageGroup) {
      tags.add(`age-${ageGroup.ageGroup}`);
      
      if (ageGroup.ageGroup === 'junior') {
        tags.add('junior-development');
        tags.add('growth-phase');
      } else if (ageGroup.ageGroup === 'senior') {
        tags.add('senior-fitness');
        tags.add('injury-prevention-priority');
      }
    }

    // Training frequency tags
    if (trainingFrequency?.trainingFrequency) {
      tags.add(`frequency-${trainingFrequency.trainingFrequency}`);
      
      const frequencyMap = {
        'casual': 'low-frequency',
        'regular': 'moderate-frequency',
        'intensive': 'high-frequency',
        'daily': 'daily-trainer'
      };
      
      if (frequencyMap[trainingFrequency.trainingFrequency]) {
        tags.add(frequencyMap[trainingFrequency.trainingFrequency]);
      }
    }

    // Full wizard data tags
    if (tennisExperience.currentLevel) {
      tags.add(`verified-level-${tennisExperience.currentLevel}`);
    }
    
    if (tennisExperience.playsCompetitively) {
      tags.add('competitive-verified');
      tags.add('match-player');
    }
    
    if (tennisExperience.ranking) {
      tags.add('has-ranking');
      tags.add('serious-competitor');
    }
    
    if (tennisExperience.coachingHistory) {
      tags.add('has-coach');
      tags.add('structured-training');
    }

    // Training goals detailed tags
    if (trainingGoals.primaryGoal) {
      tags.add(`primary-goal-${trainingGoals.primaryGoal}`);
    }
    
    if (trainingGoals.secondaryGoals?.length > 0) {
      trainingGoals.secondaryGoals.forEach(goal => {
        tags.add(`secondary-goal-${goal}`);
      });
    }
    
    if (trainingGoals.injuryHistory) {
      tags.add('injury-history');
      tags.add('needs-injury-prevention');
      tags.add('careful-progression');
    }
    
    if (trainingGoals.specificChallenges?.length > 0) {
      trainingGoals.specificChallenges.forEach(challenge => {
        tags.add(`challenge-${challenge.toLowerCase().replace(/\s+/g, '-')}`);
      });
    }

    // Schedule preferences detailed tags
    if (schedulePreferences.trainingsPerWeek >= 4) {
      tags.add('high-frequency-trainer');
      tags.add('serious-commitment');
    } else if (schedulePreferences.trainingsPerWeek <= 2) {
      tags.add('weekend-warrior');
    }
    
    if (schedulePreferences.sessionDuration) {
      tags.add(`session-${schedulePreferences.sessionDuration}min`);
      
      if (parseInt(schedulePreferences.sessionDuration) >= 90) {
        tags.add('long-session-capacity');
      }
    }
    
    if (schedulePreferences.preferredTime) {
      tags.add(`trains-${schedulePreferences.preferredTime}`);
    }
    
    if (schedulePreferences.commitmentLevel) {
      tags.add(`commitment-${schedulePreferences.commitmentLevel}`);
      
      if (['serious', 'professional'].includes(schedulePreferences.commitmentLevel)) {
        tags.add('high-commitment-verified');
      }
    }
    
    // Equipment access tags
    if (schedulePreferences.equipmentAccess?.length > 0) {
      schedulePreferences.equipmentAccess.forEach(equipment => {
        tags.add(`has-${equipment.toLowerCase().replace(/\s+/g, '-')}`);
      });
      
      if (schedulePreferences.equipmentAccess.includes('gym')) {
        tags.add('gym-access');
        tags.add('strength-training-ready');
      }
    }

    // Physical profile tags
    if (physicalProfile.fitnessLevel) {
      tags.add(`fitness-${physicalProfile.fitnessLevel}`);
      
      if (['good', 'excellent'].includes(physicalProfile.fitnessLevel)) {
        tags.add('high-fitness');
        tags.add('advanced-workout-ready');
      }
    }
    
    if (physicalProfile.dominantHand) {
      tags.add(`${physicalProfile.dominantHand}-handed`);
    }
    
    if (physicalProfile.mobilityIssues) {
      tags.add('mobility-issues');
      tags.add('needs-adaptations');
    }
    
    if (physicalProfile.age) {
      const age = parseInt(physicalProfile.age);
      if (age < 18) {
        tags.add('youth-athlete');
      } else if (age >= 50) {
        tags.add('masters-athlete');
      } else if (age >= 30 && age < 50) {
        tags.add('adult-athlete');
      }
    }

    // WhatsApp preference (Spanish users)
    if (personalInfo.whatsapp || personalInfo.communicationPreferences?.includes('whatsapp')) {
      tags.add('whatsapp-enabled');
      tags.add('multi-channel-engagement');
      tags.add('high-touch-preference');
    }
  }

  // Wizard completion status
  if (wizardData?.completedAt) {
    tags.add('wizard-completed');
    tags.add('fully-profiled');
  } else if (Object.keys(wizardData || {}).length > 0) {
    tags.add('wizard-started');
    tags.add('partially-profiled');
  }

  // Engagement scoring tags
  const engagementScore = calculateEngagementScore(data);
  if (engagementScore >= 80) {
    tags.add('high-engagement-user');
    tags.add('priority-follow-up');
  } else if (engagementScore >= 60) {
    tags.add('moderate-engagement-user');
  }

  // Date-based tags
  const now = new Date();
  tags.add(`signup-month-${now.toISOString().slice(0, 7)}`); // YYYY-MM
  tags.add(`signup-year-${now.getFullYear()}`);
  
  // Day of week (some users more active on weekends)
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  tags.add(`signup-${dayOfWeek}`);

  // Source-specific tags
  if (source === 'wizard-start') {
    tags.add('immediate-engagement');
  } else if (source === 'database-sync') {
    tags.add('recovered-lead');
  }

  // Session tracking
  if (sessionId) {
    tags.add('has-session-tracking');
  }

  return Array.from(tags);
}

/**
 * Calculate engagement score based on user data
 */
function calculateEngagementScore(data) {
  let score = 0;
  const { wizardData = {} } = data;

  // Language bonus
  if (data.language === 'es') score += 30; // Spanish users 3x engagement

  // Wizard completion
  if (wizardData.completedAt) score += 20;
  
  // High-value segments
  if (['advanced', 'professional', 'competitive'].includes(wizardData['micro-quiz']?.level)) {
    score += 15;
  }
  
  // Commitment indicators
  if (wizardData['training-frequency']?.trainingFrequency === 'daily') score += 10;
  if (wizardData.schedulePreferences?.commitmentLevel === 'serious') score += 10;
  if (wizardData.tennisExperience?.playsCompetitively) score += 10;
  
  // Multi-channel preference
  if (wizardData.personalInfo?.whatsapp) score += 5;

  return Math.min(score, 100);
}

/**
 * Generate custom fields for ConvertKit
 */
export function generateCustomFields(data = {}) {
  const { wizardData = {}, metadata = {} } = data;
  const fields = {
    source: data.source || 'unknown',
    language: data.language || 'en',
    signup_date: new Date().toISOString()
  };

  // Add all wizard data as custom fields
  if (wizardData['micro-quiz']) {
    fields.quiz_level = wizardData['micro-quiz'].level;
  }
  
  if (wizardData['goals-quiz']) {
    fields.quiz_goal = wizardData['goals-quiz'].goal;
  }
  
  if (wizardData['time-quiz']) {
    fields.quiz_time_commitment = wizardData['time-quiz'].timeCommitment;
  }
  
  if (wizardData['focus-quiz']) {
    fields.quiz_focus_area = wizardData['focus-quiz'].focusArea;
  }
  
  if (wizardData['experience-level']) {
    fields.experience_level = wizardData['experience-level'].experienceLevel;
  }
  
  if (wizardData['age-group']) {
    fields.age_group = wizardData['age-group'].ageGroup;
  }
  
  if (wizardData['training-frequency']) {
    fields.training_frequency = wizardData['training-frequency'].trainingFrequency;
  }

  // Full profile data
  if (wizardData.tennisExperience) {
    Object.assign(fields, {
      years_playing: wizardData.tennisExperience.yearsPlaying,
      current_level: wizardData.tennisExperience.currentLevel,
      plays_competitively: wizardData.tennisExperience.playsCompetitively ? 'yes' : 'no',
      has_coaching: wizardData.tennisExperience.coachingHistory ? 'yes' : 'no'
    });
  }

  // Add engagement score
  fields.engagement_score = calculateEngagementScore(data);

  return fields;
}
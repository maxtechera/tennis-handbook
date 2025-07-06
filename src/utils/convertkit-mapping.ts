/**
 * ConvertKit mapping utilities for transforming wizard data
 * Maps complex wizard responses to ConvertKit custom fields and tags
 */

import type { 
  WizardData, 
  UserSegment, 
  TrainingGoal, 
  CommitmentLevel 
} from '../components/OnboardingWizard/types';

export interface ConvertKitFields {
  [key: string]: string | number | boolean;
}

export interface ConvertKitData {
  fields: ConvertKitFields;
  tags: string[];
}

/**
 * Maps wizard data to ConvertKit custom fields and tags
 */
export function mapWizardDataToConvertKit(wizardData: WizardData): ConvertKitData {
  const {
    personalInfo = {},
    tennisExperience = {},
    trainingGoals = {},
    schedulePreferences = {},
    physicalProfile = {},
  } = wizardData;

  // Build custom fields for ConvertKit
  const fields: ConvertKitFields = {
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
    trainings_per_week: schedulePreferences.trainingsPerWeek || 0,
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
    wizard_version: wizardData.wizardVersion || '1.0',
  };

  // Generate tags based on user responses
  const tags = generateTags(wizardData);

  return { fields, tags };
}

/**
 * Generates ConvertKit tags based on wizard responses
 */
function generateTags(wizardData: WizardData): string[] {
  const tags: string[] = ['tennis-handbook', 'onboarding-wizard'];
  const {
    personalInfo = {},
    tennisExperience = {},
    trainingGoals = {},
    schedulePreferences = {},
    physicalProfile = {},
  } = wizardData;
  
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
  
  // Add secondary goal tags
  if (trainingGoals.secondaryGoals) {
    trainingGoals.secondaryGoals.forEach(goal => {
      tags.push(`secondary-goal-${goal}`);
    });
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

  // Age segments
  if (physicalProfile.age) {
    if (physicalProfile.age < 18) {
      tags.push('junior-player');
    } else if (physicalProfile.age >= 40) {
      tags.push('master-player');
    }
  }

  // Equipment access tags
  if (schedulePreferences.equipmentAccess) {
    if (schedulePreferences.equipmentAccess.includes('gym')) {
      tags.push('gym-access');
    }
    if (schedulePreferences.equipmentAccess.includes('court')) {
      tags.push('court-access');
    }
  }

  return tags;
}

/**
 * Gets email sequence recommendation based on user profile
 */
export function getEmailSequenceRecommendation(wizardData: WizardData): string {
  const { tennisExperience = {}, trainingGoals = {}, schedulePreferences = {} } = wizardData;
  
  // Competitive players get advanced sequence
  if (tennisExperience.playsCompetitively && tennisExperience.currentLevel === 'competitive') {
    return 'competitive-player-sequence';
  }
  
  // Injury recovery takes priority
  if (trainingGoals.injuryHistory) {
    return 'injury-recovery-sequence';
  }
  
  // Based on commitment level
  if (schedulePreferences.commitmentLevel === 'professional') {
    return 'professional-sequence';
  }
  
  if (schedulePreferences.commitmentLevel === 'serious') {
    return 'serious-player-sequence';
  }
  
  // Based on primary goal
  switch (trainingGoals.primaryGoal) {
    case 'competition':
      return 'competition-prep-sequence';
    case 'fitness':
      return 'fitness-focused-sequence';
    case 'technique':
      return 'technique-improvement-sequence';
    case 'recovery':
      return 'recovery-focused-sequence';
    default:
      // Default based on level
      return `${tennisExperience.currentLevel || 'beginner'}-player-sequence`;
  }
}

/**
 * Determines if user should get WhatsApp follow-up (Spanish users)
 */
export function shouldEnableWhatsApp(wizardData: WizardData): boolean {
  const { personalInfo = {}, schedulePreferences = {} } = wizardData;
  
  // Spanish speakers with high commitment are good candidates
  return personalInfo.language === 'es' && 
         (schedulePreferences.commitmentLevel === 'serious' || 
          schedulePreferences.commitmentLevel === 'professional');
}

/**
 * Gets progressive disclosure unlock recommendations
 */
export function getProgressiveUnlocks(wizardData: WizardData): string[] {
  const unlocks: string[] = [];
  const { tennisExperience = {}, trainingGoals = {}, schedulePreferences = {} } = wizardData;
  
  // Everyone gets week 1
  unlocks.push('week-1-workouts');
  
  // Intermediate+ get more weeks unlocked
  if (['intermediate', 'advanced', 'competitive'].includes(tennisExperience.currentLevel || '')) {
    unlocks.push('week-2-workouts', 'week-3-workouts');
  }
  
  // High commitment gets bonus content
  if (['serious', 'professional'].includes(schedulePreferences.commitmentLevel || '')) {
    unlocks.push('bonus-recovery-protocols', 'advanced-techniques');
  }
  
  // Competitive players get competition prep
  if (tennisExperience.playsCompetitively) {
    unlocks.push('competition-preparation-guide');
  }
  
  // Injury history unlocks prevention content
  if (trainingGoals.injuryHistory) {
    unlocks.push('injury-prevention-masterclass');
  }
  
  return unlocks;
}
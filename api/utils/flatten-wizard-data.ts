/**
 * Utility to flatten wizard data for database storage
 * Converts nested wizard data into flat fields for easier querying and export
 */

export interface FlatWizardData {
  // User Profile
  email?: string;
  name?: string;
  age?: string;
  gender?: string;
  location?: string;
  whatsapp?: string;
  language?: string;
  
  // Tennis Profile
  tennisLevel?: string;
  tennisGoal?: string;
  yearsPlaying?: string;
  playsCompetitively?: boolean;
  playingStyle?: string;
  favoriteShot?: string;
  
  // Training Preferences
  timeAvailability?: string;
  preferredTimes?: string[];
  focusAreas?: string[];
  primaryFocus?: string;
  commitmentLevel?: string;
  
  // Physical Profile
  fitnessLevel?: string;
  mainChallenges?: string[];
  injuries?: string[];
  
  // Engagement Metrics
  microQuizEngagement?: number;
  goalsQuizEngagement?: number;
  timeQuizEngagement?: number;
  focusQuizEngagement?: number;
  
  // Conversion Data
  acceptedTerms?: boolean;
  newsletter?: boolean;
  downloadedPdf?: boolean;
  
  // AI/Calculated fields
  userSegment?: string;
  aiRecommendations?: string[];
  personalizedPath?: string;
  
  // Tags for export
  tags?: string[];
  
  // Raw data backup
  rawData?: any;
}

export function flattenWizardData(wizardData: any): FlatWizardData {
  const flat: FlatWizardData = {
    // Store raw data as backup
    rawData: wizardData
  };
  
  // Extract user profile data
  const personalInfo = wizardData.personalInfo || wizardData['personal-info'] || wizardData.welcome || {};
  flat.email = personalInfo.email || wizardData.email;
  flat.name = personalInfo.name || wizardData.name;
  flat.language = personalInfo.language || wizardData.language || 'en';
  flat.acceptedTerms = personalInfo.acceptedTerms || false;
  flat.newsletter = personalInfo.newsletter || false;
  
  // Extract from personalization step
  const personalization = wizardData.personalization || {};
  flat.age = personalization.age;
  flat.gender = personalization.gender;
  flat.location = personalization.location || personalization.country;
  flat.whatsapp = personalization.whatsapp || personalInfo.whatsapp;
  
  // Extract tennis profile from micro quiz
  const microQuiz = wizardData['micro-quiz'] || {};
  flat.tennisLevel = microQuiz.level;
  flat.microQuizEngagement = microQuiz.engagement;
  
  // Extract goals from goals quiz
  const goalsQuiz = wizardData['goals-quiz'] || {};
  flat.tennisGoal = goalsQuiz.goal;
  flat.goalsQuizEngagement = goalsQuiz.engagement;
  
  // Extract time preferences
  const timeQuiz = wizardData['time-quiz'] || {};
  flat.timeAvailability = timeQuiz.availability;
  flat.preferredTimes = timeQuiz.preferredTimes || [];
  flat.timeQuizEngagement = timeQuiz.engagement;
  
  // Extract focus areas
  const focusQuiz = wizardData['focus-quiz'] || {};
  flat.focusAreas = focusQuiz.areas || [];
  flat.primaryFocus = focusQuiz.primaryFocus || (focusQuiz.areas && focusQuiz.areas[0]);
  flat.focusQuizEngagement = focusQuiz.engagement;
  
  // Extract from background step
  const background = wizardData.background || {};
  flat.yearsPlaying = background.yearsPlaying || wizardData.tennisExperience?.yearsPlaying;
  flat.playingStyle = background.playingStyle;
  flat.favoriteShot = background.favoriteShot;
  flat.playsCompetitively = background.playsCompetitively || wizardData.tennisExperience?.playsCompetitively || false;
  
  // Extract from challenges step
  const challenges = wizardData.challenges || {};
  flat.mainChallenges = challenges.mainChallenges || [];
  flat.injuries = challenges.injuries || [];
  
  // Extract physical profile
  const physicalProfile = wizardData.physicalProfile || {};
  flat.fitnessLevel = physicalProfile.fitnessLevel;
  
  // Extract training preferences
  const schedulePreferences = wizardData.schedulePreferences || {};
  flat.commitmentLevel = schedulePreferences.commitmentLevel;
  
  // Extract from welcome success
  const welcomeSuccess = wizardData['welcome-success'] || {};
  flat.downloadedPdf = welcomeSuccess.downloadedPdf || false;
  
  // Extract AI recommendations
  const analyzing = wizardData.analyzing || {};
  flat.aiRecommendations = analyzing.aiRecommendations || [];
  flat.personalizedPath = analyzing.personalizedPath;
  
  // Calculate user segment
  flat.userSegment = calculateUserSegment(wizardData);
  
  // Generate tags for export
  flat.tags = generateTags(flat);
  
  return flat;
}

function calculateUserSegment(data: any): string {
  const level = data['micro-quiz']?.level || data.tennisExperience?.currentLevel;
  const goal = data['goals-quiz']?.goal || data.trainingGoals?.primaryGoal;
  const competitive = data.background?.playsCompetitively || data.tennisExperience?.playsCompetitively;
  const fitness = data.physicalProfile?.fitnessLevel;
  
  if (level === 'professional' || (competitive && fitness === 'excellent')) {
    return 'competitive';
  }
  
  if (level === 'advanced' || (level === 'intermediate' && competitive)) {
    return 'advanced';
  }
  
  if (level === 'intermediate') {
    return 'intermediate';
  }
  
  return 'beginner';
}

function generateTags(flat: FlatWizardData): string[] {
  const tags: string[] = [];
  
  // Language tag
  if (flat.language === 'es') tags.push('spanish');
  if (flat.language === 'en') tags.push('english');
  
  // Level tags
  if (flat.tennisLevel) tags.push(`level-${flat.tennisLevel}`);
  if (flat.userSegment) tags.push(`segment-${flat.userSegment}`);
  
  // Goal tags
  if (flat.tennisGoal) tags.push(`goal-${flat.tennisGoal}`);
  
  // Time availability tags
  if (flat.timeAvailability === '1-2days') tags.push('casual-player');
  if (flat.timeAvailability === '3-5days') tags.push('regular-player');
  if (flat.timeAvailability === '6-7days') tags.push('dedicated-player');
  
  // Preferred time tags
  if (flat.preferredTimes?.includes('morning')) tags.push('morning-player');
  if (flat.preferredTimes?.includes('evening')) tags.push('evening-player');
  
  // Focus area tags
  flat.focusAreas?.forEach(area => tags.push(`focus-${area}`));
  
  // Age tags
  if (flat.age) tags.push(`age-${flat.age}`);
  
  // Location tags
  if (flat.location) tags.push(`location-${flat.location.toLowerCase().replace(/\s+/g, '-')}`);
  
  // WhatsApp tag
  if (flat.whatsapp) tags.push('whatsapp-user');
  
  // Newsletter tag
  if (flat.newsletter) tags.push('newsletter-subscriber');
  
  // Competitive tag
  if (flat.playsCompetitively) tags.push('competitive-player');
  
  // Injury tags
  flat.injuries?.forEach(injury => tags.push(`injury-${injury}`));
  
  return tags;
}

// Export utility for ConvertKit format
export function toConvertKitFormat(flat: FlatWizardData) {
  return {
    email: flat.email,
    first_name: flat.name?.split(' ')[0],
    fields: {
      tennis_level: flat.tennisLevel,
      tennis_goal: flat.tennisGoal,
      age: flat.age,
      location: flat.location,
      whatsapp: flat.whatsapp,
      language: flat.language,
      time_availability: flat.timeAvailability,
      primary_focus: flat.primaryFocus,
      user_segment: flat.userSegment,
    },
    tags: flat.tags
  };
}

// Export utility for CSV/spreadsheet format
export function toSpreadsheetRow(flat: FlatWizardData) {
  return {
    email: flat.email,
    name: flat.name,
    age: flat.age,
    gender: flat.gender,
    location: flat.location,
    whatsapp: flat.whatsapp,
    language: flat.language,
    tennis_level: flat.tennisLevel,
    tennis_goal: flat.tennisGoal,
    years_playing: flat.yearsPlaying,
    plays_competitively: flat.playsCompetitively,
    playing_style: flat.playingStyle,
    favorite_shot: flat.favoriteShot,
    time_availability: flat.timeAvailability,
    preferred_times: flat.preferredTimes?.join(', '),
    focus_areas: flat.focusAreas?.join(', '),
    primary_focus: flat.primaryFocus,
    commitment_level: flat.commitmentLevel,
    fitness_level: flat.fitnessLevel,
    main_challenges: flat.mainChallenges?.join(', '),
    injuries: flat.injuries?.join(', '),
    user_segment: flat.userSegment,
    tags: flat.tags?.join(', '),
    accepted_terms: flat.acceptedTerms,
    newsletter: flat.newsletter,
    downloaded_pdf: flat.downloadedPdf,
  };
}
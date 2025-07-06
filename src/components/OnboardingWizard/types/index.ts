// User profile and segmentation types
export type UserSegment = 'beginner' | 'intermediate' | 'advanced' | 'competitive';
export type Language = 'es' | 'en';
export type TrainingGoal = 'fitness' | 'technique' | 'competition' | 'recovery';
export type CommitmentLevel = 'casual' | 'regular' | 'serious' | 'professional';
export type Experience = '<1' | '1-3' | '3-5' | '5+';

// Form data interfaces for each step
export interface PersonalInfoData {
  name?: string;
  email: string;
  language: Language;
  country?: string;
}

export interface TennisExperienceData {
  yearsPlaying: Experience;
  currentLevel: UserSegment;
  playsCompetitively: boolean;
  ranking?: string;
  coachingHistory?: boolean;
}

export interface TrainingGoalsData {
  primaryGoal: TrainingGoal;
  secondaryGoals?: TrainingGoal[];
  specificChallenges?: string[];
  injuryHistory?: boolean;
  injuryDetails?: string;
}

export interface SchedulePreferencesData {
  trainingsPerWeek: number;
  sessionDuration: '30' | '45' | '60' | '90' | '120';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  commitmentLevel: CommitmentLevel;
  equipmentAccess: string[];
}

export interface PhysicalProfileData {
  age?: number;
  fitnessLevel: 'low' | 'moderate' | 'good' | 'excellent';
  dominantHand: 'right' | 'left' | 'ambidextrous';
  height?: number;
  weight?: number;
  mobilityIssues?: boolean;
}

// Complete wizard data
export interface WizardData {
  personalInfo?: PersonalInfoData;
  tennisExperience?: TennisExperienceData;
  trainingGoals?: TrainingGoalsData;
  schedulePreferences?: SchedulePreferencesData;
  physicalProfile?: PhysicalProfileData;
  completedAt?: string;
  wizardVersion?: string;
}

// Personalization types
export interface UserProfile {
  segment: UserSegment;
  language: Language;
  goals: TrainingGoal[];
  commitment: CommitmentLevel;
  hasCoaching: boolean;
  hasInjuries: boolean;
  fitnessLevel: string;
  trainingsPerWeek: number;
}

export interface ContentRecommendation {
  id: string;
  type: 'program' | 'article' | 'video' | 'exercise';
  title: string;
  description: string;
  path: string;
  priority: number;
  reason: string;
}

export interface EmailSequenceRecommendation {
  sequenceId: string;
  name: string;
  description: string;
  duration: string;
  priority: number;
}

export interface PersonalizationResult {
  userProfile: UserProfile;
  segment: UserSegment;
  contentRecommendations: ContentRecommendation[];
  emailSequence: EmailSequenceRecommendation;
  tags: string[];
}

// Wizard state types
export interface WizardState {
  currentStep: number;
  data: WizardData;
  isComplete: boolean;
  startedAt: string;
  lastUpdatedAt: string;
  sessionId: string;
}

// Validation types
export interface ValidationRule {
  field: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any, data: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
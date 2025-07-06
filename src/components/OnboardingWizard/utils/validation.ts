import { 
  ValidationRule, 
  ValidationResult,
  PersonalInfoData,
  TennisExperienceData,
  TrainingGoalsData,
  SchedulePreferencesData,
  PhysicalProfileData
} from '../types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation rules for each step
export const personalInfoRules: ValidationRule[] = [
  {
    field: 'email',
    required: true,
    pattern: EMAIL_REGEX,
    custom: (value: string) => {
      if (!value) return 'Email is required';
      if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
      return true;
    }
  },
  {
    field: 'language',
    required: true,
    custom: (value: string) => {
      if (!value) return 'Please select a language';
      if (!['es', 'en'].includes(value)) return 'Invalid language selection';
      return true;
    }
  }
];

export const tennisExperienceRules: ValidationRule[] = [
  {
    field: 'yearsPlaying',
    required: true,
    custom: (value: string) => {
      if (!value) return 'Please select your experience level';
      return true;
    }
  },
  {
    field: 'currentLevel',
    required: true,
    custom: (value: string) => {
      if (!value) return 'Please select your current level';
      return true;
    }
  },
  {
    field: 'playsCompetitively',
    required: true
  }
];

export const trainingGoalsRules: ValidationRule[] = [
  {
    field: 'primaryGoal',
    required: true,
    custom: (value: string) => {
      if (!value) return 'Please select your primary training goal';
      return true;
    }
  },
  {
    field: 'injuryDetails',
    custom: (value: string, data: TrainingGoalsData) => {
      if (data.injuryHistory && !value) {
        return 'Please provide details about your injury history';
      }
      return true;
    }
  }
];

export const schedulePreferencesRules: ValidationRule[] = [
  {
    field: 'trainingsPerWeek',
    required: true,
    min: 1,
    max: 7,
    custom: (value: number) => {
      if (!value || value < 1) return 'Please select training frequency';
      if (value > 7) return 'Maximum 7 sessions per week';
      return true;
    }
  },
  {
    field: 'sessionDuration',
    required: true
  },
  {
    field: 'preferredTime',
    required: true
  },
  {
    field: 'commitmentLevel',
    required: true
  },
  {
    field: 'equipmentAccess',
    custom: (value: string[]) => {
      if (!value || value.length === 0) {
        return 'Please select at least one equipment option';
      }
      return true;
    }
  }
];

export const physicalProfileRules: ValidationRule[] = [
  {
    field: 'fitnessLevel',
    required: true
  },
  {
    field: 'dominantHand',
    required: true
  },
  {
    field: 'age',
    min: 5,
    max: 100,
    custom: (value: number) => {
      if (value && (value < 5 || value > 100)) {
        return 'Please enter a valid age between 5 and 100';
      }
      return true;
    }
  }
];

// Generic validation function
export function validate(data: any, rules: ValidationRule[]): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const rule of rules) {
    const value = data[rule.field];

    // Check required fields
    if (rule.required && (!value || (Array.isArray(value) && value.length === 0))) {
      errors[rule.field] = `${rule.field} is required`;
      isValid = false;
      continue;
    }

    // Skip validation for optional empty fields
    if (!rule.required && !value) {
      continue;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[rule.field] = `Invalid ${rule.field} format`;
      isValid = false;
    }

    // Check string length
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors[rule.field] = `${rule.field} must be at least ${rule.minLength} characters`;
        isValid = false;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[rule.field] = `${rule.field} must be at most ${rule.maxLength} characters`;
        isValid = false;
      }
    }

    // Check numeric range
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors[rule.field] = `${rule.field} must be at least ${rule.min}`;
        isValid = false;
      }
      if (rule.max !== undefined && value > rule.max) {
        errors[rule.field] = `${rule.field} must be at most ${rule.max}`;
        isValid = false;
      }
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value, data);
      if (result !== true) {
        errors[rule.field] = typeof result === 'string' ? result : `Invalid ${rule.field}`;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
}

// Step-specific validation functions
export function validatePersonalInfo(data: PersonalInfoData): ValidationResult {
  return validate(data, personalInfoRules);
}

export function validateTennisExperience(data: TennisExperienceData): ValidationResult {
  return validate(data, tennisExperienceRules);
}

export function validateTrainingGoals(data: TrainingGoalsData): ValidationResult {
  return validate(data, trainingGoalsRules);
}

export function validateSchedulePreferences(data: SchedulePreferencesData): ValidationResult {
  return validate(data, schedulePreferencesRules);
}

export function validatePhysicalProfile(data: PhysicalProfileData): ValidationResult {
  return validate(data, physicalProfileRules);
}

// Helper function to get validation function for a step
export function getStepValidator(stepId: string) {
  const validators: Record<string, (data: any) => ValidationResult> = {
    'personal-info': validatePersonalInfo,
    'tennis-experience': validateTennisExperience,
    'training-goals': validateTrainingGoals,
    'schedule-preferences': validateSchedulePreferences,
    'physical-profile': validatePhysicalProfile
  };

  return validators[stepId] || (() => ({ isValid: true, errors: {} }));
}
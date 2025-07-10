/**
 * Wizard step configuration for the onboarding flow
 */

import React from 'react';
import { 
  WelcomeStep, 
  WelcomeSuccessStep,
  MicroQuizStep,
  GoalsQuizStep,
  TimeQuizStep,
  FocusQuizStep,
  ExperienceLevelStep,
  AgeGroupStep,
  TrainingFrequencyStep,
  AnalyzingStep,
  PersonalizationStep, 
  BackgroundStep, 
  ChallengesStep, 
  CompletionStep 
} from '../components/OnboardingWizard/steps';
import type { OnboardingStep } from '../components/OnboardingWizard/OnboardingWizard';

/**
 * Creates the wizard steps with proper configuration
 * New optimized flow: Engagement → Value → Email → Full Quiz → Results
 */
export function createWizardSteps(language: string = 'en'): OnboardingStep[] {
  const isSpanish = language === 'es';
  
  return [
    // Phase 1: Multi-Question Engagement Hook
    {
      id: 'micro-quiz',
      content: <MicroQuizStep />,
    },
    {
      id: 'goals-quiz',
      content: <GoalsQuizStep />,
    },
    {
      id: 'time-quiz',
      content: <TimeQuizStep />,
    },
    {
      id: 'focus-quiz',
      content: <FocusQuizStep />,
    },
    
    // Phase 2: Analyzing + Value Preview (combined experience)
    {
      id: 'analyzing',
      content: <AnalyzingStep />,
    },
    
    // Phase 3: Email Capture (with established value)
    {
      id: 'welcome',
      content: <WelcomeStep />,
    },
    
    // Phase 4: Success & Upsell (Progressive Disclosure)
    {
      id: 'welcome-success',  
      content: <WelcomeSuccessStep />,
    },
    
    // Phase 5: Additional Profile Questions
    {
      id: 'experience-level',
      content: <ExperienceLevelStep />,
    },
    {
      id: 'age-group',
      content: <AgeGroupStep />,
    },
    {
      id: 'training-frequency',
      content: <TrainingFrequencyStep />,
    },
    
    // Phase 6: Detailed Quiz
    {
      id: 'personalization',
      content: <PersonalizationStep includeWhatsApp={isSpanish} />,
    },
    {
      id: 'background',
      content: <BackgroundStep />,
    },
    {
      id: 'challenges', 
      content: <ChallengesStep />,
    },
    
    // Phase 7: Results & Completion
    {
      id: 'completion',
      content: <CompletionStep />,
    },
  ];
}

/**
 * Creates the legacy wizard steps for A/B testing
 */
export function createLegacyWizardSteps(language: string = 'en'): OnboardingStep[] {
  const isSpanish = language === 'es';
  
  return [
    {
      id: 'welcome',
      content: <WelcomeStep />,
    },
    {
      id: 'welcome-success',  
      content: <WelcomeSuccessStep />,
    },
    {
      id: 'personalization',
      content: <PersonalizationStep includeWhatsApp={isSpanish} />,
    },
    {
      id: 'background',
      content: <BackgroundStep />,
    },
    {
      id: 'challenges', 
      content: <ChallengesStep />,
    },
    {
      id: 'completion',
      content: <CompletionStep />,
    },
  ];
}

/**
 * Translations for the wizard UI
 */
export function getWizardTranslations(language: string = 'en') {
  const translations = {
    en: {
      next: 'Next',
      previous: 'Previous',
      skip: 'Skip for now',
      complete: 'Get Started',
      stepOf: 'Step',
    },
    es: {
      next: 'Siguiente',
      previous: 'Anterior',
      skip: 'Omitir por ahora',
      complete: 'Comenzar',
      stepOf: 'Paso',
    },
  };
  
  return translations[language] || translations.en;
}
/**
 * Wizard step configuration for the onboarding flow
 */

import React from 'react';
import { 
  WelcomeStep, 
  WelcomeSuccessStep,
  PersonalizationStep, 
  BackgroundStep, 
  ChallengesStep, 
  CompletionStep 
} from '../components/OnboardingWizard/steps';
import type { OnboardingStep } from '../components/OnboardingWizard/OnboardingWizard';

/**
 * Creates the wizard steps with proper configuration
 */
export function createWizardSteps(language: string = 'en'): OnboardingStep[] {
  const isSpanish = language === 'es';
  
  return [
    {
      id: 'welcome',
      content: <WelcomeStep language={language} />,
    },
    {
      id: 'welcome-success',
      content: <WelcomeSuccessStep language={language} />,
    },
    {
      id: 'personalization',
      content: <PersonalizationStep language={language} includeWhatsApp={isSpanish} />,
    },
    {
      id: 'background',
      content: <BackgroundStep language={language} />,
    },
    {
      id: 'challenges',
      content: <ChallengesStep language={language} />,
    },
    {
      id: 'completion',
      content: <CompletionStep language={language} />,
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
import { useEffect, useCallback } from 'react';
import { useWizardState } from './useWizardState';
import { useWizardPersistence } from './useWizardPersistence';
import { usePersonalization } from './usePersonalization';
import { WizardData, UserSegment } from '../types';

interface UseOnboardingWizardProps {
  onComplete?: (data: WizardData, segment: UserSegment, recommendations: any) => void;
  persistKey?: string;
  autoSave?: boolean;
}

/**
 * Composite hook that combines all wizard functionality
 * This is the main hook to use in your wizard component
 */
export function useOnboardingWizard({
  onComplete,
  persistKey = 'tennis-onboarding',
  autoSave = true
}: UseOnboardingWizardProps = {}) {
  // Initialize wizard state
  const wizardState = useWizardState({
    onComplete: (data, segment) => {
      // Get personalization results before calling onComplete
      const personalization = getPersonalization();
      
      if (onComplete) {
        onComplete(data, segment, personalization);
      }

      // Clear persistence after completion
      persistence.clearState();
    }
  });

  // Set up persistence
  const persistence = useWizardPersistence({
    state: wizardState.state,
    persistKey,
    autoSave
  });

  // Set up personalization
  const {
    userProfile,
    segment,
    getPersonalization,
    getContentRecommendations,
    getEmailSequence,
    generateTags,
    getStartingPath
  } = usePersonalization({
    wizardData: wizardState.wizardData
  });

  // Load saved state on mount
  useEffect(() => {
    if (persistence.hasSavedState()) {
      const savedState = persistence.loadState();
      if (savedState && !wizardState.isComplete) {
        // Restore saved state
        // Note: In a real implementation, you'd need to update the wizard state
        // This would require adding a method to useWizardState to restore state
        console.log('Loaded saved state:', savedState);
      }
    }
  }, []);

  // Handle step validation before navigation
  const nextStepWithValidation = useCallback((stepId: string) => {
    const validation = wizardState.validateCurrentStep(stepId);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    wizardState.nextStep();
    return { success: true };
  }, [wizardState]);

  // Handle wizard completion with personalization
  const completeWithPersonalization = useCallback(() => {
    const result = wizardState.completeWizard();
    const personalization = getPersonalization();

    // Send data to ConvertKit or your email service
    if (result.data.personalInfo?.email) {
      // Example API call (implement based on your backend)
      fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: result.data.personalInfo.email,
          segment: result.segment,
          tags: personalization.tags,
          sequenceId: personalization.emailSequence.sequenceId,
          wizardData: result.data
        })
      }).catch(console.error);
    }

    return {
      ...result,
      personalization
    };
  }, [wizardState, getPersonalization]);

  // Get step-specific props for forms
  const getStepProps = useCallback((stepId: string) => {
    return {
      data: wizardState.wizardData[stepId as keyof WizardData] || {},
      onUpdate: (data: any) => wizardState.updateStepData(stepId, data),
      validation: wizardState.validateCurrentStep(stepId),
      isActive: wizardState.currentStep === getStepIndex(stepId)
    };
  }, [wizardState]);

  // Helper to get step index by ID
  const getStepIndex = (stepId: string): number => {
    const stepMap: Record<string, number> = {
      'personal-info': 0,
      'tennis-experience': 1,
      'training-goals': 2,
      'schedule-preferences': 3,
      'physical-profile': 4
    };
    return stepMap[stepId] || 0;
  };

  // Spanish language detection
  const detectSpanishPreference = useCallback(() => {
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      wizardState.updateStepData('personal-info', { language: 'es' });
    }

    // Check timezone for Spanish-speaking countries
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const spanishTimezones = ['Europe/Madrid', 'America/Mexico_City', 'America/Buenos_Aires'];
    if (spanishTimezones.some(tz => timezone.includes(tz))) {
      wizardState.updateStepData('personal-info', { language: 'es' });
    }
  }, [wizardState]);

  // Run Spanish detection on mount
  useEffect(() => {
    detectSpanishPreference();
  }, [detectSpanishPreference]);

  return {
    // State
    ...wizardState,
    userProfile,
    segment,

    // Persistence
    hasSavedState: persistence.hasSavedState(),
    clearSavedState: persistence.clearState,
    isStorageAvailable: persistence.isStorageAvailable,

    // Personalization
    getPersonalization,
    getContentRecommendations,
    getEmailSequence,
    generateTags,
    getStartingPath,

    // Enhanced actions
    nextStepWithValidation,
    completeWithPersonalization,
    getStepProps,

    // Utilities
    detectSpanishPreference
  };
}
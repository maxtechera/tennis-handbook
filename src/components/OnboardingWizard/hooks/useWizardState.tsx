import { useState, useCallback, useMemo } from 'react';
import { WizardData, WizardState, ValidationResult, UserSegment } from '../types';
import { getStepValidator } from '../utils/validation';

interface UseWizardStateProps {
  initialData?: Partial<WizardData>;
  onStepChange?: (step: number, data: WizardData) => void;
  onComplete?: (data: WizardData, segment: UserSegment) => void;
}

export function useWizardState({
  initialData = {},
  onStepChange,
  onComplete
}: UseWizardStateProps = {}) {
  // Generate session ID for tracking
  const sessionId = useMemo(() => {
    return `wizard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Initialize state
  const [state, setState] = useState<WizardState>({
    currentStep: 0,
    data: {
      ...initialData,
      wizardVersion: '1.0.0'
    },
    isComplete: false,
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    sessionId
  });

  // Update step data
  const updateStepData = useCallback((stepId: string, stepData: any) => {
    setState(prev => {
      const newData = {
        ...prev.data,
        [stepId]: {
          ...prev.data[stepId as keyof WizardData],
          ...stepData
        }
      };

      return {
        ...prev,
        data: newData,
        lastUpdatedAt: new Date().toISOString()
      };
    });
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((stepId: string): ValidationResult => {
    const stepData = state.data[stepId as keyof WizardData];
    if (!stepData) {
      return { isValid: true, errors: {} };
    }

    const validator = getStepValidator(stepId);
    return validator(stepData);
  }, [state.data]);

  // Navigation functions
  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
      lastUpdatedAt: new Date().toISOString()
    }));

    if (onStepChange) {
      onStepChange(step, state.data);
    }
  }, [state.data, onStepChange]);

  const nextStep = useCallback(() => {
    const newStep = state.currentStep + 1;
    goToStep(newStep);
  }, [state.currentStep, goToStep]);

  const previousStep = useCallback(() => {
    const newStep = Math.max(0, state.currentStep - 1);
    goToStep(newStep);
  }, [state.currentStep, goToStep]);

  // Calculate user segment based on data
  const calculateSegment = useCallback((): UserSegment => {
    const { tennisExperience, physicalProfile, schedulePreferences } = state.data;

    if (!tennisExperience) return 'beginner';

    // Competitive players with good fitness and high commitment
    if (
      tennisExperience.playsCompetitively &&
      tennisExperience.currentLevel !== 'beginner' &&
      physicalProfile?.fitnessLevel === 'excellent' &&
      schedulePreferences?.commitmentLevel === 'professional'
    ) {
      return 'competitive';
    }

    // Advanced players
    if (
      tennisExperience.currentLevel === 'advanced' ||
      (tennisExperience.yearsPlaying === '5+' && 
       physicalProfile?.fitnessLevel === 'good')
    ) {
      return 'advanced';
    }

    // Intermediate players
    if (
      tennisExperience.currentLevel === 'intermediate' ||
      (tennisExperience.yearsPlaying === '3-5' || 
       tennisExperience.yearsPlaying === '1-3')
    ) {
      return 'intermediate';
    }

    return 'beginner';
  }, [state.data]);

  // Complete wizard
  const completeWizard = useCallback(() => {
    const completedData: WizardData = {
      ...state.data,
      completedAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      data: completedData,
      isComplete: true
    }));

    const segment = calculateSegment();

    if (onComplete) {
      onComplete(completedData, segment);
    }

    return { data: completedData, segment };
  }, [state.data, calculateSegment, onComplete]);

  // Reset wizard
  const resetWizard = useCallback(() => {
    setState({
      currentStep: 0,
      data: {
        wizardVersion: '1.0.0'
      },
      isComplete: false,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      sessionId: `wizard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }, []);

  // Check if step has data
  const hasStepData = useCallback((stepId: string): boolean => {
    const stepData = state.data[stepId as keyof WizardData];
    return stepData !== undefined && Object.keys(stepData).length > 0;
  }, [state.data]);

  // Get progress percentage
  const getProgress = useCallback((): number => {
    const totalSteps = 5; // Adjust based on your wizard steps
    const completedSteps = Object.keys(state.data).filter(
      key => key !== 'wizardVersion' && key !== 'completedAt'
    ).length;
    return Math.round((completedSteps / totalSteps) * 100);
  }, [state.data]);

  return {
    // State
    state,
    currentStep: state.currentStep,
    wizardData: state.data,
    isComplete: state.isComplete,
    sessionId: state.sessionId,

    // Actions
    updateStepData,
    validateCurrentStep,
    goToStep,
    nextStep,
    previousStep,
    completeWizard,
    resetWizard,

    // Utilities
    hasStepData,
    getProgress,
    calculateSegment
  };
}
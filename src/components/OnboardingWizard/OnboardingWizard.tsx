import React, { useState, useEffect, ReactNode } from 'react';
import { ProgressIndicator } from './components/ProgressIndicator';
import { UserInfoDisplay } from './components/UserInfoDisplay';
import { WizardProgress } from './components/WizardProgress';
import styles from './OnboardingWizard.module.css';

export interface OnboardingStep {
  id: string;
  content: ReactNode;
  isHidden?: boolean; // For hidden steps (like email capture)
}

export interface OnboardingWizardProps {
  steps: OnboardingStep[];
  onComplete: (data: any) => void;
  onSkip?: () => void;
  initialStep?: number;
  persistKey?: string;
  translations?: {
    next: string;
    previous: string;
    skip: string;
    complete: string;
    stepOf: string;
  };
}

const defaultTranslations = {
  next: 'Next',
  previous: 'Previous',
  skip: 'Skip',
  complete: 'Complete',
  stepOf: 'of'
};

export default function OnboardingWizard({
  steps,
  onComplete,
  onSkip,
  initialStep = 0,
  persistKey = 'onboarding-wizard',
  translations = defaultTranslations
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [wizardData, setWizardData] = useState<Record<string, any>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);

  // Filter out hidden steps for display purposes
  const visibleSteps = steps.filter(step => !step.isHidden);
  const totalVisibleSteps = visibleSteps.length;
  
  // Calculate visible step index
  const getVisibleStepIndex = (stepIndex: number) => {
    let visibleIndex = 0;
    for (let i = 0; i < stepIndex; i++) {
      if (!steps[i].isHidden) {
        visibleIndex++;
      }
    }
    return visibleIndex;
  };

  const currentVisibleStep = getVisibleStepIndex(currentStep);

  // Load saved progress from localStorage
  useEffect(() => {
    if (persistKey) {
      const savedData = localStorage.getItem(`${persistKey}-data`);
      const savedStep = localStorage.getItem(`${persistKey}-step`);
      
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setWizardData(data);
          
          // Check if user is already a subscriber
          if (data.personalInfo?.email && data.personalInfo?.isSubscriber) {
            setIsSubscriber(true);
          }
        } catch (e) {
          console.error('Failed to parse saved wizard data');
        }
      }
      
      if (savedStep) {
        const stepIndex = parseInt(savedStep, 10);
        if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < steps.length) {
          setCurrentStep(stepIndex);
        }
      }
    }
  }, [persistKey, steps.length]);

  // Save progress to localStorage
  useEffect(() => {
    if (persistKey) {
      localStorage.setItem(`${persistKey}-data`, JSON.stringify(wizardData));
      localStorage.setItem(`${persistKey}-step`, currentStep.toString());
    }
  }, [currentStep, wizardData, persistKey]);

  const updateStepData = (stepId: string, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [stepId]: data
    }));
    
    // Check if this is the personal info step and email was provided
    if (stepId === 'personal-info' && data.email && !isSubscriber) {
      setIsSubscriber(true);
      // Mark as subscriber in the data
      setWizardData(prev => ({
        ...prev,
        [stepId]: { ...data, isSubscriber: true }
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = () => {
    onComplete(wizardData);
    // Clear saved progress
    if (persistKey) {
      localStorage.removeItem(`${persistKey}-data`);
      localStorage.removeItem(`${persistKey}-step`);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
      // Clear saved progress
      if (persistKey) {
        localStorage.removeItem(`${persistKey}-data`);
        localStorage.removeItem(`${persistKey}-step`);
      }
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = steps[currentStep];
  
  // Get user info for display
  const userInfo = wizardData['personal-info'] || {};
  const showUserInfo = userInfo.name || userInfo.email;

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.wizardHeader}>
        {!currentStepData.isHidden && (
          <ProgressIndicator
            currentStep={currentVisibleStep + 1}
            totalSteps={totalVisibleSteps}
            stepText={`${translations.stepOf}`}
          />
        )}
        {onSkip && (
          <button
            className={styles.skipButton}
            onClick={handleSkip}
            aria-label={translations.skip}
          >
            {translations.skip}
          </button>
        )}
      </div>

      <div className={`${styles.stepContent} ${isAnimating ? styles.animating : ''}`}>
        {/* Show wizard progress with accumulated information */}
        <WizardProgress 
          wizardData={wizardData}
          currentStep={currentStepData.id}
        />
        {React.isValidElement(currentStepData.content) 
          ? React.cloneElement(currentStepData.content as React.ReactElement<any>, {
              onNext: (data: any) => {
                updateStepData(currentStepData.id, data);
                handleNext();
              },
              onBack: handlePrevious,
              data: wizardData[currentStepData.id] || {},
              wizardData: wizardData // Pass full wizard data for personalization
            })
          : currentStepData.content
        }
      </div>

      {/* Hide navigation for welcome step and success step */}
      {currentStepData.id !== 'welcome' && currentStepData.id !== 'welcome-success' && (
        <div className={styles.wizardFooter}>
          <button
            className={`${styles.navButton} ${styles.previousButton}`}
            onClick={handlePrevious}
            disabled={isFirstStep}
            aria-label={translations.previous}
          >
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {translations.previous}
          </button>

          <button
            className={`${styles.navButton} ${styles.nextButton} ${styles.primary}`}
            onClick={handleNext}
            aria-label={isLastStep ? translations.complete : translations.next}
          >
            {isLastStep ? translations.complete : translations.next}
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
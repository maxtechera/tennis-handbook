import React from 'react';
import styles from './ProgressIndicator.module.css';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepText?: string;
  className?: string;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepText = 'of',
  className = '' 
}: ProgressIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div className={styles.progressText}>
        <span className={styles.stepLabel}>Step</span>
        <span className={styles.stepNumber}>{currentStep}</span>
        <span className={styles.stepOf}>{stepText}</span>
        <span className={styles.totalSteps}>{totalSteps}</span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
        
        <div className={styles.progressDots}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`${styles.progressDot} ${
                index + 1 <= currentStep ? styles.completed : ''
              } ${index + 1 === currentStep ? styles.current : ''}`}
              aria-label={`Step ${index + 1} ${
                index + 1 <= currentStep ? 'completed' : 'not completed'
              }`}
            >
              {index + 1 === currentStep && (
                <div className={styles.currentDotPulse} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
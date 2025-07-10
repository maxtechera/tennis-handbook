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
      <div className={styles.stepCounter}>
        {currentStep} {stepText} {totalSteps}
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
      </div>
    </div>
  );
}
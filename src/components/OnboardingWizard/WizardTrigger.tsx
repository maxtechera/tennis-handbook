/**
 * Component to manually trigger the onboarding wizard
 * Can be used in CTAs or for testing purposes
 */

import React from 'react';
import { trackWizardStart } from '@site/src/utils/analytics';

interface WizardTriggerProps {
  onTrigger: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'button' | 'link';
  language?: string;
}

export function WizardTrigger({ 
  onTrigger, 
  className = '', 
  children,
  variant = 'button',
  language = 'en'
}: WizardTriggerProps) {
  const handleClick = () => {
    trackWizardStart(language);
    onTrigger();
  };

  const defaultText = language === 'es' 
    ? '🎯 Personaliza tu experiencia' 
    : '🎯 Personalize Your Experience';

  if (variant === 'link') {
    return (
      <a 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className={className}
      >
        {children || defaultText}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || 'button button--primary button--lg'}
    >
      {children || defaultText}
    </button>
  );
}

/**
 * Hook to manage wizard trigger state
 */
export function useWizardTrigger() {
  const [showWizard, setShowWizard] = React.useState(false);
  
  const openWizard = () => setShowWizard(true);
  const closeWizard = () => setShowWizard(false);
  
  return {
    showWizard,
    openWizard,
    closeWizard,
  };
}
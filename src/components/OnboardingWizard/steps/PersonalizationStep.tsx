import React, { useState } from 'react';
import styles from './PersonalizationStep.module.css';

interface PersonalizationStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

export function PersonalizationStep({ onNext, onBack, data, wizardData }: PersonalizationStepProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  const personalInfo = wizardData?.['personal-info'] || {};

  const options = [
    {
      id: 'email',
      icon: '📧',
      title: 'Solo Email',
      description: 'Tips semanales por email'
    },
    {
      id: 'whatsapp',
      icon: '💬',
      title: 'Email + WhatsApp',
      description: 'Contenido exclusivo por WhatsApp'
    },
    {
      id: 'all',
      icon: '🎯',
      title: 'Todo el Contenido',
      description: 'Acceso completo a tips y análisis'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowCelebration(true);
    
    setTimeout(() => {
      onNext({ 
        communicationPreference: optionId,
        language: 'es'
      });
    }, 1000);
  };

  return (
    <div className={styles.personalizationStep}>
      <div className={styles.content}>
        
        {/* Question */}
        <div className={styles.questionSection}>
          <h2 className={styles.title}>
            {personalInfo.name ? `¡Hola ${personalInfo.name}!` : '¡Perfecto!'}
          </h2>
          <p className={styles.subtitle}>
            ¿Cómo te gustaría recibir contenido exclusivo?
          </p>
        </div>

        {/* Options */}
        <div className={styles.optionsGrid}>
          {options.map((option) => (
            <button
              key={option.id}
              className={`${styles.optionCard} ${selectedOption === option.id ? styles.selected : ''} ${showCelebration && selectedOption === option.id ? styles.celebrate : ''}`}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showCelebration}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <h3 className={styles.optionTitle}>{option.title}</h3>
              <p className={styles.optionDescription}>{option.description}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
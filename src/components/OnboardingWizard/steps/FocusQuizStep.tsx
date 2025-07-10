import React, { useState } from 'react';
import styles from './MicroQuizStep.module.css';

interface FocusQuizStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

type FocusArea = 'technique' | 'power' | 'endurance' | 'strategy';

interface FocusOption {
  id: FocusArea;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const focusOptions: FocusOption[] = [
  {
    id: 'technique',
    title: 'Técnica',
    description: 'Perfeccionar golpes y movimientos',
    icon: '🎯',
    color: 'linear-gradient(135deg, #4CAF50, #8BC34A)'
  },
  {
    id: 'power',
    title: 'Potencia',
    description: 'Aumentar fuerza y velocidad',
    icon: '💥',
    color: 'linear-gradient(135deg, #FF9800, #F57C00)'
  },
  {
    id: 'endurance',
    title: 'Resistencia',
    description: 'Mejorar condición cardiovascular',
    icon: '🏃‍♂️',
    color: 'linear-gradient(135deg, #2196F3, #1976D2)'
  },
  {
    id: 'strategy',
    title: 'Táctica',
    description: 'Desarrollar juego inteligente',
    icon: '🧠',
    color: 'linear-gradient(135deg, #9C27B0, #7B1FA2)'
  }
];

export function FocusQuizStep({ onNext, onBack, data = {} }: FocusQuizStepProps) {
  const [selectedFocus, setSelectedFocus] = useState<FocusArea | null>(
    data.focusArea || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleFocusSelect = (focus: FocusArea) => {
    setSelectedFocus(focus);
    setShowCelebration(true);
    
    // Extended sequence: celebration → analyzing → value reveal → advance
    setTimeout(() => {
      onNext({
        focusArea: focus,
        engagement: 100,
        timestamp: new Date().toISOString(),
        triggerAnalyzing: true // Signal to start analyzing sequence
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>¿Qué quieres mejorar más?</h2>
          <p className={styles.questionSubtitle}>
            Enfocaremos tu entrenamiento en esta área
          </p>
        </div>

        <div className={styles.levelOptions}>
          {focusOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.levelOption} ${
                selectedFocus === option.id ? styles.selected : ''
              }`}
              onClick={() => handleFocusSelect(option.id)}
              style={{
                background: selectedFocus === option.id ? option.color : undefined
              }}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionContent}>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              {selectedFocus === option.id && (
                <div className={styles.selectedIndicator}>
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Celebration Message */}
        {showCelebration && (
          <div className={styles.celebration}>
            <div className={styles.celebrationIcon}>🚀</div>
            <p className={styles.celebrationText}>
              ¡Genial! Tu plan de entrenamiento está casi listo...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
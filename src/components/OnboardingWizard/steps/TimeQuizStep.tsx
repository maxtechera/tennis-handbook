import React, { useState } from 'react';
import styles from './MicroQuizStep.module.css';

interface TimeQuizStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

type TimeCommitment = 'minimal' | 'moderate' | 'dedicated' | 'intensive';

interface TimeOption {
  id: TimeCommitment;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const timeOptions: TimeOption[] = [
  {
    id: 'minimal',
    title: '30-45 min',
    description: '2-3 veces por semana',
    icon: '⏰',
    color: 'linear-gradient(135deg, #4CAF50, #8BC34A)'
  },
  {
    id: 'moderate',
    title: '1 hora',
    description: '3-4 veces por semana',
    icon: '🕐',
    color: 'linear-gradient(135deg, #2196F3, #1976D2)'
  },
  {
    id: 'dedicated',
    title: '1-2 horas',
    description: '4-5 veces por semana',
    icon: '⏲️',
    color: 'linear-gradient(135deg, #FF9800, #F57C00)'
  },
  {
    id: 'intensive',
    title: '2+ horas',
    description: '6+ veces por semana',
    icon: '⏱️',
    color: 'linear-gradient(135deg, #9C27B0, #7B1FA2)'
  }
];

export function TimeQuizStep({ onNext, onBack, data = {} }: TimeQuizStepProps) {
  const [selectedTime, setSelectedTime] = useState<TimeCommitment | null>(
    data.timeCommitment || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleTimeSelect = (time: TimeCommitment) => {
    setSelectedTime(time);
    setShowCelebration(true);
    
    // Auto-advance after celebration
    setTimeout(() => {
      onNext({
        timeCommitment: time,
        engagement: 100,
        timestamp: new Date().toISOString()
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>¿Cuánto tiempo puedes dedicar?</h2>
          <p className={styles.questionSubtitle}>
            Adaptaremos la intensidad a tu disponibilidad
          </p>
        </div>

        <div className={styles.levelOptions}>
          {timeOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.levelOption} ${
                selectedTime === option.id ? styles.selected : ''
              }`}
              onClick={() => handleTimeSelect(option.id)}
              style={{
                background: selectedTime === option.id ? option.color : undefined
              }}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionContent}>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              {selectedTime === option.id && (
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
            <div className={styles.celebrationIcon}>⚡</div>
            <p className={styles.celebrationText}>
              ¡Perfecto! Calculando tu programa personalizado...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
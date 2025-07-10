import React, { useState, useEffect } from 'react';
import styles from './BackgroundStep.module.css';

interface BackgroundStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

interface Option {
  id: string;
  icon: string;
  label: string;
  description: string;
}

export function BackgroundStep({ onNext, onBack, data, wizardData }: BackgroundStepProps) {
  // Get experience level from micro-quiz step (no need to ask again)
  const microQuizData = wizardData?.['micro-quiz'] || {};
  const experienceLevel = microQuizData.level || '';
  
  const [ageGroup, setAgeGroup] = useState(data.ageGroup || '');
  const [trainingFrequency, setTrainingFrequency] = useState(data.trainingFrequency || '');
  const [showCelebration, setShowCelebration] = useState<string>('');
  
  const personalInfo = wizardData?.['personal-info'] || {};
  const userName = personalInfo.name;

  const experienceLevels: Option[] = [
    {
      id: 'beginner',
      icon: '🌱',
      label: 'Principiante',
      description: '< 1 año jugando'
    },
    {
      id: 'intermediate',
      icon: '🎾',
      label: 'Intermedio',
      description: '1-3 años de experiencia'
    },
    {
      id: 'advanced',
      icon: '🏆',
      label: 'Avanzado',
      description: '3+ años, juego regular'
    },
    {
      id: 'competitive',
      icon: '🥇',
      label: 'Competitivo',
      description: 'Torneos y competencias'
    }
  ];

  const ageGroups: Option[] = [
    {
      id: 'junior',
      icon: '👦',
      label: 'Junior',
      description: 'Menos de 18 años'
    },
    {
      id: 'adult',
      icon: '🧑',
      label: 'Adulto',
      description: '18-50 años'
    },
    {
      id: 'senior',
      icon: '👨‍🦳',
      label: 'Senior',
      description: 'Más de 50 años'
    }
  ];

  const trainingFrequencies: Option[] = [
    {
      id: '1-2',
      icon: '📅',
      label: '1-2 días',
      description: 'Casual, por diversión'
    },
    {
      id: '3-4',
      icon: '📆',
      label: '3-4 días',
      description: 'Regular, mejora constante'
    },
    {
      id: '5-6',
      icon: '🗓️',
      label: '5-6 días',
      description: 'Dedicado, alto rendimiento'
    },
    {
      id: 'daily',
      icon: '🏃‍♂️',
      label: 'Todos los días',
      description: 'Profesional o pre-profesional'
    }
  ];

  // Handle option selection with celebration animation
  const handleOptionSelect = (type: string, value: string) => {
    setShowCelebration(`${type}-${value}`);
    
    setTimeout(() => {
      if (type === 'experience') {
        setExperienceLevel(value);
      } else if (type === 'age') {
        setAgeGroup(value);
      } else if (type === 'frequency') {
        setTrainingFrequency(value);
      }
      setShowCelebration('');
    }, 600);
  };

  // Auto-proceed when all NEW fields are filled (experience comes from micro-quiz)
  useEffect(() => {
    if (ageGroup && trainingFrequency) {
      const timer = setTimeout(() => {
        onNext({
          experienceLevel, // From micro-quiz
          ageGroup,
          trainingFrequency
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [experienceLevel, ageGroup, trainingFrequency, onNext]);

  // Determine which question is active (skip experience as it's already known)
  const activeQuestion = !ageGroup ? 'age' : 'frequency';

  const renderOptions = (options: Option[], type: string, value: string, columns: number) => {
    return (
      <div className={`${styles.optionsGrid} ${styles[`columns${columns}`]}`}>
        {options.map((option, index) => (
          <button
            key={option.id}
            className={`${styles.optionCard} ${value === option.id ? styles.selected : ''} ${showCelebration === `${type}-${option.id}` ? styles.celebrate : ''}`}
            onClick={() => handleOptionSelect(type, option.id)}
            disabled={showCelebration !== ''}
            style={{ '--index': index } as React.CSSProperties}
          >
            <div className={styles.optionIcon}>{option.icon}</div>
            <div className={styles.optionLabel}>{option.label}</div>
            <div className={styles.optionDescription}>{option.description}</div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.backgroundStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {userName ? `Perfecto ${userName}, completemos tu perfil` : 'Completemos tu perfil'}
        </h2>
        <p className={styles.subtitle}>
          Solo nos faltan un par de datos para personalizar tu programa
        </p>
        {experienceLevel && (
          <div className={styles.experienceReminder}>
            ✅ Nivel: <strong>{experienceLevels.find(e => e.id === experienceLevel)?.label || experienceLevel}</strong>
          </div>
        )}
      </div>

      <div className={styles.form}>

        {/* Age Group */}
        <div className={`${styles.questionCard} ${ageGroup ? styles.completed : ''} ${activeQuestion === 'age' ? styles.active : ''}`}>
          <h3 className={styles.questionTitle}>¿En qué grupo de edad te encuentras?</h3>
          {renderOptions(ageGroups, 'age', ageGroup, 3)}
        </div>

        {/* Training Frequency */}
        <div className={`${styles.questionCard} ${trainingFrequency ? styles.completed : ''} ${activeQuestion === 'frequency' ? styles.active : ''}`}>
          <h3 className={styles.questionTitle}>¿Con qué frecuencia entrenas?</h3>
          {renderOptions(trainingFrequencies, 'frequency', trainingFrequency, 2)}
        </div>

        {/* Progress Dots - Only 2 questions now */}
        <div className={styles.progressDots}>
          <div className={`${styles.progressDot} ${ageGroup ? styles.completed : ''} ${activeQuestion === 'age' ? styles.active : ''}`} />
          <div className={`${styles.progressDot} ${trainingFrequency ? styles.completed : ''} ${activeQuestion === 'frequency' ? styles.active : ''}`} />
        </div>
      </div>
    </div>
  );
}
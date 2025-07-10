import React, { useState, useEffect } from 'react';
import styles from './ChallengesStep.module.css';

interface ChallengesStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

interface Challenge {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export function ChallengesStep({ onNext, onBack, data, wizardData }: ChallengesStepProps) {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(data.challenges || []);
  const [showCelebration, setShowCelebration] = useState('');
  
  const personalInfo = wizardData?.['personal-info'] || {};
  const userName = personalInfo.name;

  const challenges: Challenge[] = [
    {
      id: 'power',
      icon: '💥',
      title: 'Más Potencia',
      description: 'Golpes más fuertes y explosivos'
    },
    {
      id: 'speed',
      icon: '⚡',
      title: 'Más Velocidad',
      description: 'Movimientos más rápidos en cancha'
    },
    {
      id: 'endurance',
      icon: '🔋',
      title: 'Más Resistencia',
      description: 'Aguantar partidos largos sin fatiga'
    },
    {
      id: 'flexibility',
      icon: '🤸',
      title: 'Más Flexibilidad',
      description: 'Mejor rango de movimiento'
    },
    {
      id: 'consistency',
      icon: '🎯',
      title: 'Más Consistencia',
      description: 'Reducir errores no forzados'
    },
    {
      id: 'injury-prevention',
      icon: '🛡️',
      title: 'Prevenir Lesiones',
      description: 'Mantenerte saludable y activo'
    }
  ];

  const toggleChallenge = (challengeId: string) => {
    setShowCelebration(challengeId);
    
    setTimeout(() => {
      setSelectedChallenges(prev => {
        if (prev.includes(challengeId)) {
          return prev.filter(id => id !== challengeId);
        } else {
          return [...prev, challengeId];
        }
      });
      setShowCelebration('');
    }, 300);
  };

  // Auto-advance after selecting 2-3 challenges
  useEffect(() => {
    if (selectedChallenges.length >= 2) {
      const timer = setTimeout(() => {
        onNext({ challenges: selectedChallenges });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedChallenges, onNext]);

  const handleSkip = () => {
    onNext({ challenges: [] });
  };

  return (
    <div className={styles.challengesStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {userName ? `${userName}, ¿qué quieres mejorar?` : '¿Qué quieres mejorar?'}
        </h2>
        <p className={styles.subtitle}>
          Selecciona 2 o 3 áreas de enfoque para tu entrenamiento
        </p>
      </div>

      <div className={styles.challengesGrid}>
        {challenges.map((challenge, index) => (
          <button
            key={challenge.id}
            className={`${styles.challengeCard} ${selectedChallenges.includes(challenge.id) ? styles.selected : ''} ${showCelebration === challenge.id ? styles.celebrate : ''}`}
            onClick={() => toggleChallenge(challenge.id)}
            disabled={showCelebration !== '' || (selectedChallenges.length >= 3 && !selectedChallenges.includes(challenge.id))}
            style={{ '--index': index } as React.CSSProperties}
          >
            <div className={styles.challengeIcon}>{challenge.icon}</div>
            <h3 className={styles.challengeTitle}>{challenge.title}</h3>
            <p className={styles.challengeDescription}>{challenge.description}</p>
            {selectedChallenges.includes(challenge.id) && (
              <div className={styles.checkmark}>✓</div>
            )}
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.selectionCount}>
          {selectedChallenges.length > 0 && (
            <span className={styles.countText}>
              {selectedChallenges.length} de 3 seleccionados
            </span>
          )}
        </div>
        
        <button 
          className={styles.skipButton}
          onClick={handleSkip}
          type="button"
        >
          Omitir este paso →
        </button>
      </div>
    </div>
  );
}
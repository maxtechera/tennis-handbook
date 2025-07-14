import React, { useState, useEffect } from 'react';
import styles from './AnalyzingStep.module.css';

interface AnalyzingStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
  wizardData?: any;
}

type AnalysisPhase = 'analyzing' | 'calculating' | 'revealing' | 'completed';

export function AnalyzingStep({ onNext, onBack, data = {}, wizardData = {} }: AnalyzingStepProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phases: AnalysisPhase[] = ['analyzing', 'calculating', 'revealing', 'completed'];
  const phase = phases[phaseIndex];
  const [showPlan, setShowPlan] = useState(false);

  // Get user's selections for personalization
  const userLevel = wizardData['micro-quiz']?.level || 'intermediate';
  const userGoal = wizardData['goals-quiz']?.goal || 'fitness';
  const userTime = wizardData['time-quiz']?.timeCommitment || 'moderate';
  const userFocus = wizardData['focus-quiz']?.focusArea || 'technique';

  // Determine personalized plan based on user selections
  const getPlanDetails = () => {
    const planMap = {
      beginner: {
        title: 'Plan de Fundamentos Sólidos',
        icon: '🌱',
        description: 'Perfecto para construir una base técnica correcta desde el inicio',
        benefits: [
          'Técnicas básicas de golpeo correctas',
          'Posicionamiento y movimiento en cancha',
          'Desarrollo de consistencia y confianza',
          'Fundamentos de estrategia básica'
        ]
      },
      intermediate: {
        title: 'Plan de Desarrollo Técnico',
        icon: '🎾',
        description: 'Ideal para elevar tu juego al siguiente nivel',
        benefits: [
          'Refinamiento de técnica de golpes',
          'Desarrollo de potencia controlada',
          'Estrategias de juego intermedias',
          'Preparación física específica'
        ]
      },
      advanced: {
        title: 'Plan de Alto Rendimiento',
        icon: '🏆',
        description: 'Para jugadores que buscan competir seriamente',
        benefits: [
          'Técnicas avanzadas y variaciones',
          'Entrenamiento de alta intensidad',
          'Estrategias de competición',
          'Preparación mental y táctica'
        ]
      },
      professional: {
        title: 'Plan Elite de Entrenadores',
        icon: '👑',
        description: 'Métodos usados por entrenadores de top 10',
        benefits: [
          'Secretos de entrenadores élite',
          'Metodologías de Alcaraz y Sinner',
          'Sistemas de medallistas olímpicos',
          'Técnicas de recuperación avanzada'
        ]
      }
    };

    return planMap[userLevel] || planMap.intermediate;
  };

  const planDetails = getPlanDetails();

  useEffect(() => {
    const sequence = async () => {
      // Each phase for 2 seconds
      for (let i = 0; i < phases.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (i < phases.length - 1) {
          setPhaseIndex(i + 1);
        }
      }
      
      // Brief pause before auto-advance
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Auto-advance to email capture
      onNext({
        analyzingComplete: true,
        userPreferences: {
          level: userLevel,
          goal: userGoal,
          timeCommitment: userTime,
          focusArea: userFocus
        }
      });
    };

    sequence();
  }, []);

  const getAnalyzingText = () => {
    // Each phase shows: Problem Analysis + Solution Value
    const phaseContent = {
      analyzing: {
        analysis: {
          title: 'Detectando por qué tu derecha parece golpe de ping pong...',
          subtitle: '🔍 Ese swing que prometiste arreglar hace 3 años',
          icon: '🕵️'
        },
        solution: {
          title: '✅ Técnica Correcta desde el Día 1',
          description: 'Aprende los fundamentos que usan los pros - evita años de malos hábitos',
          benefit: 'Progreso 3x más rápido con técnica correcta',
          color: 'blue'
        }
      },
      calculating: {
        analysis: {
          title: 'Calculando por qué a veces juegas como Federer...',
          subtitle: '🎾 ...y otras veces como si fuera tu primer día',
          icon: '📊'
        },
        solution: {
          title: '✅ Sistema de Entrenamiento Progresivo',
          description: 'Rutinas estructuradas que garantizan mejora constante',
          benefit: 'Consistencia profesional en 30 días',
          color: 'purple'
        }
      },
      revealing: {
        analysis: {
          title: 'Midiendo cuánto talento desperdicias...',
          subtitle: '💎 Tienes potencial pero solo sale los domingos',
          icon: '⚡'
        },
        solution: {
          title: '✅ Metodología de Campeones Olímpicos',
          description: 'Los mismos métodos que usan entrenadores de top 10 mundial',
          benefit: 'Desbloquea tu máximo potencial',
          color: 'orange'
        }
      },
      completed: {
        analysis: {
          title: '¡Análisis completo! (Es peor de lo que pensabas)',
          subtitle: '🏆 Pero tenemos la solución perfecta para ti',
          icon: '🎯'
        },
        solution: {
          title: '🎁 Descarga tu Plan GRATIS',
          description: 'Todo personalizado para tu nivel y objetivos',
          benefit: 'Comienza tu transformación HOY',
          color: 'green'
        }
      }
    };

    return phaseContent[phase] || phaseContent.analyzing;
  };

  const getAllPhaseContent = () => {
    const allPhases: AnalysisPhase[] = ['analyzing', 'calculating', 'revealing', 'completed'];
    return allPhases.map(p => getAnalyzingText(p));
  };

  const getAnalyzingTextForPhase = (specificPhase: AnalysisPhase) => {
    const phaseContent = {
      analyzing: {
        analysis: {
          title: 'Detectando por qué tu derecha parece golpe de ping pong...',
          subtitle: '🔍 Ese swing que prometiste arreglar hace 3 años',
          icon: '🕵️'
        },
        solution: {
          title: '✅ Técnica Correcta desde el Día 1',
          description: 'Aprende los fundamentos que usan los pros - evita años de malos hábitos',
          benefit: 'Progreso 3x más rápido con técnica correcta',
          color: 'blue'
        }
      },
      calculating: {
        analysis: {
          title: 'Calculando por qué a veces juegas como Federer...',
          subtitle: '🎾 ...y otras veces como si fuera tu primer día',
          icon: '📊'
        },
        solution: {
          title: '✅ Sistema de Entrenamiento Progresivo',
          description: 'Rutinas estructuradas que garantizan mejora constante',
          benefit: 'Consistencia profesional en 30 días',
          color: 'purple'
        }
      },
      revealing: {
        analysis: {
          title: 'Midiendo cuánto talento desperdicias...',
          subtitle: '💎 Tienes potencial pero solo sale los domingos',
          icon: '⚡'
        },
        solution: {
          title: '✅ Metodología de Campeones Olímpicos',
          description: 'Los mismos métodos que usan entrenadores de top 10 mundial',
          benefit: 'Desbloquea tu máximo potencial',
          color: 'orange'
        }
      },
      completed: {
        analysis: {
          title: '¡Análisis completo! (Es peor de lo que pensabas)',
          subtitle: '🏆 Pero tenemos la solución perfecta para ti',
          icon: '🎯'
        },
        solution: {
          title: '🎁 Descarga tu Plan GRATIS',
          description: 'Todo personalizado para tu nivel y objetivos',
          benefit: 'Comienza tu transformación HOY',
          color: 'green'
        }
      }
    };

    return phaseContent[specificPhase] || phaseContent.analyzing;
  };

  return (
    <div className={styles.analyzingStep}>
      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack} 
          style={{ transform: `translateX(-${phaseIndex * 100}%)` }}
        >
          {phases.map((p, index) => {
            const info = getAnalyzingTextForPhase(p);
            return (
              <div key={p} className={styles.carouselSlide}>
                <div className={styles.content}>
                  {/* Analysis Section */}
                  <div className={styles.analysisSection}>
                    <div className={styles.animationContainer}>
                      <div className={styles.loadingIcon}>{info.analysis.icon}</div>
                      <div className={styles.loadingDots}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    
                    <div className={styles.analyzingText}>
                      <h2 className={styles.title}>{info.analysis.title}</h2>
                      <p className={styles.subtitle}>{info.analysis.subtitle}</p>
                    </div>
                  </div>

                  {/* Solution Value */}
                  <div className={styles.solutionSection}>
                    <div className={`${styles.solutionCard} ${styles[info.solution.color]}`}>
                      <h3 className={styles.solutionTitle}>{info.solution.title}</h3>
                      <p className={styles.solutionDescription}>{info.solution.description}</p>
                      <div className={styles.benefitBadge}>
                        <span className={styles.benefitText}>{info.solution.benefit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress dots */}
      <div className={styles.progressDots}>
        {phases.map((p, index) => (
          <div 
            key={index} 
            className={`${styles.dot} ${index === phaseIndex ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
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
  const [phase, setPhase] = useState<AnalysisPhase>('analyzing');
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
      // Phase 1: Analyzing (5 seconds - analysis + value point)
      await new Promise(resolve => setTimeout(resolve, 5000));
      setPhase('calculating');
      
      // Phase 2: Calculating (5 seconds - analysis + value point)  
      await new Promise(resolve => setTimeout(resolve, 5000));
      setPhase('revealing');
      
      // Phase 3: Revealing (5 seconds - analysis + value point)
      await new Promise(resolve => setTimeout(resolve, 5000));
      setPhase('completed');
      
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
          title: 'Detectando errores técnicos...',
          subtitle: '🔍 Encontrando esos malos hábitos escondidos',
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
          title: 'Analizando falta de consistencia...',
          subtitle: '🎾 ¿Por qué unos días juegas bien y otros...?',
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
          title: 'Midiendo potencial sin explotar...',
          subtitle: '💎 Hay un jugador élite esperando salir',
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
          title: '¡Análisis completo!',
          subtitle: '🏆 Tu roadmap personalizado está listo',
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

  const analyzingInfo = getAnalyzingText();

  return (
    <div className={styles.analyzingStep}>
      <div className={styles.content}>
        
        {/* Analysis Section */}
        <div key={`analysis-${phase}`} className={styles.analysisSection}>
          <div className={styles.animationContainer}>
            <div className={styles.loadingIcon}>{analyzingInfo.analysis.icon}</div>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className={styles.analyzingText}>
            <h2 className={styles.title}>{analyzingInfo.analysis.title}</h2>
            <p className={styles.subtitle}>{analyzingInfo.analysis.subtitle}</p>
          </div>
        </div>

        {/* Solution Value */}
        <div key={`solution-${phase}`} className={styles.solutionSection}>
          <div className={`${styles.solutionCard} ${styles[analyzingInfo.solution.color]}`}>
            <h3 className={styles.solutionTitle}>{analyzingInfo.solution.title}</h3>
            <p className={styles.solutionDescription}>{analyzingInfo.solution.description}</p>
            <div className={styles.benefitBadge}>
              <span className={styles.benefitText}>{analyzingInfo.solution.benefit}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
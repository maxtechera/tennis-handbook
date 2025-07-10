import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import styles from './CompletionStep.module.css';

interface CompletionStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

export function CompletionStep({ onNext, onBack, data, wizardData }: CompletionStepProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const personalInfo = wizardData?.['personal-info'] || {};
  const userName = personalInfo.name;

  useEffect(() => {
    // Trigger confetti animation after component mounts
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    onNext({ completed: true });
  };

  return (
    <div className={styles.completionStep}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className={styles.confetti}>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={styles.confettiPiece}
              style={{
                '--delay': `${Math.random() * 0.5}s`,
                '--duration': `${1 + Math.random() * 1}s`,
                '--position': `${Math.random() * 100}%`,
                '--rotation': `${Math.random() * 360}deg`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Success Section */}
      <div className={styles.success}>
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.title}>
          {userName ? `¡Felicidades ${userName}!` : '¡Felicidades!'}
        </h2>
        <p className={styles.subtitle}>
          Tu programa personalizado está listo para transformar tu juego
        </p>
      </div>

      {/* Next Steps Cards */}
      <div className={styles.nextSteps}>
        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>📧</div>
          <div className={styles.stepContent}>
            <h3>Revisa tu correo</h3>
            <p>Te enviamos tu guía de inicio y acceso completo</p>
          </div>
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>📱</div>
          <div className={styles.stepContent}>
            <h3>Descarga la app</h3>
            <p>Accede a todos los entrenamientos desde tu móvil</p>
          </div>
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>🏃‍♂️</div>
          <div className={styles.stepContent}>
            <h3>Comienza hoy</h3>
            <p>Tu primera sesión te está esperando</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <h3 className={styles.quickLinksTitle}>Acceso rápido a tu contenido</h3>
        <div className={styles.linkGrid}>
          <Link to="/docs/workouts/week-1/monday" className={styles.linkCard}>
            <span className={styles.linkIcon}>🎾</span>
            <span>Primera Sesión</span>
          </Link>
          <Link to="/docs/workouts/week-program-table" className={styles.linkCard}>
            <span className={styles.linkIcon}>📅</span>
            <span>Plan Completo</span>
          </Link>
          <Link to="/docs/training-philosophy/overview" className={styles.linkCard}>
            <span className={styles.linkIcon}>🧠</span>
            <span>Filosofías</span>
          </Link>
          <Link to="/docs/nutrition/overview" className={styles.linkCard}>
            <span className={styles.linkIcon}>🥗</span>
            <span>Nutrición</span>
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className={styles.finalActions}>
        <button onClick={handleComplete} className={styles.primaryButton}>
          Comenzar mi transformación →
        </button>
      </div>
    </div>
  );
}
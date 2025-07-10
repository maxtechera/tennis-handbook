import React, { useState } from 'react';
import styles from './MicroQuizStep.module.css';

interface WelcomeSuccessStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

export function WelcomeSuccessStep({ onNext, onBack, data, wizardData }: WelcomeSuccessStepProps) {
  const personalInfo = wizardData?.['personal-info'] || {};
  const [showCelebration, setShowCelebration] = useState(false);

  const handleContinue = () => {
    setShowCelebration(true);
    setTimeout(() => {
      onNext({ continueToVip: true });
    }, 1000);
  };

  const handleSkip = () => {
    setShowCelebration(true);
    setTimeout(() => {
      onNext({ skip: true });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        
        {/* Title Section */}
        <div className={styles.questionTitle}>
          <h2>¡Bienvenido a Elite Tennis!</h2>
          <p className={styles.questionSubtitle}>
            Ya eres parte de nuestra comunidad de entrenamiento élite
          </p>
        </div>

        {/* Success Options */}
        <div className={styles.levelOptions}>
          {/* PDF Status Card */}
          <div className={styles.levelOption}>
            <div className={styles.optionIcon}>📧</div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>¡Tu PDF está en camino!</h3>
              <p className={styles.optionDescription}>
                {personalInfo.email ? (
                  `Enviamos tu rutina de 7 días a ${personalInfo.email}. Revisa tu bandeja de entrada y confirma tu suscripción.`
                ) : (
                  'Enviamos tu rutina de 7 días a tu email. Revisa tu bandeja de entrada y confirma tu suscripción.'
                )}
              </p>
            </div>
          </div>

          {/* CTA Button styled as option */}
          <button
            type="button"
            className={`${styles.levelOption} ${styles.ctaOption}`}
            onClick={handleContinue}
            disabled={showCelebration}
          >
            <div className={styles.optionIcon}>🎯</div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Ver oferta exclusiva</h3>
              <p className={styles.optionDescription}>
                Descubre nuestro programa completo personalizado
              </p>
            </div>
            <div className={styles.selectedIndicator}>→</div>
          </button>
        </div>

        {/* Celebration Message */}
        {showCelebration && (
          <div className={styles.celebration}>
            <div className={styles.celebrationIcon}>🎾</div>
            <p className={styles.celebrationText}>
              ¡Perfecto! Preparando tu oferta exclusiva...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
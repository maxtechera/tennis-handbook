import React, { useState } from 'react';
import styles from './WelcomeSuccessStep.module.css';

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
    <div className={styles.welcomeSuccessStep}>
      <div className={styles.content}>
        
        {/* Success Icon */}
        <div className={styles.iconContainer}>
          <div className={`${styles.successIcon} ${showCelebration ? styles.celebrate : ''}`}>
            🎾
          </div>
        </div>

        {/* Welcome Message */}
        <div className={styles.welcomeText}>
          <h2 className={styles.title}>¡Bienvenido a Elite Tennis!</h2>
          <p className={styles.subtitle}>
            Ya eres parte de nuestra comunidad de entrenamiento élite
          </p>
        </div>

        {/* PDF Status */}
        <div className={styles.pdfCard}>
          <div className={styles.pdfIcon}>📧</div>
          <h3 className={styles.pdfTitle}>¡Tu PDF está en camino!</h3>
          <p className={styles.pdfMessage}>
            {personalInfo.email ? (
              `Enviamos tu rutina de 7 días a ${personalInfo.email}. Revisa tu bandeja de entrada y confirma tu suscripción.`
            ) : (
              'Enviamos tu rutina de 7 días a tu email. Revisa tu bandeja de entrada y confirma tu suscripción.'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.continueButton}
            onClick={handleContinue}
            disabled={showCelebration}
          >
            Ver oferta exclusiva →
          </button>
        </div>

      </div>
    </div>
  );
}
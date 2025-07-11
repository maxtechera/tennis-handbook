import React from 'react';
import styles from './MicroQuizStep.module.css';

interface WelcomeSuccessStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

export function WelcomeSuccessStep({ onNext, onBack, data, wizardData }: WelcomeSuccessStepProps) {
  const personalInfo = wizardData?.['personal-info'] || {};

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

          {/* VIP Access Card */}
          <div className={styles.levelOption}>
            <div className={styles.optionIcon}>🎯</div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Acceso rápido a tu contenido</h3>
              <p className={styles.optionDescription}>
                Descubre nuestro programa completo personalizado
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './WelcomeSuccessStep.module.css';

interface WelcomeSuccessStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

export function WelcomeSuccessStep({ onNext, onBack, data, wizardData }: WelcomeSuccessStepProps) {
  const personalInfo = wizardData?.['personal-info'] || {};

  const handleContinue = () => {
    onNext({});
  };

  return (
    <div className={styles.welcomeSuccessStep}>
      {/* Welcome Hero Section */}
      <div className={styles.welcomeHero}>
        <div className={styles.heroIcon}>🎾</div>
        <h1 className={styles.heroTitle}>
          {personalInfo.name ? (
            `¡Bienvenido ${personalInfo.name}!`
          ) : (
            <Translate id="onboarding.success.hero.welcome.default">
              ¡Bienvenido a Elite Tennis!
            </Translate>
          )}
        </h1>
        <p className={styles.heroSubtitle}>
          <Translate id="onboarding.success.hero.subtitle">
            Ya eres parte de nuestra comunidad de entrenamiento elite
          </Translate>
        </p>
        
        {/* PDF Status Section */}
        <div className={styles.pdfStatus}>
          <div className={styles.pdfStatusIcon}>📧</div>
          <div className={styles.pdfStatusContent}>
            <h3 className={styles.pdfStatusTitle}>
              <Translate id="onboarding.success.pdf.sent.title">
                ¡Tu PDF está en camino!
              </Translate>
            </h3>
            <p className={styles.pdfStatusMessage}>
              {personalInfo.email ? (
                `Enviamos tu rutina de 7 días a ${personalInfo.email}. Revisa tu bandeja de entrada y confirma tu suscripción.`
              ) : (
                <Translate id="onboarding.success.pdf.sent.message.default">
                  Enviamos tu rutina de 7 días a tu email. Revisa tu bandeja de entrada y confirma tu suscripción.
                </Translate>
              )}
            </p>
          </div>
        </div>

        {/* Exclusive Access Offer */}
        <div className={styles.exclusiveOffer}>
          <div className={styles.offerBadge}>🔥 OFERTA EXCLUSIVA</div>
          <h3 className={styles.offerTitle}>
            <Translate id="onboarding.success.exclusive.title">
              Acceso VIP a todo el sistema completo
            </Translate>
          </h3>
          <div className={styles.offerBenefits}>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>📚</span>
              <span>12 semanas de rutinas progresivas</span>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>🎯</span>
              <span>Personalización según tu nivel y objetivos</span>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>💪</span>
              <span>Métodos específicos para tu tipo de jugador</span>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>📱</span>
              <span>Acceso prioritario a la app móvil (próximamente)</span>
            </div>
          </div>
          <div className={styles.offerCta}>
            <p className={styles.offerCondition}>
              <Translate id="onboarding.success.exclusive.condition">
                Solo necesitas completar tu perfil ahora (2 minutos) para reservar tu acceso VIP
              </Translate>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.continueButton}
            onClick={handleContinue}
          >
            <Translate id="onboarding.success.continue">
              🚀 SÍ, QUIERO ACCESO VIP (2 min)
            </Translate>
          </button>
          <div className={styles.skipContainer}>
            <button
              type="button"
              className={styles.skipButton}
              onClick={() => onNext({ skip: true })}
            >
              <Translate id="onboarding.success.skip">
                No, solo quiero el PDF
              </Translate>
            </button>
            <p className={styles.skipWarning}>
              <Translate id="onboarding.success.warning">
                ⚠️ Perderás acceso al programa completo y la app móvil
              </Translate>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
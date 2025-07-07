import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './WizardProgress.module.css';

interface WizardProgressProps {
  wizardData: Record<string, any>;
  currentStep: string;
}

export function WizardProgress({ wizardData, currentStep }: WizardProgressProps) {
  const personalInfo = wizardData['personal-info'] || {};
  const backgroundInfo = wizardData['background-info'] || {};
  const personalizationInfo = wizardData['personalization'] || {};

  // Don't show on the first step (personal info step) or if no personal info
  if (currentStep === 'personal-info' || !personalInfo.name || !personalInfo.email) {
    return null;
  }

  return (
    <div className={styles.progressContainer}>
      {/* Personal greeting */}
      {personalInfo.name && (
        <div className={styles.greeting}>
          <span className={styles.wave}>👋</span>
          <span className={styles.greetingText}>
            <Translate 
              id="wizard.progress.greeting"
              values={{ name: personalInfo.name }}
            >
              Hola {personalInfo.name}, sigamos personalizando tu plan
            </Translate>
          </span>
        </div>
      )}

      {/* Information gathered so far */}
      <div className={styles.infoGrid}>
        {personalInfo.email && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📧</span>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>
                <Translate id="wizard.progress.email">Email</Translate>
              </span>
              <span className={styles.infoValue}>
                {personalInfo.email}
                {personalInfo.isSubscriber && (
                  <span className={styles.subscribedBadge}>
                    ✓ <Translate id="wizard.progress.subscribed">Suscrito</Translate>
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {backgroundInfo.experienceLevel && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🎾</span>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>
                <Translate id="wizard.progress.experience">Nivel</Translate>
              </span>
              <span className={styles.infoValue}>
                <Translate id={`onboarding.background.experience.${backgroundInfo.experienceLevel}`}>
                  {backgroundInfo.experienceLevel}
                </Translate>
              </span>
            </div>
          </div>
        )}

        {backgroundInfo.trainingFrequency && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📅</span>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>
                <Translate id="wizard.progress.frequency">Frecuencia</Translate>
              </span>
              <span className={styles.infoValue}>
                <Translate id={`onboarding.background.frequency.${backgroundInfo.trainingFrequency}`}>
                  {backgroundInfo.trainingFrequency}
                </Translate>
              </span>
            </div>
          </div>
        )}

        {personalizationInfo.language && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🌍</span>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>
                <Translate id="wizard.progress.language">Idioma</Translate>
              </span>
              <span className={styles.infoValue}>
                <Translate id={`onboarding.personalization.language.${personalizationInfo.language}`}>
                  {personalizationInfo.language}
                </Translate>
              </span>
            </div>
          </div>
        )}

        {personalizationInfo.whatsapp && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>💬</span>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>
                <Translate id="wizard.progress.whatsapp">WhatsApp</Translate>
              </span>
              <span className={styles.infoValue}>
                {personalizationInfo.whatsapp}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress summary */}
      <div className={styles.progressSummary}>
        <Translate id="wizard.progress.summary">
          Tu plan se está personalizando con cada respuesta
        </Translate>
      </div>
    </div>
  );
}
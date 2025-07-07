import React from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './CompletionStep.module.css';

interface CompletionStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any;
}

export function CompletionStep({ onNext, onBack, data, wizardData }: CompletionStepProps) {
  const personalInfo = wizardData?.['personal-info'] || {};
  const backgroundInfo = wizardData?.['background'] || {};
  const challengesInfo = wizardData?.['challenges'] || {};
  
  const getPersonalizedRecommendations = () => {
    const recommendations = [];

    // Based on experience level
    if (backgroundInfo.experienceLevel === 'beginner') {
      recommendations.push({
        icon: '📚',
        title: 'onboarding.completion.rec.beginner.title',
        description: 'onboarding.completion.rec.beginner.desc',
        link: '/docs/training-philosophy/overview',
        linkText: 'onboarding.completion.rec.beginner.link'
      });
    } else if (backgroundInfo.experienceLevel === 'competitive') {
      recommendations.push({
        icon: '🏆',
        title: 'onboarding.completion.rec.competitive.title',
        description: 'onboarding.completion.rec.competitive.desc',
        link: '/docs/training-philosophy/ferrero-alcaraz-methods',
        linkText: 'onboarding.completion.rec.competitive.link'
      });
    }

    // Based on challenges
    if (challengesInfo.challenges?.includes('strength')) {
      recommendations.push({
        icon: '💪',
        title: 'onboarding.completion.rec.strength.title',
        description: 'onboarding.completion.rec.strength.desc',
        link: '/docs/specialized/explosive-power',
        linkText: 'onboarding.completion.rec.strength.link'
      });
    }

    if (challengesInfo.challenges?.includes('injury_prevention')) {
      recommendations.push({
        icon: '🏥',
        title: 'onboarding.completion.rec.injury.title',
        description: 'onboarding.completion.rec.injury.desc',
        link: '/docs/specialized/tendon-health-science',
        linkText: 'onboarding.completion.rec.injury.link'
      });
    }

    // Default recommendations if none specific
    if (recommendations.length === 0) {
      recommendations.push(
        {
          icon: '📅',
          title: 'onboarding.completion.rec.program.title',
          description: 'onboarding.completion.rec.program.desc',
          link: '/docs/workouts/overview',
          linkText: 'onboarding.completion.rec.program.link'
        },
        {
          icon: '🎾',
          title: 'onboarding.completion.rec.methods.title',
          description: 'onboarding.completion.rec.methods.desc',
          link: '/docs/training-philosophy/overview',
          linkText: 'onboarding.completion.rec.methods.link'
        }
      );
    }

    return recommendations.slice(0, 3); // Max 3 recommendations
  };

  const recommendations = getPersonalizedRecommendations();

  return (
    <div className={styles.completionStep}>
      <div className={styles.success}>
        <div className={styles.successIcon}>✅</div>
        <h2 className={styles.title}>
          <Translate id="onboarding.completion.title">
            ¡Bienvenido al Elite Tennis Training!
          </Translate>
        </h2>
        <p className={styles.subtitle}>
          {personalInfo.name ? (
            `${personalInfo.name}, tu programa personalizado está listo`
          ) : (
            <Translate id="onboarding.completion.subtitle">
              Tu programa personalizado está listo
            </Translate>
          )}
        </p>
      </div>

      <div className={styles.nextSteps}>
        <h3 className={styles.sectionTitle}>
          <Translate id="onboarding.completion.nextsteps.title">
            Tus próximos pasos
          </Translate>
        </h3>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>
                <Translate id="onboarding.completion.step1.title">
                  Revisa tu email
                </Translate>
              </h4>
              <p className={styles.stepDescription}>
                <Translate id="onboarding.completion.step1.desc">
                  Te hemos enviado tu guía de inicio rápido y acceso al programa
                </Translate>
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>
                <Translate id="onboarding.completion.step2.title">
                  Descarga los PDFs
                </Translate>
              </h4>
              <p className={styles.stepDescription}>
                <Translate id="onboarding.completion.step2.desc">
                  Accede a todos los programas de entrenamiento en formato PDF
                </Translate>
              </p>
            </div>
          </div>

          {wizardData?.['personalization']?.communicationPreferences?.includes('whatsapp') && (
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>
                  <Translate id="onboarding.completion.step3.title">
                    Únete al grupo de WhatsApp
                  </Translate>
                </h4>
                <p className={styles.stepDescription}>
                  <Translate id="onboarding.completion.step3.desc">
                    Recibirás una invitación en las próximas 24 horas
                  </Translate>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.recommendations}>
        <h3 className={styles.sectionTitle}>
          <Translate id="onboarding.completion.recommendations.title">
            Recomendado para ti
          </Translate>
        </h3>

        <div className={styles.recommendationGrid}>
          {recommendations.map((rec, index) => (
            <div key={index} className={styles.recommendationCard}>
              <div className={styles.recIcon}>{rec.icon}</div>
              <h4 className={styles.recTitle}>
                <Translate id={rec.title} />
              </h4>
              <p className={styles.recDescription}>
                <Translate id={rec.description} />
              </p>
              <Link to={rec.link} className={styles.recLink}>
                <Translate id={rec.linkText} />
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.finalActions}>
        <Link to="/docs/workouts/overview" className={styles.primaryButton}>
          <Translate id="onboarding.completion.cta.primary">
            Comenzar mi programa
          </Translate>
        </Link>
        <Link to="/" className={styles.secondaryButton}>
          <Translate id="onboarding.completion.cta.secondary">
            Explorar el contenido
          </Translate>
        </Link>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import { createSubscriber } from '@site/src/config/api';
import styles from './WelcomeStep.module.css';

interface WelcomeStepProps {
  onNext: (data: any) => void;
  data: any;
}

export function WelcomeStep({ onNext, data }: WelcomeStepProps) {
  const [email, setEmail] = useState(data.email || '');
  const [name, setName] = useState(data.name || '');
  const [errors, setErrors] = useState<{email?: string; name?: string; subscription?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = translate({
        id: 'onboarding.welcome.email.required',
        message: 'El email es requerido'
      });
    } else if (!validateEmail(email)) {
      newErrors.email = translate({
        id: 'onboarding.welcome.email.invalid',
        message: 'Por favor ingresa un email válido'
      });
    }

    // Name is now optional - no validation needed

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create subscriber immediately
    setIsLoading(true);
    try {
      // Detect language
      const browserLang = navigator.language.toLowerCase();
      const language = browserLang.startsWith('es') ? 'es' : 'en';
      
      await createSubscriber(email, name, language);
      
      // Show brief success message and advance automatically
      setErrors({
        subscription: translate({
          id: 'onboarding.welcome.subscription.success',
          message: '✅ ¡Perfecto! Avanzando...'
        })
      });
      
      // Auto-advance to success step after brief delay
      setTimeout(() => {
        onNext({ 
          email, 
          name, 
          language,
          isSubscriber: true,
          subscribedAt: new Date().toISOString()
        });
      }, 1500);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to create subscriber:', error);
      
      // Show error to user and don't continue
      setErrors({
        subscription: translate({
          id: 'onboarding.welcome.subscription.error',
          message: 'No se pudo crear tu cuenta. Por favor, verifica tu email e intenta nuevamente.'
        })
      });
      setIsLoading(false);
      return; // Don't continue to next step
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.welcomeStep}>
      <div className={styles.hero}>
        <div className={styles.pdfOffer}>
          <div className={styles.pdfIcon}>📄</div>
          <h1 className={styles.title}>
            <Translate id="onboarding.welcome.pdf.title">
              Descarga GRATIS tu rutina de 7 días
            </Translate>
          </h1>
          <p className={styles.subtitle}>
            <Translate id="onboarding.welcome.pdf.subtitle">
              Métodos exactos de entrenadores de Alcaraz, Sinner y medallistas olímpicos
            </Translate>
          </p>
        </div>

        <div className={styles.urgency}>
          <span className={styles.urgencyIcon}>⚡</span>
          <span className={styles.urgencyText}>
            <Translate id="onboarding.welcome.urgency">
              Solo ingresa tu email y recíbelo instantáneamente
            </Translate>
          </span>
        </div>
      </div>

      <div className={styles.quickForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.emailSection}>
            <h3 className={styles.formTitle}>
              <Translate id="onboarding.welcome.form.simple.title">
                ¡Consigue tu PDF ahora!
              </Translate>
            </h3>
            
            <div className={styles.inputGroup}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({...errors, email: undefined});
                }}
                placeholder={translate({
                  id: 'onboarding.welcome.email.placeholder.simple',
                  message: 'Ingresa tu email para recibir el PDF'
                })}
                className={`${styles.emailInput} ${errors.email ? styles.error : ''}`}
                required
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <div className={styles.optionalName}>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({...errors, name: undefined});
                }}
                placeholder={translate({
                  id: 'onboarding.welcome.name.placeholder.optional',
                  message: 'Tu nombre (opcional)'
                })}
                className={styles.nameInput}
              />
            </div>

            {errors.subscription && (
              <div className={styles.errorMessage} style={{ marginBottom: '1rem' }}>
                {errors.subscription}
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? (
                <Translate id="onboarding.welcome.loading.simple">
                  Enviando PDF...
                </Translate>
              ) : (
                <Translate id="onboarding.welcome.cta.simple">
                  📧 DESCARGAR PDF GRATIS
                </Translate>
              )}
            </button>

            <p className={styles.instant}>
              <Translate id="onboarding.welcome.instant">
                📩 Lo recibirás en menos de 1 minuto
              </Translate>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
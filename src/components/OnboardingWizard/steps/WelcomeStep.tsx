import React, { useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import { createSubscriber } from '@site/src/config/api';
import confetti from 'canvas-confetti';
import styles from './WelcomeStep.module.css';

interface WelcomeStepProps {
  onNext?: (data: any) => void;
  data?: any;
  captureEmail?: (email: string) => Promise<{ success: boolean; error?: any }>;
  wizardData?: any;
  sessionId?: string;
}

export function WelcomeStep({ onNext, data = {}, captureEmail }: WelcomeStepProps) {
  const [email, setEmail] = useState(data.email || '');
  const [name, setName] = useState(data.name || '');
  const [errors, setErrors] = useState<{email?: string; name?: string; subscription?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

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
      
      // Use new database capture if available, fallback to old method
      if (captureEmail) {
        const result = await captureEmail(email);
        if (!result.success) {
          throw new Error('Database capture failed');
        }
      } else {
        await createSubscriber(email, name, language);
      }
      
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0']
      });
      
      // Show brief success message and advance automatically
      setErrors({
        subscription: translate({
          id: 'onboarding.welcome.subscription.success',
          message: '✅ ¡Perfecto! Avanzando...'
        })
      });
      
      // Auto-advance to success step after brief delay
      setTimeout(() => {
        onNext?.({ 
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
      <div className={styles.content}>
        <div className={styles.hero}>
          <div className={styles.celebration}>
            <div className={styles.sparkles}>✨</div>
            <div className={styles.pdfIcon}>📄</div>
            <div className={styles.sparkles}>✨</div>
          </div>
          <h1 className={styles.title}>
            ¡Tu rutina personalizada está lista!
          </h1>
          <h2 className={styles.subtitle}>
            Rutina de 7 días GRATIS
          </h2>
          <p className={styles.description}>
            Métodos exactos de entrenadores de Alcaraz, Sinner y medallistas olímpicos
          </p>
          <div className={styles.valueHighlight}>
            🎯 Personalizada para tu nivel y objetivos
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: undefined});
                setIsEmailValid(validateEmail(e.target.value));
              }}
              placeholder="Tu email para recibir el PDF"
              className={`${styles.emailInput} ${errors.email ? styles.error : ''}`}
              required
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          {errors.subscription && (
            <div className={styles.errorMessage}>
              {errors.subscription}
            </div>
          )}

          <button 
            type="submit" 
            className={`${styles.submitButton} ${isEmailValid ? styles.valid : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Descargar PDF Gratis'}
          </button>

          <p className={styles.guarantee}>
            ✅ Entrega instantánea • Sin spam
          </p>
        </form>
      </div>
    </div>
  );
}
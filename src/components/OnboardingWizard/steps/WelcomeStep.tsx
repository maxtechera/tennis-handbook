import React, { useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import styles from './WelcomeStep.module.css';

interface WelcomeStepProps {
  onNext: (data: any) => void;
  data: any;
}

export function WelcomeStep({ onNext, data }: WelcomeStepProps) {
  const [email, setEmail] = useState(data.email || '');
  const [name, setName] = useState(data.name || '');
  const [errors, setErrors] = useState<{email?: string; name?: string}>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!name.trim()) {
      newErrors.name = translate({
        id: 'onboarding.welcome.name.required',
        message: 'El nombre es requerido'
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({ email, name });
  };

  return (
    <div className={styles.welcomeStep}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <Translate id="onboarding.welcome.title">
            Entrena como Alcaraz y Sinner
          </Translate>
        </h1>
        <p className={styles.subtitle}>
          <Translate id="onboarding.welcome.subtitle">
            Accede a los métodos de entrenamiento de los mejores jugadores del mundo
          </Translate>
        </p>
      </div>

      <div className={styles.valueProps}>
        <div className={styles.valueProp}>
          <span className={styles.icon}>🎾</span>
          <span className={styles.text}>
            <Translate id="onboarding.welcome.value1">
              Programas de Juan Carlos Ferrero
            </Translate>
          </span>
        </div>
        <div className={styles.valueProp}>
          <span className={styles.icon}>💪</span>
          <span className={styles.text}>
            <Translate id="onboarding.welcome.value2">
              Métodos de Marco Panichi (Sinner)
            </Translate>
          </span>
        </div>
        <div className={styles.valueProp}>
          <span className={styles.icon}>📱</span>
          <span className={styles.text}>
            <Translate id="onboarding.welcome.value3">
              Actualizaciones por WhatsApp
            </Translate>
          </span>
        </div>
        <div className={styles.valueProp}>
          <span className={styles.icon}>📄</span>
          <span className={styles.text}>
            <Translate id="onboarding.welcome.value4">
              PDFs descargables incluidos
            </Translate>
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <QuestionCard
          title="onboarding.welcome.form.title"
          subtitle="onboarding.welcome.form.subtitle"
          required
        >
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              <Translate id="onboarding.welcome.name.label">Nombre</Translate>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({...errors, name: undefined});
              }}
              placeholder={translate({
                id: 'onboarding.welcome.name.placeholder',
                message: 'Tu nombre'
              })}
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
            />
            {errors.name && (
              <span className={styles.errorMessage}>{errors.name}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              <Translate id="onboarding.welcome.email.label">Email</Translate>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: undefined});
              }}
              placeholder={translate({
                id: 'onboarding.welcome.email.placeholder',
                message: 'tu@email.com'
              })}
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton}>
            <Translate id="onboarding.welcome.cta">
              Empezar mi entrenamiento elite
            </Translate>
          </button>

          <p className={styles.privacy}>
            <Translate id="onboarding.welcome.privacy">
              Respetamos tu privacidad. Sin spam, solo contenido de valor.
            </Translate>
          </p>
        </QuestionCard>
      </form>
    </div>
  );
}
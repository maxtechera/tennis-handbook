import React, { useState } from 'react';
import Translate from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import { OptionSelector, Option } from '../components/OptionSelector';
import styles from './PersonalizationStep.module.css';

interface PersonalizationStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
}

const languageOptions: Option[] = [
  {
    value: 'es',
    label: 'onboarding.personalization.language.spanish',
    icon: '🇪🇸',
    description: 'onboarding.personalization.language.spanish.desc'
  },
  {
    value: 'en',
    label: 'onboarding.personalization.language.english',
    icon: '🇬🇧',
    description: 'onboarding.personalization.language.english.desc'
  }
];

const communicationOptions: Option[] = [
  {
    value: 'email',
    label: 'onboarding.personalization.comm.email',
    icon: '📧',
    description: 'onboarding.personalization.comm.email.desc'
  },
  {
    value: 'whatsapp',
    label: 'onboarding.personalization.comm.whatsapp',
    icon: '💬',
    description: 'onboarding.personalization.comm.whatsapp.desc'
  }
];

const interestOptions: Option[] = [
  {
    value: 'weekly_tips',
    label: 'onboarding.personalization.interests.tips',
    icon: '💡',
    description: 'onboarding.personalization.interests.tips.desc'
  },
  {
    value: 'pro_analysis',
    label: 'onboarding.personalization.interests.analysis',
    icon: '📊',
    description: 'onboarding.personalization.interests.analysis.desc'
  },
  {
    value: 'new_workouts',
    label: 'onboarding.personalization.interests.workouts',
    icon: '🏋️‍♂️',
    description: 'onboarding.personalization.interests.workouts.desc'
  },
  {
    value: 'nutrition',
    label: 'onboarding.personalization.interests.nutrition',
    icon: '🥗',
    description: 'onboarding.personalization.interests.nutrition.desc'
  }
];

export function PersonalizationStep({ onNext, onBack, data }: PersonalizationStepProps) {
  const [language, setLanguage] = useState(data.language || 'es');
  const [communicationPreferences, setCommunicationPreferences] = useState<string[]>(
    data.communicationPreferences || ['email']
  );
  const [interests, setInterests] = useState<string[]>(data.interests || []);
  const [phone, setPhone] = useState(data.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ 
      language, 
      communicationPreferences, 
      interests,
      phone: communicationPreferences.includes('whatsapp') ? phone : undefined
    });
  };

  const handleSkip = () => {
    onNext({ 
      language: 'es',
      communicationPreferences: ['email'],
      interests: []
    });
  };

  return (
    <div className={styles.personalizationStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Translate id="onboarding.personalization.title">
            Personaliza tu experiencia
          </Translate>
        </h2>
        <p className={styles.subtitle}>
          <Translate id="onboarding.personalization.subtitle">
            Opcional - Recibe contenido adaptado a tus preferencias
          </Translate>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <QuestionCard
          title="onboarding.personalization.language.title"
          subtitle="onboarding.personalization.language.subtitle"
          required={false}
        >
          <OptionSelector
            options={languageOptions}
            value={language}
            onChange={(value) => setLanguage(value as string)}
            columns={2}
            size="medium"
          />
        </QuestionCard>

        <QuestionCard
          title="onboarding.personalization.comm.title"
          subtitle="onboarding.personalization.comm.subtitle"
          required={false}
        >
          <OptionSelector
            options={communicationOptions}
            value={communicationPreferences}
            onChange={(value) => setCommunicationPreferences(value as string[])}
            multiple
            columns={2}
            size="medium"
          />
          
          {communicationPreferences.includes('whatsapp') && (
            <div className={styles.phoneInput}>
              <label htmlFor="phone" className={styles.phoneLabel}>
                <Translate id="onboarding.personalization.phone.label">
                  Número de WhatsApp
                </Translate>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className={styles.input}
              />
              <span className={styles.phoneHint}>
                <Translate id="onboarding.personalization.phone.hint">
                  Incluye el código de país
                </Translate>
              </span>
            </div>
          )}
        </QuestionCard>

        <QuestionCard
          title="onboarding.personalization.interests.title"
          subtitle="onboarding.personalization.interests.subtitle"
          required={false}
        >
          <OptionSelector
            options={interestOptions}
            value={interests}
            onChange={(value) => setInterests(value as string[])}
            multiple
            columns={2}
            size="medium"
          />
        </QuestionCard>

        <div className={styles.skipNotice}>
          <p className={styles.skipText}>
            <Translate id="onboarding.personalization.skip.text">
              Puedes cambiar estas preferencias en cualquier momento
            </Translate>
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}
          >
            <Translate id="onboarding.actions.back">Atrás</Translate>
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className={styles.skipButton}
          >
            <Translate id="onboarding.actions.skip">Omitir</Translate>
          </button>
          <button type="submit" className={styles.nextButton}>
            <Translate id="onboarding.actions.complete">Completar</Translate>
          </button>
        </div>
      </form>
    </div>
  );
}
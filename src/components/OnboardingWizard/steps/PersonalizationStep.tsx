import React, { useState, useEffect } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import { OptionSelector, Option } from '../components/OptionSelector';
import { updateSubscriberTags } from '@site/src/config/api';
import styles from './PersonalizationStep.module.css';

interface PersonalizationStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any; // Full wizard data for personalization
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

export function PersonalizationStep({ onNext, onBack, data, wizardData }: PersonalizationStepProps) {
  const [language, setLanguage] = useState(data.language || 'es');
  const [communicationPreferences, setCommunicationPreferences] = useState<string[]>(
    data.communicationPreferences || ['email']
  );
  const [interests, setInterests] = useState<string[]>(data.interests || []);
  const [phone, setPhone] = useState(data.phone || (language === 'es' ? '+34 ' : ''));
  const [phoneError, setPhoneError] = useState('');
  
  const personalInfo = wizardData?.['personal-info'] || {};
  const backgroundInfo = wizardData?.['background-info'] || {};

  // Dynamic communication options with personalized email
  const dynamicCommunicationOptions: Option[] = [
    {
      value: 'email',
      label: 'onboarding.personalization.comm.email',
      icon: '📧',
      description: personalInfo.email 
        ? `Tips semanales por email a ${personalInfo.email}`
        : 'onboarding.personalization.comm.email.desc'
    },
    {
      value: 'whatsapp',
      label: 'onboarding.personalization.comm.whatsapp',
      icon: '💬',
      description: 'onboarding.personalization.comm.whatsapp.desc'
    }
  ];

  // Real-time updates for each preference change
  useEffect(() => {
    if (language && personalInfo.email && personalInfo.isSubscriber) {
      updateSubscriberTags(personalInfo.email, {
        'personalization': { language },
        'personal-info': personalInfo,
        'background-info': backgroundInfo
      }).catch(console.error);
    }
  }, [language, personalInfo, backgroundInfo]);

  useEffect(() => {
    if (communicationPreferences.length && personalInfo.email && personalInfo.isSubscriber) {
      updateSubscriberTags(personalInfo.email, {
        'personalization': { language, communicationPreferences },
        'personal-info': personalInfo,
        'background-info': backgroundInfo
      }).catch(console.error);
    }
  }, [communicationPreferences, language, personalInfo, backgroundInfo]);

  useEffect(() => {
    if (interests.length && personalInfo.email && personalInfo.isSubscriber) {
      updateSubscriberTags(personalInfo.email, {
        'personalization': { language, communicationPreferences, interests },
        'personal-info': personalInfo,
        'background-info': backgroundInfo
      }).catch(console.error);
    }
  }, [interests, language, communicationPreferences, personalInfo, backgroundInfo]);

  const validateSpanishPhone = (phone: string) => {
    // Spanish phone format: +34 6XX XXX XXX or +34 7XX XXX XXX
    const spanishPhoneRegex = /^\+34\s?[6-7]\d{2}\s?\d{3}\s?\d{3}$/;
    // Clean version for validation
    const cleanPhone = phone.replace(/\s/g, '');
    return spanishPhoneRegex.test(cleanPhone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone if WhatsApp is selected
    if (communicationPreferences.includes('whatsapp') && phone) {
      if (language === 'es' && !validateSpanishPhone(phone)) {
        setPhoneError(translate({
          id: 'onboarding.personalization.phone.error',
          message: 'Por favor ingresa un número válido de España (+34 6XX XXX XXX)'
        }));
        return;
      }
    }
    
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

  // Check if user just subscribed (has email but no other data yet)
  const justSubscribed = personalInfo.email && !data.language && !data.communicationPreferences;

  return (
    <div className={styles.personalizationStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {personalInfo.name ? (
            `Hola ${personalInfo.name}, personaliza tu experiencia`
          ) : (
            <Translate id="onboarding.personalization.title">
              Personaliza tu experiencia
            </Translate>
          )}
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
            onChange={(value) => {
              setLanguage(value as string);
              // Update phone prefix when language changes
              if (value === 'es' && !phone.startsWith('+34')) {
                setPhone('+34 ');
              }
            }}
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
            options={dynamicCommunicationOptions}
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
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError('');
                }}
                placeholder="+34 600 000 000"
                className={`${styles.input} ${phoneError ? styles.error : ''}`}
              />
              <span className={styles.phoneHint}>
                <Translate id="onboarding.personalization.phone.hint">
                  Incluye el código de país
                </Translate>
              </span>
              {phoneError && (
                <span className={styles.errorMessage}>{phoneError}</span>
              )}
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
      </form>
    </div>
  );
}
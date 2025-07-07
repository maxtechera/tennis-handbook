import React, { useState, useEffect } from 'react';
import Translate from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import { OptionSelector, Option } from '../components/OptionSelector';
import { updateSubscriberTags } from '@site/src/config/api';
import styles from './BackgroundStep.module.css';

interface BackgroundStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
  wizardData?: any; // Full wizard data for personalization
}

const experienceLevels: Option[] = [
  {
    value: 'beginner',
    label: 'onboarding.background.experience.beginner',
    icon: '🌱',
    description: 'onboarding.background.experience.beginner.desc'
  },
  {
    value: 'intermediate',
    label: 'onboarding.background.experience.intermediate',
    icon: '🎾',
    description: 'onboarding.background.experience.intermediate.desc'
  },
  {
    value: 'advanced',
    label: 'onboarding.background.experience.advanced',
    icon: '🏆',
    description: 'onboarding.background.experience.advanced.desc'
  },
  {
    value: 'competitive',
    label: 'onboarding.background.experience.competitive',
    icon: '🥇',
    description: 'onboarding.background.experience.competitive.desc'
  }
];

const ageGroups: Option[] = [
  {
    value: 'junior',
    label: 'onboarding.background.age.junior',
    icon: '👦',
    description: 'onboarding.background.age.junior.desc'
  },
  {
    value: 'adult',
    label: 'onboarding.background.age.adult',
    icon: '🧑',
    description: 'onboarding.background.age.adult.desc'
  },
  {
    value: 'senior',
    label: 'onboarding.background.age.senior',
    icon: '👨‍🦳',
    description: 'onboarding.background.age.senior.desc'
  }
];

const trainingFrequencies: Option[] = [
  {
    value: '1-2',
    label: 'onboarding.background.frequency.low',
    icon: '📅',
    description: 'onboarding.background.frequency.low.desc'
  },
  {
    value: '3-4',
    label: 'onboarding.background.frequency.medium',
    icon: '📆',
    description: 'onboarding.background.frequency.medium.desc'
  },
  {
    value: '5-6',
    label: 'onboarding.background.frequency.high',
    icon: '🗓️',
    description: 'onboarding.background.frequency.high.desc'
  },
  {
    value: 'daily',
    label: 'onboarding.background.frequency.daily',
    icon: '🏃‍♂️',
    description: 'onboarding.background.frequency.daily.desc'
  }
];

export function BackgroundStep({ onNext, onBack, data, wizardData }: BackgroundStepProps) {
  const [experienceLevel, setExperienceLevel] = useState(data.experienceLevel || '');
  const [ageGroup, setAgeGroup] = useState(data.ageGroup || '');
  const [trainingFrequency, setTrainingFrequency] = useState(data.trainingFrequency || '');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const personalInfo = wizardData?.['personal-info'] || {};
  const userName = personalInfo.name;

  // Submit each field individually as it's completed
  // Removed automatic API calls to prevent issues when navigating back/forward
  // API updates will happen only when the entire wizard is completed

  // Auto-proceed when all fields are filled
  useEffect(() => {
    if (experienceLevel && ageGroup && trainingFrequency) {
      // Small delay to show the selection
      const timer = setTimeout(() => {
        onNext({
          experienceLevel,
          ageGroup,
          trainingFrequency
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [experienceLevel, ageGroup, trainingFrequency, onNext]);

  return (
    <div className={styles.backgroundStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {userName ? (
            <Translate 
              id="onboarding.background.title.personalized"
              values={{ name: userName }}
            >
              Perfecto {userName}, cuéntanos sobre tu experiencia
            </Translate>
          ) : (
            <Translate id="onboarding.background.title">
              Cuéntanos sobre tu experiencia
            </Translate>
          )}
        </h2>
        <p className={styles.subtitle}>
          <Translate id="onboarding.background.subtitle">
            Esto nos ayudará a personalizar tu programa de entrenamiento
          </Translate>
        </p>
      </div>

      <div className={styles.form}>
        <QuestionCard
          title="onboarding.background.experience.title"
          subtitle="onboarding.background.experience.subtitle"
          required
        >
          <OptionSelector
            options={experienceLevels}
            value={experienceLevel}
            onChange={(value) => {
              setExperienceLevel(value as string);
              if (errors.experienceLevel) {
                setErrors({...errors, experienceLevel: undefined});
              }
            }}
            columns={2}
            size="medium"
          />
          {errors.experienceLevel && (
            <span className={styles.errorMessage}>{errors.experienceLevel}</span>
          )}
        </QuestionCard>

        <QuestionCard
          title="onboarding.background.age.title"
          subtitle="onboarding.background.age.subtitle"
          required
        >
          <OptionSelector
            options={ageGroups}
            value={ageGroup}
            onChange={(value) => {
              setAgeGroup(value as string);
              if (errors.ageGroup) {
                setErrors({...errors, ageGroup: undefined});
              }
            }}
            columns={3}
            size="medium"
          />
          {errors.ageGroup && (
            <span className={styles.errorMessage}>{errors.ageGroup}</span>
          )}
        </QuestionCard>

        <QuestionCard
          title="onboarding.background.frequency.title"
          subtitle="onboarding.background.frequency.subtitle"
          required
        >
          <OptionSelector
            options={trainingFrequencies}
            value={trainingFrequency}
            onChange={(value) => {
              setTrainingFrequency(value as string);
              if (errors.trainingFrequency) {
                setErrors({...errors, trainingFrequency: undefined});
              }
            }}
            columns={2}
            size="medium"
          />
          {errors.trainingFrequency && (
            <span className={styles.errorMessage}>{errors.trainingFrequency}</span>
          )}
        </QuestionCard>

      </div>
    </div>
  );
}
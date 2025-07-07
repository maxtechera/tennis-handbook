import React, { useState } from 'react';
import Translate from '@docusaurus/Translate';
import { QuestionCard } from '../components/QuestionCard';
import { OptionSelector, Option } from '../components/OptionSelector';
import styles from './ChallengesStep.module.css';

interface ChallengesStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
}

const challengeOptions: Option[] = [
  {
    value: 'strength',
    label: 'onboarding.challenges.strength',
    icon: '💪',
    description: 'onboarding.challenges.strength.desc'
  },
  {
    value: 'endurance',
    label: 'onboarding.challenges.endurance',
    icon: '🏃‍♂️',
    description: 'onboarding.challenges.endurance.desc'
  },
  {
    value: 'flexibility',
    label: 'onboarding.challenges.flexibility',
    icon: '🤸‍♂️',
    description: 'onboarding.challenges.flexibility.desc'
  },
  {
    value: 'speed',
    label: 'onboarding.challenges.speed',
    icon: '⚡',
    description: 'onboarding.challenges.speed.desc'
  },
  {
    value: 'consistency',
    label: 'onboarding.challenges.consistency',
    icon: '📈',
    description: 'onboarding.challenges.consistency.desc'
  },
  {
    value: 'injury_prevention',
    label: 'onboarding.challenges.injury',
    icon: '🏥',
    description: 'onboarding.challenges.injury.desc'
  }
];

const goalOptions: Option[] = [
  {
    value: 'competition',
    label: 'onboarding.goals.competition',
    icon: '🏆',
    description: 'onboarding.goals.competition.desc'
  },
  {
    value: 'fitness',
    label: 'onboarding.goals.fitness',
    icon: '💯',
    description: 'onboarding.goals.fitness.desc'
  },
  {
    value: 'technique',
    label: 'onboarding.goals.technique',
    icon: '🎯',
    description: 'onboarding.goals.technique.desc'
  },
  {
    value: 'fun',
    label: 'onboarding.goals.fun',
    icon: '😊',
    description: 'onboarding.goals.fun.desc'
  }
];

export function ChallengesStep({ onNext, onBack, data }: ChallengesStepProps) {
  const [challenges, setChallenges] = useState<string[]>(data.challenges || []);
  const [goals, setGoals] = useState<string[]>(data.goals || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ challenges, goals });
  };

  const handleSkip = () => {
    onNext({ challenges: [], goals: [] });
  };

  return (
    <div className={styles.challengesStep}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Translate id="onboarding.challenges.title">
            ¿Qué aspectos quieres mejorar?
          </Translate>
        </h2>
        <p className={styles.subtitle}>
          <Translate id="onboarding.challenges.subtitle">
            Opcional - Ayúdanos a enfocar tu entrenamiento
          </Translate>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <QuestionCard
          title="onboarding.challenges.areas.title"
          subtitle="onboarding.challenges.areas.subtitle"
          required={false}
        >
          <OptionSelector
            options={challengeOptions}
            value={challenges}
            onChange={(value) => setChallenges(value as string[])}
            multiple
            columns={2}
            size="medium"
          />
        </QuestionCard>

        <QuestionCard
          title="onboarding.goals.title"
          subtitle="onboarding.goals.subtitle"
          required={false}
        >
          <OptionSelector
            options={goalOptions}
            value={goals}
            onChange={(value) => setGoals(value as string[])}
            multiple
            columns={2}
            size="medium"
          />
        </QuestionCard>

        <div className={styles.skipNotice}>
          <p className={styles.skipText}>
            <Translate id="onboarding.challenges.skip.text">
              Estos datos son opcionales. Puedes omitirlos si prefieres.
            </Translate>
          </p>
        </div>
      </form>
    </div>
  );
}
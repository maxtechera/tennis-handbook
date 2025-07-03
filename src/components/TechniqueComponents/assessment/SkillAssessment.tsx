import React, { useState } from 'react';
import { useTechnique } from '../core/TechniqueProvider';
import styles from './SkillAssessment.module.css';

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'single' | 'scale';
  options: {
    value: string;
    label: string;
    points: number;
  }[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'experience',
    question: 'How long have you been playing tennis?',
    type: 'single',
    options: [
      { value: 'never', label: 'Never played before', points: 0 },
      { value: 'beginner', label: 'Less than 6 months', points: 1 },
      { value: 'intermediate', label: '6 months to 2 years', points: 2 },
      { value: 'advanced', label: 'More than 2 years', points: 3 },
    ],
  },
  {
    id: 'frequency',
    question: 'How often do you currently play tennis?',
    type: 'single',
    options: [
      { value: 'none', label: 'Not playing currently', points: 0 },
      { value: 'occasional', label: 'Once a month or less', points: 1 },
      { value: 'weekly', label: '1-2 times per week', points: 2 },
      { value: 'frequent', label: '3+ times per week', points: 3 },
    ],
  },
  {
    id: 'lessons',
    question: 'Have you taken tennis lessons before?',
    type: 'single',
    options: [
      { value: 'none', label: 'No formal lessons', points: 0 },
      { value: 'few', label: 'A few lessons', points: 1 },
      { value: 'regular', label: 'Regular lessons for months', points: 2 },
      { value: 'extensive', label: 'Years of coaching', points: 3 },
    ],
  },
  {
    id: 'fitness',
    question: 'Rate your current fitness level',
    type: 'scale',
    options: [
      { value: '1', label: 'Low fitness', points: 0 },
      { value: '2', label: 'Moderate fitness', points: 1 },
      { value: '3', label: 'Good fitness', points: 2 },
      { value: '4', label: 'Excellent fitness', points: 3 },
    ],
  },
  {
    id: 'goals',
    question: 'What is your primary tennis goal?',
    type: 'single',
    options: [
      { value: 'fun', label: 'Play for fun and exercise', points: 1 },
      { value: 'social', label: 'Join social leagues', points: 2 },
      { value: 'competitive', label: 'Compete in tournaments', points: 3 },
      { value: 'professional', label: 'Reach professional level', points: 3 },
    ],
  },
  {
    id: 'equipment',
    question: 'What equipment do you have access to?',
    type: 'single',
    options: [
      { value: 'none', label: 'No equipment yet', points: 0 },
      { value: 'basic', label: 'Racket and balls', points: 1 },
      { value: 'good', label: 'Quality racket, balls, proper shoes', points: 2 },
      { value: 'complete', label: 'Full equipment including practice aids', points: 3 },
    ],
  },
  {
    id: 'court',
    question: 'How easily can you access tennis courts?',
    type: 'single',
    options: [
      { value: 'difficult', label: 'Limited or no access', points: 0 },
      { value: 'occasional', label: 'Can book occasionally', points: 1 },
      { value: 'regular', label: 'Regular access to courts', points: 2 },
      { value: 'unlimited', label: 'Unlimited court access', points: 3 },
    ],
  },
  {
    id: 'practice',
    question: 'How much time can you dedicate to practice per week?',
    type: 'single',
    options: [
      { value: 'minimal', label: 'Less than 1 hour', points: 0 },
      { value: 'moderate', label: '1-3 hours', points: 1 },
      { value: 'regular', label: '3-5 hours', points: 2 },
      { value: 'intensive', label: 'More than 5 hours', points: 3 },
    ],
  },
];

interface SkillAssessmentProps {
  onComplete: (skillLevel: 'beginner' | 'intermediate' | 'advanced') => void;
}

export default function SkillAssessment({ onComplete }: SkillAssessmentProps) {
  const { userData, updateProgress } = useTechnique();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [totalPoints, setTotalPoints] = useState(0);

  const handleAnswer = (questionId: string, value: string, points: number) => {
    setAnswers({ ...answers, [questionId]: value });
    setTotalPoints(totalPoints + points);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      completeAssessment(totalPoints + points);
    }
  };

  const completeAssessment = (finalPoints: number) => {
    const maxPoints = assessmentQuestions.length * 3;
    const percentage = (finalPoints / maxPoints) * 100;

    let skillLevel: 'beginner' | 'intermediate' | 'advanced';
    if (percentage < 33) {
      skillLevel = 'beginner';
    } else if (percentage < 66) {
      skillLevel = 'intermediate';
    } else {
      skillLevel = 'advanced';
    }

    if (userData) {
      const updatedUserData = {
        ...userData,
        profile: {
          ...userData.profile,
          skillLevel,
        },
      };
      localStorage.setItem('tennis-technique-progress', JSON.stringify(updatedUserData));
    }

    onComplete(skillLevel);
  };

  const question = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  return (
    <div className={styles.assessmentContainer}>
      <div className={styles.header}>
        <h2>Skill Assessment</h2>
        <p>Let's determine your starting level to personalize your learning path</p>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.questionContainer}>
        <h3 className={styles.question}>
          {currentQuestion + 1}. {question.question}
        </h3>

        <div className={styles.options}>
          {question.options.map((option) => (
            <button
              key={option.value}
              className={styles.optionButton}
              onClick={() => handleAnswer(question.id, option.value, option.points)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.questionNumber}>
          Question {currentQuestion + 1} of {assessmentQuestions.length}
        </span>
      </div>
    </div>
  );
}
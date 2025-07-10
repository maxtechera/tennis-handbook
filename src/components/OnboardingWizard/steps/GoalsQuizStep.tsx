import React, { useState } from "react";
import styles from "./MicroQuizStep.module.css";

interface GoalsQuizStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

type TennisGoal = "fitness" | "competitive" | "recreational" | "professional";

interface GoalOption {
  id: TennisGoal;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const goalOptions: GoalOption[] = [
  {
    id: "fitness",
    title: "Fitness y Salud",
    description: "Mejorar mi condición física general",
    icon: "💪",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "recreational",
    title: "Diversión",
    description: "Jugar por placer y socializar",
    icon: "😊",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "competitive",
    title: "Competición",
    description: "Mejorar mi juego competitivo",
    icon: "🏆",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "professional",
    title: "Alto Rendimiento",
    description: "Entrenar como un profesional",
    icon: "👑",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
];

export function GoalsQuizStep({
  onNext,
  onBack,
  data = {},
}: GoalsQuizStepProps) {
  const [selectedGoal, setSelectedGoal] = useState<TennisGoal | null>(
    data.goal || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleGoalSelect = (goal: TennisGoal) => {
    setSelectedGoal(goal);
    setShowCelebration(true);

    // Auto-advance after celebration
    setTimeout(() => {
      onNext({
        goal,
        engagement: 100,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>¿Cuál es tu objetivo principal?</h2>
          <p className={styles.questionSubtitle}>
            Esto nos ayuda a personalizar tu entrenamiento
          </p>
        </div>

        <div className={styles.levelOptions}>
          {goalOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.levelOption} ${
                selectedGoal === option.id ? styles.selected : ""
              }`}
              onClick={() => handleGoalSelect(option.id)}
              style={{
                background:
                  selectedGoal === option.id ? option.color : undefined,
              }}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionContent}>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              {selectedGoal === option.id && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Celebration Message */}
        {showCelebration && (
          <div className={styles.celebration}>
            <div className={styles.celebrationIcon}>🎯</div>
            <p className={styles.celebrationText}>
              ¡Excelente! Personalizando tu plan de entrenamiento...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

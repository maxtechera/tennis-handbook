import React, { useState } from "react";
import styles from "./MicroQuizStep.module.css";
import { tennisBallEvents } from "@site/src/utils/tennis-ball-events";

interface ExperienceLevelStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "competitive";

interface ExperienceOption {
  id: ExperienceLevel;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const experienceOptions: ExperienceOption[] = [
  {
    id: "beginner",
    title: "Principiante",
    description: "< 1 año jugando",
    icon: "🌱",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "intermediate",
    title: "Intermedio",
    description: "1-3 años de experiencia",
    icon: "🎾",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "advanced",
    title: "Avanzado",
    description: "3+ años, juego regular",
    icon: "🏆",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "competitive",
    title: "Competitivo",
    description: "Torneos y competencias",
    icon: "🏅",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
];

export function ExperienceLevelStep({
  onNext,
  onBack,
  data = {},
}: ExperienceLevelStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(
    data.experienceLevel || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleLevelSelect = (level: ExperienceLevel) => {
    setSelectedLevel(level);
    setShowCelebration(true);

    // Trigger small tennis ball celebration
    tennisBallEvents.explode(5);

    // Auto-advance after celebration
    setTimeout(() => {
      onNext({
        experienceLevel: level,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>¿Cuál es tu nivel de experiencia?</h2>
          <p className={styles.questionSubtitle}>
            Esto nos ayuda a ajustar la dificultad de los ejercicios
          </p>
        </div>

        <div className={styles.levelOptions}>
          {experienceOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.levelOption} ${
                selectedLevel === option.id ? styles.selected : ""
              }`}
              onClick={() => handleLevelSelect(option.id)}
              style={{
                background:
                  selectedLevel === option.id ? option.color : undefined,
              }}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionContent}>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              {selectedLevel === option.id && (
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
              ¡Perfecto! Continuemos personalizando tu plan...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
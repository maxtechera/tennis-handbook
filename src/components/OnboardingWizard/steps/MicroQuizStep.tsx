import React, { useState } from "react";
import Translate from "@docusaurus/Translate";
import {
  CardLayout,
  CardStack,
  CardHeader,
  CardContent,
  CardActions,
} from "../components/CardLayout";
import { TennisBallAnimation } from "../components/TennisBallAnimation";
import { tennisBallEvents } from "@site/src/utils/tennis-ball-events";
import styles from "./MicroQuizStep.module.css";

interface MicroQuizStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

type TennisLevel = "beginner" | "intermediate" | "advanced" | "professional";

interface LevelOption {
  id: TennisLevel;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const levelOptions: LevelOption[] = [
  {
    id: "beginner",
    title: "Principiante",
    description: "Nuevo en el tenis o menos de 1 año",
    icon: "🌱",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "intermediate",
    title: "Intermedio",
    description: "1-3 años jugando regularmente",
    icon: "🎾",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "advanced",
    title: "Avanzado",
    description: "3+ años, juego competitivo",
    icon: "🏆",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "professional",
    title: "Profesional",
    description: "Competidor serio o entrenador",
    icon: "👑",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
];

export function MicroQuizStep({
  onNext,
  onBack,
  data = {},
}: MicroQuizStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<TennisLevel | null>(
    data.level || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleLevelSelect = (level: TennisLevel) => {
    setSelectedLevel(level);
    setShowCelebration(true);

    // Trigger small tennis ball celebration
    tennisBallEvents.explode(5); // 5 balls for quiz selection

    // Auto-advance after celebration
    setTimeout(() => {
      onNext({
        level,
        engagement: 100, // High engagement for completing first step
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>¿Cuál es tu nivel de tenis?</h2>
          <p className={styles.questionSubtitle}>
            Selecciona la opción que mejor te describa
          </p>
        </div>

        <div className={styles.levelOptions}>
          {levelOptions.map((option) => (
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
            <div className={styles.celebrationIcon}>🎉</div>
            <p className={styles.celebrationText}>
              ¡Perfecto! Preparando tu experiencia personalizada...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

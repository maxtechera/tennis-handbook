import React, { useState } from "react";
import styles from "./MicroQuizStep.module.css";
import { tennisBallEvents } from "@site/src/utils/tennis-ball-events";

interface TrainingFrequencyStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
}

type TrainingFrequency = "casual" | "regular" | "intensive" | "daily";

interface FrequencyOption {
  id: TrainingFrequency;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const frequencyOptions: FrequencyOption[] = [
  {
    id: "casual",
    title: "1-2 días",
    description: "Casual, por diversión",
    icon: "📅",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "regular",
    title: "3-4 días",
    description: "Regular, mejora constante",
    icon: "📆",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "intensive",
    title: "5-6 días",
    description: "Intensivo, progreso rápido",
    icon: "🗓️",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "daily",
    title: "Todos los días",
    description: "Dedicación total",
    icon: "📍",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
];

export function TrainingFrequencyStep({
  onNext,
  onBack,
  data = {},
}: TrainingFrequencyStepProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<TrainingFrequency | null>(
    data.trainingFrequency || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  const handleFrequencySelect = (frequency: TrainingFrequency) => {
    setSelectedFrequency(frequency);
    setShowCelebration(true);

    // Trigger small tennis ball celebration
    tennisBallEvents.explode(5);

    // Auto-advance after celebration
    setTimeout(() => {
      onNext({
        trainingFrequency: frequency,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>¿Con qué frecuencia entrenas?</h2>
          <p className={styles.questionSubtitle}>
            Para crear un plan que se ajuste a tu disponibilidad
          </p>
        </div>

        <div className={styles.levelOptions}>
          {frequencyOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.levelOption} ${
                selectedFrequency === option.id ? styles.selected : ""
              }`}
              onClick={() => handleFrequencySelect(option.id)}
              style={{
                background:
                  selectedFrequency === option.id ? option.color : undefined,
              }}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionContent}>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              {selectedFrequency === option.id && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Celebration Message */}
        {showCelebration && (
          <div className={styles.celebration}>
            <div className={styles.celebrationIcon}>🚀</div>
            <p className={styles.celebrationText}>
              ¡Genial! Ya tenemos lo esencial para empezar...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
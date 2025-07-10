import React, { useState } from "react";
import styles from "./MicroQuizStep.module.css";
import { tennisBallEvents } from "@site/src/utils/tennis-ball-events";

interface AgeGroupStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
  wizardData?: any;
}

type AgeGroup = "junior" | "adult" | "senior";

interface AgeOption {
  id: AgeGroup;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const ageOptions: AgeOption[] = [
  {
    id: "junior",
    title: "Junior",
    description: "Menos de 18 años",
    icon: "👶",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "adult",
    title: "Adulto",
    description: "18-50 años",
    icon: "🧑",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
  {
    id: "senior",
    title: "Senior",
    description: "Más de 50 años",
    icon: "👴",
    color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
  },
];

export function AgeGroupStep({
  onNext,
  onBack,
  data = {},
  wizardData,
}: AgeGroupStepProps) {
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(
    data.ageGroup || null
  );
  const [showCelebration, setShowCelebration] = useState(false);

  // Get user name and experience from previous steps
  const personalInfo = wizardData?.['personal-info'] || {};
  const microQuizData = wizardData?.['micro-quiz'] || {};
  const userName = personalInfo.name;
  const experienceLevel = microQuizData.level;

  const handleAgeSelect = (age: AgeGroup) => {
    setSelectedAge(age);
    setShowCelebration(true);

    // Trigger small tennis ball celebration
    tennisBallEvents.explode(5);

    // Auto-advance after celebration
    setTimeout(() => {
      onNext({
        ageGroup: age,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <div className={styles.microQuizStep}>
      <div className={styles.content}>
        <div className={styles.questionTitle}>
          <h2>
            {userName 
              ? `${userName}, ¿en qué grupo de edad te encuentras?` 
              : '¿En qué grupo de edad te encuentras?'
            }
          </h2>
          <p className={styles.questionSubtitle}>
            Para adaptar los ejercicios a tu condición física
          </p>
          {experienceLevel && (
            <div className={styles.experienceReminder}>
              ✅ Nivel: <strong>{experienceLevel}</strong>
            </div>
          )}
        </div>

        <div className={styles.levelOptions}>
          {ageOptions.map((option) => (
            <button
              key={option.id}
              className={`${styles.levelOption} ${
                selectedAge === option.id ? styles.selected : ""
              }`}
              onClick={() => handleAgeSelect(option.id)}
              style={{
                background:
                  selectedAge === option.id ? option.color : undefined,
              }}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionContent}>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>
              {selectedAge === option.id && (
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
              ¡Excelente! Una pregunta más...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
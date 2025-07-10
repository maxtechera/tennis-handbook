import React, { useState, useEffect, useRef } from "react";
import Translate, { translate } from "@docusaurus/Translate";
import { QuestionCard } from "../components/QuestionCard";
import { createSubscriber } from "@site/src/config/api";
import { tennisBallEvents } from "@site/src/utils/tennis-ball-events";
import styles from "./WelcomeStep.module.css";

interface WelcomeStepProps {
  onNext?: (data: any) => void;
  data?: any;
  captureEmail?: (email: string) => Promise<{ success: boolean; error?: any }>;
  wizardData?: any;
  sessionId?: string;
}

export function WelcomeStep({
  onNext,
  data = {},
  captureEmail,
  wizardData,
}: WelcomeStepProps) {
  const [email, setEmail] = useState(data.email || "");
  const [name, setName] = useState(data.name || "");
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    subscription?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // Validate email function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Initialize email validity based on stored email
  const [isEmailValid, setIsEmailValid] = useState(validateEmail(data.email || ""));
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Get user's selections for personalization
  const userLevel = wizardData?.["micro-quiz"]?.level || "intermediate";
  const userGoal = wizardData?.["goals-quiz"]?.goal || "fitness";
  const userTime = wizardData?.["time-quiz"]?.timeCommitment || "moderate";
  const userFocus = wizardData?.["focus-quiz"]?.focusArea || "technique";

  const getLevelText = () => {
    const levels = {
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
      professional: "Profesional",
    };
    return levels[userLevel] || levels.intermediate;
  };

  // Autofocus email input on mount if empty
  useEffect(() => {
    if (emailInputRef.current && !email) {
      emailInputRef.current.focus();
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = translate({
        id: "onboarding.welcome.email.required",
        message: "El email es requerido",
      });
    } else if (!validateEmail(email)) {
      newErrors.email = translate({
        id: "onboarding.welcome.email.invalid",
        message: "Por favor ingresa un email válido",
      });
    }

    // Name is now optional - no validation needed

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create subscriber immediately
    setIsLoading(true);
    try {
      // Detect language
      const browserLang = navigator.language.toLowerCase();
      const language = browserLang.startsWith("es") ? "es" : "en";

      // Use new database capture if available, fallback to old method
      if (captureEmail) {
        const result = await captureEmail(email);
        if (!result.success) {
          throw new Error("Database capture failed");
        }
      } else {
        await createSubscriber(email, name, language);
      }

      // Trigger tennis ball explosion!
      tennisBallEvents.explode(20); // 20 balls for celebration

      // Show brief success message and advance automatically
      setErrors({
        subscription: translate({
          id: "onboarding.welcome.subscription.success",
          message: "✅ ¡Perfecto! Avanzando...",
        }),
      });

      // Auto-advance to success step after brief delay
      setTimeout(() => {
        onNext?.({
          email,
          name,
          language,
          isSubscriber: true,
          subscribedAt: new Date().toISOString(),
        });
      }, 1500);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to create subscriber:", error);

      // Show error to user and don't continue
      setErrors({
        subscription: translate({
          id: "onboarding.welcome.subscription.error",
          message:
            "No se pudo crear tu cuenta. Por favor, verifica tu email e intenta nuevamente.",
        }),
      });
      setIsLoading(false);
      return; // Don't continue to next step
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.welcomeStep}>
      {/* Animated background elements */}
      {/* <div className={styles.backgroundAnimation}>
        <div className={styles.floatingBall1}>🎾</div>
        <div className={styles.floatingBall2}>🎾</div>
        <div className={styles.floatingBall3}>🎾</div>
      </div> */}

      <div className={styles.content}>
        <div className={styles.hero}>
          {/* Countdown Timer
          <div className={styles.urgencyTimer}>
            <span className={styles.timerIcon}>⏰</span>
            <span className={styles.timerText}>
              Tu plan se reserva por: {formatTime(timeLeft)}
            </span>
          </div> */}
          {/* Success Header */}
          {/* <div className={styles.successBadge}>
            <span className={styles.checkmark}>✅</span>
            <span className={styles.successText}>
              ¡Plan {getLevelText()} Listo!
            </span>
          </div> */}
          <h1 className={styles.title}>
            Tu Plan Personalizado de Tenis Elite Está Listo
          </h1>
          {/* Visual Summary of Personalization */}
          <div className={styles.personalizedSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryIcon}>🎯</span>
              <span className={styles.summaryText}>{getLevelText()}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryIcon}>💪</span>
              <span className={styles.summaryText}>4 semanas</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryIcon}>🏆</span>
              <span className={styles.summaryText}>ATP Methods</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
                setIsEmailValid(validateEmail(e.target.value));
              }}
              placeholder="Tu email para recibir el PDF"
              className={`${styles.emailInput} ${
                errors.email ? styles.error : ""
              }`}
              required
              autoFocus
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          {errors.subscription && (
            <div className={styles.errorMessage}>{errors.subscription}</div>
          )}

          <button
            type="submit"
            className={`${styles.submitButton} ${
              isEmailValid ? styles.valid : ""
            }`}
            disabled={isLoading || !isEmailValid}
          >
            {isLoading ? (
              <span className={styles.loadingText}>Preparando tu plan...</span>
            ) : (
              <>
                <span className={styles.buttonIcon}>🎾</span>
                <span className={styles.buttonText}>
                  DESCARGAR MI PLAN GRATIS
                </span>
                <span className={styles.buttonArrow}>→</span>
              </>
            )}
          </button>

          {/* Trust Badges */}
          {/* <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <span className={styles.badgeIcon}>🔒</span>
              <span className={styles.badgeText}>100% Seguro</span>
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.badgeIcon}>⚡</span>
              <span className={styles.badgeText}>Acceso Instantáneo</span>
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.badgeIcon}>🚫</span>
              <span className={styles.badgeText}>Sin Spam</span>
            </div>
          </div> */}
        </form>
        {/* Value Preview */}
        <div className={styles.valuePreview}>
          <h2 className={styles.valueTitle}>Lo que recibirás al instante:</h2>
          <div className={styles.valueItems}>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>📱</span>
              <span className={styles.valueText}>
                Plan de 7 días personalizado
              </span>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🏋️</span>
              <span className={styles.valueText}>
                Ejericicos pensados para el tenista
              </span>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🧠</span>
              <span className={styles.valueText}>
                Secretos de entrenadores ATP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

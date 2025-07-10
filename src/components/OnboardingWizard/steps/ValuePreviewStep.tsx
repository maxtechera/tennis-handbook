import React, { useState, useEffect } from "react";
import Translate from "@docusaurus/Translate";
import {
  CardLayout,
  CardStack,
  CardHeader,
  CardContent,
  CardActions,
} from "../components/CardLayout";
import {
  TennisBallAnimation,
  TennisScene,
} from "../components/TennisBallAnimation";
import styles from "./ValuePreviewStep.module.css";

interface ValuePreviewStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
  wizardData?: any;
}

interface PersonalizedContent {
  title: string;
  description: string;
  benefits: string[];
  focusAreas: string[];
  timeframe: string;
  intensity: string;
  icon: string;
  color: string;
}

const getPersonalizedContent = (level: string): PersonalizedContent => {
  switch (level) {
    case "beginner":
      return {
        title: "Plan de Fundamentos Sólidos",
        description:
          "Perfecto para construir una base técnica correcta desde el inicio",
        benefits: [
          "Técnicas básicas de golpeo correctas",
          "Posicionamiento y movimiento en cancha",
          "Desarrollo de consistencia y confianza",
          "Fundamentos de estrategia básica",
        ],
        focusAreas: ["Técnica", "Consistencia", "Movimiento", "Fundamentos"],
        timeframe: "4-6 semanas para ver mejoras",
        intensity: "Moderada, 2-3 sesiones por semana",
        icon: "🌱",
        color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
      };

    case "intermediate":
      return {
        title: "Plan de Desarrollo Avanzado",
        description: "Lleva tu juego al siguiente nivel con técnicas refinadas",
        benefits: [
          "Refinamiento de golpes y variaciones",
          "Estrategia táctica avanzada",
          "Mejora de resistencia y velocidad",
          "Preparación para competencia",
        ],
        focusAreas: ["Táctica", "Potencia", "Resistencia", "Competencia"],
        timeframe: "6-8 semanas para dominar",
        intensity: "Alta, 3-4 sesiones por semana",
        icon: "🎾",
        color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
      };

    case "advanced":
      return {
        title: "Plan de Perfeccionamiento Elite",
        description:
          "Técnicas avanzadas y estrategias de competidores profesionales",
        benefits: [
          "Técnicas de jugadores profesionales",
          "Estrategia mental y psicológica",
          "Optimización de rendimiento",
          "Preparación para torneos serios",
        ],
        focusAreas: ["Precisión", "Estrategia", "Mental", "Competencia"],
        timeframe: "8-10 semanas para perfeccionar",
        intensity: "Muy alta, 4-5 sesiones por semana",
        icon: "🏆",
        color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
      };

    case "professional":
      return {
        title: "Plan de Entrenamiento Profesional",
        description: "Métodos de entrenadores olímpicos y ATP/WTA",
        benefits: [
          "Periodización profesional",
          "Análisis técnico avanzado",
          "Preparación física específica",
          "Estrategias de alto rendimiento",
        ],
        focusAreas: ["Periodización", "Análisis", "Rendimiento", "Competencia"],
        timeframe: "12+ semanas de desarrollo",
        intensity: "Profesional, 5-6 sesiones por semana",
        icon: "👑",
        color: "linear-gradient(135deg, #4CAF50, #8BC34A)",
      };

    default:
      return getPersonalizedContent("beginner");
  }
};

export function ValuePreviewStep({
  onNext,
  onBack,
  data = {},
  wizardData = {},
}: ValuePreviewStepProps) {
  const [showContent, setShowContent] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(0);

  const userLevel = wizardData?.level || "beginner";
  const content = getPersonalizedContent(userLevel);

  useEffect(() => {
    // Show content after brief delay for better UX
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cycle through benefits
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % content.benefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [content.benefits.length]);

  const handleContinue = () => {
    onNext({
      previewSeen: true,
      personalizedContent: content,
      engagementLevel: "high",
      timestamp: new Date().toISOString(),
    });
  };

  if (!showContent) {
    return (
      <div className={styles.valuePreviewStep}>
        <CardLayout variant="primary" padding="lg" animation="fadeIn">
          <CardContent>
            <div className={styles.loadingState}>
              <TennisBallAnimation size="lg" animation="bounce" />
              <h2>Analizando tu perfil...</h2>
              <p>Preparando tu plan personalizado</p>
            </div>
          </CardContent>
        </CardLayout>
      </div>
    );
  }

  return (
    <div className={styles.valuePreviewStep}>
      <CardStack spacing="lg">
        {/* Header with Tennis Scene */}
        <CardLayout
          variant="primary"
          padding="lg"
          animation="slideUp"
          className={styles.headerCard}
          style={{ background: content.color }}
        >
          <CardHeader
            icon={<div className={styles.levelIcon}>{content.icon}</div>}
            title={content.title}
            subtitle={content.description}
          />
          <TennisScene
            showBall={true}
            showRacket={false}
            ballAnimation="float"
            className={styles.tennisScene}
          />
        </CardLayout>

        {/* Dynamic Benefits Showcase */}
        <CardLayout padding="lg" animation="slideUp">
          <CardContent>
            <div className={styles.benefitsShowcase}>
              <h3 className={styles.benefitsTitle}>Lo que conseguirás:</h3>
              <div className={styles.benefitsList}>
                {content.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`${styles.benefitItem} ${
                      index === currentBenefit ? styles.active : ""
                    }`}
                  >
                    <div className={styles.benefitIcon}>✨</div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CardLayout>

        {/* Focus Areas */}
        <CardLayout padding="lg" animation="slideUp">
          <CardContent>
            <div className={styles.focusAreas}>
              <h3 className={styles.focusTitle}>Áreas de enfoque:</h3>
              <div className={styles.focusGrid}>
                {content.focusAreas.map((area, index) => (
                  <div key={index} className={styles.focusItem}>
                    <TennisBallAnimation size="sm" animation="pulse" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CardLayout>

        {/* Training Details */}
        <CardLayout padding="lg" animation="slideUp">
          <CardContent>
            <div className={styles.trainingDetails}>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>⏱️</div>
                <div>
                  <h4>Tiempo de resultados</h4>
                  <p>{content.timeframe}</p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>💪</div>
                <div>
                  <h4>Intensidad</h4>
                  <p>{content.intensity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </CardLayout>

        {/* Social Proof */}
        <CardLayout variant="warning" padding="lg" animation="slideUp">
          <CardContent>
            <div className={styles.socialProof}>
              <div className={styles.proofIcon}>🔥</div>
              <div className={styles.proofText}>
                <p>
                  <strong>500+ jugadores</strong> ya han mejorado su juego
                </p>
                <p>
                  <strong>87%</strong> recomienda este programa
                </p>
              </div>
            </div>
          </CardContent>
        </CardLayout>

        {/* CTA */}
        <CardLayout padding="lg" animation="slideUp">
          <CardActions>
            <button
              className={styles.ctaButton}
              onClick={handleContinue}
              style={{ background: content.color }}
            >
              <span className={styles.ctaIcon}>🚀</span>
              <span>¡Quiero mi plan personalizado!</span>
            </button>
          </CardActions>
          <div className={styles.ctaNote}>
            <p>
              Siguiente: Solo necesitamos tu email para enviarte el plan
              completo
            </p>
          </div>
        </CardLayout>

        {/* Progress */}
        <div className={styles.progressIndicator}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: "40%" }} />
          </div>
          <p className={styles.progressText}>
            Paso 2 de 5 • Plan personalizado listo
          </p>
        </div>
      </CardStack>
    </div>
  );
}

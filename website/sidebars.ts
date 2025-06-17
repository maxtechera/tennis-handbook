import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main training guide sidebar
  trainingSidebar: [
    "intro",
    {
      type: "category",
      label: "🏆 Elite Training Philosophy",
      items: [
        "training-philosophy/overview",
        "training-philosophy/ferrero-alcaraz-methods",
        "training-philosophy/sinner-panichi-methods",
        "training-philosophy/specialized-methods",
      ],
    },
    {
      type: "category",
      label: "💪 Exercise Systems",
      items: [
        "exercises/exercise-database",
        "exercises/lower-body-exercises",
        "exercises/upper-body-exercises",
      ],
    },
    {
      type: "category",
      label: "📋 Program Design",
      items: [
        "programming/training-programming",
        "programming/periodization-models",
        "programming/training-templates",
        "programming/auto-regulation",
        "programming/competition-preparation",
      ],
    },
    {
      type: "category",
      label: "🔬 Specialized Training",
      items: [
        "specialized/tendon-health-science",
        "specialized/tendon-science-foundations",
        "specialized/tennis-specific-tendon-protocols",
        "specialized/power-development",
        "specialized/post-activation-potentiation",
        "specialized/speed-strength-continuum",
        "specialized/neural-adaptations",
      ],
    },
    {
      type: "category",
      label: "🔄 Recovery & Support",
      items: [
        "recovery/recovery-protocols",
        "recovery/daily-recovery",
        "recovery/advanced-recovery",
        "nutrition/nutrition-support",
        "nutrition/performance-nutrition",
        "nutrition/daily-nutrition",
      ],
    },
    {
      type: "category",
      label: "📊 Assessment & Monitoring",
      items: [
        "assessment/assessment-monitoring",
        "assessment/performance-testing",
      ],
    },
    "program-optimization-summary",
  ],

  // Workout plans sidebar
  workoutsSidebar: [
    "workouts/overview",
    {
      type: "category",
      label: "📅 12-Week Program",
      items: [
        "workouts/week-1-plan",
        "workouts/week-2-plan",
        "workouts/week-3-plan",
        "workouts/week-4-plan",
        "workouts/week-5-plan",
        "workouts/week-6-plan",
        "workouts/week-7-plan",
        "workouts/week-8-plan",
        "workouts/week-9-plan",
        "workouts/week-10-plan",
        "workouts/week-11-plan",
        "workouts/week-12-plan",
      ],
    },
  ],
};

export default sidebars;

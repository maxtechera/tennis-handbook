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
  // Complete Tennis Training Handbook
  trainingSidebar: [
    "intro",
    "equipment-guide",
    "professional-standards",
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
      label: "💪 Exercise Systems & Techniques",
      items: [
        "exercises/exercise-database",
        "exercises/lower-body-exercises",
        "exercises/upper-body-exercises",
      ],
    },
    {
      type: "category",
      label: "📋 Training Program Design",
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
      label: "🔬 Advanced Training Methods",
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
      label: "🔄 Recovery & Regeneration",
      items: [
        "recovery/recovery-protocols",
        "recovery/daily-recovery",
        "recovery/advanced-recovery",
      ],
    },
    {
      type: "category",
      label: "🥗 Nutrition Support",
      items: [
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
    {
      type: "category",
      label: "📅 12-Week Elite Program",
      collapsed: false,
      items: [
        "workouts/overview",
        {
          type: "category",
          label: "Foundation Phase (Weeks 1-3)",
          items: [
            "workouts/week-1-plan",
            "workouts/week-2-plan",
            "workouts/week-3-plan",
          ],
        },
        {
          type: "category",
          label: "Development Phase (Weeks 4-6)",
          items: [
            "workouts/week-4-plan",
            "workouts/week-5-plan",
            "workouts/week-6-plan",
          ],
        },
        {
          type: "category",
          label: "Intensification Phase (Weeks 7-9)",
          items: [
            "workouts/week-7-plan",
            "workouts/week-8-plan",
            "workouts/week-9-plan",
          ],
        },
        {
          type: "category",
          label: "Peaking Phase (Weeks 10-12)",
          items: [
            "workouts/week-10-plan",
            "workouts/week-11-plan",
            "workouts/week-12-plan",
          ],
        },
      ],
    },
    "program-optimization-summary",
    "troubleshooting",
  ],

  // Keep the separate workout sidebar for direct access to weekly plans
  workoutsSidebar: [
    "workouts/overview",
    {
      type: "category",
      label: "📅 Complete 12-Week Program",
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

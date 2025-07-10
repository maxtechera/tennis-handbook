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
  // Complete Tenis Manual
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
        "workouts/week-program-table",
        {
          type: "category",
          label: "Foundation Phase (Weeks 1-3)",
          items: [
            {
              type: "category",
              label: "Week 1 - Elite Foundation",
              collapsed: false,
              items: [
                "workouts/week-1/index",
                "workouts/week-1/monday",
                "workouts/week-1/tuesday",
                "workouts/week-1/wednesday",
                "workouts/week-1/thursday",
                "workouts/week-1/friday",
                "workouts/week-1/saturday",
                "workouts/week-1/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 2 - Foundation Development",
              collapsed: false,
              items: [
                "workouts/week-2/index",
                "workouts/week-2/monday",
                "workouts/week-2/tuesday",
                "workouts/week-2/wednesday",
                "workouts/week-2/thursday",
                "workouts/week-2/friday",
                "workouts/week-2/saturday",
                "workouts/week-2/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 3 - Foundation Peak",
              collapsed: false,
              items: [
                "workouts/week-3/index",
                "workouts/week-3/monday",
                "workouts/week-3/tuesday",
                "workouts/week-3/wednesday",
                "workouts/week-3/thursday",
                "workouts/week-3/friday",
                "workouts/week-3/saturday",
                "workouts/week-3/sunday",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Development Phase (Weeks 4-6)",
          items: [
            {
              type: "category",
              label: "Week 4 - Power Introduction",
              collapsed: false,
              items: [
                "workouts/week-4/index",
                "workouts/week-4/monday",
                "workouts/week-4/tuesday",
                "workouts/week-4/wednesday",
                "workouts/week-4/thursday",
                "workouts/week-4/friday",
                "workouts/week-4/saturday",
                "workouts/week-4/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 5 - Development+",
              collapsed: false,
              items: [
                "workouts/week-5/index",
                "workouts/week-5/monday",
                "workouts/week-5/tuesday",
                "workouts/week-5/wednesday",
                "workouts/week-5/thursday",
                "workouts/week-5/friday",
                "workouts/week-5/saturday",
                "workouts/week-5/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 6 - Power Mastery",
              collapsed: false,
              items: [
                "workouts/week-6/index",
                "workouts/week-6/monday",
                "workouts/week-6/tuesday",
                "workouts/week-6/wednesday",
                "workouts/week-6/thursday",
                "workouts/week-6/friday",
                "workouts/week-6/saturday",
                "workouts/week-6/sunday",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Intensification Phase (Weeks 7-9)",
          items: [
            {
              type: "category",
              label: "Week 7 - Maximum Strength",
              collapsed: false,
              items: [
                "workouts/week-7/index",
                "workouts/week-7/monday",
                "workouts/week-7/tuesday",
                "workouts/week-7/wednesday",
                "workouts/week-7/thursday",
                "workouts/week-7/friday",
                "workouts/week-7/saturday",
                "workouts/week-7/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 8 - Advanced Methods",
              collapsed: false,
              items: [
                "workouts/week-8/index",
                "workouts/week-8/monday",
                "workouts/week-8/tuesday",
                "workouts/week-8/wednesday",
                "workouts/week-8/thursday",
                "workouts/week-8/friday",
                "workouts/week-8/saturday",
                "workouts/week-8/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 9 - Complex Training",
              collapsed: false,
              items: [
                "workouts/week-9/index",
                "workouts/week-9/monday",
                "workouts/week-9/tuesday",
                "workouts/week-9/wednesday",
                "workouts/week-9/thursday",
                "workouts/week-9/friday",
                "workouts/week-9/saturday",
                "workouts/week-9/sunday",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Peaking Phase (Weeks 10-12)",
          items: [
            {
              type: "category",
              label: "Week 10 - Neural Sharpening",
              collapsed: false,
              items: [
                "workouts/week-10/index",
                "workouts/week-10/monday",
                "workouts/week-10/tuesday",
                "workouts/week-10/wednesday",
                "workouts/week-10/thursday",
                "workouts/week-10/friday",
                "workouts/week-10/saturday",
                "workouts/week-10/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 11 - Competition Prep",
              collapsed: false,
              items: [
                "workouts/week-11/index",
                "workouts/week-11/monday",
                "workouts/week-11/tuesday",
                "workouts/week-11/wednesday",
                "workouts/week-11/thursday",
                "workouts/week-11/friday",
                "workouts/week-11/saturday",
                "workouts/week-11/sunday",
              ],
            },
            {
              type: "category",
              label: "Week 12 - Championship Ready",
              collapsed: false,
              items: [
                "workouts/week-12/index",
                "workouts/week-12/monday",
                "workouts/week-12/tuesday",
                "workouts/week-12/wednesday",
                "workouts/week-12/thursday",
                "workouts/week-12/friday",
                "workouts/week-12/saturday",
                "workouts/week-12/sunday",
              ],
            },
          ],
        },
      ],
    },

    "troubleshooting",
  ],

  // Dedicated workout sidebar with improved navigation
  workoutsSidebar: [
    "workouts/overview",
    "workouts/week-program-table",
    {
      type: "category",
      label: "🌱 Foundation Phase",
      collapsed: false,
      customProps: {
        description: "Weeks 1-3: Building movement patterns and base fitness",
      },
      items: [
        {
          type: "category",
          label: "Week 1 - Elite Foundation",
          collapsed: false,
          items: [
            "workouts/week-1/index",
            "workouts/week-1/monday",
            "workouts/week-1/tuesday",
            "workouts/week-1/wednesday",
            "workouts/week-1/thursday",
            "workouts/week-1/friday",
            "workouts/week-1/saturday",
            "workouts/week-1/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 2 - Foundation Development",
          collapsed: false,
          items: [
            "workouts/week-2/index",
            "workouts/week-2/monday",
            "workouts/week-2/tuesday",
            "workouts/week-2/wednesday",
            "workouts/week-2/thursday",
            "workouts/week-2/friday",
            "workouts/week-2/saturday",
            "workouts/week-2/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 3 - Foundation Peak",
          collapsed: false,
          items: [
            "workouts/week-3/index",
            "workouts/week-3/monday",
            "workouts/week-3/tuesday",
            "workouts/week-3/wednesday",
            "workouts/week-3/thursday",
            "workouts/week-3/friday",
            "workouts/week-3/saturday",
            "workouts/week-3/sunday",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "⚡ Development Phase",
      collapsed: false,
      customProps: {
        description: "Weeks 4-6: Progressive loading and power introduction",
      },
      items: [
        {
          type: "category",
          label: "Week 4 - Power Introduction",
          collapsed: false,
          items: [
            "workouts/week-4/index",
            "workouts/week-4/monday",
            "workouts/week-4/tuesday",
            "workouts/week-4/wednesday",
            "workouts/week-4/thursday",
            "workouts/week-4/friday",
            "workouts/week-4/saturday",
            "workouts/week-4/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 5 - Development+",
          collapsed: false,
          items: [
            "workouts/week-5/index",
            "workouts/week-5/monday",
            "workouts/week-5/tuesday",
            "workouts/week-5/wednesday",
            "workouts/week-5/thursday",
            "workouts/week-5/friday",
            "workouts/week-5/saturday",
            "workouts/week-5/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 6 - Power Mastery",
          collapsed: false,
          items: [
            "workouts/week-6/index",
            "workouts/week-6/monday",
            "workouts/week-6/tuesday",
            "workouts/week-6/wednesday",
            "workouts/week-6/thursday",
            "workouts/week-6/friday",
            "workouts/week-6/saturday",
            "workouts/week-6/sunday",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "🔥 Intensification Phase",
      collapsed: false,
      customProps: {
        description: "Weeks 7-9: Maximum strength and advanced methods",
      },
      items: [
        {
          type: "category",
          label: "Week 7 - Maximum Strength",
          collapsed: false,
          items: [
            "workouts/week-7/index",
            "workouts/week-7/monday",
            "workouts/week-7/tuesday",
            "workouts/week-7/wednesday",
            "workouts/week-7/thursday",
            "workouts/week-7/friday",
            "workouts/week-7/saturday",
            "workouts/week-7/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 8 - Advanced Methods",
          collapsed: false,
          items: [
            "workouts/week-8/index",
            "workouts/week-8/monday",
            "workouts/week-8/tuesday",
            "workouts/week-8/wednesday",
            "workouts/week-8/thursday",
            "workouts/week-8/friday",
            "workouts/week-8/saturday",
            "workouts/week-8/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 9 - Complex Training",
          collapsed: false,
          items: [
            "workouts/week-9/index",
            "workouts/week-9/monday",
            "workouts/week-9/tuesday",
            "workouts/week-9/wednesday",
            "workouts/week-9/thursday",
            "workouts/week-9/friday",
            "workouts/week-9/saturday",
            "workouts/week-9/sunday",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "🏆 Peaking Phase",
      collapsed: false,
      customProps: {
        description:
          "Weeks 10-12: Competition preparation and peak performance",
      },
      items: [
        {
          type: "category",
          label: "Week 10 - Neural Sharpening",
          collapsed: false,
          items: [
            "workouts/week-10/index",
            "workouts/week-10/monday",
            "workouts/week-10/tuesday",
            "workouts/week-10/wednesday",
            "workouts/week-10/thursday",
            "workouts/week-10/friday",
            "workouts/week-10/saturday",
            "workouts/week-10/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 11 - Competition Prep",
          collapsed: false,
          items: [
            "workouts/week-11/index",
            "workouts/week-11/monday",
            "workouts/week-11/tuesday",
            "workouts/week-11/wednesday",
            "workouts/week-11/thursday",
            "workouts/week-11/friday",
            "workouts/week-11/saturday",
            "workouts/week-11/sunday",
          ],
        },
        {
          type: "category",
          label: "Week 12 - Championship Ready",
          collapsed: false,
          items: [
            "workouts/week-12/index",
            "workouts/week-12/monday",
            "workouts/week-12/tuesday",
            "workouts/week-12/wednesday",
            "workouts/week-12/thursday",
            "workouts/week-12/friday",
            "workouts/week-12/saturday",
            "workouts/week-12/sunday",
          ],
        },
      ],
    },
  ],
};

export default sidebars;

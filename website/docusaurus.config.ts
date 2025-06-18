import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Complete Tennis Training Handbook",
  tagline: "Elite methodologies, comprehensive science, practical application",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://tennis-training.dev",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "elite-tennis", // Usually your GitHub org/user name.
  projectName: "tennis-training", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Markdown configuration to handle special characters
  markdown: {
    mermaid: false,
    format: "detect", // Auto-detect md vs mdx
    preprocessor: ({ filePath, fileContent }) => {
      // This preprocessor ensures proper Unicode handling
      return fileContent;
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/docs", // Serve docs at /docs instead of root to avoid conflict
          // Remove edit links since this is a standalone resource
          editUrl: undefined,
          // Configure markdown processing for special characters
          remarkPlugins: [],
          rehypePlugins: [],
          // Ensure proper encoding handling
          include: ["**/*.md", "**/*.mdx"],
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
          ],
        },
        blog: false, // Disable blog for this training resource
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/tennis-training-social.jpg",

    // Add meta tags for proper character encoding
    metadata: [
      {
        name: "charset",
        content: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      {
        "http-equiv": "Content-Type",
        content: "text/html; charset=utf-8",
      },
    ],

    navbar: {
      title: "Tennis Training Handbook",
      logo: {
        alt: "Tennis Training Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "trainingSidebar",
          position: "left",
          label: "Complete Handbook",
        },
        {
          type: "docSidebar",
          sidebarId: "workoutsSidebar",
          position: "left",
          label: "12-Week Program",
        },
        {
          href: "https://github.com/elite-tennis/tennis-training",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Training Components",
          items: [
            {
              label: "Elite Philosophy",
              to: "/docs/training-philosophy",
            },
            {
              label: "Exercise Database",
              to: "/docs/exercises/exercise-database",
            },
            {
              label: "Programming",
              to: "/docs/programming/training-programming",
            },
          ],
        },
        {
          title: "Specialized Methods",
          items: [
            {
              label: "Tendon Health",
              to: "/docs/specialized/tendon-health-science",
            },
            {
              label: "Power Development",
              to: "/docs/specialized/power-development",
            },
            {
              label: "Recovery Protocols",
              to: "/docs/recovery/recovery-protocols",
            },
          ],
        },
        {
          title: "Support Systems",
          items: [
            {
              label: "Nutrition",
              to: "/docs/nutrition/nutrition-support",
            },
            {
              label: "Assessment",
              to: "/docs/assessment/assessment-monitoring",
            },
            {
              label: "Weekly Plans",
              to: "/docs/workouts",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Elite Tennis Training Research. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

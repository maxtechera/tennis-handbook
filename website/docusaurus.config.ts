import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Elite Tennis Training Research",
  tagline: "Comprehensive, research-backed tennis-specific training programs",
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

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/", // Serve docs at site root
          // Remove edit links since this is a standalone resource
          editUrl: undefined,
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
    navbar: {
      title: "Elite Tennis Training",
      logo: {
        alt: "Tennis Training Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "trainingSidebar",
          position: "left",
          label: "Training Guide",
        },
        {
          type: "docSidebar",
          sidebarId: "workoutsSidebar",
          position: "left",
          label: "Weekly Workouts",
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
              to: "/training-philosophy",
            },
            {
              label: "Exercise Database",
              to: "/exercise-database",
            },
            {
              label: "Programming",
              to: "/training-programming",
            },
          ],
        },
        {
          title: "Specialized Methods",
          items: [
            {
              label: "Tendon Health",
              to: "/tendon-health-science",
            },
            {
              label: "Power Development",
              to: "/power-development",
            },
            {
              label: "Recovery Protocols",
              to: "/recovery-protocols",
            },
          ],
        },
        {
          title: "Support Systems",
          items: [
            {
              label: "Nutrition",
              to: "/nutrition-support",
            },
            {
              label: "Assessment",
              to: "/assessment-monitoring",
            },
            {
              label: "Weekly Plans",
              to: "/workouts",
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

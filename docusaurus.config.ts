import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Elite Tennis Training",
  tagline: "Entrena como los #1 del mundo",
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
    defaultLocale: "es",
    locales: ["es", "en"],
    localeConfigs: {
      es: {
        label: "Español",
        direction: "ltr",
        htmlLang: "es",
        calendar: "gregory",
      },
      en: {
        label: "English",
        direction: "ltr",
        htmlLang: "en",
        calendar: "gregory",
      },
    },
  },

  // Markdown configuration to handle special characters
  markdown: {
    mermaid: false,
    format: "detect", // Auto-detect md vs mdx
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

  plugins: [
    "./src/plugins/workout-data-plugin",

    // Configure webpack to handle YAML files
    async function yamlLoaderPlugin(context, options) {
      return {
        name: "yaml-loader",
        configureWebpack(config, isServer, utils) {
          return {
            module: {
              rules: [
                {
                  test: /\.ya?ml$/,
                  use: "js-yaml-loader",
                },
              ],
            },
          };
        },
      };
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/tennis-training-social.jpg",

    // Add meta tags for proper character encoding and mobile/PWA support
    metadata: [
      {
        name: "charset",
        content: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
      },
      {
        "http-equiv": "Content-Type",
        content: "text/html; charset=utf-8",
      },
      // PWA and mobile app meta tags
      {
        name: "theme-color",
        content: "#1b5e20", // Dark green from hero gradient
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "Elite Tennis",
      },
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "application-name",
        content: "Elite Tennis Training",
      },
      {
        name: "msapplication-TileColor",
        content: "#1b5e20",
      },
      {
        name: "msapplication-navbutton-color",
        content: "#1b5e20",
      },
      // Social media and SEO
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Elite Tennis Training - Entrena como los #1 del mundo",
      },
      {
        property: "og:description",
        content: "Métodos exactos de entrenadores de Alcaraz, Sinner y medallistas olímpicos. Rutina personalizada GRATIS.",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Elite Tennis Training",
      },
      {
        name: "twitter:description",
        content: "Entrena como los #1 del mundo 🎾",
      },
    ],

    navbar: {
      title: "Tennis Handbook",
      logo: {
        alt: "Tennis Training Logo",
        src: "img/logo.png",
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
          to: "/docs/workouts/week-program-table",
          position: "left",
          label: "📊 Program Overview",
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
              to: "/docs/training-philosophy/overview",
            },
            {
              label: "Exercise Database",
              to: "/docs/exercises/exercise-database",
            },
            {
              label: "Programming",
              to: "/docs/programming/training-programming",
            },
            {
              label: "Recovery Methods",
              to: "/docs/recovery/recovery-protocols",
            },
          ],
        },
        {
          title: "Quick Links",
          items: [
            {
              label: "Weekly Schedule",
              to: "/docs/workouts/week-program-table",
            },
            {
              label: "Assessment Guide",
              to: "/docs/assessment/performance-testing",
            },
            {
              label: "Nutrition Support",
              to: "/docs/nutrition/performance-nutrition",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/elite-tennis/tennis-training",
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

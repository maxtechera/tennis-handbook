import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          🎾 Elite Tennis Training
        </Heading>
        <p className="hero__subtitle">
          Research-backed training programs for self-taught tennis pros
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            Start Your Training Journey 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStartSection() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Choose Your Path</Heading>
              <p className="hero__subtitle">
                Start where you are, progress systematically
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--4">
            <div className="card margin--md">
              <div className="card__header">
                <h3>🌱 Beginner Path</h3>
              </div>
              <div className="card__body">
                <p>New to tennis training? Start with foundations:</p>
                <ul>
                  <li>Learn elite training philosophy</li>
                  <li>Master basic exercises</li>
                  <li>3-day training template</li>
                  <li>Recovery fundamentals</li>
                </ul>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/docs/training-philosophy/overview"
                >
                  Start Here
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card margin--md">
              <div className="card__header">
                <h3>⚡ Intermediate Path</h3>
              </div>
              <div className="card__body">
                <p>Ready to advance your training:</p>
                <ul>
                  <li>Tendon health science</li>
                  <li>Power development methods</li>
                  <li>4-day training template</li>
                  <li>Advanced recovery protocols</li>
                </ul>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/docs/specialized/tendon-health-science"
                >
                  Level Up
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card margin--md">
              <div className="card__header">
                <h3>🏆 Advanced Path</h3>
              </div>
              <div className="card__body">
                <p>Maximize your potential:</p>
                <ul>
                  <li>Elite coaching methods</li>
                  <li>Competition preparation</li>
                  <li>5-day training template</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/docs/programming/competition-preparation"
                >
                  Go Elite
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedContent() {
  return (
    <section
      className="padding-vert--xl"
      style={{ backgroundColor: "var(--ifm-color-emphasis-100)" }}
    >
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Featured Training Systems</Heading>
              <p>Proven methods from the world's best coaches and athletes</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--6">
            <div className="card margin--md">
              <div className="card__header">
                <h3>🎯 12-Week Training Program</h3>
              </div>
              <div className="card__body">
                <p>
                  Complete periodized program with weekly progressions designed
                  for tennis-specific adaptations.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--outline button--primary"
                  to="/docs/workouts/overview"
                >
                  View Program
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className="card margin--md">
              <div className="card__header">
                <h3>🔬 Elite Methods Database</h3>
              </div>
              <div className="card__body">
                <p>
                  Learn from Carlos Alcaraz's coach Juan Carlos Ferrero and
                  Jannik Sinner's coach Marco Panichi.
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--outline button--primary"
                  to="/docs/training-philosophy/ferrero-alcaraz-methods"
                >
                  Explore Methods
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Elite Tennis Training"
      description="Research-backed tennis training programs for self-taught pros. Learn from elite coaches like Juan Carlos Ferrero and Marco Panichi."
    >
      <HomepageHeader />
      <main>
        <QuickStartSection />
        <FeaturedContent />
      </main>
    </Layout>
  );
}

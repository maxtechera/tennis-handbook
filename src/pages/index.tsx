import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="homepage.hero.title">
            🎾 The Tennis Training Handbook
          </Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.hero.subtitle">
            Go behind the scenes with the world's top players and learn what they actually do
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            <Translate id="homepage.hero.button">
              See What They Do 🚀
            </Translate>
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
              <Heading as="h2">
                <Translate id="homepage.paths.title">
                  Choose Your Chapter
                </Translate>
              </Heading>
              <p className="hero__subtitle">
                <Translate id="homepage.paths.subtitle">
                  Pick what you want to learn about
                </Translate>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--4">
            <div className="card margin--md">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.beginner.title">
                    🌱 The Fundamentals
                  </Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.beginner.description">
                    New to serious training? Start with what really matters:
                  </Translate>
                </p>
                <ul>
                  <li>
                    <Translate id="homepage.beginner.item1">
                      How pros actually structure their training
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.beginner.item2">
                      Which exercises they actually prioritize
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.beginner.item3">
                      The weekly patterns that work
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.beginner.item4">
                      Recovery methods that actually work
                    </Translate>
                  </li>
                </ul>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/docs/training-philosophy/overview"
                >
                  <Translate id="homepage.beginner.button">
                    Start Here
                  </Translate>
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card margin--md">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.intermediate.title">
                    ⚡ The Real Methods
                  </Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.intermediate.description">
                    Ready to go deeper? Learn about:
                  </Translate>
                </p>
                <ul>
                  <li>
                    <Translate id="homepage.intermediate.item1">
                      How pros actually stay injury-free
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.intermediate.item2">
                      The science behind explosive power
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.intermediate.item3">
                      Why pros train the way they do
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.intermediate.item4">
                      Advanced recovery techniques
                    </Translate>
                  </li>
                </ul>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/docs/specialized/tendon-health-science"
                >
                  <Translate id="homepage.intermediate.button">
                    Learn More
                  </Translate>
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--4">
            <div className="card margin--md">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.advanced.title">
                    🏆 Behind the Scenes
                  </Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.advanced.description">
                    Want the complete picture? See:
                  </Translate>
                </p>
                <ul>
                  <li>
                    <Translate id="homepage.advanced.item1">
                      What top coaches actually focus on
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.advanced.item2">
                      How they prepare for big tournaments
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.advanced.item3">
                      Real pro training schedules
                    </Translate>
                  </li>
                  <li>
                    <Translate id="homepage.advanced.item4">
                      How they track and measure progress
                    </Translate>
                  </li>
                </ul>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--primary button--block"
                  to="/docs/programming/competition-preparation"
                >
                  <Translate id="homepage.advanced.button">
                    See Everything
                  </Translate>
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
              <Heading as="h2">
                <Translate id="homepage.featured.title">
                  Inside Your Handbook
                </Translate>
              </Heading>
              <p>
                <Translate id="homepage.featured.subtitle">
                  Real training methods from the coaches behind today's champions
                </Translate>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--6">
            <div className="card margin--md">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.program.title">
                    🎯 12-Week Training Method
                  </Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.program.description">
                    See how pros structure 12 weeks of training. The real progressions, timing, and methods they use.
                  </Translate>
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--outline button--primary"
                  to="/docs/workouts/overview"
                >
                  <Translate id="homepage.program.button">
                    See the Method
                  </Translate>
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className="card margin--md">
              <div className="card__header">
                <h3>
                  <Translate id="homepage.methods.title">
                    🔬 What the Coaches Do
                  </Translate>
                </h3>
              </div>
              <div className="card__body">
                <p>
                  <Translate id="homepage.methods.description">
                    Ferrero's approach with Alcaraz. Panichi's methods with Sinner. Real insights from championship coaches.
                  </Translate>
                </p>
              </div>
              <div className="card__footer">
                <Link
                  className="button button--outline button--primary"
                  to="/docs/training-philosophy/ferrero-alcaraz-methods"
                >
                  <Translate id="homepage.methods.button">
                    Learn Their Methods
                  </Translate>
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

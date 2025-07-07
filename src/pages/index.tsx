import type { ReactNode } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import { EmailCaptureForm, EmailCapturePopup, EmailCaptureBar } from "@site/src/components/EmailCapture";
import { OnboardingWizard } from "@site/src/components/OnboardingWizard";
import { subscribeWithWizard, updateSubscriberTags } from "@site/src/config/api";
import { 
  trackWizardComplete, 
  trackWizardAbandon, 
  trackWizardStart,
  trackWizardProgress,
  sendEvent 
} from "@site/src/utils/analytics";
import { createWizardSteps, getWizardTranslations } from "@site/src/utils/wizard-steps";

import styles from "./index.module.css";

// Wizard Modal Component with viewport management
function WizardModal({ onClose, wizardSteps, handleWizardComplete, handleWizardSkip, wizardTranslations }) {
  useEffect(() => {
    // Prevent zoom on iOS by temporarily setting viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport?.getAttribute('content') || '';
    
    // Set viewport to prevent zoom
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const scrollY = window.scrollY;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Add class for CSS targeting
    document.body.classList.add('modal-open');
    
    // Cleanup function
    return () => {
      // Restore viewport
      if (viewport) {
        viewport.setAttribute('content', originalContent);
      }
      
      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    };
  }, []);
  
  return (
    <div className={styles.wizardModal} onClick={(e) => {
      // Close on backdrop click (not on wizard container)
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className={styles.wizardContainer}>
        {/* Close button for mobile */}
        <button 
          className={styles.wizardCloseButton}
          onClick={onClose}
          aria-label="Close wizard"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <OnboardingWizard
          steps={wizardSteps}
          onComplete={handleWizardComplete}
          onSkip={handleWizardSkip}
          persistKey="tennis-handbook-wizard"
          translations={wizardTranslations}
        />
      </div>
    </div>
  );
}

// Social proof data
const SOCIAL_PROOF = {
  totalUsers: "12,000+",
  avgImprovement: "73%",
  testimonials: [
    {
      quote: "Finalmente veo qué hacen realmente detrás de escenas. No teorías, métodos que funcionan",
      author: "Carlos M.",
      role: "Jugador 4.5 USTA"
    },
    {
      quote: "Como entrenador, estos insights de los coaches del ATP me ayudan a entender qué realmente funciona",
      author: "María S.", 
      role: "Entrenadora de Tenis, España"
    }
  ]
};

// Optimized Hero Section with single CTA
function HomepageHeader({ showWizard, setShowWizard, wizardComplete, currentLanguage, triggerWizard }) {
  const [showUrgency, setShowUrgency] = useState(false);
  
  useEffect(() => {
    // Show urgency after 10 seconds
    const timer = setTimeout(() => setShowUrgency(true), 10000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner, styles.optimizedHero)}>
      <div className="container">
        {/* Urgency Banner */}
        {showUrgency && !wizardComplete && (
          <div className={styles.urgencyBanner}>
            <Translate id="homepage.hero.urgency">
              🔥 Join 12,000+ players getting personalized training plans
            </Translate>
          </div>
        )}
        
        <Heading as="h1" className="hero__title text-blue-600">
          <Translate id="homepage.hero.title">
            Descubre cómo entrenan realmente los mejores del mundo
          </Translate>
        </Heading>
        <p className={clsx("hero__subtitle", styles.heroSubtitle)}>
          <Translate id="homepage.hero.subtitle">
            Ve detrás de escenas con entrenadores medallistas olímpicos del ATP Tour. Métodos reales, no teorías.
          </Translate>
        </p>
        
        {/* Social Proof */}
        <div className={styles.socialProofContainer}>
          <div className={styles.socialProofStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{SOCIAL_PROOF.totalUsers}</span>
              <span className={styles.statLabel}>
                <Translate id="homepage.hero.playersUsing">Players Training</Translate>
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{SOCIAL_PROOF.avgImprovement}</span>
              <span className={styles.statLabel}>
                <Translate id="homepage.hero.improvement">Avg. Improvement</Translate>
              </span>
            </div>
          </div>
        </div>
        
        {/* Lead Magnet CTA */}
        <div className={styles.ctaContainer}>
          {!wizardComplete && !showWizard && (
            <button 
              className={clsx("button button--primary button--lg", styles.primaryCTA)}
              onClick={triggerWizard}
            >
              <Translate id="homepage.hero.pdfCTA">
                📄 DESCARGAR RUTINA GRATIS (7 días)
              </Translate>
            </button>
          )}
          {wizardComplete && (
            <Link
              className="button button--primary button--lg"
              to="/docs/workouts/overview"
            >
              <Translate id="homepage.hero.viewPlan">
                Ver tu rutina personalizada →
              </Translate>
            </Link>
          )}
        </div>
        
        {/* Trust Indicators */}
        <div className={styles.trustIndicators}>
          <span className={styles.trustBadge}>
            ✓ <Translate id="homepage.hero.noCard">Solo tu email, nada más</Translate>
          </span>
          <span className={styles.trustBadge}>
            ✓ <Translate id="homepage.hero.instant">Descarga inmediata</Translate>
          </span>
          <span className={styles.trustBadge}>
            ✓ <Translate id="homepage.hero.realMethods">Métodos reales de entrenadores ATP</Translate>
          </span>
        </div>
      </div>
    </header>
  );
}

// Testimonials Section
function TestimonialsSection({ triggerWizard }) {
  return (
    <section className={clsx("padding-vert--xl", styles.testimonialsSection)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">
            <Translate id="homepage.testimonials.title">
              What Players Are Saying
            </Translate>
          </Heading>
        </div>
        <div className="row">
          {SOCIAL_PROOF.testimonials.map((testimonial, idx) => (
            <div key={idx} className="col col--6">
              <div className={clsx("card margin--md", styles.testimonialCard)}>
                <div className="card__body">
                  <blockquote className={styles.testimonialQuote}>
                    "{testimonial.quote}"
                  </blockquote>
                  <div className={styles.testimonialAuthor}>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <button 
            className="button button--primary button--lg"
            onClick={triggerWizard}
          >
            <Translate id="homepage.testimonials.cta">
              Start Your Personalized Plan →
            </Translate>
          </button>
        </div>
      </div>
    </section>
  );
}

// Simplified Featured Content supporting wizard narrative
function FeaturedContent({ triggerWizard }) {
  return (
    <section
      className="padding-vert--xl"
      style={{ backgroundColor: "var(--ifm-color-emphasis-100)" }}
    >
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">
            <Translate id="homepage.featured.title">
              Qué encontrarás en tu rutina de 7 días
            </Translate>
          </Heading>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.featured.subtitle">
              Los métodos exactos que usan los entrenadores de jugadores #1 del mundo. Ahora accesibles para ti.
            </Translate>
          </p>
        </div>
        
        <div className="row">
          <div className="col col--4">
            <div className={clsx("text--center", styles.benefitCard)}>
              <div className={styles.benefitIcon}>🏆</div>
              <h3>
                <Translate id="homepage.benefits.olympicMethods">
                  Métodos de Medallistas Olímpicos
                </Translate>
              </h3>
              <p>
                <Translate id="homepage.benefits.olympicMethodsDesc">
                  Rutinas exactas de entrenadores que han llevado jugadores al oro olímpico
                </Translate>
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={clsx("text--center", styles.benefitCard)}>
              <div className={styles.benefitIcon}>🎾</div>
              <h3>
                <Translate id="homepage.benefits.atpMethods">
                  Técnicas del ATP Tour
                </Translate>
              </h3>
              <p>
                <Translate id="homepage.benefits.atpMethodsDesc">
                  Los mismos ejercicios que usan los entrenadores de jugadores #1 del mundo
                </Translate>
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={clsx("text--center", styles.benefitCard)}>
              <div className={styles.benefitIcon}>📄</div>
              <h3>
                <Translate id="homepage.benefits.sevenDays">
                  7 Días Completos
                </Translate>
              </h3>
              <p>
                <Translate id="homepage.benefits.sevenDaysDesc">
                  Una semana completa con ejercicios específicos, progresiones y métodos probados
                </Translate>
              </p>
            </div>
          </div>
        </div>
        
        <div className="text--center margin-top--xl">
          <button 
            className={clsx("button button--primary button--lg", styles.ctaButton)}
            onClick={triggerWizard}
          >
            <Translate id="homepage.featured.cta">
              📄 DESCARGAR RUTINA GRATIS AHORA
            </Translate>
          </button>
          <p className={styles.ctaSubtext}>
            <Translate id="homepage.featured.ctaSubtext">
              Solo tu email • Descarga inmediata • Métodos reales
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

// FOMO Section
function FOMOSection({ triggerWizard }) {
  const [recentSignups, setRecentSignups] = useState(237);
  
  useEffect(() => {
    // Simulate live signups
    const interval = setInterval(() => {
      setRecentSignups(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className={clsx("padding-vert--lg", styles.fomoSection)}>
      <div className="container text--center">
        <div className={styles.fomoContent}>
          <span className={styles.fomoIndicator}>
            🔴 <Translate id="homepage.fomo.live">LIVE</Translate>
          </span>
          <p className={styles.fomoText}>
            <Translate 
              id="homepage.fomo.signups"
              values={{ count: recentSignups }}
            >
              {`${recentSignups} players started their personalized plan in the last 24 hours`}
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig, i18n } = useDocusaurusContext();
  const [showWizard, setShowWizard] = useState(false);
  const [wizardComplete, setWizardComplete] = useState(false);
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false);
  const lastScrollY = useRef(0);
  
  // Get current language
  const currentLanguage = i18n.currentLocale || 'en';
  const wizardSteps = createWizardSteps(currentLanguage);
  const wizardTranslations = getWizardTranslations(currentLanguage);

  // Centralized wizard trigger function
  const triggerWizard = useCallback(() => {
    if (!wizardComplete && !showWizard) {
      setShowWizard(true);
      trackWizardStart(currentLanguage);
      localStorage.setItem('wizard_seen', 'true');
      
      // Track trigger source
      sendEvent({
        event: 'wizard_triggered',
        category: 'Onboarding',
        label: 'manual_click',
        properties: {
          language: currentLanguage,
          timestamp: new Date().toISOString(),
        }
      });
    }
  }, [wizardComplete, showWizard, currentLanguage]);

  // Check if user should see wizard
  useEffect(() => {
    const hasCompletedWizard = localStorage.getItem('wizard_completed');
    const hasSeenWizard = localStorage.getItem('wizard_seen');
    const hasDismissedWizard = localStorage.getItem('wizard_dismissed');
    const lastDismissedTime = localStorage.getItem('wizard_dismissed_time');
    
    if (hasCompletedWizard) {
      setWizardComplete(true);
    }
    
    // Detect Spanish user
    const browserLang = navigator.language.toLowerCase();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const isSpanishUser = browserLang.startsWith('es') || 
                         timezone.includes('Madrid') || 
                         timezone.includes('Mexico') ||
                         timezone.includes('Buenos_Aires') ||
                         timezone.includes('Barcelona') ||
                         timezone.includes('Lima') ||
                         timezone.includes('Bogota');
    
    // Redirect to Spanish version if Spanish user and not already there
    if (isSpanishUser && currentLanguage !== 'es' && !window.location.pathname.startsWith('/es')) {
      window.location.href = '/es';
      return;
    }
    
    // Check if recently dismissed (within 24 hours)
    let shouldShowWizard = true;
    if (hasDismissedWizard && lastDismissedTime) {
      const dismissedTime = parseInt(lastDismissedTime);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        shouldShowWizard = false;
      }
    }
    
    // Auto-show wizard for new visitors (faster)
    if (!hasCompletedWizard && !hasSeenWizard && shouldShowWizard) {
      const timer = setTimeout(() => {
        setShowWizard(true);
        localStorage.setItem('wizard_seen', 'true');
        trackWizardStart(currentLanguage);
        
        sendEvent({
          event: 'wizard_triggered',
          category: 'Onboarding',
          label: 'auto_timer',
          properties: {
            delay_seconds: 2,
            language: currentLanguage,
          }
        });
      }, 2000); // Reduced from 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [currentLanguage]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Check if wizard was recently dismissed
      const hasDismissedWizard = localStorage.getItem('wizard_dismissed');
      const lastDismissedTime = localStorage.getItem('wizard_dismissed_time');
      
      let canShowWizard = true;
      if (hasDismissedWizard && lastDismissedTime) {
        const dismissedTime = parseInt(lastDismissedTime);
        const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
        if (hoursSinceDismissed < 24) {
          canShowWizard = false;
        }
      }
      
      if (e.clientY <= 0 && !exitIntentTriggered && !wizardComplete && !showWizard && canShowWizard) {
        setExitIntentTriggered(true);
        triggerWizard();
        
        sendEvent({
          event: 'wizard_triggered',
          category: 'Onboarding',
          label: 'exit_intent',
          properties: {
            language: currentLanguage,
          }
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitIntentTriggered, wizardComplete, showWizard, triggerWizard, currentLanguage]);

  // Scroll-based trigger
  useEffect(() => {
    const handleScroll = () => {
      // Check if wizard was recently dismissed
      const hasDismissedWizard = localStorage.getItem('wizard_dismissed');
      const lastDismissedTime = localStorage.getItem('wizard_dismissed_time');
      
      let canShowWizard = true;
      if (hasDismissedWizard && lastDismissedTime) {
        const dismissedTime = parseInt(lastDismissedTime);
        const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
        if (hoursSinceDismissed < 24) {
          canShowWizard = false;
        }
      }
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
      
      // Trigger at 30% scroll down
      if (scrollPercentage > 30 && !wizardComplete && !showWizard && scrollY > lastScrollY.current && canShowWizard) {
        triggerWizard();
        
        sendEvent({
          event: 'wizard_triggered',
          category: 'Onboarding',
          label: 'scroll_trigger',
          properties: {
            scroll_percentage: Math.round(scrollPercentage),
            language: currentLanguage,
          }
        });
      }
      
      lastScrollY.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [wizardComplete, showWizard, triggerWizard, currentLanguage]);

  // Time-based reminder
  useEffect(() => {
    // Check if wizard was recently dismissed
    const hasDismissedWizard = localStorage.getItem('wizard_dismissed');
    const lastDismissedTime = localStorage.getItem('wizard_dismissed_time');
    
    let canShowReminder = true;
    if (hasDismissedWizard && lastDismissedTime) {
      const dismissedTime = parseInt(lastDismissedTime);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        canShowReminder = false;
      }
    }
    
    if (!wizardComplete && !showWizard && canShowReminder) {
      const timer = setTimeout(() => {
        // Show floating reminder
        const reminder = document.createElement('div');
        reminder.className = styles.floatingReminder;
        reminder.innerHTML = `
          <p>👋 Still here? Get your personalized plan in just 2 minutes</p>
          <button class="button button--primary button--sm">Start Now →</button>
        `;
        reminder.querySelector('button')?.addEventListener('click', () => {
          triggerWizard();
          reminder.remove();
          
          sendEvent({
            event: 'wizard_triggered',
            category: 'Onboarding',
            label: 'time_reminder',
            properties: {
              delay_seconds: 45,
              language: currentLanguage,
            }
          });
        });
        document.body.appendChild(reminder);
        
        // Auto-remove after 10 seconds
        setTimeout(() => reminder.remove(), 10000);
      }, 45000); // 45 seconds
      
      return () => clearTimeout(timer);
    }
  }, [wizardComplete, showWizard, triggerWizard, currentLanguage]);

  const handleWizardComplete = async (wizardData: any) => {
    try {
      // Submit to API
      const email = wizardData['personal-info']?.email;
      if (email) {
        // Check if user is already a subscriber (from immediate creation)
        const isSubscriber = wizardData['personal-info']?.isSubscriber;
        
        let response;
        if (isSubscriber) {
          // Update tags for existing subscriber
          response = await updateSubscriberTags(email, wizardData, wizardData.personalization?.whatsapp);
        } else {
          // Fallback to full wizard submission
          response = await subscribeWithWizard(email, wizardData, wizardData.personalization?.whatsapp);
        }
        
        if (response.success) {
          // Track completion
          trackWizardComplete(wizardData);
          
          // Mark as completed
          localStorage.setItem('wizard_completed', 'true');
          setWizardComplete(true);
          
          // Navigate to recommended content if provided
          if (response.personalization?.recommendedContent?.[0]) {
            window.location.href = response.personalization.recommendedContent[0].path;
          }
        }
      }
    } catch (error) {
      console.error('Wizard submission error:', error);
    } finally {
      setShowWizard(false);
    }
  };

  const handleWizardSkip = () => {
    // Track abandonment
    trackWizardAbandon(0, wizardSteps.length);
    setShowWizard(false);
    
    // Mark as dismissed with timestamp
    localStorage.setItem('wizard_dismissed', 'true');
    localStorage.setItem('wizard_dismissed_time', Date.now().toString());
    
    // Show a less intrusive reminder after skip
    setTimeout(() => {
      if (!wizardComplete) {
        // Use email capture bar as fallback
        const event = new Event('show-email-bar');
        window.dispatchEvent(event);
      }
    }, 10000); // 10 seconds after skip
  };

  return (
    <Layout
      title="Elite Tennis Training - Personalized Plans Based on Pro Methods"
      description="Get a personalized tennis training plan based on the exact methods used by coaches of Alcaraz, Sinner, and other top pros. 12,000+ players improving their game."
    >
      <HomepageHeader 
        showWizard={showWizard}
        setShowWizard={setShowWizard}
        wizardComplete={wizardComplete}
        currentLanguage={currentLanguage}
        triggerWizard={triggerWizard}
      />
      <main>
        <FOMOSection triggerWizard={triggerWizard} />
        <TestimonialsSection triggerWizard={triggerWizard} />
        <FeaturedContent triggerWizard={triggerWizard} />
      </main>
      
      {/* Wizard Modal */}
      {showWizard && (
        <WizardModal
          onClose={handleWizardSkip}
          wizardSteps={wizardSteps}
          handleWizardComplete={handleWizardComplete}
          handleWizardSkip={handleWizardSkip}
          wizardTranslations={wizardTranslations}
        />
      )}
      
      {/* Minimal fallback for users who skip wizard */}
      {!wizardComplete && !showWizard && (
        <EmailCaptureBar 
          showAfterScroll={true}
          scrollThreshold={80} // Higher threshold
          source="bar-fallback-minimal"
        />
      )}
    </Layout>
  );
}
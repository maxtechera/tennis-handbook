import React, { useState, useEffect } from 'react';
import styles from './EmailCaptureBar.module.css';
import Translate, { translate } from '@docusaurus/Translate';

const STORAGE_KEY = 'tennis-handbook-footer-bar-dismissed';
const SUBSCRIBER_KEY = 'tennis-handbook-subscriber';

export function EmailCaptureBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDismissed = window.localStorage.getItem(STORAGE_KEY) === 'true';
    const isSubscriber = window.localStorage.getItem(SUBSCRIBER_KEY) === 'true';

    if (!isDismissed && !isSubscriber) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer-bar',
          consent: true,
          timestamp: new Date().toISOString(),
          language: document.documentElement.lang || 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus('success');
      window.localStorage.setItem(SUBSCRIBER_KEY, 'true');
      
      if (window.gtag) {
        window.gtag('event', 'email_capture', {
          event_category: 'engagement',
          event_label: 'footer-bar',
        });
      }

      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    window.localStorage.setItem(STORAGE_KEY, 'true');
    
    if (window.gtag) {
      window.gtag('event', 'email_bar_dismissed', {
        event_category: 'engagement',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.text}>
            <span className={styles.emoji}>🎾</span>
            <Translate id="emailCapture.bar.text">
              Get free tennis training tips delivered weekly
            </Translate>
          </p>
          {status === 'success' ? (
            <p className={styles.success}>
              <Translate id="emailCapture.bar.success">
                ✓ Welcome! Check your email
              </Translate>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translate({
                  id: 'emailCapture.bar.placeholder',
                  message: 'Your email',
                })}
                className={styles.input}
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className={styles.button}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '...' : translate({
                  id: 'emailCapture.bar.submit',
                  message: 'Subscribe',
                })}
              </button>
            </form>
          )}
        </div>
        <button
          className={styles.closeButton}
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
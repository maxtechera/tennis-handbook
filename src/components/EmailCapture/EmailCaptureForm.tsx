import React, { useState, FormEvent } from 'react';
import styles from './EmailCaptureForm.module.css';
import Translate, { translate } from '@docusaurus/Translate';
import { API_CONFIG } from '../../config/api';

interface EmailCaptureFormProps {
  variant?: 'hero' | 'inline' | 'popup' | 'footer';
  onSuccess?: () => void;
  source: string;
}

export function EmailCaptureForm({ variant = 'inline', onSuccess, source }: EmailCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [hasConsent, setHasConsent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!hasConsent) {
      setMessage(translate({
        id: 'emailCapture.consentRequired',
        message: 'Please agree to receive emails',
      }));
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Use the API endpoint from configuration
      const response = await fetch(API_CONFIG.SUBSCRIBE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          consent: hasConsent,
          timestamp: new Date().toISOString(),
          language: document.documentElement.lang || 'en',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Subscription failed');
      }

      setStatus('success');
      setMessage(translate({
        id: 'emailCapture.success',
        message: 'Welcome! Check your email to confirm your subscription.',
      }));
      setEmail('');
      setHasConsent(false);

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'email_capture', {
          event_category: 'engagement',
          event_label: source,
          method: 'ConvertKit',
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('ConvertKit subscription error:', error);
      setStatus('error');
      setMessage(translate({
        id: 'emailCapture.error',
        message: 'Something went wrong. Please try again.',
      }));
    }
  };

  return (
    <div className={`${styles.emailCapture} ${styles[variant]}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Translate id="emailCapture.title">
            Level Up Your Tennis Game
          </Translate>
        </h3>
        <p className={styles.description}>
          <Translate id="emailCapture.description">
            Get weekly training tips, workout routines, and exclusive content from elite players.
          </Translate>
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={translate({
                id: 'emailCapture.placeholder',
                message: 'Enter your email',
              })}
              className={styles.input}
              required
              disabled={status === 'loading' || status === 'success'}
              aria-label={translate({
                id: 'emailCapture.emailLabel',
                message: 'Email address',
              })}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? (
                <Translate id="emailCapture.loading">Subscribing...</Translate>
              ) : (
                <Translate id="emailCapture.submit">Get Free Tips</Translate>
              )}
            </button>
          </div>
          
          <div className={styles.consent}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
                className={styles.checkbox}
                disabled={status === 'loading' || status === 'success'}
              />
              <span>
                <Translate id="emailCapture.consent">
                  I agree to receive tennis tips and updates. You can unsubscribe anytime.
                </Translate>
              </span>
            </label>
          </div>
          
          {message && (
            <div className={`${styles.message} ${styles[status]}`}>
              {message}
            </div>
          )}
        </form>
        
        <p className={styles.privacy}>
          <Translate id="emailCapture.privacy">
            We respect your privacy. No spam, ever.
          </Translate>
        </p>
      </div>
    </div>
  );
}
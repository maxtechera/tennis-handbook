import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './PWAInstallBanner.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className={clsx(styles.banner, styles.slideIn)}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <img src="/img/logo.png" alt="App Icon" className={styles.icon} />
        </div>
        <div className={styles.textContainer}>
          <h3 className={styles.title}>¡Instala Tenis Manual!</h3>
          <p className={styles.subtitle}>
            Accede rápidamente a tus entrenamientos desde tu pantalla de inicio
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button 
            onClick={handleInstallClick}
            className={clsx(styles.button, styles.installButton)}
          >
            <span className={styles.buttonIcon}>📲</span>
            Instalar
          </button>
          <button 
            onClick={handleDismiss}
            className={clsx(styles.button, styles.dismissButton)}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
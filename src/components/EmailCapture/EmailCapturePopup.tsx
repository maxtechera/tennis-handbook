import React, { useState, useEffect } from "react";
import { EmailCaptureForm } from "./EmailCaptureForm";
import styles from "./EmailCapturePopup.module.css";
import { useLocation } from "@docusaurus/router";

const POPUP_DELAY = 3 * 60 * 1000; // 3 minutes
const POPUP_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = "tennis-handbook-email-popup";

export function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // DISABLED: Auto-popup disabled per user request
    // Popup will only show if manually triggered by other code
    // if (typeof window === 'undefined') return;
    // const storage = window.localStorage;
    // const lastShown = storage.getItem(STORAGE_KEY);
    // if (lastShown) {
    //   const timeSinceLastShown = Date.now() - parseInt(lastShown, 10);
    //   if (timeSinceLastShown < POPUP_COOLDOWN) {
    //     return;
    //   }
    // }
    // const existingSubscriber = storage.getItem('tennis-handbook-subscriber');
    // if (existingSubscriber === 'true') {
    //   return;
    // }
    // const timer = setTimeout(() => {
    //   setIsVisible(true);
    //   storage.setItem(STORAGE_KEY, Date.now().toString());
    //   if (window.gtag) {
    //     window.gtag('event', 'email_popup_shown', {
    //       event_category: 'engagement',
    //       event_label: location.pathname,
    //     });
    //   }
    // }, POPUP_DELAY);
    // return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClose = () => {
    setIsVisible(false);

    if (window.gtag) {
      window.gtag("event", "email_popup_closed", {
        event_category: "engagement",
        event_label: location.pathname,
      });
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("tennis-handbook-subscriber", "true");
      }
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={styles.popup}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <EmailCaptureForm
          variant="popup"
          source={`popup-${location.pathname}`}
          onSuccess={handleSuccess}
        />
      </div>
    </>
  );
}

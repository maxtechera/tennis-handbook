import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './UserInfoDisplay.module.css';

interface UserInfoDisplayProps {
  name?: string;
  email?: string;
  isSubscriber?: boolean;
}

export function UserInfoDisplay({ name, email, isSubscriber }: UserInfoDisplayProps) {
  if (!name && !email) {
    return null;
  }

  return (
    <div className={styles.userInfo}>
      <div className={styles.userAvatar}>
        {name ? name.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userDetails}>
        {name && (
          <div className={styles.userName}>
            <Translate id="wizard.userInfo.welcomeBack" values={{ name }}>
              Hola, {name}
            </Translate>
          </div>
        )}
        {email && (
          <div className={styles.userEmail}>
            {email}
            {isSubscriber && (
              <span className={styles.subscriberBadge}>
                ✓ <Translate id="wizard.userInfo.subscribed">Suscrito</Translate>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
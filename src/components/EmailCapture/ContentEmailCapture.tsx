import React from 'react';
import { EmailCaptureForm } from './EmailCaptureForm';
import styles from './ContentEmailCapture.module.css';
import Translate from '@docusaurus/Translate';

interface ContentEmailCaptureProps {
  source: string;
}

export function ContentEmailCapture({ source }: ContentEmailCaptureProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.divider}>
        <span className={styles.dividerText}>• • •</span>
      </div>
      <div className={styles.container}>
        <h3 className={styles.title}>
          <Translate id="contentEmailCapture.title">
            🎾 Want More Training Insights?
          </Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="contentEmailCapture.subtitle">
            Join thousands of players getting weekly training tips from elite coaches
          </Translate>
        </p>
        <EmailCaptureForm variant="inline" source={source} />
      </div>
    </div>
  );
}
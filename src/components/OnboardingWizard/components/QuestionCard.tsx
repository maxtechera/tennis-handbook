import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function QuestionCard({ 
  title, 
  subtitle, 
  required = false, 
  children,
  className = ''
}: QuestionCardProps) {
  return (
    <div className={`${styles.questionCard} ${className}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Translate id={title}>{title}</Translate>
          {!required && (
            <span className={styles.optional}>
              <Translate id="onboarding.optional">(Opcional)</Translate>
            </span>
          )}
        </h3>
        {subtitle && (
          <p className={styles.subtitle}>
            <Translate id={subtitle}>{subtitle}</Translate>
          </p>
        )}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
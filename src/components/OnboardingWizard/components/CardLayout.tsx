import React, { ReactNode } from 'react';
import styles from './CardLayout.module.css';

interface CardLayoutProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  padding?: 'sm' | 'md' | 'lg';
  animation?: 'none' | 'fadeIn' | 'slideUp' | 'celebration';
}

export function CardLayout({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  animation = 'none'
}: CardLayoutProps) {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    animation !== 'none' ? styles[animation] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

interface CardStackProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CardStack({ 
  children, 
  spacing = 'md',
  className = ''
}: CardStackProps) {
  const stackClasses = [
    styles.cardStack,
    styles[`spacing-${spacing}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'primary' | 'success' | 'warning' | 'danger';
  };
}

export function CardHeader({ icon, title, subtitle, badge }: CardHeaderProps) {
  return (
    <div className={styles.cardHeader}>
      {badge && (
        <div className={`${styles.badge} ${styles[`badge-${badge.variant}`]}`}>
          {badge.text}
        </div>
      )}
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`${styles.cardContent} ${className}`}>
      {children}
    </div>
  );
}

interface CardActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  stack?: boolean;
}

export function CardActions({ children, align = 'center', stack = false }: CardActionsProps) {
  const actionsClasses = [
    styles.cardActions,
    styles[`align-${align}`],
    stack ? styles.stack : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={actionsClasses}>
      {children}
    </div>
  );
}
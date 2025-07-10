import React from 'react';
import styles from './TennisBallAnimation.module.css';

interface TennisBallAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  animation?: 'bounce' | 'spin' | 'float' | 'pulse' | 'none';
  className?: string;
}

export function TennisBallAnimation({ 
  size = 'md', 
  animation = 'bounce',
  className = ''
}: TennisBallAnimationProps) {
  const ballClasses = [
    styles.tennisBall,
    styles[size],
    animation !== 'none' ? styles[animation] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={ballClasses}>
      <div className={styles.ballSurface}>
        <div className={styles.ballCurve}></div>
      </div>
    </div>
  );
}

interface TennisCourtProps {
  children?: React.ReactNode;
  className?: string;
}

export function TennisCourt({ children, className = '' }: TennisCourtProps) {
  return (
    <div className={`${styles.tennisCourt} ${className}`}>
      <div className={styles.courtLines}>
        <div className={styles.baseline}></div>
        <div className={styles.serviceLine}></div>
        <div className={styles.centerLine}></div>
      </div>
      {children}
    </div>
  );
}

interface TennisRacketProps {
  size?: 'sm' | 'md' | 'lg';
  animation?: 'swing' | 'static';
  className?: string;
}

export function TennisRacket({ 
  size = 'md', 
  animation = 'static',
  className = ''
}: TennisRacketProps) {
  const racketClasses = [
    styles.tennisRacket,
    styles[`racket-${size}`],
    animation !== 'static' ? styles[`racket-${animation}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={racketClasses}>
      <div className={styles.racketHead}>
        <div className={styles.strings}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.string}></div>
          ))}
        </div>
      </div>
      <div className={styles.racketHandle}></div>
    </div>
  );
}

interface TennisSceneProps {
  showBall?: boolean;
  showRacket?: boolean;
  ballAnimation?: 'bounce' | 'spin' | 'float' | 'pulse' | 'none';
  racketAnimation?: 'swing' | 'static';
  className?: string;
}

export function TennisScene({ 
  showBall = true,
  showRacket = false,
  ballAnimation = 'bounce',
  racketAnimation = 'static',
  className = ''
}: TennisSceneProps) {
  return (
    <div className={`${styles.tennisScene} ${className}`}>
      <TennisCourt>
        {showBall && (
          <TennisBallAnimation 
            size="lg" 
            animation={ballAnimation}
            className={styles.sceneBall}
          />
        )}
        {showRacket && (
          <TennisRacket 
            size="lg" 
            animation={racketAnimation}
            className={styles.sceneRacket}
          />
        )}
      </TennisCourt>
    </div>
  );
}
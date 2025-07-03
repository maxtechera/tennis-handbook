import React from 'react';
import { TechniqueProgress } from '../../../types/technique';
import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  techniqueId: string;
  progress: TechniqueProgress;
  totalLessons: number;
  currentLesson: number;
}

export default function ProgressIndicator({
  techniqueId,
  progress,
  totalLessons,
  currentLesson,
}: ProgressIndicatorProps) {
  const completedCount = progress.completedLessons.length;
  const progressPercentage = (completedCount / totalLessons) * 100;
  const averageScore = progress.assessmentScores
    ? Object.values(progress.assessmentScores).reduce((sum, score) => sum + score, 0) / 
      Object.values(progress.assessmentScores).length
    : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = () => {
    if (progress.status === 'completed') return '#4CAF50';
    if (progress.status === 'in-progress') return '#2196F3';
    return '#9E9E9E';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className={styles.progressContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Your Progress</h4>
        <span 
          className={styles.status}
          style={{ color: getStatusColor() }}
        >
          {progress.status.replace('-', ' ')}
        </span>
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        />
        <div className={styles.progressText}>
          {completedCount} of {totalLessons} lessons completed
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Current Lesson</span>
          <span className={styles.statValue}>{currentLesson + 1}</span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Average Score</span>
          <span 
            className={styles.statValue}
            style={{ color: getScoreColor(averageScore) }}
          >
            {averageScore > 0 ? `${Math.round(averageScore)}%` : 'N/A'}
          </span>
        </div>
        
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Time Invested</span>
          <span className={styles.statValue}>
            {formatTime(progress.totalTimeSpent)}
          </span>
        </div>
      </div>

      {progress.completedLessons.length > 0 && (
        <div className={styles.lessonGrid}>
          {Array.from({ length: totalLessons }, (_, index) => {
            const lessonId = `lesson-${index + 1}`;
            const isCompleted = progress.completedLessons.includes(lessonId);
            const isCurrent = index === currentLesson;
            const score = progress.assessmentScores[lessonId];

            return (
              <div
                key={lessonId}
                className={`${styles.lessonDot} ${
                  isCompleted ? styles.completed : ''
                } ${isCurrent ? styles.current : ''}`}
                title={`Lesson ${index + 1}${
                  score ? ` - Score: ${score}%` : ''
                }`}
              >
                {isCompleted && '✓'}
                {isCurrent && !isCompleted && '●'}
              </div>
            );
          })}
        </div>
      )}

      {progress.notes && (
        <div className={styles.notes}>
          <h5>Your Notes</h5>
          <p>{progress.notes}</p>
        </div>
      )}

      <div className={styles.actions}>
        {progress.status === 'completed' ? (
          <button className={styles.reviewButton}>
            Review Technique
          </button>
        ) : (
          <button className={styles.continueButton}>
            Continue Learning
          </button>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Drill, DifficultyLevel } from '../../../types/technique';
import styles from './DrillCard.module.css';

interface DrillCardProps {
  drill: Drill;
  onStart: () => void;
  isCompleted?: boolean;
}

export default function DrillCard({ drill, onStart, isCompleted = false }: DrillCardProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(drill.difficulty);
  const [showVariations, setShowVariations] = useState(false);

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
    }
  };

  const getRepetitions = () => {
    if (!drill.repetitions) return null;
    return drill.repetitions[selectedDifficulty];
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className={`${styles.drillCard} ${isCompleted ? styles.completed : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{drill.title}</h3>
        <span 
          className={styles.difficulty}
          style={{ backgroundColor: getDifficultyColor(drill.difficulty) }}
        >
          {drill.difficulty}
        </span>
      </div>

      <p className={styles.description}>{drill.description}</p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.icon}>⏱️</span>
          <span>{formatDuration(drill.duration)}</span>
        </div>
        
        {drill.equipment.length > 0 && (
          <div className={styles.detailItem}>
            <span className={styles.icon}>🎾</span>
            <span>{drill.equipment.join(', ')}</span>
          </div>
        )}
        
        <div className={styles.detailItem}>
          <span className={styles.icon}>📍</span>
          <span>{drill.space.replace('-', ' ')}</span>
        </div>
      </div>

      {drill.repetitions && (
        <div className={styles.difficultySelector}>
          <label>Select your level:</label>
          <div className={styles.difficultyButtons}>
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                className={`${styles.difficultyButton} ${
                  selectedDifficulty === level ? styles.selected : ''
                }`}
                onClick={() => setSelectedDifficulty(level)}
                style={{
                  borderColor: selectedDifficulty === level ? getDifficultyColor(level) : undefined,
                }}
              >
                {level}
              </button>
            ))}
          </div>
          {getRepetitions() && (
            <p className={styles.repetitions}>
              <strong>Recommended:</strong> {getRepetitions()}
            </p>
          )}
        </div>
      )}

      {drill.variations && drill.variations.length > 0 && (
        <div className={styles.variations}>
          <button
            className={styles.variationsToggle}
            onClick={() => setShowVariations(!showVariations)}
          >
            {showVariations ? '▼' : '▶'} Variations ({drill.variations.length})
          </button>
          
          {showVariations && (
            <div className={styles.variationsList}>
              {drill.variations.map((variation) => (
                <div key={variation.id} className={styles.variation}>
                  <div className={styles.variationHeader}>
                    <h4>{variation.title}</h4>
                    <span 
                      className={styles.variationDifficulty}
                      style={{ backgroundColor: getDifficultyColor(variation.difficulty) }}
                    >
                      {variation.difficulty}
                    </span>
                  </div>
                  <p>{variation.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button 
          className={styles.startButton}
          onClick={onStart}
        >
          {isCompleted ? '✓ Practice Again' : 'Start Practice'}
        </button>
        
        {drill.videoUrl && (
          <a 
            href={drill.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoLink}
          >
            Watch Demo 🎥
          </a>
        )}
      </div>
    </div>
  );
}
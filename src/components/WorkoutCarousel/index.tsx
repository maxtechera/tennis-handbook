import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface WorkoutPhase {
  id: string;
  title: string;
  duration: string;
  timeRange: string;
  icon: string;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  weight?: string;
  instructions?: string[];
  cues?: string[];
  videoUrl?: string;
  completed?: boolean;
}

interface WorkoutCarouselProps {
  phases: WorkoutPhase[];
  workoutTitle: string;
}

export default function WorkoutCarousel({ phases, workoutTitle }: WorkoutCarouselProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isCarouselMode, setIsCarouselMode] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState<{ [key: string]: boolean }>({});
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  

  const currentPhaseData = phases[currentPhase];
  const currentExerciseData = currentPhaseData?.exercises[currentExercise];
  
  // Guard clause to prevent errors if data is not available
  if (!phases || phases.length === 0 || !currentPhaseData || !currentExerciseData) {
    return (
      <div className={styles.workoutModeToggle}>
        <p>Loading workout data...</p>
      </div>
    );
  }

  // Auto-scroll when exercise changes - ONLY sync background page
  useEffect(() => {
    if (isCarouselMode) {
      // Sync background page scroll only
      setTimeout(() => {
        scrollBackgroundPage();
      }, 200);
    }
  }, [currentPhase, currentExercise, isCarouselMode]);

  // Handle sticky behavior when scrolling
  useEffect(() => {
    if (isCarouselMode) return; // Don't handle sticky when in guided mode

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Make sticky when scrolled past one viewport height
      setIsSticky(scrollPosition > viewportHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCarouselMode]);


  // Scroll background page to sync with guided workout
  const scrollBackgroundPage = () => {
    if (!currentPhaseData) return;
    
    const phaseId = currentPhaseData.id;
    const phaseTitle = currentPhaseData.title;
    
    // Try multiple strategies to find the corresponding section
    let targetElement: HTMLElement | null = null;
    
    // Strategy 1: Look for element with matching ID
    targetElement = document.getElementById(phaseId);
    
    // Strategy 2: Look for data-phase attribute
    if (!targetElement) {
      targetElement = document.querySelector(`[data-phase="${phaseId}"]`) as HTMLElement;
    }
    
    // Strategy 3: Look for heading containing phase title
    if (!targetElement) {
      const headings = document.querySelectorAll('h1, h2, h3, h4');
      for (const heading of headings) {
        if (heading.textContent?.includes(phaseTitle) || 
            heading.textContent?.includes(phaseId) ||
            heading.textContent?.toLowerCase().includes(phaseTitle.toLowerCase())) {
          targetElement = heading as HTMLElement;
          break;
        }
      }
    }
    
    // Strategy 4: Look for specific phase patterns
    if (!targetElement) {
      const patterns = [
        `h2[id*="${phaseId}"]`,
        `div[class*="${phaseId}"]`,
        `section[class*="${phaseId}"]`,
        `.${phaseId}`,
        `#${phaseId.replace(/[^a-zA-Z0-9-_]/g, '')}`
      ];
      
      for (const pattern of patterns) {
        targetElement = document.querySelector(pattern) as HTMLElement;
        if (targetElement) break;
      }
    }
    
    if (targetElement) {
      // Scroll the main document (background page)
      const offsetTop = targetElement.offsetTop;
      window.scrollTo({
        top: Math.max(0, offsetTop - 100), // 100px offset from top
        behavior: 'smooth'
      });
    } else {
      // Final fallback: use phase index to estimate position
      const estimatedPosition = currentPhase * (window.innerHeight * 0.8);
      window.scrollTo({
        top: estimatedPosition,
        behavior: 'smooth'
      });
    }
  };

  const nextExercise = () => {
    // Mark current exercise as completed when moving forward
    const key = `${currentPhase}-${currentExercise}`;
    setExerciseCompleted(prev => ({ ...prev, [key]: true }));

    // Check if this is the last exercise of the last phase
    const isLastExercise = currentPhase === phases.length - 1 && currentExercise === currentPhaseData.exercises.length - 1;
    
    if (isLastExercise) {
      // Finish workout - exit guided mode
      setIsCarouselMode(false);
    } else if (currentExercise < currentPhaseData.exercises.length - 1) {
      // Move to next exercise in current phase
      setCurrentExercise(currentExercise + 1);
    } else if (currentPhase < phases.length - 1) {
      // Move to first exercise of next phase
      setCurrentPhase(currentPhase + 1);
      setCurrentExercise(0);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    } else if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
      setCurrentExercise(phases[currentPhase - 1].exercises.length - 1);
    }
  };


  const isExerciseComplete = (phaseIndex: number, exerciseIndex: number) => {
    return exerciseCompleted[`${phaseIndex}-${exerciseIndex}`] || false;
  };

  const getProgressPercentage = () => {
    const totalExercises = phases.reduce((sum, phase) => sum + phase.exercises.length, 0);
    const completedExercises = Object.keys(exerciseCompleted).length;
    return Math.round((completedExercises / totalExercises) * 100);
  };

  if (!isCarouselMode) {
    return (
      <>
        {/* Regular toggle button */}
        <div className={styles.workoutModeToggle}>
          <button 
            className={styles.startWorkoutBtn}
            onClick={() => setIsCarouselMode(true)}
          >
            🏃‍♂️ Start Guided Workout
          </button>
          <p className={styles.modeDescription}>
            Switch to guided mode for a step-by-step workout experience
          </p>
        </div>
        
        {/* Sticky button when scrolled */}
        {isSticky && (
          <div className={styles.stickyWorkoutToggle}>
            <button 
              className={styles.stickyStartBtn}
              onClick={() => setIsCarouselMode(true)}
            >
              🏃‍♂️ Start Guided Workout
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={styles.workoutCarousel}>
      {/* Header */}
      <div className={styles.workoutHeader}>
        <button 
          className={styles.exitBtn}
          onClick={() => setIsCarouselMode(false)}
        >
          ← Exit
        </button>
        <h2 className={styles.workoutTitle}>{workoutTitle}</h2>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <span className={styles.progressText}>{getProgressPercentage()}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Phase Indicator */}
        <div className={styles.phaseIndicator}>
          <span className={styles.phaseIcon}>{currentPhaseData.icon}</span>
          <div className={styles.phaseInfo}>
            <h3 className={styles.phaseTitle}>{currentPhaseData.title}</h3>
            <p className={styles.phaseTime}>{currentPhaseData.timeRange} • {currentPhaseData.duration}</p>
          </div>
        </div>

        {/* Exercise Card */}
        <div className={styles.exerciseCard}>
          <div className={styles.exerciseHeader}>
            <h3 className={styles.exerciseName}>{currentExerciseData.name}</h3>
            <div className={styles.exerciseCounter}>
              {currentExercise + 1} of {currentPhaseData.exercises.length}
            </div>
          </div>

          {/* Video Section */}
          {currentExerciseData.videoUrl && (
            <div className={styles.videoContainer}>
              <iframe
                src={currentExerciseData.videoUrl}
                title={`${currentExerciseData.name} demonstration`}
                className={`${styles.exerciseVideo} ${isVideoFullscreen ? styles.fullscreenVideo : ''}`}
                allowFullScreen
                onClick={() => setIsVideoFullscreen(!isVideoFullscreen)}
              />
              {isVideoFullscreen && (
                <div 
                  className={styles.fullscreenOverlay}
                  onClick={() => setIsVideoFullscreen(false)}
                />
              )}
            </div>
          )}

          {/* Exercise Details */}
          <div className={styles.exerciseDetails}>
            {currentExerciseData.sets && (
              <div className={styles.exerciseSpec}>
                <span className={styles.specLabel}>Sets</span>
                <span className={styles.specValue}>{currentExerciseData.sets}</span>
              </div>
            )}
            {currentExerciseData.reps && (
              <div className={styles.exerciseSpec}>
                <span className={styles.specLabel}>Reps</span>
                <span className={styles.specValue}>{currentExerciseData.reps}</span>
              </div>
            )}
            {currentExerciseData.rest && (
              <div className={styles.exerciseSpec}>
                <span className={styles.specLabel}>Rest</span>
                <span className={styles.specValue}>{currentExerciseData.rest}</span>
              </div>
            )}
          </div>

          {/* Instructions - Always Visible */}
          {currentExerciseData.instructions && (
            <div className={styles.instructions}>
              <h4>Instructions</h4>
              <ul>
                {currentExerciseData.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cues - Always Visible */}
          {currentExerciseData.cues && (
            <div className={styles.cues}>
              <h4>Coaching Cues</h4>
              <ul>
                {currentExerciseData.cues.map((cue, index) => (
                  <li key={index}>{cue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigationControls}>
        <button 
          className={styles.navBtn}
          onClick={prevExercise}
          disabled={currentPhase === 0 && currentExercise === 0}
        >
          ← Previous
        </button>
        
        <button 
          className={styles.nextBtn}
          onClick={nextExercise}
        >
          {currentPhase === phases.length - 1 && currentExercise === currentPhaseData.exercises.length - 1 
            ? 'Finish Workout' 
            : 'Next →'
          }
        </button>
      </div>
    </div>
  );
}
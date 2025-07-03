import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTechnique } from './TechniqueProvider';

interface ProgressContextValue {
  timeSpent: number;
  startTime: Date | null;
  isTracking: boolean;
  currentStreak: number;
  startTracking: () => void;
  stopTracking: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  updateStreak: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { userData, updateProgress, currentTechnique } = useTechnique();
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (userData) {
      setCurrentStreak(userData.progress.globalStats.currentStreak);
    }
  }, [userData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTracking && !isPaused && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setTimeSpent(elapsed);

        if (currentTechnique && elapsed % 10 === 0) {
          const techniqueProgress = userData?.progress.techniques[currentTechnique];
          const currentTotal = techniqueProgress?.totalTimeSpent || 0;
          
          updateProgress(currentTechnique, {
            totalTimeSpent: currentTotal + 10,
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTracking, isPaused, startTime, currentTechnique, userData, updateProgress]);

  const startTracking = () => {
    setStartTime(new Date());
    setTimeSpent(0);
    setIsTracking(true);
    setIsPaused(false);
  };

  const stopTracking = () => {
    if (currentTechnique && timeSpent > 0) {
      const techniqueProgress = userData?.progress.techniques[currentTechnique];
      const currentTotal = techniqueProgress?.totalTimeSpent || 0;
      
      updateProgress(currentTechnique, {
        totalTimeSpent: currentTotal + timeSpent,
      });
    }

    setIsTracking(false);
    setIsPaused(false);
    setStartTime(null);
    setTimeSpent(0);
  };

  const pauseTracking = () => {
    setIsPaused(true);
  };

  const resumeTracking = () => {
    setIsPaused(false);
  };

  const updateStreak = () => {
    if (!userData) return;

    const lastAccess = userData.lastSync;
    const today = new Date();
    const daysSinceLastAccess = Math.floor(
      (today.getTime() - new Date(lastAccess).getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = currentStreak;
    
    if (daysSinceLastAccess === 0) {
      return;
    } else if (daysSinceLastAccess === 1) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 1;
    }

    setCurrentStreak(newStreak);

    const longestStreak = Math.max(
      newStreak,
      userData.progress.globalStats.longestStreak
    );

    updateProgress('global', {
      status: 'in-progress',
      currentLesson: 0,
      completedLessons: [],
      assessmentScores: {},
      totalTimeSpent: 0,
      lastAccessed: new Date(),
      notes: '',
    });
  };

  const value: ProgressContextValue = {
    timeSpent,
    startTime,
    isTracking,
    currentStreak,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    updateStreak,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
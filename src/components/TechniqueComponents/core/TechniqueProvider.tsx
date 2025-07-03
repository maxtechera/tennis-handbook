import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserTechniqueData, TechniqueProgress, Achievement } from '../../../types/technique';

interface TechniqueContextValue {
  userData: UserTechniqueData | null;
  currentTechnique: string | null;
  currentLesson: string | null;
  isLoading: boolean;
  setCurrentTechnique: (techniqueId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  updateProgress: (techniqueId: string, progress: Partial<TechniqueProgress>) => void;
  completeLesson: (techniqueId: string, lessonId: string, score: number) => void;
  unlockAchievement: (achievementId: string) => void;
  saveProgress: () => void;
}

const TechniqueContext = createContext<TechniqueContextValue | null>(null);

const STORAGE_KEY = 'tennis-technique-progress';
const CURRENT_VERSION = '1.0.0';

export function TechniqueProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserTechniqueData | null>(null);
  const [currentTechnique, setCurrentTechnique] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as UserTechniqueData;
        if (data.version === CURRENT_VERSION) {
          setUserData(data);
        } else {
          migrateData(data);
        }
      } else {
        initializeUserData();
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      initializeUserData();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeUserData = () => {
    const newUserData: UserTechniqueData = {
      version: CURRENT_VERSION,
      userId: generateUserId(),
      profile: {
        id: generateUserId(),
        skillLevel: 'beginner',
        dominantHand: 'right',
        playingExperience: 0,
        weeklyPracticeHours: 0,
        goals: [],
        preferredLearningStyle: 'visual',
      },
      progress: {
        techniques: {},
        globalStats: {
          totalLessonsCompleted: 0,
          averageAssessmentScore: 0,
          currentStreak: 0,
          longestStreak: 0,
          favoriteTime: 'morning',
        },
      },
      achievements: [],
      preferences: {
        videoQuality: 'auto',
        autoplay: true,
        notifications: true,
        theme: 'light',
      },
      lastSync: new Date(),
    };
    setUserData(newUserData);
    saveToLocalStorage(newUserData);
  };

  const migrateData = (oldData: any) => {
    console.log('Migrating user data from version', oldData.version);
    initializeUserData();
  };

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveToLocalStorage = (data: UserTechniqueData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const updateProgress = (techniqueId: string, progress: Partial<TechniqueProgress>) => {
    if (!userData) return;

    const updatedData = {
      ...userData,
      progress: {
        ...userData.progress,
        techniques: {
          ...userData.progress.techniques,
          [techniqueId]: {
            ...userData.progress.techniques[techniqueId],
            ...progress,
            lastAccessed: new Date(),
          },
        },
      },
      lastSync: new Date(),
    };

    setUserData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const completeLesson = (techniqueId: string, lessonId: string, score: number) => {
    if (!userData) return;

    const techniqueProgress = userData.progress.techniques[techniqueId] || {
      status: 'not-started',
      currentLesson: 0,
      completedLessons: [],
      assessmentScores: {},
      totalTimeSpent: 0,
      lastAccessed: new Date(),
      notes: '',
    };

    const updatedProgress: TechniqueProgress = {
      ...techniqueProgress,
      completedLessons: [...new Set([...techniqueProgress.completedLessons, lessonId])],
      assessmentScores: {
        ...techniqueProgress.assessmentScores,
        [lessonId]: score,
      },
      currentLesson: techniqueProgress.currentLesson + 1,
      status: 'in-progress',
    };

    const totalLessons = techniqueProgress.completedLessons.length + 1;
    const totalScore = Object.values({
      ...techniqueProgress.assessmentScores,
      [lessonId]: score,
    }).reduce((sum, s) => sum + s, 0);

    const updatedData = {
      ...userData,
      progress: {
        ...userData.progress,
        techniques: {
          ...userData.progress.techniques,
          [techniqueId]: updatedProgress,
        },
        globalStats: {
          ...userData.progress.globalStats,
          totalLessonsCompleted: userData.progress.globalStats.totalLessonsCompleted + 1,
          averageAssessmentScore: totalScore / totalLessons,
        },
      },
      lastSync: new Date(),
    };

    setUserData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const unlockAchievement = (achievementId: string) => {
    if (!userData) return;

    const achievement = userData.achievements.find(a => a.id === achievementId);
    if (achievement && achievement.unlockedAt) return;

    const updatedAchievements = userData.achievements.map(a =>
      a.id === achievementId ? { ...a, unlockedAt: new Date() } : a
    );

    const updatedData = {
      ...userData,
      achievements: updatedAchievements,
      lastSync: new Date(),
    };

    setUserData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const saveProgress = () => {
    if (userData) {
      saveToLocalStorage(userData);
    }
  };

  const value: TechniqueContextValue = {
    userData,
    currentTechnique,
    currentLesson,
    isLoading,
    setCurrentTechnique,
    setCurrentLesson,
    updateProgress,
    completeLesson,
    unlockAchievement,
    saveProgress,
  };

  return (
    <TechniqueContext.Provider value={value}>
      {children}
    </TechniqueContext.Provider>
  );
}

export function useTechnique() {
  const context = useContext(TechniqueContext);
  if (!context) {
    throw new Error('useTechnique must be used within TechniqueProvider');
  }
  return context;
}
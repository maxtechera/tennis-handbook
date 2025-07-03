export type TechniqueCategory = 'forehand' | 'backhand' | 'serve' | 'volley' | 'return';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PracticeSpace = 'full-court' | 'half-court' | 'wall' | 'anywhere';
export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export interface TechniqueFrontmatter {
  id: string;
  title: string;
  category: TechniqueCategory;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  prerequisites: string[];
  objectives: string[];
  equipment: string[];
  space: PracticeSpace;
}

export interface VideoSegment {
  id: string;
  start: number;
  end: number;
  title: string;
  description?: string;
  slowMotion?: boolean;
}

export interface Annotation {
  id: string;
  timestamp: number;
  duration: number;
  content: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface Mistake {
  id: string;
  title: string;
  description: string;
  videoTimestamp?: number;
  correctionTips: string[];
}

export interface Assessment {
  id: string;
  questions: Question[];
  passingScore: number;
  retryAllowed: boolean;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'visual-recognition' | 'ordering';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Drill {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  duration: number;
  equipment: string[];
  space: PracticeSpace;
  repetitions?: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  variations?: DrillVariation[];
  videoUrl?: string;
}

export interface DrillVariation {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
}

export interface Lesson {
  id: string;
  techniqueId: string;
  order: number;
  title: string;
  slug: string;
  content: {
    introduction: string;
    keyPoints: string[];
    commonMistakes: Mistake[];
    videoSegments: VideoSegment[];
  };
  assessment?: Assessment;
  drills: Drill[];
}

export interface TechniqueProgress {
  status: LessonStatus;
  currentLesson: number;
  completedLessons: string[];
  assessmentScores: Record<string, number>;
  totalTimeSpent: number;
  lastAccessed: Date;
  notes: string;
}

export interface UserProfile {
  id: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  dominantHand: 'right' | 'left';
  playingExperience: number;
  weeklyPracticeHours: number;
  goals: string[];
  preferredLearningStyle: 'visual' | 'kinesthetic' | 'analytical';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserTechniqueData {
  version: string;
  userId: string;
  profile: UserProfile;
  progress: {
    techniques: Record<string, TechniqueProgress>;
    globalStats: {
      totalLessonsCompleted: number;
      averageAssessmentScore: number;
      currentStreak: number;
      longestStreak: number;
      favoriteTime: 'morning' | 'afternoon' | 'evening';
    };
  };
  achievements: Achievement[];
  preferences: {
    videoQuality: '360p' | '720p' | '1080p' | 'auto';
    autoplay: boolean;
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  lastSync: Date;
}
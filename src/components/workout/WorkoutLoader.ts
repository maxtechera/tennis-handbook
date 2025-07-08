// Workout Data Loader Utility
// This loads and parses YAML workout data

import { load } from 'js-yaml';

// Type definitions for workout data structure
export interface WorkoutMetadata {
  week: number;
  week_name: string;
  day: string;
  day_number: number;
  title: string;
  phase: string;
  phase_week: number;
  focus: string;
  volume_target: string;
  intensity_target: string;
  athlete_methods: string[];
  equipment_needed: string[];
}

export interface TimelineEntry {
  time_start: string;
  time_end: string;
  duration: number;
  category: string;
  activity: string;
  description: string;
  details?: string[];
  location: string;
}

export interface TennisDrill {
  name: string;
  type: string;
  sets: number;
  duration_per_set: number;
  intensity: string;
  rest_between?: string;
  targets?: string[];
  technical_focus?: string;
  description?: string;
}

export interface TennisTraining {
  category: string;
  total_duration: number;
  court_time: number;
  intensity_avg: string;
  drills: TennisDrill[];
}

export interface Exercise {
  exercise_id: string;
  name: string;
  category: string;
  muscle_groups: string[];
  sets: number;
  reps?: number;
  reps_per_side?: number;
  load: string;
  load_type?: string;
  load_metric?: string;
  velocity_target?: string;
  rest_seconds: number;
  tempo: string;
  tempo_description?: string;
  technique_cues: string[];
  alternatives?: Array<{
    name: string;
    reason: string;
  }>;
  setup?: string[];
  common_errors?: string[];
  range_of_motion?: string;
  purpose?: string;
  hold_time?: string;
}

export interface StrengthTraining {
  session_name: string;
  total_duration: number;
  exercise_count: number;
  primary_focus: string;
  secondary_focus: string;
  exercises: Exercise[];
}

export interface Metrics {
  volume: {
    tennis_minutes: number;
    strength_minutes: number;
    warmup_minutes: number;
    recovery_minutes: number;
    total_minutes: number;
  };
  intensity: {
    tennis_average: string;
    strength_average: string;
    overall_rpe: number;
  };
}

export interface WorkoutData {
  metadata: WorkoutMetadata;
  schedule: {
    total_duration: string;
    start_time: string;
    end_time: string;
  };
  timeline: TimelineEntry[];
  tennis_training: TennisTraining;
  warmup: any; // Define more specific type if needed
  strength_training: StrengthTraining;
  recovery_protocol: any; // Define more specific type if needed
  metrics: Metrics;
  coaching_notes: any; // Define more specific type if needed
  equipment: any; // Define more specific type if needed
  level_modifications?: any;
  week_integration?: any;
  tracking?: any;
}

// Cache for loaded workout data
const workoutCache = new Map<string, WorkoutData>();

/**
 * Load workout data from YAML file
 * @param week - Week number (1-12)
 * @param day - Day name (monday, tuesday, etc.)
 * @returns Parsed workout data
 */
export async function loadWorkoutData(week: number, day: string): Promise<WorkoutData> {
  const cacheKey = `${week}-${day}`;
  
  // Check cache first
  if (workoutCache.has(cacheKey)) {
    return workoutCache.get(cacheKey)!;
  }
  
  try {
    // In production, this would load from processed JSON files
    // For now, we'll import the data directly
    const response = await fetch(`/data/workouts/week-${week}/${day}.json`);
    const data = await response.json() as WorkoutData;
    
    // Cache the result
    workoutCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`Failed to load workout data for week ${week}, ${day}:`, error);
    throw error;
  }
}

/**
 * Get a summary of workout data for table views
 */
export function getWorkoutSummary(data: WorkoutData) {
  return {
    title: data.metadata.title,
    focus: data.metadata.focus,
    duration: data.schedule.total_duration,
    mainExercises: data.strength_training.exercises.slice(0, 3).map(ex => ({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps || ex.reps_per_side,
      load: ex.load
    })),
    tennisVolume: data.metrics.volume.tennis_minutes,
    totalVolume: data.metrics.volume.total_minutes,
    intensity: data.metadata.intensity_target
  };
}

/**
 * Get exercises by category
 */
export function getExercisesByCategory(data: WorkoutData, category: string) {
  return data.strength_training.exercises.filter(ex => ex.category === category);
}

/**
 * Format time range for display
 */
export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}
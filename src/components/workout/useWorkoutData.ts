// This file will be generated at build time by the workout-data-plugin
// It exports the workout data as static imports

import week1Monday from '@site/workout-data/week-1/monday.yml';

export const workoutData = {
  1: {
    monday: week1Monday,
  },
};

export function getWorkoutData(week: number, day: string) {
  return workoutData[week]?.[day] || null;
}
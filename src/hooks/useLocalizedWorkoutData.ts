import { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';

interface WorkoutData {
  [key: string]: any;
}

interface WorkoutDataPlugin {
  workouts: {
    [locale: string]: {
      [week: string]: {
        [day: string]: WorkoutData;
      };
    };
  };
}

/**
 * Hook to get localized workout data
 * @param week - Week number (1-12)
 * @param day - Day of the week (monday, tuesday, etc.)
 * @returns Workout data in the current locale with English fallback
 */
export function useLocalizedWorkoutData(week: number, day: string): WorkoutData | null {
  const { i18n } = useDocusaurusContext();
  const pluginData = usePluginData('workout-data-plugin') as WorkoutDataPlugin;
  const [workoutData, setWorkoutData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkoutData = async () => {
      setLoading(true);
      
      try {
        const currentLocale = i18n.currentLocale;
        const weekKey = `week-${week}`;
        
        let data: WorkoutData | null = null;
        
        // Try to get data from plugin first (build-time data)
        if (pluginData?.workouts) {
          // Try current locale first
          if (pluginData.workouts[currentLocale]?.[weekKey]?.[day]) {
            data = pluginData.workouts[currentLocale][weekKey][day];
          }
          // Fallback to English if not found
          else if (pluginData.workouts['en']?.[weekKey]?.[day]) {
            data = pluginData.workouts['en'][weekKey][day];
            console.warn(`Spanish translation not found for ${weekKey}/${day}, falling back to English`);
          }
        }
        
        // If not found in plugin data, try runtime loading
        if (!data) {
          try {
            // Try current locale first
            const response = await fetch(`/data/workouts/${currentLocale}/week-${week}/${day}.json`);
            if (response.ok) {
              data = await response.json();
            } else {
              // Fallback to English
              const fallbackResponse = await fetch(`/data/workouts/en/week-${week}/${day}.json`);
              if (fallbackResponse.ok) {
                data = await fallbackResponse.json();
                console.warn(`Spanish translation not found for ${weekKey}/${day}, falling back to English`);
              }
            }
          } catch (error) {
            console.error(`Error loading workout data for ${weekKey}/${day}:`, error);
          }
        }
        
        setWorkoutData(data);
      } catch (error) {
        console.error('Error in useLocalizedWorkoutData:', error);
        setWorkoutData(null);
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutData();
  }, [week, day, i18n.currentLocale, pluginData]);

  return workoutData;
}

/**
 * Hook to get all workout data for a specific week
 * @param week - Week number (1-12)
 * @returns Object with all days of the week data
 */
export function useLocalizedWeekData(week: number): { [day: string]: WorkoutData } {
  const { i18n } = useDocusaurusContext();
  const pluginData = usePluginData('workout-data-plugin') as WorkoutDataPlugin;
  const [weekData, setWeekData] = useState<{ [day: string]: WorkoutData }>({});

  useEffect(() => {
    const loadWeekData = async () => {
      try {
        const currentLocale = i18n.currentLocale;
        const weekKey = `week-${week}`;
        
        let data: { [day: string]: WorkoutData } = {};
        
        // Try to get data from plugin first
        if (pluginData?.workouts) {
          // Try current locale first
          if (pluginData.workouts[currentLocale]?.[weekKey]) {
            data = pluginData.workouts[currentLocale][weekKey];
          }
          // Fill in missing days with English fallback
          else if (pluginData.workouts['en']?.[weekKey]) {
            data = pluginData.workouts['en'][weekKey];
            console.warn(`Spanish translations not found for ${weekKey}, falling back to English`);
          }
        }
        
        setWeekData(data);
      } catch (error) {
        console.error('Error in useLocalizedWeekData:', error);
        setWeekData({});
      }
    };

    loadWeekData();
  }, [week, i18n.currentLocale, pluginData]);

  return weekData;
}

/**
 * Hook to check if a Spanish translation exists for a workout
 * @param week - Week number (1-12)
 * @param day - Day of the week
 * @returns Boolean indicating if Spanish translation exists
 */
export function useTranslationExists(week: number, day: string): boolean {
  const pluginData = usePluginData('workout-data-plugin') as WorkoutDataPlugin;
  const weekKey = `week-${week}`;
  
  return !!(pluginData?.workouts?.['es']?.[weekKey]?.[day]);
}
import React from 'react';
import WorkoutCarousel from '@site/src/components/WorkoutCarousel';
// Import YAML directly - webpack will process this at build time
import workoutData from '@site/workout-data/week-1/monday.yml';

// This component renders the WorkoutCarousel with data from the build-time processed YAML
export function WorkoutCarouselFromData({ week, day }: { week: number; day: string }) {
  // For now, we're importing the specific file, but this could be dynamic based on week/day
  const data = workoutData;
  
  if (!data) return null;
  
  // Transform the schedule data into WorkoutCarousel phases
  const phases = (data.schedule?.blocks || [])
    .filter(entry => entry.phase_id) // Only entries with phase_id are carousel phases
    .map(entry => {
      // Get exercises for this phase
      let exercises = [];
      
      switch (entry.phase_id) {
        case 'morning':
          exercises = [
            {
              name: 'Yoga Flow',
              sets: '1',
              reps: '20 min',
              videoUrl: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'yoga_flow')?.video_url,
              instructions: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'yoga_flow')?.detailed_instructions || [],
              cues: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'yoga_flow')?.cues || []
            },
            {
              name: 'Breathing Protocol',
              sets: '1',
              reps: '5 min',
              instructions: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'breathing_protocol')?.detailed_instructions || [],
              cues: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'breathing_protocol')?.cues || []
            },
            {
              name: 'HRV Measurement',
              sets: '1',
              reps: '1 reading',
              instructions: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'hrv_measurement')?.detailed_instructions || [],
              cues: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'hrv_measurement')?.cues || []
            },
            {
              name: 'Movement Quality Screen',
              sets: '1',
              reps: '5 squats',
              instructions: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'movement_screen')?.detailed_instructions || [],
              cues: data.preparation_phases?.find(p => p.id === 'morning_protocol')?.components?.find(c => c.id === 'movement_screen')?.cues || []
            }
          ];
          break;
          
        case 'tennis':
          exercises = data.tennis_training?.alcaraz_integration?.warm_up?.exercises || [];
          break;
          
        case 'movement':
          exercises = data.movement_preparation?.exercises?.map(ex => ({
            name: ex.name,
            sets: ex.sets.toString(),
            reps: ex.reps,
            videoUrl: ex.video_url,
            instructions: ex.detailed_instructions || [],
            cues: ex.cues || []
          })) || [];
          break;
          
        case 'strength':
          exercises = data.strength_training?.main_exercises?.map(ex => ({
            name: ex.name,
            sets: ex.sets.toString(),
            reps: `${ex.reps} @ ${ex.load}`,
            rest: `${Math.floor(ex.rest_seconds / 60)} minutes`,
            videoUrl: ex.video_url,
            instructions: ex.detailed_instructions || [],
            cues: ex.technique_cues || []
          })) || [];
          break;
          
        case 'recovery':
          exercises = [
            {
              name: 'Contrast Shower',
              sets: data.recovery_protocol?.contrast_shower?.cycles?.toString() || '3',
              reps: '30s hot/30s cold',
              instructions: data.recovery_protocol?.contrast_shower?.detailed_instructions || [],
              cues: data.recovery_protocol?.contrast_shower?.cues || []
            },
            {
              name: 'HRV Breathing',
              sets: '1',
              reps: '5 minutes',
              instructions: data.recovery_protocol?.hrv_breathing?.detailed_instructions || [],
              cues: data.recovery_protocol?.hrv_breathing?.cues || []
            },
            {
              name: 'Session Documentation',
              sets: '1',
              reps: '4 minutes',
              instructions: data.recovery_protocol?.session_documentation?.detailed_instructions || [],
              cues: data.recovery_protocol?.session_documentation?.cues || []
            }
          ];
          break;
      }
      
      return {
        id: entry.phase_id,
        title: entry.phase_title,
        duration: `${entry.duration} min`,
        timeRange: `${entry.time_start}-${entry.time_end}`,
        icon: entry.phase_icon,
        exercises
      };
    });
  
  return (
    <WorkoutCarousel 
      workoutTitle={`Monday - ${data.metadata.title}`}
      phases={phases}
    />
  );
}

// Export other data transformation functions
export function getPreWeekAssessment() {
  return workoutData.assessments?.find(a => a.id === 'pre_week_assessment');
}

export function getMorningProtocol() {
  return workoutData.preparation_phases?.find(p => p.id === 'morning_protocol');
}

export function getTennisTraining() {
  return workoutData.tennis_training;
}

export function getMovementPrep() {
  return workoutData.movement_preparation;
}

export function getStrengthTraining() {
  return workoutData.strength_training;
}

export function getRecoveryProtocol() {
  return workoutData.recovery_protocol;
}
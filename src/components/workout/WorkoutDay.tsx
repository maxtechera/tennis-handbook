import React, { useEffect, useState } from 'react';
import { loadWorkoutData, WorkoutData, formatTimeRange, formatDuration } from './WorkoutLoader';
import styles from './WorkoutDay.module.css';

interface WorkoutDayProps {
  week: number;
  day: string;
  view?: 'full' | 'summary';
}

export default function WorkoutDay({ week, day, view = 'full' }: WorkoutDayProps) {
  const [data, setData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkoutData(week, day)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [week, day]);

  if (loading) return <div>Loading workout data...</div>;
  if (error) return <div>Error loading workout: {error}</div>;
  if (!data) return null;

  return (
    <div className={styles.workoutDay}>
      <DayHeader metadata={data.metadata} />
      <ScheduleOverview schedule={data.schedule} metrics={data.metrics} />
      <DayScheduleTable timeline={data.timeline} />
      
      {data.tennis_training && (
        <TennisTrainingSection training={data.tennis_training} />
      )}
      
      {data.strength_training && (
        <GymSessionSection training={data.strength_training} view={view} />
      )}
      
      {view === 'full' && (
        <>
          <RecoverySection protocol={data.recovery_protocol} />
          <KeyFocusPoints notes={data.coaching_notes} />
          <EquipmentSection equipment={data.equipment} />
        </>
      )}
    </div>
  );
}

// Sub-components

function DayHeader({ metadata }: { metadata: WorkoutData['metadata'] }) {
  return (
    <div className={styles.dayHeader}>
      <h1>{metadata.title}</h1>
      <div className={styles.metadata}>
        <span className={styles.phase}>{metadata.phase}</span>
        <span className={styles.focus}>{metadata.focus}</span>
        <span className={styles.intensity}>Intensity: {metadata.intensity_target}</span>
      </div>
      {metadata.athlete_methods.length > 0 && (
        <div className={styles.methods}>
          <strong>Elite Methods:</strong> {metadata.athlete_methods.join(', ')}
        </div>
      )}
    </div>
  );
}

function ScheduleOverview({ schedule, metrics }: { 
  schedule: WorkoutData['schedule'];
  metrics: WorkoutData['metrics'];
}) {
  return (
    <div className={styles.scheduleOverview}>
      <div className={styles.timeBlock}>
        <span className={styles.label}>Total Duration:</span>
        <span className={styles.value}>{schedule.total_duration}</span>
      </div>
      <div className={styles.timeBlock}>
        <span className={styles.label}>Schedule:</span>
        <span className={styles.value}>{formatTimeRange(schedule.start_time, schedule.end_time)}</span>
      </div>
      <div className={styles.timeBlock}>
        <span className={styles.label}>Tennis:</span>
        <span className={styles.value}>{formatDuration(metrics.volume.tennis_minutes)}</span>
      </div>
      <div className={styles.timeBlock}>
        <span className={styles.label}>Gym:</span>
        <span className={styles.value}>{formatDuration(metrics.volume.strength_minutes)}</span>
      </div>
    </div>
  );
}

function DayScheduleTable({ timeline }: { timeline: WorkoutData['timeline'] }) {
  return (
    <div className={styles.scheduleSection}>
      <h2>📅 Daily Schedule</h2>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Activity</th>
            <th>Duration</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((entry, idx) => (
            <tr key={idx}>
              <td>{formatTimeRange(entry.time_start, entry.time_end)}</td>
              <td>
                <strong>{entry.activity}</strong>
                {entry.category && <span className={styles.category}> ({entry.category})</span>}
              </td>
              <td>{formatDuration(entry.duration)}</td>
              <td>
                {entry.description}
                {entry.details && (
                  <ul className={styles.detailsList}>
                    {entry.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TennisTrainingSection({ training }: { training: WorkoutData['tennis_training'] }) {
  return (
    <div className={styles.tennisSection}>
      <h2>🎾 Tennis Training Details</h2>
      <div className={styles.trainingMeta}>
        <span>Category: {training.category}</span>
        <span>Duration: {formatDuration(training.total_duration)}</span>
        <span>Average Intensity: {training.intensity_avg}</span>
      </div>
      
      <table className={styles.drillsTable}>
        <thead>
          <tr>
            <th>Drill</th>
            <th>Sets</th>
            <th>Duration</th>
            <th>Intensity</th>
            <th>Focus</th>
          </tr>
        </thead>
        <tbody>
          {training.drills.map((drill, idx) => (
            <tr key={idx}>
              <td>
                <strong>{drill.name}</strong>
                {drill.description && <div className={styles.drillDesc}>{drill.description}</div>}
              </td>
              <td>{drill.sets}</td>
              <td>{drill.duration_per_set} min</td>
              <td>{drill.intensity}</td>
              <td>
                {drill.technical_focus}
                {drill.targets && (
                  <div className={styles.targets}>
                    Targets: {drill.targets.join(', ')}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GymSessionSection({ training, view }: { 
  training: WorkoutData['strength_training'];
  view: 'full' | 'summary';
}) {
  return (
    <div className={styles.gymSection}>
      <h2>💪 Gym Session: {training.session_name}</h2>
      <div className={styles.sessionMeta}>
        <span>Duration: {formatDuration(training.total_duration)}</span>
        <span>Exercises: {training.exercise_count}</span>
        <span>Focus: {training.primary_focus}</span>
      </div>
      
      <table className={styles.exerciseTable}>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets×Reps</th>
            <th>Load/Speed</th>
            <th>Rest</th>
            <th>Tempo</th>
            {view === 'full' && (
              <>
                <th>Key Cues</th>
                <th>Alternatives</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {training.exercises.map((exercise) => (
            <tr key={exercise.exercise_id}>
              <td>
                <strong>{exercise.name}</strong>
                {view === 'full' && exercise.muscle_groups && (
                  <div className={styles.muscleGroups}>
                    {exercise.muscle_groups.join(', ')}
                  </div>
                )}
              </td>
              <td>
                {exercise.sets}×{exercise.reps || `${exercise.reps_per_side}/side`}
              </td>
              <td>
                {exercise.load}
                {exercise.velocity_target && (
                  <div className={styles.velocity}>({exercise.velocity_target})</div>
                )}
              </td>
              <td>{Math.floor(exercise.rest_seconds / 60)} min</td>
              <td>{exercise.tempo}</td>
              {view === 'full' && (
                <>
                  <td>
                    <ul className={styles.cuesList}>
                      {exercise.technique_cues.map((cue, idx) => (
                        <li key={idx}>{cue}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {exercise.alternatives?.map((alt, idx) => (
                      <div key={idx} className={styles.alternative}>
                        <strong>{alt.name}</strong>
                        <span>{alt.reason}</span>
                      </div>
                    ))}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecoverySection({ protocol }: { protocol: any }) {
  if (!protocol) return null;
  
  return (
    <div className={styles.recoverySection}>
      <h2>🧘 Recovery Protocol</h2>
      <div className={styles.recoveryContent}>
        {protocol.components?.map((component: any, idx: number) => (
          <div key={idx} className={styles.recoveryComponent}>
            <h3>{component.name} ({component.duration} min)</h3>
            {component.details && (
              <ul>
                {component.details.map((detail: string, i: number) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyFocusPoints({ notes }: { notes: any }) {
  if (!notes) return null;
  
  return (
    <div className={styles.notesSection}>
      <h2>📝 Key Focus Points</h2>
      {notes.technical_focus && (
        <div>
          <h3>Technical Focus:</h3>
          <ul>
            {notes.technical_focus.map((point: string, idx: number) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      {notes.load_management && (
        <div>
          <h3>Load Management:</h3>
          <ul>
            {notes.load_management.map((point: string, idx: number) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EquipmentSection({ equipment }: { equipment: any }) {
  if (!equipment) return null;
  
  return (
    <div className={styles.equipmentSection}>
      <h2>🏋️ Equipment Needed</h2>
      <div className={styles.equipmentGrid}>
        {Object.entries(equipment).map(([category, items]: [string, any]) => (
          <div key={category} className={styles.equipmentCategory}>
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <ul>
              {items.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
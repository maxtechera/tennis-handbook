import React, { useEffect, useState } from 'react';
import { loadWorkoutData, WorkoutData, formatTimeRange } from './WorkoutLoader';
import styles from './WorkoutProgramTable.module.css';

interface WorkoutProgramTableProps {
  week: number;
  view?: 'detailed' | 'summary';
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function WorkoutProgramTable({ week, view = 'detailed' }: WorkoutProgramTableProps) {
  const [weekData, setWeekData] = useState<Record<string, WorkoutData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeekData = async () => {
      try {
        const promises = DAYS.map(day => loadWorkoutData(week, day));
        const results = await Promise.all(promises);
        
        const data: Record<string, WorkoutData> = {};
        DAYS.forEach((day, index) => {
          data[day] = results[index];
        });
        
        setWeekData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWeekData();
  }, [week]);

  if (loading) return <div>Loading week {week} data...</div>;
  if (error) return <div>Error loading week data: {error}</div>;

  const firstDay = weekData[DAYS[0]];
  if (!firstDay) return null;

  return (
    <div className={styles.weekTable}>
      <div className={styles.weekHeader}>
        <h3>Week {week}: {firstDay.metadata.week_name}</h3>
        <p>Phase: {firstDay.metadata.phase} | Focus: {firstDay.metadata.focus}</p>
      </div>

      {DAYS.map(day => {
        const data = weekData[day];
        if (!data) return null;

        return (
          <div key={day} className={styles.daySection}>
            <h4 className={styles.dayTitle}>
              📅 {day.charAt(0).toUpperCase() + day.slice(1)} - {data.metadata.title}
            </h4>

            {/* Schedule Table */}
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
                {data.timeline.slice(0, view === 'summary' ? 5 : undefined).map((entry, idx) => (
                  <tr key={idx}>
                    <td>{formatTimeRange(entry.time_start, entry.time_end)}</td>
                    <td>{entry.activity}</td>
                    <td>{entry.duration} min</td>
                    <td>{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Gym Session Details */}
            {data.strength_training && view === 'detailed' && (
              <>
                <h5 className={styles.sessionTitle}>
                  {data.metadata.day === 'saturday' || data.metadata.day === 'sunday' 
                    ? 'Activity Details:' 
                    : `${data.metadata.day.charAt(0).toUpperCase() + data.metadata.day.slice(1)} Gym Session Details:`}
                </h5>
                <table className={styles.exerciseTable}>
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets×Reps</th>
                      <th>Load/Speed</th>
                      <th>Rest</th>
                      <th>Tempo</th>
                      <th>Key Cues</th>
                      <th>Alternatives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.strength_training.exercises.map((exercise, idx) => (
                      <tr key={idx}>
                        <td>{exercise.name}</td>
                        <td>
                          {exercise.sets}×{exercise.reps || `${exercise.reps_per_side}/leg`}
                        </td>
                        <td>
                          {exercise.load}
                          {exercise.velocity_target && ` (${exercise.velocity_target})`}
                        </td>
                        <td>{Math.floor(exercise.rest_seconds / 60)} min</td>
                        <td>{exercise.tempo}</td>
                        <td>{exercise.technique_cues[0]}</td>
                        <td>{exercise.alternatives?.[0]?.name || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Special handling for Saturday/Sunday */}
            {(day === 'saturday' || day === 'sunday') && view === 'detailed' && (
              <RecoveryOptions day={day} data={data} />
            )}
          </div>
        );
      })}

      {/* Week Summary */}
      <WeekSummary weekData={weekData} />
    </div>
  );
}

function RecoveryOptions({ day, data }: { day: string; data: WorkoutData }) {
  if (day === 'saturday') {
    return (
      <div className={styles.recoveryOptions}>
        <div className={styles.option}>
          <h5>Option A: Match Play</h5>
          <table className={styles.optionTable}>
            <tbody>
              <tr>
                <td>7:30-8:00</td>
                <td>Pre-Match</td>
                <td>30 min</td>
                <td>Dynamic warm-up, shadow swings, progressive hitting</td>
              </tr>
              <tr>
                <td>8:00-10:00</td>
                <td>Competition</td>
                <td>2 hours</td>
                <td>Best of 3 sets match play</td>
              </tr>
              <tr>
                <td>10:00-10:30</td>
                <td>Cool-down</td>
                <td>30 min</td>
                <td>Light movement + stretching</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className={styles.option}>
          <h5>Option B: Active Recovery</h5>
          <table className={styles.optionTable}>
            <tbody>
              <tr>
                <td>8:00-8:30</td>
                <td>Light Tennis</td>
                <td>30 min</td>
                <td>Fun rallies, no pressure</td>
              </tr>
              <tr>
                <td>8:30-9:00</td>
                <td>Zone 2 Cardio</td>
                <td>30 min</td>
                <td>Bike or swim</td>
              </tr>
              <tr>
                <td>9:00-9:30</td>
                <td>Yoga Flow</td>
                <td>30 min</td>
                <td>Restorative focus</td>
              </tr>
              <tr>
                <td>9:30-10:00</td>
                <td>Massage/Therapy</td>
                <td>30 min</td>
                <td>Foam rolling or professional treatment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (day === 'sunday') {
    return (
      <div className={styles.recoveryDay}>
        <table className={styles.optionTable}>
          <tbody>
            <tr>
              <td>8:00-8:20</td>
              <td>Morning Yoga</td>
              <td>20 min</td>
              <td>Djokovic gentle flow</td>
            </tr>
            <tr>
              <td>8:20-8:30</td>
              <td>Breathing</td>
              <td>10 min</td>
              <td>4-7-8 protocol (10 cycles)</td>
            </tr>
            <tr>
              <td>9:00-9:30</td>
              <td>Foam Rolling</td>
              <td>30 min</td>
              <td>Full body systematic approach</td>
            </tr>
            <tr>
              <td>10:00-10:15</td>
              <td>HRV Analysis</td>
              <td>15 min</td>
              <td>Review week's data, plan adjustments</td>
            </tr>
            <tr>
              <td>Afternoon</td>
              <td>Meal Prep</td>
              <td>2 hours</td>
              <td>Prepare nutrition for upcoming week</td>
            </tr>
            <tr>
              <td>Evening</td>
              <td>Early Sleep</td>
              <td>-</td>
              <td>Target 9+ hours for maximum recovery</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

function WeekSummary({ weekData }: { weekData: Record<string, WorkoutData> }) {
  // Calculate week totals
  let totalTennisMinutes = 0;
  let totalGymMinutes = 0;
  let totalRecoveryMinutes = 0;

  Object.values(weekData).forEach(data => {
    if (data.metrics) {
      totalTennisMinutes += data.metrics.volume.tennis_minutes || 0;
      totalGymMinutes += data.metrics.volume.strength_minutes || 0;
      totalRecoveryMinutes += data.metrics.volume.recovery_minutes || 0;
    }
  });

  const totalMinutes = totalTennisMinutes + totalGymMinutes + totalRecoveryMinutes;

  return (
    <div className={styles.weekSummary}>
      <h4>Week {weekData.monday?.metadata.week} Key Performance Indicators:</h4>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Volume:</span>
          <span className={styles.summaryValue}>{weekData.monday?.metadata.volume_target}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Intensity:</span>
          <span className={styles.summaryValue}>{weekData.monday?.metadata.intensity_target}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Tennis Volume:</span>
          <span className={styles.summaryValue}>{Math.round(totalTennisMinutes / 60)} hours</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Gym Volume:</span>
          <span className={styles.summaryValue}>{Math.round(totalGymMinutes / 60)} hours</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Training:</span>
          <span className={styles.summaryValue}>{Math.round(totalMinutes / 60)} hours</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Weekly Load:</span>
          <span className={styles.summaryValue}>{weekData.monday?.metadata.week === 1 ? '420' : 'TBD'} AU</span>
        </div>
      </div>
    </div>
  );
}
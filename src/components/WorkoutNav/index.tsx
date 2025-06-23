import React from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import './styles.css';

interface WorkoutNavProps {
  weekNumber: number;
}

export default function WorkoutNav({ weekNumber }: WorkoutNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const days = [
    { key: 'index', label: '📋 Week Overview', path: `/docs/workouts/week-${weekNumber}/` },
    { key: 'monday', label: '💪 Monday', path: `/docs/workouts/week-${weekNumber}/monday` },
    { key: 'tuesday', label: '🎯 Tuesday', path: `/docs/workouts/week-${weekNumber}/tuesday` },
    { key: 'wednesday', label: '⚡ Wednesday', path: `/docs/workouts/week-${weekNumber}/wednesday` },
    { key: 'thursday', label: '🏃‍♂️ Thursday', path: `/docs/workouts/week-${weekNumber}/thursday` },
    { key: 'friday', label: '🔥 Friday', path: `/docs/workouts/week-${weekNumber}/friday` },
    { key: 'saturday', label: '🎾 Saturday', path: `/docs/workouts/week-${weekNumber}/saturday` },
    { key: 'sunday', label: '🧘‍♂️ Sunday', path: `/docs/workouts/week-${weekNumber}/sunday` },
  ];

  // Determine previous and next week paths
  const getPrevWeekPath = () => {
    if (weekNumber <= 1) return null; // No previous week before week 1
    return `/docs/workouts/week-${weekNumber - 1}`;
  };

  const getNextWeekPath = () => {
    if (weekNumber >= 12) return null; // No next week after week 12
    return `/docs/workouts/week-${weekNumber + 1}`;
  };

  const prevWeekPath = getPrevWeekPath();
  const nextWeekPath = getNextWeekPath();

  return (
    <div className="workout-nav">
      <div className="workout-nav__container">
      {prevWeekPath && (
        <Link
          to={prevWeekPath}
          className="workout-nav__prev-week"
        >
          <span className="workout-nav__prev-week-arrow">←</span>
          <span className="workout-nav__prev-week-text">
            Week {weekNumber - 1}
          </span>
        </Link>
      )}

      {days.map((day) => {
        const isActive = currentPath === day.path || 
                        (day.key === 'index' && currentPath === `/docs/workouts/week-${weekNumber}/index`);
        
        return (
          <Link
            key={day.key}
            to={day.path}
            className={`workout-nav__tab ${isActive ? 'workout-nav__tab--active' : ''}`}
          >
            {day.label}
          </Link>
        );
      })}
      
      {nextWeekPath && (
        <Link
          to={nextWeekPath}
          className="workout-nav__next-week"
        >
          <span className="workout-nav__next-week-arrow">→</span>
          <span className="workout-nav__next-week-text">
            Next Week {weekNumber + 1}
          </span>
        </Link>
      )}
      </div>
    </div>
  );
}
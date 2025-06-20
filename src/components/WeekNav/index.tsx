import React from 'react';
import Link from '@docusaurus/Link';
import './styles.css';

interface WeekNavProps {
  currentWeek: number;
}

export default function WeekNav({ currentWeek }: WeekNavProps) {
  const weeks = [
    { 
      number: 1, 
      title: 'Foundation', 
      path: '/docs/workouts/week-1',
      phase: 'foundation',
      description: 'Building the Base'
    },
    { 
      number: 2, 
      title: 'Foundation+', 
      path: '/docs/workouts/week-2-plan',
      phase: 'foundation',
      description: 'Progression'
    },
    { 
      number: 3, 
      title: 'Foundation Peak', 
      path: '/docs/workouts/week-3-plan',
      phase: 'foundation',
      description: 'Completion'
    },
    { 
      number: 4, 
      title: 'Development', 
      path: '/docs/workouts/week-4-plan',
      phase: 'development',
      description: 'Power Introduction'
    },
    { 
      number: 5, 
      title: 'Development+', 
      path: '/docs/workouts/week-5-plan',
      phase: 'development',
      description: 'Intensity Ramp'
    },
    { 
      number: 6, 
      title: 'Development Peak', 
      path: '/docs/workouts/week-6-plan',
      phase: 'development',
      description: 'Power Mastery'
    },
    { 
      number: 7, 
      title: 'Intensification', 
      path: '/docs/workouts/week-7-plan',
      phase: 'intensification',
      description: 'Maximum Strength'
    },
    { 
      number: 8, 
      title: 'Intensification+', 
      path: '/docs/workouts/week-8-plan',
      phase: 'intensification',
      description: 'Advanced Methods'
    },
    { 
      number: 9, 
      title: 'Intensification Peak', 
      path: '/docs/workouts/week-9-plan',
      phase: 'intensification',
      description: 'Complex Training'
    },
    { 
      number: 10, 
      title: 'Peaking', 
      path: '/docs/workouts/week-10-plan',
      phase: 'peaking',
      description: 'Neural Sharpening'
    },
    { 
      number: 11, 
      title: 'Peaking+', 
      path: '/docs/workouts/week-11-plan',
      phase: 'peaking',
      description: 'Competition Prep'
    },
    { 
      number: 12, 
      title: 'Elite Peak', 
      path: '/docs/workouts/week-12-plan',
      phase: 'peaking',
      description: 'Championship Ready'
    },
  ];

  const currentWeekIndex = weeks.findIndex(week => week.number === currentWeek);
  const prevWeek = currentWeekIndex > 0 ? weeks[currentWeekIndex - 1] : null;
  const nextWeek = currentWeekIndex < weeks.length - 1 ? weeks[currentWeekIndex + 1] : null;
  const currentWeekData = weeks[currentWeekIndex];

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'foundation': return '#10b981';
      case 'development': return '#3b82f6';
      case 'intensification': return '#f59e0b';
      case 'peaking': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case 'foundation': return '🌱';
      case 'development': return '⚡';
      case 'intensification': return '🔥';
      case 'peaking': return '🏆';
      default: return '📅';
    }
  };

  return (
    <div className="week-nav">
      {/* Current Week Header */}
      <div 
        className="week-nav__header"
        style={{ '--phase-color': getPhaseColor(currentWeekData?.phase || '') }}
      >
        <div className="week-nav__current">
          <span className="week-nav__emoji">
            {getPhaseEmoji(currentWeekData?.phase || '')}
          </span>
          <div className="week-nav__current-info">
            <div className="week-nav__current-week">Week {currentWeek}</div>
            <div className="week-nav__current-title">{currentWeekData?.title}</div>
            <div className="week-nav__current-desc">{currentWeekData?.description}</div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="week-nav__controls">
        {prevWeek && (
          <Link to={prevWeek.path} className="week-nav__button week-nav__button--prev">
            <span className="week-nav__button-arrow">←</span>
            <div className="week-nav__button-content">
              <div className="week-nav__button-label">Previous</div>
              <div className="week-nav__button-title">Week {prevWeek.number}: {prevWeek.title}</div>
            </div>
          </Link>
        )}

        <Link to="/docs/workouts/overview" className="week-nav__button week-nav__button--overview">
          <span className="week-nav__button-icon">📋</span>
          <div className="week-nav__button-content">
            <div className="week-nav__button-title">Program Overview</div>
          </div>
        </Link>

        {nextWeek && (
          <Link to={nextWeek.path} className="week-nav__button week-nav__button--next">
            <div className="week-nav__button-content">
              <div className="week-nav__button-label">Next</div>
              <div className="week-nav__button-title">Week {nextWeek.number}: {nextWeek.title}</div>
            </div>
            <span className="week-nav__button-arrow">→</span>
          </Link>
        )}
      </div>
      
      {/* Week Grid for Quick Access */}
      <details className="week-nav__grid-toggle">
        <summary>📅 Jump to Any Week</summary>
        <div className="week-nav__grid">
          {weeks.map((week) => (
            <Link
              key={week.number}
              to={week.path}
              className={`week-nav__grid-item ${week.number === currentWeek ? 'week-nav__grid-item--active' : ''}`}
              style={{ '--phase-color': getPhaseColor(week.phase) }}
            >
              <div className="week-nav__grid-number">W{week.number}</div>
              <div className="week-nav__grid-title">{week.title}</div>
            </Link>
          ))}
        </div>
      </details>
    </div>
  );
}
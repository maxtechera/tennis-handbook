import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface Phase {
  id: string;
  title: string;
  description: string;
  weeks: Week[];
  color: string;
}

interface Week {
  id: string;
  title: string;
  path: string;
}

const programPhases: Phase[] = [
  {
    id: 'foundation',
    title: '🌱 Foundation Phase',
    description: 'Weeks 1-3: Building movement patterns and base fitness',
    color: '#10b981',
    weeks: [
      { id: 'week-1', title: 'Week 1', path: '/docs/workouts/week-1' },
      { id: 'week-2', title: 'Week 2', path: '/docs/workouts/week-2' },
      { id: 'week-3', title: 'Week 3', path: '/docs/workouts/week-3' },
    ],
  },
  {
    id: 'development',
    title: '⚡ Development Phase',
    description: 'Weeks 4-6: Progressive loading and power introduction',
    color: '#3b82f6',
    weeks: [
      { id: 'week-4', title: 'Week 4', path: '/docs/workouts/week-4' },
      { id: 'week-5', title: 'Week 5', path: '/docs/workouts/week-5' },
      { id: 'week-6', title: 'Week 6', path: '/docs/workouts/week-6' },
    ],
  },
  {
    id: 'intensification',
    title: '🔥 Intensification Phase',
    description: 'Weeks 7-9: Maximum strength and advanced methods',
    color: '#f59e0b',
    weeks: [
      { id: 'week-7', title: 'Week 7', path: '/docs/workouts/week-7' },
      { id: 'week-8', title: 'Week 8', path: '/docs/workouts/week-8' },
      { id: 'week-9', title: 'Week 9', path: '/docs/workouts/week-9' },
    ],
  },
  {
    id: 'peaking',
    title: '🏆 Peaking Phase',
    description: 'Weeks 10-12: Competition preparation and peak performance',
    color: '#ef4444',
    weeks: [
      { id: 'week-10', title: 'Week 10', path: '/docs/workouts/week-10' },
      { id: 'week-11', title: 'Week 11', path: '/docs/workouts/week-11' },
      { id: 'week-12', title: 'Week 12', path: '/docs/workouts/week-12' },
    ],
  },
];

export default function ProgramNavigator(): JSX.Element {
  return (
    <div className={styles.programNavigator}>
      <div className={styles.header}>
        <h2>🚀 Quick Program Navigation</h2>
        <p>Jump directly to any phase or week of the 12-Week Elite Tennis Training Program</p>
      </div>

      <div className={styles.phasesGrid}>
        {programPhases.map((phase) => (
          <div key={phase.id} className={styles.phaseCard} style={{ '--phase-color': phase.color }}>
            <div className={styles.phaseHeader}>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
            
            <div className={styles.weeksGrid}>
              {phase.weeks.map((week) => (
                <Link
                  key={week.id}
                  to={week.path}
                  className={styles.weekButton}
                >
                  {week.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickLinks}>
        <h3>⚡ Quick Access</h3>
        <div className={styles.quickLinksGrid}>
          <Link to="/docs/workouts/week-1" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>🎯</span>
            <div>
              <strong>Start Here</strong>
              <small>Begin Week 1</small>
            </div>
          </Link>
          
          <Link to="/docs/assessment/assessment-monitoring" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>📊</span>
            <div>
              <strong>Assessment</strong>
              <small>Test & Monitor</small>
            </div>
          </Link>

          <Link to="/docs/equipment-guide" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>🏋️</span>
            <div>
              <strong>Equipment</strong>
              <small>What You Need</small>
            </div>
          </Link>

          <Link to="/docs/troubleshooting" className={styles.quickLink}>
            <span className={styles.quickLinkIcon}>🔧</span>
            <div>
              <strong>Help</strong>
              <small>Troubleshooting</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
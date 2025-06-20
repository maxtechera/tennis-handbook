import React from 'react';
import WorkoutNav from '../WorkoutNav';

interface WorkoutLayoutProps {
  children: React.ReactNode;
  weekNumber: number;
}

export default function WorkoutLayout({ children, weekNumber }: WorkoutLayoutProps) {
  return (
    <>
      <WorkoutNav weekNumber={weekNumber} />
      {children}
    </>
  );
}
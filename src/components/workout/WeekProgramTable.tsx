import React from 'react';
import styles from './WeekProgramTable.module.css';
import { useLocalizedWeekData } from '@site/src/hooks/useLocalizedWorkoutData';

export function WeekProgramTable() {
  const week1Data = useLocalizedWeekData(1);
  
  const getDayName = (dayData: any, dayKey: string) => {
    return dayData.metadata?.day_name || 
           dayData.metadata?.day?.charAt(0).toUpperCase() + dayData.metadata?.day?.slice(1) || 
           dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
  };

  const formatTime = (seconds: number): string => {
    if (seconds >= 60) {
      return `${Math.round(seconds / 60)} min`;
    }
    return `${seconds} sec`;
  };

  const formatRestTime = (exercise: any): string => {
    if (exercise.rest_seconds) {
      return formatTime(exercise.rest_seconds);
    }
    if (exercise.rest) {
      return exercise.rest;
    }
    return '-';
  };

  const renderWorkoutDay = (dayKey: string, dayData: any) => {
    const dayName = getDayName(dayData, dayKey);
    const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
    
    const toggleSection = (sectionId: string) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(sectionId)) {
        newExpanded.delete(sectionId);
      } else {
        newExpanded.add(sectionId);
      }
      setExpandedSections(newExpanded);
    };

    const expandAll = () => {
      setExpandedSections(new Set(sections.map(s => s.id)));
    };

    const collapseAll = () => {
      setExpandedSections(new Set());
    };
    
    // Build separate tables for each section
    const sections = [];
    
    // Morning Protocol Section
    if (dayData.preparation_phases?.find(p => p.id === 'morning_protocol')) {
      const morningProtocol = dayData.preparation_phases.find(p => p.id === 'morning_protocol');
      const exercises = [];
      
      // Individual activities
      if (morningProtocol.activities) {
        morningProtocol.activities.forEach(activity => {
          exercises.push({
            exercise: activity.name,
            sets: activity.sets || '-',
            reps: activity.duration || activity.reps || '-',
            rest: '-',
            instructions: activity.instructions?.map(inst => 
              typeof inst === 'string' ? inst : `${inst.phase}: ${inst.text}`
            ).slice(0, 2).join('; ') || activity.implementation?.execution || ''
          });
        });
      }
      
      sections.push({
        id: `${dayKey}-morning-protocol`,
        time: '6:00-6:20',
        title: morningProtocol.title || 'Morning Protocol',
        exercises: exercises
      });
    }

    // Assessment Section
    if (dayData.assessments || dayData.preparation_phases?.find(p => p.professional_assessment)) {
      const assessments = dayData.assessments || [];
      const proAssessment = dayData.preparation_phases?.find(p => p.professional_assessment)?.professional_assessment;
      const exercises = [];
      
      // Assessment items
      if (proAssessment?.assessments) {
        proAssessment.assessments.forEach(item => {
          exercises.push({
            exercise: item.name,
            sets: '-',
            reps: item.protocol || '-',
            rest: '-',
            instructions: item.notes || item.standard || ''
          });
        });
      }
      
      // Or from main assessments
      assessments.forEach(assessment => {
        if (assessment.components) {
          assessment.components.forEach(comp => {
            exercises.push({
              exercise: comp.name,
              sets: '-',
              reps: comp.measurement?.repetitions || comp.measurement?.duration || '-',
              rest: '-',
              instructions: comp.measurement?.protocol || ''
            });
          });
        }
      });
      
      if (exercises.length > 0) {
        sections.push({
          id: `${dayKey}-assessment`,
          time: '6:30-7:15',
          title: 'Assessment',
          exercises: exercises
        });
      }
    }

    // Tennis Training Section
    if (dayData.tennis_training || dayData.skill_training) {
      const tennisData = dayData.tennis_training || dayData.skill_training;
      const exercises = [];
      
      // Tennis warm-up
      if (tennisData.alcaraz_integration?.warm_up?.exercises) {
        tennisData.alcaraz_integration.warm_up.exercises.forEach(ex => {
          exercises.push({
            exercise: ex.name,
            sets: ex.sets || '1',
            reps: ex.duration || ex.reps || '-',
            rest: '-',
            instructions: ex.detailed_instructions?.[0] || ''
          });
        });
      }
      
      // Main tennis drills
      const drills = tennisData.alcaraz_integration?.rally_development?.drills ||
                     tennisData.alcaraz_integration?.main_session?.drills ||
                     tennisData.drills ||
                     tennisData.sessions?.[0]?.components || [];
                     
      drills.forEach(drill => {
        exercises.push({
          exercise: drill.name,
          sets: drill.sets || '1',
          reps: drill.balls || drill.duration || drill.reps || '-',
          rest: drill.rest || '-',
          instructions: drill.intensity ? `${drill.intensity} intensity` : drill.implementation?.focus || ''
        });
      });
      
      if (exercises.length > 0) {
        sections.push({
          id: `${dayKey}-tennis-training`,
          time: '7:15-8:15',
          title: tennisData.title || 'Tennis Training',
          exercises: exercises
        });
      }
    }

    // Movement Preparation Section
    if (dayData.movement_preparation) {
      const exercises = [];
      
      // Movement prep exercises
      if (dayData.movement_preparation.exercises) {
        dayData.movement_preparation.exercises.forEach(ex => {
          exercises.push({
            exercise: ex.name,
            sets: ex.sets || '-',
            reps: ex.reps || ex.duration || '-',
            rest: formatRestTime(ex),
            instructions: ex.protocol || ex.tennis_application || ''
          });
        });
      }
      
      if (exercises.length > 0) {
        sections.push({
          id: `${dayKey}-movement-prep`,
          time: '8:30-9:00',
          title: dayData.movement_preparation.title || 'Movement Prep',
          exercises: exercises
        });
      }
    }

    // Gym Session Section
    if (dayData.strength_training || dayData.conditioning_blocks) {
      const strengthData = dayData.strength_training || { exercises: [] };
      const conditioningData = dayData.conditioning_blocks || [];
      const subsections = [];
      
      // Main strength exercises
      const mainExercises = strengthData.main_exercises || 
                           strengthData.primary_movements || 
                           strengthData.exercises || [];
      
      if (mainExercises.length > 0) {
        const exercises = mainExercises.map(ex => ({
          exercise: ex.name,
          sets: ex.sets || '-',
          reps: ex.reps || ex.reps_per_side || '-',
          rest: formatRestTime(ex),
          instructions: `${ex.load || ''} ${ex.tempo ? `Tempo: ${ex.tempo}` : ''}`
        }));
        subsections.push({ title: 'Main Exercises', exercises });
      }
      
      // Power Integration
      if (strengthData.phase_2_integration?.exercises) {
        const exercises = strengthData.phase_2_integration.exercises.map(ex => ({
          exercise: ex.name,
          sets: ex.sets || '-',
          reps: ex.reps || '-',
          rest: ex.rest || '-',
          instructions: ex.protocol || ex.target || ''
        }));
        subsections.push({ title: 'Power Integration', exercises });
      }
      
      // Tendon Conditioning
      if (strengthData.advanced_tendon_conditioning?.exercises) {
        const exercises = strengthData.advanced_tendon_conditioning.exercises.map(ex => ({
          exercise: ex.name,
          sets: ex.sets || '-',
          reps: ex.reps || ex.duration || '-',
          rest: ex.rest || '-',
          instructions: ex.protocol || ''
        }));
        subsections.push({ title: 'Tendon Conditioning', exercises });
      }
      
      // Stability/Power Block
      if (strengthData.stability_power_block?.exercises) {
        const exercises = strengthData.stability_power_block.exercises.map(ex => ({
          exercise: ex.name,
          sets: ex.sets || '-',
          reps: ex.reps || ex.hold || '-',
          rest: ex.rest || '-',
          instructions: ex.protocol || ex.details || ''
        }));
        subsections.push({ title: 'Stability/Power', exercises });
      }
      
      // Conditioning blocks (from new format)
      conditioningData.forEach(block => {
        if (block.exercises) {
          const exercises = block.exercises.map(ex => ({
            exercise: ex.name,
            sets: ex.sets || ex.loading?.sets || '-',
            reps: ex.reps || ex.loading?.reps || '-',
            rest: ex.rest || ex.loading?.rest || '-',
            instructions: ex.loading?.intensity || ex.execution?.technique?.[0] || ''
          }));
          subsections.push({ title: block.title || 'Conditioning', exercises });
        }
      });
      
      if (subsections.length > 0) {
        sections.push({
          id: `${dayKey}-gym-session`,
          time: '9:00-10:30',
          title: strengthData.title || 'Gym Session',
          subsections: subsections
        });
      }
    }

    // Recovery Section
    if (dayData.recovery_protocol || dayData.recovery_protocols) {
      const recovery = dayData.recovery_protocol || (Array.isArray(dayData.recovery_protocols) ? dayData.recovery_protocols[0] : dayData.recovery_protocols);
      const exercises = [];
      
      // Recovery components
      const components = recovery.components || [];
      components.forEach(comp => {
        exercises.push({
          exercise: comp.name,
          sets: '-',
          reps: comp.duration || '-',
          rest: '-',
          instructions: comp.implementation?.method || comp.protocol || ''
        });
      });
      
      if (exercises.length > 0) {
        sections.push({
          id: `${dayKey}-recovery`,
          time: '10:30-11:00',
          title: recovery.title || 'Recovery',
          exercises: exercises
        });
      }
    }

    return (
      <div key={dayKey}>
        <h3>📅 {dayName} - {dayData.metadata?.title}</h3>
        <p><em>"{dayData.metadata?.subtitle}"</em></p>
        
        {/* Training Parameters */}
        {dayData.metadata?.training_parameters && (
          <p>
            <strong>Training Parameters:</strong> Volume: {dayData.metadata.training_parameters.volume} | 
            Intensity: {dayData.metadata.training_parameters.intensity} | 
            Duration: {dayData.metadata.training_parameters.duration}
          </p>
        )}
        
        {/* Expand/Collapse Controls */}
        <div className={styles.controlsContainer}>
          <button 
            className={styles.controlButton}
            onClick={expandAll}
            type="button"
          >
            📖 Expand All
          </button>
          <button 
            className={styles.controlButton}
            onClick={collapseAll}
            type="button"
          >
            📝 Collapse All
          </button>
        </div>
        
        {/* Render each section as a separate table */}
        {sections.map((section, sectionIdx) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <div key={sectionIdx} className={styles.sectionContainer}>
              <div 
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.sectionHeaderContent}>
                  <h4 className={styles.sectionTitle}>{section.title}</h4>
                  <span className={styles.expandIcon}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
                <span className={styles.sectionTime}>{section.time}</span>
              </div>
            
            {/* Collapsible content */}
            {isExpanded && (
              <div className={styles.sectionContent}>
                {/* Handle sections with subsections (like Gym Session) */}
                {section.subsections ? (
                  section.subsections.map((subsection, subIdx) => (
                    <div key={subIdx} className={styles.subsectionContainer}>
                      <h5 className={styles.subsectionTitle}>{subsection.title}</h5>
                      <table className={styles.workoutTable}>
                        <thead>
                          <tr>
                            <th>Exercise</th>
                            <th>Sets</th>
                            <th>Reps/Duration</th>
                            <th>Rest</th>
                            <th>Instructions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subsection.exercises.map((exercise, exIdx) => (
                            <tr key={exIdx} className={styles.exerciseRow}>
                              <td className={styles.exerciseCell}>{exercise.exercise}</td>
                              <td className={styles.centerCell}>{exercise.sets}</td>
                              <td className={styles.centerCell}>{exercise.reps}</td>
                              <td className={styles.centerCell}>{exercise.rest}</td>
                              <td className={styles.instructionsCell}>{exercise.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
                ) : (
                  /* Regular sections without subsections */
                  <table className={styles.workoutTable}>
                    <thead>
                      <tr>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Reps/Duration</th>
                        <th>Rest</th>
                        <th>Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.exercises?.map((exercise, exIdx) => (
                        <tr key={exIdx} className={styles.exerciseRow}>
                          <td className={styles.exerciseCell}>{exercise.exercise}</td>
                          <td className={styles.centerCell}>{exercise.sets}</td>
                          <td className={styles.centerCell}>{exercise.reps}</td>
                          <td className={styles.centerCell}>{exercise.rest}</td>
                          <td className={styles.instructionsCell}>{exercise.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
          );
        })}

        {/* Elite Methods Attribution */}
        {dayData.metadata?.elite_methods && (
          <details>
            <summary><strong>🏆 Elite Methods & Attribution</strong></summary>
            <div>
              {dayData.metadata.elite_methods.map((method, idx) => (
                <p key={idx}>
                  <strong>{method.name}</strong> - {method.attribution?.source}
                  {method.attribution?.athlete && ` (${method.attribution.athlete})`}
                  {method.attribution?.context && ` - ${method.attribution.context}`}
                </p>
              ))}
            </div>
          </details>
        )}

        {/* Equipment Needed */}
        {dayData.metadata?.equipment_required && (
          <details>
            <summary><strong>🏋️ Equipment Required</strong></summary>
            <div>
              <p><strong>Essential:</strong> {dayData.metadata.equipment_required.essential?.join(', ')}</p>
              {dayData.metadata.equipment_required.optional && (
                <p><strong>Optional:</strong> {dayData.metadata.equipment_required.optional.join(', ')}</p>
              )}
            </div>
          </details>
        )}

        {/* Key Focus Areas */}
        {dayData.metadata?.focus_areas && (
          <details>
            <summary><strong>🎯 Focus Areas</strong></summary>
            <div>
              {dayData.metadata.focus_areas.map((area, idx) => (
                <p key={idx}>• {area}</p>
              ))}
            </div>
          </details>
        )}

        <hr />
      </div>
    );
  };

  return (
    <div>
      <h1>12-Week Elite Tennis Program Overview Table</h1>
      
      <h2>Complete Weekly Structure with Daily Breakdowns</h2>
      
      <p>This comprehensive guide provides detailed daily tables for the entire 12-week elite tennis training program. Each day includes specific timing, exercises, sets, reps, rest periods, and technique cues. Based on 224+ research citations and methods from world #1 players, Grand Slam champions, and Olympic gold medalists.</p>
      
      <h3>📊 How to Use This Guide</h3>
      
      <ol>
        <li><strong>Daily Schedule</strong>: Each table shows the complete daily structure with all training blocks</li>
        <li><strong>Block Organization</strong>: Morning Protocol → Assessment → Tennis → Gym → Recovery</li>
        <li><strong>Training Parameters</strong>: Volume, intensity, and duration guidelines for each day</li>
        <li><strong>Elite Methods</strong>: Click to see which pro player methods are being used</li>
        <li><strong>Equipment Lists</strong>: Click to see required and optional equipment</li>
      </ol>

      <h3>🎯 Quick Navigation</h3>
      
      <ul>
        <li><a href="#week-1-elite-foundation">Week 1: Elite Foundation</a></li>
        <li><a href="#week-2-foundation-building">Week 2: Foundation Building</a></li>
        <li>Weeks 3-12: Coming Soon</li>
      </ul>

      <h3>Key Program Features:</h3>
      <ul>
        <li><strong>6.5 hours daily training</strong> (4 hours court + 2.5 hours gym) following world #1 player protocols</li>
        <li><strong>Velocity-based training zones</strong> with bar speed monitoring (0.75-1.00 m/s)</li>
        <li><strong>RFD optimization</strong> in 0-100ms window for tennis-specific movements</li>
        <li><strong>Three-dimensional functional training</strong> (ATP tour fitness expert method)</li>
        <li><strong>Daily 20-minute yoga</strong> and 4-7-8 breathing (elite recovery system)</li>
      </ul>

      <h3>Phase 1: Elite Foundation (Weeks 1-3)</h3>
      
      <h2 id="week-1-elite-foundation">Week 1: Elite Foundation - Building the Base</h2>
      
      {Object.entries(week1Data).map(([dayKey, dayData]) => renderWorkoutDay(dayKey, dayData))}
      
      <h2 id="week-2-foundation-building">Week 2: Foundation Building - Power Introduction</h2>
      <p><em>Week 2 data coming soon...</em></p>
    </div>
  );
}
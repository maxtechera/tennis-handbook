import React from 'react';
import Details from '@theme/Details';

// Component to render the Pre-Week Assessment section using unified schema
export function PreWeekAssessment({ data, assessments }: { data?: any; assessments?: any[] }) {
  // Support both legacy data structure and new unified assessments array
  const preWeekAssessment = data || assessments?.find(a => a.type === 'baseline' && a.id === 'pre_week_assessment');
  
  if (!preWeekAssessment) return null;
  
  return (
    <>
      <h2>Elite Pre-Week Assessment (Complete before Monday)</h2>
      
      <h3>{preWeekAssessment.title}</h3>
      <p><em>{preWeekAssessment.description}</em></p>
      
      {/* Show attribution if available */}
      {preWeekAssessment.attribution && (
        <div className="admonition admonition-info alert alert--info">
          <div className="admonition-heading">
            <h5>🏆 Elite Method Attribution</h5>
          </div>
          <div className="admonition-content">
            <p><strong>Source:</strong> {preWeekAssessment.attribution.source}</p>
            <p><strong>Elite Use:</strong> {preWeekAssessment.attribution.elite_use}</p>
            <p><strong>Methodology:</strong> {preWeekAssessment.attribution.methodology}</p>
          </div>
        </div>
      )}
      
      <p><strong>Assessment Components ({preWeekAssessment.duration}):</strong></p>
      
      {/* Unified schema components */}
      {preWeekAssessment.components?.map((component: any, idx: number) => (
        <div key={component.id || idx} style={{ marginBottom: '2rem' }}>
          <h4>📊 {component.name}</h4>
          
          <table>
            <tbody>
              <tr>
                <td><strong>Protocol</strong></td>
                <td>{component.measurement?.protocol}</td>
              </tr>
              <tr>
                <td><strong>Repetitions</strong></td>
                <td>{component.measurement?.repetitions || component.measurement?.duration}</td>
              </tr>
              <tr>
                <td><strong>Equipment</strong></td>
                <td>{component.measurement?.equipment}</td>
              </tr>
              {component.standards && (
                <>
                  <tr>
                    <td><strong>Elite Benchmark</strong></td>
                    <td>{component.standards.elite_benchmark}</td>
                  </tr>
                  <tr>
                    <td><strong>Good Standard</strong></td>
                    <td>{component.standards.good_standard}</td>
                  </tr>
                  <tr>
                    <td><strong>Needs Work</strong></td>
                    <td>{component.standards.needs_work}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          
          {component.context && (
            <Details summary="🎯 Assessment Context">
              <p><strong>Description:</strong> {component.context.description}</p>
              {component.context.research && <p><strong>Research:</strong> {component.context.research}</p>}
              <p><strong>Application:</strong> {component.context.application}</p>
            </Details>
          )}
        </div>
      ))}
      
      {/* Legacy format fallback */}
      {preWeekAssessment.movement_screen?.map((assessment: any, idx: number) => (
        <li key={idx}>
          <strong>{assessment.name}</strong>: {assessment.reps}
          <ul>
            <li><em>Elite Standard</em>: {assessment.elite_standard}</li>
            <li><em>Professional Notes</em>: {assessment.professional_notes}</li>
            {assessment.research && <li><em>Research Integration</em>: {assessment.research}</li>}
            {assessment.imbalance_detection && <li><em>Imbalance Detection</em>: {assessment.imbalance_detection}</li>}
            {assessment.tennis_application && <li><em>Tennis Application</em>: {assessment.tennis_application}</li>}
            {assessment.elite_benchmark && <li><em>Elite Benchmark</em>: {assessment.elite_benchmark}</li>}
          </ul>
        </li>
      ))}
    </>
  );
}

// Component to render the Morning Protocol section with checkboxes
export function MorningProtocol({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>🌅 Elite Morning Protocol (06:00-07:15) - Djokovic Integration {`{#morning}`}</h2>
      
      <h3>⏰ 6:00-6:20 AM: Djokovic Morning Yoga & Breathing</h3>
      
      <div className="admonition admonition-tip alert alert--success">
        <div className="admonition-heading">
          <h5>Completion Tracking</h5>
        </div>
        <div className="admonition-content">
          <p>Check off each component as you complete it:</p>
        </div>
      </div>
      
      <h4>🧘 Yoga Flow Component</h4>
      <ul style={{ listStyle: 'none' }}>
        <li>- [ ] <strong>Duration:</strong> {data.yoga_breathing?.yoga_flow?.duration}</li>
        <li>- [ ] <strong>Method:</strong> {data.yoga_breathing?.yoga_flow?.method}</li>
        <li>- [ ] <strong>Focus:</strong> {data.yoga_breathing?.yoga_flow?.focus}</li>
      </ul>
      
      <Details summary="💡 Professional Coaching Notes">
        <ul>
          {data.yoga_breathing?.yoga_flow?.professional_notes?.map((note: string, idx: number) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </Details>
      
      <h4>🫁 Breathing Protocol</h4>
      <ul style={{ listStyle: 'none' }}>
        <li>- [ ] <strong>Duration:</strong> {data.yoga_breathing?.breathing_protocol?.duration}</li>
        <li>- [ ] <strong>Pattern:</strong> {data.yoga_breathing?.breathing_protocol?.pattern}</li>
        <li>- [ ] <strong>Technique:</strong> {data.yoga_breathing?.breathing_protocol?.technique}</li>
      </ul>
      
      <Details summary="🎯 Parasympathetic Activation Goals">
        <ul>
          {data.yoga_breathing?.breathing_protocol?.parasympathetic_goals?.map((goal: string, idx: number) => (
            <li key={idx}>{goal}</li>
          ))}
        </ul>
      </Details>
      
      <h4>🧠 Mindful Preparation</h4>
      <ul style={{ listStyle: 'none' }}>
        <li>- [ ] <strong>Duration:</strong> {data.mindful_preparation?.duration}</li>
        <li>- [ ] <strong>Focus:</strong> {data.mindful_preparation?.focus}</li>
        <li>- [ ] <strong>Goal:</strong> {data.mindful_preparation?.goal}</li>
      </ul>
    </>
  );
}

// Component to render Tennis Training tables with detailed programs
export function TennisTrainingTable({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>🎾 Elite Tennis Foundation (07:15-08:15) - Alcaraz Academy Protocol {`{#tennis}`}</h2>
      
      <p><em>{data.category} | Duration: {data.total_duration} minutes | Intensity: {data.intensity_avg}</em></p>
      
      <h3>🏃 Court Movement Preparation ({data.alcaraz_integration?.warm_up?.time})</h3>
      <p><strong>Method:</strong> {data.alcaraz_integration?.warm_up?.method}</p>
      <p><strong>Standard:</strong> {data.alcaraz_integration?.warm_up?.standard}</p>
      
      {data.alcaraz_integration?.warm_up?.exercises?.map((exercise: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '1.5rem' }}>
          <h4>📝 {exercise.name}</h4>
          <ul style={{ listStyle: 'none' }}>
            <li>- [ ] <strong>Duration:</strong> {exercise.duration}</li>
            <li>- [ ] <strong>Sets:</strong> {exercise.sets}</li>
          </ul>
          
          <Details summary="💡 Detailed Instructions">
            <ul>
              {/* Handle detailed_instructions as either array of strings or array of objects */}
              {exercise.detailed_instructions?.map((instruction: any, i: number) => (
                <li key={i}>
                  {typeof instruction === 'string' 
                    ? instruction 
                    : instruction.phase 
                      ? <><strong>{instruction.phase}:</strong> {instruction.instruction}</>
                      : instruction.instruction || instruction}
                </li>
              ))}
            </ul>
          </Details>
          
          <Details summary="🎯 Professional Cues">
            <ul>
              {exercise.cues?.map((cue: string, i: number) => (
                <li key={i}>"{cue}"</li>
              ))}
            </ul>
          </Details>
        </div>
      ))}
      
      <h3>🎯 Rally Development ({data.alcaraz_integration?.rally_development?.time})</h3>
      <p><strong>Method:</strong> {data.alcaraz_integration?.rally_development?.method}</p>
      <p><strong>Standard:</strong> {data.alcaraz_integration?.rally_development?.standard}</p>
      
      {data.alcaraz_integration?.rally_development?.drills?.map((drill: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '1.5rem' }}>
          <h4>🏆 {drill.name}</h4>
          <ul style={{ listStyle: 'none' }}>
            <li>- [ ] <strong>Type:</strong> {drill.type}</li>
            <li>- [ ] <strong>Balls:</strong> {drill.balls}</li>
            <li>- [ ] <strong>Intensity:</strong> {drill.intensity}</li>
          </ul>
          
          <Details summary="🥎 Forehand Protocol">
            <ul>
              {drill.forehand_instructions?.map((instruction: string, i: number) => (
                <li key={i}>{instruction}</li>
              ))}
            </ul>
          </Details>
          
          <Details summary="🥎 Backhand Protocol">
            <ul>
              {drill.backhand_instructions?.map((instruction: string, i: number) => (
                <li key={i}>{instruction}</li>
              ))}
            </ul>
          </Details>
          
          <Details summary="🎯 Professional Cues">
            <ul>
              {drill.cues?.map((cue: string, i: number) => (
                <li key={i}>"{cue}"</li>
              ))}
            </ul>
          </Details>
        </div>
      ))}
      
      <h3>📍 Directional Precision ({data.alcaraz_integration?.directional_precision?.time})</h3>
      <p><strong>Method:</strong> {data.alcaraz_integration?.directional_precision?.method}</p>
      <p><strong>Standard:</strong> {data.alcaraz_integration?.directional_precision?.standard}</p>
      
      {data.alcaraz_integration?.directional_precision?.drills?.map((drill: any, idx: number) => (
        <div key={idx} style={{ marginBottom: '1.5rem' }}>
          <h4>🎯 {drill.name}</h4>
          <ul style={{ listStyle: 'none' }}>
            <li>- [ ] <strong>Type:</strong> {drill.type}</li>
            <li>- [ ] <strong>Duration:</strong> {drill.duration}</li>
          </ul>
          
          <Details summary="📋 Setup & Execution">
            <ul>
              {/* Handle detailed_instructions as either array of strings or array of objects */}
              {drill.detailed_instructions?.map((instruction: any, i: number) => (
                <li key={i}>
                  {typeof instruction === 'string' 
                    ? instruction 
                    : instruction.phase 
                      ? <><strong>{instruction.phase}:</strong> {instruction.instruction}</>
                      : instruction.instruction || instruction}
                </li>
              ))}
            </ul>
          </Details>
          
          <Details summary="🎯 Professional Cues">
            <ul>
              {drill.cues?.map((cue: string, i: number) => (
                <li key={i}>"{cue}"</li>
              ))}
            </ul>
          </Details>
        </div>
      ))}
      
      <h3>⚡ Power-Accuracy Integration ({data.alcaraz_integration?.power_accuracy_integration?.time})</h3>
      <p><strong>Method:</strong> {data.alcaraz_integration?.power_accuracy_integration?.method}</p>
      <p><strong>Power Range:</strong> {data.alcaraz_integration?.power_accuracy_integration?.power_range}</p>
      <p><strong>Standard:</strong> {data.alcaraz_integration?.power_accuracy_integration?.standard}</p>
      
      <div className="admonition admonition-tip alert alert--success">
        <div className="admonition-heading">
          <h5>🏆 Elite Success Metrics (Alcaraz Standards)</h5>
        </div>
        <div className="admonition-content">
          <ul>
            {Object.entries(data.elite_success_metrics || {}).map(([key, value]: [string, any]) => (
              <li key={key}>
                <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>: {value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// Component to render Strength Training section with set tracking
export function StrengthTrainingSection({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>💪 Elite Strength Foundation Block (08:40-10:00) - Murray Precision Integration {`{#strength}`}</h2>
      
      <p><em>"{data.phase_description}"</em></p>
      
      <div className="admonition admonition-caution alert alert--warning">
        <div className="admonition-heading">
          <h5>Phase 1: Foundation Strength (Murray's Precision Method)</h5>
        </div>
        <div className="admonition-content">
          <p>Track each set as you complete it. Rest fully between exercises.</p>
        </div>
      </div>
      
      {data.main_exercises?.map((exercise: any, idx: number) => (
        <div key={exercise.exercise_id}>
          <h3>🏋️ Exercise {idx + 1}: {exercise.name}</h3>
          
          <p><strong>Target:</strong> {exercise.sets} sets × {exercise.reps} reps @ {exercise.load} | <strong>Rest:</strong> {Math.floor(exercise.rest_seconds / 60)} minutes between sets</p>
          
          <h4>Set Tracking:</h4>
          <ul style={{ listStyle: 'none' }}>
            {exercise.set_tracking?.map((set: any, setIdx: number) => (
              <li key={setIdx}>
                - [ ] <strong>Set {set.set}:</strong> _____ lbs × {set.target_reps} reps ✓
              </li>
            ))}
          </ul>
          
          <Details summary="🎯 Elite Protocol Instructions">
            <p><strong>Technique:</strong></p>
            <ul>
              <li>{exercise.tempo_description}</li>
              {/* Handle different detailed_instructions structures */}
              {(() => {
                const instructions = exercise.detailed_instructions;
                if (!instructions) return null;
                
                // Week 2+ structure: object with technique_points array
                if (instructions.technique_points && Array.isArray(instructions.technique_points)) {
                  return (
                    <>
                      {instructions.title && <li><strong>{instructions.title}</strong></li>}
                      {instructions.technique_points.map((instruction: any, i: number) => (
                        <li key={i}>
                          {instruction.phase 
                            ? <><strong>{instruction.phase}:</strong> {instruction.instruction}</>
                            : instruction.instruction || instruction}
                        </li>
                      ))}
                    </>
                  );
                }
                
                // Week 1 structure: direct array
                if (Array.isArray(instructions)) {
                  return instructions.map((instruction: any, i: number) => (
                    <li key={i}>
                      {typeof instruction === 'string' 
                        ? instruction 
                        : instruction.phase 
                          ? <><strong>{instruction.phase}:</strong> {instruction.instruction}</>
                          : instruction.instruction || instruction}
                    </li>
                  ));
                }
                
                return null;
              })()}
            </ul>
            
            <p><strong>Professional Cues:</strong></p>
            <ul>
              {exercise.professional_cues?.map((cue: string, i: number) => (
                <li key={i}>"{cue}"</li>
              ))}
            </ul>
          </Details>
          
          <Details summary="🔬 Research Integration">
            <ul>
              {exercise.research_integration?.map((point: string, i: number) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </Details>
          
          <hr />
        </div>
      ))}
    </>
  );
}

// Component to render Daily Assessment section
export function DailyAssessment({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>{data.title} ({data.time})</h2>
      
      {data.comparison_table && (
        <table>
          <thead>
            <tr>
              {data.comparison_table.headers.map((header: string, idx: number) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.comparison_table.rows.map((row: any, idx: number) => (
              <tr key={idx}>
                <td><strong>{row.metric}</strong></td>
                <td>{row.monday_baseline || row.baseline}</td>
                <td>{row.tuesday_reading || row.current_reading || row.thursday_reading || row.friday_reading}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

// Component to render Recovery Protocol section
export function RecoveryProtocol({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>{data.title} ({data.time})</h2>
      
      {/* Render different recovery sections based on what's available */}
      {data.upper_body_mobility && (
        <>
          <h3>{data.upper_body_mobility.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Stretch</th>
                <th>Duration</th>
                <th>Instructions</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              {data.upper_body_mobility.stretches.map((stretch: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{stretch.name}</strong></td>
                  <td>{stretch.duration}</td>
                  <td>{stretch.instructions}</td>
                  <td>{stretch.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      
      {data.breathing_protocols && (
        <>
          <h3>{data.breathing_protocols.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Protocol</th>
                <th>Duration</th>
                <th>Method</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {data.breathing_protocols.protocols.map((protocol: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{protocol.name}</strong></td>
                  <td>{protocol.duration}</td>
                  <td>{protocol.method}</td>
                  <td>{protocol.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      
      {/* Morning recovery routine for Sunday */}
      {data.morning_recovery && (
        <>
          <h3>{data.morning_recovery.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Duration</th>
                <th>Method</th>
                <th>Benefits</th>
              </tr>
            </thead>
            <tbody>
              {data.morning_recovery.activities.map((activity: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{activity.name}</strong></td>
                  <td>{activity.duration}</td>
                  <td>{activity.method}</td>
                  <td>{activity.benefits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

// Component to render Weekly Review section
export function WeeklyReview({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>{data.title}</h2>
      
      {data.physical_performance && (
        <>
          <h3>{data.physical_performance.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Week 1 Baseline</th>
                <th>Week 1 Final</th>
                <th>Change</th>
                <th>Week 2 Target</th>
              </tr>
            </thead>
            <tbody>
              {data.physical_performance.metrics?.map((metric: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{metric.name}</strong></td>
                  <td>{metric.baseline}</td>
                  <td>{metric.final}</td>
                  <td>{metric.change}</td>
                  <td>{metric.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      
      {data.movement_quality && (
        <>
          <h3>{data.movement_quality.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Screen Component</th>
                <th>Week 1 Score</th>
                <th>Improvements Noted</th>
                <th>Week 2 Focus</th>
              </tr>
            </thead>
            <tbody>
              {data.movement_quality.components?.map((component: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{component.name}</strong></td>
                  <td>{component.score}</td>
                  <td>{component.improvements}</td>
                  <td>{component.next_focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      
      {data.tennis_performance && (
        <>
          <h3>{data.tennis_performance.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Skill Area</th>
                <th>Monday Level</th>
                <th>Friday Level</th>
                <th>Key Improvements</th>
              </tr>
            </thead>
            <tbody>
              {data.tennis_performance.skills?.map((skill: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{skill.area}</strong></td>
                  <td>{skill.monday_level}</td>
                  <td>{skill.friday_level}</td>
                  <td>{skill.improvements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

// Component to render Workout Options (for Saturday)
export function WorkoutOptions({ options }: { options: any[] }) {
  if (!options) return null;
  
  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px', marginBottom: '20px' }}>
      {options.map((option: any, idx: number) => (
        <div key={idx} style={{ 
          flex: 1, 
          padding: '20px', 
          border: '2px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: option.option === 'A' ? '#f0f8ff' : '#f5f5f5'
        }}>
          <h3>Option {option.option}: {option.title}</h3>
          <p>{option.description}</p>
        </div>
      ))}
    </div>
  );
}
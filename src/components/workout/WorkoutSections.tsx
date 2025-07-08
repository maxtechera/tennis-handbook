import React from 'react';
import Details from '@theme/Details';

// Component to render the Pre-Week Assessment section
export function PreWeekAssessment({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>Elite Pre-Week Assessment (Complete before Monday)</h2>
      
      <h3>{data.title}</h3>
      
      <p><strong>Primary Assessments:</strong></p>
      <ul>
        {data.movement_screen?.map((assessment: any, idx: number) => (
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
      </ul>
      
      {data.advanced_assessments && (
        <>
          <p><strong>{data.advanced_assessments.title}:</strong></p>
          <ul>
            {data.advanced_assessments.exercises?.map((exercise: any, idx: number) => (
              <li key={idx}>
                <strong>{exercise.name}</strong>: {exercise.reps} ({exercise.focus})
              </li>
            ))}
          </ul>
        </>
      )}
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

// Component to render Tennis Training tables
export function TennisTrainingTable({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>Elite Tennis Foundation (07:15-08:15) - Alcaraz Academy Protocol {`{#tennis}`}</h2>
      
      <h3>Alcaraz 20-Minute Dynamic Warm-up Integration</h3>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Tennis Component</th>
            <th>Alcaraz Method</th>
            <th>Elite Standards</th>
            <th>Performance Tracking</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>07:15-07:25</strong></td>
            <td><strong>Court Movement Preparation</strong></td>
            <td>{data.alcaraz_integration?.warm_up?.method}</td>
            <td>{data.alcaraz_integration?.warm_up?.standard}</td>
            <td>{data.alcaraz_integration?.warm_up?.tracking}</td>
          </tr>
          <tr>
            <td><strong>07:25-07:50</strong></td>
            <td><strong>Controlled Rally Development</strong></td>
            <td>Precision hitting (100 balls each side)</td>
            <td>{data.alcaraz_integration?.rally_development?.standard}</td>
            <td>{data.alcaraz_integration?.rally_development?.tracking}</td>
          </tr>
          <tr>
            <td><strong>07:50-08:05</strong></td>
            <td><strong>Directional Precision Training</strong></td>
            <td>{data.alcaraz_integration?.directional_precision?.method}</td>
            <td>{data.alcaraz_integration?.directional_precision?.standard}</td>
            <td>{data.alcaraz_integration?.directional_precision?.tracking}</td>
          </tr>
          <tr>
            <td><strong>08:05-08:15</strong></td>
            <td><strong>Power-Accuracy Integration</strong></td>
            <td>Controlled pace building ({data.alcaraz_integration?.power_accuracy_integration?.power_range})</td>
            <td>{data.alcaraz_integration?.power_accuracy_integration?.standard}</td>
            <td>{data.alcaraz_integration?.power_accuracy_integration?.tracking}</td>
          </tr>
        </tbody>
      </table>
      
      <p><strong>Elite Success Metrics (Alcaraz Standards):</strong></p>
      <ul>
        {Object.entries(data.elite_success_metrics || {}).map(([key, value]: [string, any]) => (
          <li key={key}>
            <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>: {value}
          </li>
        ))}
      </ul>
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
              {exercise.detailed_instructions?.map((instruction: string, i: number) => (
                <li key={i}>{instruction}</li>
              ))}
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
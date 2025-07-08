import React from 'react';
import Details from '@theme/Details';
import Admonition from '@theme/Admonition';

// Assessment checklist component
export function AssessmentChecklist({ assessments }: { assessments: any[] }) {
  if (!assessments) return null;
  
  return (
    <>
      {assessments.map((assessment, idx) => (
        <div key={idx}>
          <h4>{assessment.icon || '📊'} {assessment.name}</h4>
          <ul style={{ listStyle: 'none' }}>
            {assessment.protocol && <li>- [ ] <strong>Protocol:</strong> {assessment.protocol}</li>}
            {assessment.standard && <li>- [ ] <strong>Standard:</strong> {assessment.standard}</li>}
            <li>- [ ] <strong>Reading:</strong> _____ {assessment.unit || 'ms'}</li>
            {assessment.notes && <li>- [ ] <strong>Notes:</strong> {assessment.notes}</li>}
            {assessment.metrics && assessment.metrics.map((metric: any, mIdx: number) => (
              <li key={mIdx}>- [ ] <strong>{metric.split('(')[0]}:</strong> _____{metric.includes('(') ? ' ' + metric.split('(')[1] : ''}</li>
            ))}
            {assessment.tests && Object.entries(assessment.tests).map(([test, desc]: [string, any]) => (
              <li key={test}>- [ ] <strong>{test}:</strong> {desc}</li>
            ))}
            {assessment.checks && assessment.checks.map((check: string, cIdx: number) => (
              <li key={cIdx}>- [ ] {check}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

// Movement preparation table component
export function MovementPrepTable({ exercises }: { exercises: any[] }) {
  if (!exercises) return null;
  
  return (
    <table>
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Sets×Reps</th>
          <th>Elite Protocol</th>
          <th>Tennis Application</th>
          <th>Research Integration</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise, idx) => (
          <tr key={idx}>
            <td><strong>{exercise.name}</strong></td>
            <td>{exercise.sets}×{exercise.reps}</td>
            <td>{exercise.protocol}</td>
            <td>{exercise.tennis_application}</td>
            <td>{exercise.research}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Targeted correctives table
export function TargetedCorrectives({ correctives }: { correctives: any[] }) {
  if (!correctives) return null;
  
  return (
    <>
      <h3>Targeted Correctives (Individual Assessment)</h3>
      <table>
        <thead>
          <tr>
            <th>Screen Limitation</th>
            <th>Corrective Exercise</th>
            <th>Duration</th>
            <th>Professional Focus</th>
          </tr>
        </thead>
        <tbody>
          {correctives.map((corrective, idx) => (
            <tr key={idx}>
              <td><strong>{corrective.limitation}</strong></td>
              <td>{corrective.exercise}</td>
              <td>{corrective.duration}</td>
              <td>{corrective.focus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// Phase 2 integration table
export function Phase2Integration({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <p><strong>{data.title}</strong></p>
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets×Reps</th>
            <th>Elite Protocol</th>
            <th>Tennis Application</th>
            <th>Performance Target</th>
          </tr>
        </thead>
        <tbody>
          {data.exercises?.map((exercise: any, idx: number) => (
            <tr key={idx}>
              <td><strong>{exercise.name}</strong></td>
              <td>{exercise.sets}×{exercise.reps}</td>
              <td>{exercise.protocol}</td>
              <td>{exercise.tennis_application}</td>
              <td>{exercise.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// Advanced tendon conditioning table
export function TendonConditioning({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h3>{data.title}</h3>
      <p><strong>{data.protocol}:</strong></p>
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets×Reps</th>
            <th>Professional Protocol</th>
            <th>Tennis Application</th>
            <th>Research Backing</th>
          </tr>
        </thead>
        <tbody>
          {data.exercises?.map((exercise: any, idx: number) => (
            <React.Fragment key={idx}>
              <tr>
                <td><strong>{exercise.name}</strong></td>
                <td>{exercise.sets}×{exercise.duration || exercise.reps}</td>
                <td>{exercise.protocol}</td>
                <td>{exercise.tennis_application}</td>
                <td>{exercise.research}</td>
              </tr>
              {exercise.details && (
                <tr>
                  <td></td>
                  <td></td>
                  <td>{exercise.details}</td>
                  <td>{exercise.enhancement}</td>
                  <td>{exercise.benefits || exercise.backing || exercise.integration}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

// Stability and power block
export function StabilityPowerBlock({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>Elite Stability & Power Transfer Block (10:00-10:25)</h2>
      <h3>{data.title}</h3>
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets×Reps</th>
            <th>Elite Protocol</th>
            <th>Tennis Application</th>
            <th>Neural Development</th>
          </tr>
        </thead>
        <tbody>
          {data.exercises?.map((exercise: any, idx: number) => (
            <React.Fragment key={idx}>
              <tr>
                <td><strong>{exercise.name}</strong></td>
                <td>{exercise.sets}×{exercise.reps}</td>
                <td>{exercise.protocol}</td>
                <td>{exercise.tennis_application}</td>
                <td>{exercise.neural}</td>
              </tr>
              {exercise.details && (
                <tr>
                  <td></td>
                  <td></td>
                  <td>{exercise.details}</td>
                  <td>{exercise.ability || exercise.coordination}</td>
                  <td>{exercise.benefit || exercise.control || exercise.strength}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {data.professional_integration && (
        <>
          <h3>Professional Integration Work</h3>
          <table>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Sets×Reps</th>
                <th>Professional Method</th>
                <th>Elite Benefits</th>
              </tr>
            </thead>
            <tbody>
              {data.professional_integration.map((exercise: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{exercise.name}</strong></td>
                  <td>{exercise.sets}×{exercise.reps || exercise.duration}</td>
                  <td>{exercise.method}</td>
                  <td>{exercise.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

// Recovery checklist component
export function RecoveryChecklist({ data }: { data: any }) {
  if (!data) return null;
  
  return (
    <>
      <h2>🧊 Elite Recovery & Professional Assessment (10:25-10:45) {`{#recovery}`}</h2>
      
      <p><em>"{data.subtitle}"</em></p>
      
      <Admonition type="success" title="Recovery Completion Checklist">
        <p>Mark each protocol as complete. Proper recovery is essential for adaptation.</p>
      </Admonition>
      
      {data.contrast_shower && (
        <>
          <h3>🚿 Contrast Shower Protocol</h3>
          <ul style={{ listStyle: 'none' }}>
            <li>- [ ] <strong>Duration:</strong> {data.contrast_shower.duration} minutes total</li>
            {data.contrast_shower.protocol?.map((cycle: any, idx: number) => (
              <li key={idx}>- [ ] <strong>{cycle.cycle}:</strong> {cycle.hot} → {cycle.cold} ✓</li>
            ))}
            <li>- [ ] <strong>Finish:</strong> {data.contrast_shower.protocol?.[0]?.finish || 'End on cold water'}</li>
            <li>- [ ] <strong>Benefits:</strong> {data.contrast_shower.benefits?.join(', ')}</li>
          </ul>
        </>
      )}
      
      {data.hrv_breathing && (
        <>
          <h3>🫁 HRV Breathing Protocol</h3>
          <ul style={{ listStyle: 'none' }}>
            <li>- [ ] <strong>Duration:</strong> {data.hrv_breathing.duration} minutes</li>
            <li>- [ ] <strong>Pattern:</strong> {data.hrv_breathing.pattern}</li>
            <li>- [ ] <strong>Technique:</strong> Inhale 4s, hold 7s, exhale 8s</li>
            <li>- [ ] <strong>Purpose:</strong> {data.hrv_breathing.purpose?.join(', ')}</li>
          </ul>
        </>
      )}
      
      {data.session_documentation && (
        <>
          <h3>📝 Session Documentation</h3>
          <ul style={{ listStyle: 'none' }}>
            {data.session_documentation.tracking_items?.map((item: string, idx: number) => (
              <li key={idx}>- [ ] <strong>{item.split(':')[0]}:</strong> {item.includes(':') ? item.split(':')[1] : ''}</li>
            ))}
          </ul>
          
          <Details summary="📊 Professional Assessment Questions">
            {data.session_documentation.professional_questions?.quality_ratings && (
              <>
                <p><strong>Rate each area (1-10 scale):</strong></p>
                <ul>
                  {data.session_documentation.professional_questions.quality_ratings.map((rating: string, idx: number) => (
                    <li key={idx}>{rating}</li>
                  ))}
                </ul>
              </>
            )}
            
            {data.session_documentation.professional_questions?.yes_no_assessments && (
              <>
                <p><strong>Yes/No Assessments:</strong></p>
                <ul>
                  {data.session_documentation.professional_questions.yes_no_assessments.map((assessment: string, idx: number) => (
                    <li key={idx}>{assessment}</li>
                  ))}
                </ul>
              </>
            )}
          </Details>
        </>
      )}
    </>
  );
}
import React from 'react';
import Admonition from '@theme/Admonition';
import { AssessmentChecklist } from './DynamicWorkoutSections';

export function ProfessionalAssessmentSection({ data, assessments }: { 
  data: any; 
  assessments: any[]; 
}) {
  if (!data) return null;
  
  return (
    <>
      <h3>{data.section_headers?.professional_assessment_header}</h3>
      
      <Admonition 
        type={data.section_headers?.assessment_admonition?.type || "info"} 
        title={data.section_headers?.assessment_admonition?.title}
      >
        <p>{data.section_headers?.assessment_admonition?.content}</p>
      </Admonition>
      
      <AssessmentChecklist assessments={assessments} />
    </>
  );
}

export function MovementPrepSection({ data, exercises, correctives }: { 
  data: any; 
  exercises: any[];
  correctives: any[];
}) {
  if (!data) return null;
  
  return (
    <>
      <h2>{data.section_headers?.movement_prep} {`{#movement}`}</h2>
      
      <h3>{data.section_headers?.movement_method}</h3>
      <MovementPrepTable exercises={exercises} />
      
      <TargetedCorrectives correctives={correctives} />
    </>
  );
}

// Import the existing components
import { MovementPrepTable, TargetedCorrectives } from './DynamicWorkoutSections';
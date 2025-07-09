# Component Mapping Guide

This guide shows exactly which React components to use for different types of workout content and how to structure the YAML data for each component.

## Component Reference

### Core Workout Components

#### 1. PreWeekAssessment
**When to use**: For assessment sections, typically on Monday
**YAML structure**:
```yaml
pre_week_assessment:
  title: "Assessment Title"
  duration: "20 minutes"
  description: "Assessment description"
  movement_screen:
    - name: "Overhead Squat Assessment"
      reps: "5 reps"
      method: "Video analysis"
      elite_standard: "Perfect alignment"
      professional_notes: "Document deviations"
  advanced_assessments:
    title: "Murray Precision Standards"
    exercises:
      - name: "Single-Leg RDL"
        reps: "10 reps each leg"
        focus: "Stability"
```
**MDX usage**:
```mdx
<PreWeekAssessment data={workoutData.pre_week_assessment} />
```

#### 2. MorningProtocol
**When to use**: For morning routines with breathing, yoga, mindfulness
**YAML structure**:
```yaml
morning_protocol:
  yoga_breathing:
    yoga_flow:
      duration: "8 minutes"
      method: "Dynamic flow sequence"
      focus: "Mobility and activation"
      professional_notes:
        - "Focus on spinal mobility"
        - "Control breathing throughout"
    breathing_protocol:
      duration: "5 minutes"
      pattern: "4-4-4-4 breathing"
      technique: "Diaphragmatic breathing"
      parasympathetic_goals:
        - "Lower heart rate"
        - "Increase HRV"
  mindful_preparation:
    duration: "5 minutes"
    focus: "Mental preparation"
    goal: "Focus and intention setting"
```
**MDX usage**:
```mdx
<MorningProtocol data={workoutData.morning_protocol} />
```

#### 3. ProfessionalAssessmentSection
**When to use**: For daily assessment checklists
**YAML structure**:
```yaml
# In metadata section:
metadata:
  section_headers:
    professional_assessment_header: "⏰ 6:30-7:15 AM: Professional Assessment Protocol"
    assessment_admonition:
      type: "info"
      title: "Daily Assessment Checklist"
      content: "Complete each assessment and record your results:"

# In morning_protocol or separate section:
professional_assessment:
  assessments:
    - category: "Movement Quality"
      items:
        - name: "Hip Mobility Screen"
          instruction: "90/90 position hold"
          target: "60 seconds each side"
        - name: "Shoulder ROM"
          instruction: "Behind back reach"
          target: "Touch fingertips"
```
**MDX usage**:
```mdx
<ProfessionalAssessmentSection 
  data={workoutData.metadata}
  assessments={workoutData.professional_assessment?.assessments} 
/>
```

#### 4. TennisTrainingTable
**When to use**: For tennis-specific training schedules
**YAML structure**:
```yaml
tennis_training:
  alcaraz_integration:
    warm_up:
      method: "Multi-directional movement"
      standard: "Professional movement quality"
      tracking: "Movement assessment checklist"
    rally_development:
      standard: "85% accuracy, 25+ rally depth"
      tracking: "Shot placement success rate"
    directional_precision:
      method: "Target-based cross-court/down-line"
      standard: "80% target accuracy"
      tracking: "Success rate by direction"
    power_accuracy_integration:
      power_range: "75-85% intensity"
      standard: "Power with 75% accuracy maintenance"
      tracking: "MPH and placement data"
  elite_success_metrics:
    consistency: "85% rally success (25+ shots)"
    accuracy: "80% target precision"
    power_control: "75-85% intensity with accuracy"
    movement_quality: "Professional assessment standards"
```
**MDX usage**:
```mdx
<TennisTrainingTable data={workoutData.tennis_training} />
```

#### 5. MovementPrepSection
**When to use**: For movement preparation and correctives
**YAML structure**:
```yaml
# In metadata for headers:
metadata:
  section_headers:
    movement_prep: "Elite Movement Preparation (08:20-08:40)"
    movement_method: "Sinner's Three-Dimensional Preparation"

movement_preparation:
  exercises:
    - name: "Dynamic Leg Swings"
      sets: "2"
      reps: "15 each direction"
      description: "Forward/back, side-to-side"
      focus: "Hip mobility and activation"
    - name: "Arm Circles"
      sets: "2"
      reps: "10 each direction"
      description: "Progressive size increase"
      focus: "Shoulder mobility"
  
  targeted_correctives:
    - name: "Glute Activation"
      target: "Glute medius weakness"
      method: "Clamshells with resistance"
      sets: "2x15 each side"
```
**MDX usage**:
```mdx
<MovementPrepSection 
  data={workoutData.metadata}
  exercises={workoutData.movement_preparation?.exercises}
  correctives={workoutData.movement_preparation?.targeted_correctives}
/>
```

#### 6. StrengthTrainingSection
**When to use**: For main strength exercises
**YAML structure**:
```yaml
strength_training:
  phase_description: "Phase 1: Foundation strength development using Murray's precision method"
  
  main_exercises:
    - exercise_id: "ex_1"
      name: "Back Squat"
      sets: "3"
      reps: "8"
      load: "70% 1RM"
      rest_seconds: 180
      tempo_description: "3-second descent, 1-second pause, explosive ascent"
      
      set_tracking:
        - set: 1
          target_reps: 8
        - set: 2
          target_reps: 8
        - set: 3
          target_reps: 8
      
      detailed_instructions:
        - "Maintain neutral spine throughout movement"
        - "Descend to below parallel (hip crease below knee)"
        - "Drive through heels on ascent"
        - "Keep chest up and core engaged"
      
      professional_cues:
        - "Sit back and down, not just down"
        - "Squeeze the bar to activate lats"
        - "Push the floor away"
      
      research_integration:
        - "3-second eccentric enhances strength gains (Roig et al., 2009)"
        - "Full depth squats improve functional mobility"
        - "Pause squats develop starting strength"
```
**MDX usage**:
```mdx
<StrengthTrainingSection data={workoutData.strength_training} />
```

### Advanced/Optional Components

#### 7. Phase2Integration
**When to use**: For phase-specific advanced exercises
**YAML structure**:
```yaml
strength_training:
  phase_2_integration:
    title: "Phase 2: Power Development Integration"
    exercises:
      - name: "Jump Squat Progression"
        description: "Explosive squat with 30% bodyweight"
        progression: "Week 1: 3x5, Week 2: 3x6, Week 3: 3x8"
        method: "Maximum velocity intent"
        rest: "3 minutes between sets"
        cues:
          - "Think 'jump through the ceiling'"
          - "Land softly with bent knees"
        tracking: "Jump height via app measurement"
```
**MDX usage**:
```mdx
<Phase2Integration data={workoutData.strength_training?.phase_2_integration} />
```

#### 8. TendonConditioning
**When to use**: For tendon-specific exercises
**YAML structure**:
```yaml
strength_training:
  advanced_tendon_conditioning:
    title: "Advanced Tendon Conditioning"
    exercises:
      - name: "Eccentric Calf Raises"
        method: "5-second lowering phase"
        progression: "Week 1: bodyweight, Week 2: +10lbs, Week 3: +15lbs"
        sets: "3"
        reps: "12"
        focus: "Achilles tendon strength"
        research: "Eccentric loading improves tendon stiffness"
```
**MDX usage**:
```mdx
<TendonConditioning data={workoutData.strength_training?.advanced_tendon_conditioning} />
```

#### 9. StabilityPowerBlock
**When to use**: For stability and power combination exercises
**YAML structure**:
```yaml
strength_training:
  stability_power_block:
    title: "Stability & Power Block"
    exercises:
      - name: "Single-Leg Hop to Hold"
        focus: "Reactive stability"
        method: "Hop forward, stick landing for 3 seconds"
        sets: "3"
        reps: "5 each leg"
        progression: "Distance and landing quality"
```
**MDX usage**:
```mdx
<StabilityPowerBlock data={workoutData.strength_training?.stability_power_block} />
```

#### 10. RecoveryChecklist
**When to use**: For recovery protocols and completion tracking
**YAML structure**:
```yaml
recovery_protocol:
  title: "Elite Recovery Protocol"
  
  sections:
    - category: "Immediate Post-Training"
      title: "First 30 Minutes"
      items:
        - name: "Hydration Reset"
          duration: "10 minutes"
          method: "750ml water + electrolytes"
          focus: "Cellular rehydration"
        - name: "Static Stretching"
          duration: "15 minutes"
          method: "Hold positions 30-60 seconds"
          focus: "Muscle length restoration"
    
    - category: "Evening Protocol"
      title: "Pre-Sleep Recovery"
      items:
        - name: "Contrast Shower"
          duration: "8 minutes"
          method: "3x (90s hot / 30s cold)"
          focus: "Circulation and recovery"
  
  completion_tracking:
    - item: "Hydration Target"
      description: "3L+ total water intake"
    - item: "Sleep Preparation"
      description: "Recovery protocol completed"
```
**MDX usage**:
```mdx
<RecoveryChecklist data={workoutData.recovery_protocol} />
```

## Special Components

### WorkoutCarouselFromData
**When to use**: For workout overview carousels
**YAML structure** (this data is typically embedded in other sections):
```yaml
# This component reads from multiple sections automatically
# No specific YAML structure needed - it aggregates data
```
**MDX usage**:
```mdx
<WorkoutCarouselFromData week={1} day="monday" />
```

### WorkoutNav
**When to use**: For week navigation
**No YAML needed** - uses week number prop
**MDX usage**:
```mdx
<WorkoutNav weekNumber={1} />
```

## Decision Tree for Component Selection

```
Is it an assessment/evaluation section?
├── Yes → PreWeekAssessment or ProfessionalAssessmentSection
└── No
    ├── Is it morning routine/breathing?
    │   ├── Yes → MorningProtocol
    │   └── No
    │       ├── Is it tennis-specific training?
    │       │   ├── Yes → TennisTrainingTable
    │       │   └── No
    │       │       ├── Is it movement prep/warm-up?
    │       │       │   ├── Yes → MovementPrepSection
    │       │       │   └── No
    │       │       │       ├── Is it strength training?
    │       │       │       │   ├── Yes → StrengthTrainingSection
    │       │       │       │   └── No
    │       │       │       │       ├── Is it advanced/phase-specific?
    │       │       │       │       │   ├── Yes → Phase2Integration/TendonConditioning/StabilityPowerBlock
    │       │       │       │       │   └── No
    │       │       │       │       │       └── Is it recovery/completion tracking?
    │       │       │       │       │           ├── Yes → RecoveryChecklist
    │       │       │       │       │           └── No → Create new component
```

## Creating New Components

If existing components don't fit your content:

1. **Analyze the content pattern**
2. **Check if it can be modified to fit existing components**
3. **If not, create a new component** following the pattern:
   - Create in `/src/components/workout/`
   - Follow naming convention: `SectionNameComponent.tsx`
   - Accept `data` prop with structured YAML
   - Export from appropriate index file
   - Add to MDX imports

## Common Patterns

### Checkbox Lists
```yaml
# Convert MDX checkboxes to completion tracking
items:
  - name: "Item name"
    description: "Item description"
    target: "Success criteria"
```

### Tables
```yaml
# Convert MDX tables to structured data
table_data:
  headers: ["Col 1", "Col 2", "Col 3"]
  rows:
    - ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"]
    - ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
```

### Exercise Instructions
```yaml
# Always structure as arrays for consistency
detailed_instructions:
  - "Instruction 1"
  - "Instruction 2"

professional_cues:
  - "Cue 1"
  - "Cue 2"

research_integration:
  - "Research point 1"
  - "Research point 2"
```

This mapping guide ensures consistent data structure and component usage across all workout migrations.
# Workout Migration Guide

This guide explains the systematic approach for migrating MDX workout files to YAML data structure.

## Overview

The migration system follows the pattern established with `week-1/monday.yml` where:
1. **YAML files** contain all workout data
2. **MDX files** become minimal, using React components to render YAML data
3. **Components** handle the presentation logic and formatting

## Migration Process

### Step 1: Analyze the Source MDX

Before starting migration, understand the content structure:

```bash
# Use the analyzer to understand content patterns
node scripts/migration/mdx-analyzer.js file docs/workouts/week-X/day.mdx
```

Look for:
- **Headers** (workout sections)
- **Tables** (exercise data, schedules)
- **Lists** (instructions, cues, equipment)
- **Admonitions** (tip/info/warning boxes)
- **Checkboxes** (completion tracking)
- **Navigation** (day links)

### Step 2: Create YAML Structure

1. **Copy the template**:
   ```bash
   cp workout-data/WORKOUT_TEMPLATE.yml workout-data/week-X/day.yml
   ```

2. **Fill in metadata** (week, day, title, etc.)
3. **Extract content** section by section

### Step 3: Content Extraction Patterns

#### Headers → Section Structure
```mdx
## 🌅 Elite Morning Protocol (06:00-07:15)
### ⏰ 6:00-6:20 AM: Breathing Component
```
↓
```yaml
metadata:
  section_headers:
    morning_protocol: "🌅 Elite Morning Protocol (06:00-07:15)"
    breathing_component: "⏰ 6:00-6:20 AM: Breathing Component"
```

#### Tables → Structured Data
```mdx
| Time | Exercise | Method | Standard |
|------|----------|---------|----------|
| 07:15-07:25 | Warm-up | Dynamic | High quality |
```
↓
```yaml
tennis_training:
  alcaraz_integration:
    warm_up:
      time: "07:15-07:25"
      method: "Dynamic"
      standard: "High quality"
```

#### Exercise Blocks → Exercise Objects
```mdx
### 🏋️ Exercise 1: Back Squat {#squat}

**Target:** 3 sets × 8 reps @ 70% 1RM | **Rest:** 3 minutes

#### Set Tracking:
- [ ] **Set 1:** _____ lbs × 8 reps ✓
- [ ] **Set 2:** _____ lbs × 8 reps ✓

**Technique:**
- Maintain neutral spine
- Full depth squat

**Professional Cues:**
- "Drive through heels"
- "Chest up, core tight"
```
↓
```yaml
strength_training:
  main_exercises:
    - exercise_id: "ex_1"
      name: "Back Squat"
      sets: "3"
      reps: "8"
      load: "70% 1RM"
      rest_seconds: 180
      anchor: "squat"
      
      set_tracking:
        - set: 1
          target_reps: 8
        - set: 2
          target_reps: 8
        - set: 3
          target_reps: 8
      
      detailed_instructions:
        - "Maintain neutral spine"
        - "Full depth squat"
      
      professional_cues:
        - "Drive through heels"
        - "Chest up, core tight"
```

#### Admonitions → Structured Admonitions
```mdx
:::tip Completion Tracking
Check off each component as you complete it:
:::
```
↓
```yaml
metadata:
  section_headers:
    completion_admonition:
      type: "tip"
      title: "Completion Tracking"
      content: "Check off each component as you complete it:"
```

#### Checklists → Completion Tracking
```mdx
- [ ] **Duration:** 8 minutes
- [ ] **Method:** Dynamic flow
- [ ] **Focus:** Mobility activation
```
↓
```yaml
morning_protocol:
  yoga_breathing:
    yoga_flow:
      duration: "8 minutes"
      method: "Dynamic flow"
      focus: "Mobility activation"
```

#### Navigation → Navigation Object
```mdx
**Daily Navigation:** [📋 Week Overview](./) | [Tuesday ➡️](tuesday)
```
↓
```yaml
metadata:
  navigation:
    daily: "[📋 Week Overview](./) | [Tuesday ➡️](tuesday)"
    week_overview_link: "./"
    next_day: "tuesday"
    next_day_link: "tuesday"
```

### Step 4: Update MDX File

Replace the original content with component-based structure:

```mdx
---
sidebar_position: 1
---

import WorkoutNav from '@site/src/components/WorkoutNav';
import EmailCapture from '@site/src/components/EmailCapture/EmailCapture.mdx';
import { WorkoutCarouselFromData } from '@site/src/components/workout/WorkoutDataProvider';
import { 
  PreWeekAssessment, 
  MorningProtocol, 
  TennisTrainingTable, 
  StrengthTrainingSection 
} from '@site/src/components/workout/WorkoutSections';
import {
  Phase2Integration,
  TendonConditioning,
  StabilityPowerBlock,
  RecoveryChecklist
} from '@site/src/components/workout/DynamicWorkoutSections';
import { 
  ProfessionalAssessmentSection,
  MovementPrepSection 
} from '@site/src/components/workout/ProfessionalAssessment';
import workoutData from '@site/workout-data/week-X/day.yml';

<WorkoutNav weekNumber={X} />

# {workoutData.metadata.title}

_{workoutData.metadata.subtitle}_

**Daily Navigation:** {workoutData.metadata.navigation?.daily}

<WorkoutCarouselFromData week={X} day="day" />

---

<PreWeekAssessment data={workoutData.pre_week_assessment} />

---

<MorningProtocol data={workoutData.morning_protocol} />

<ProfessionalAssessmentSection 
  data={workoutData.metadata}
  assessments={workoutData.morning_protocol?.professional_assessment?.assessments} 
/>

<TennisTrainingTable data={workoutData.tennis_training} />

<MovementPrepSection 
  data={workoutData.metadata}
  exercises={workoutData.movement_preparation?.exercises}
  correctives={workoutData.movement_preparation?.targeted_correctives}
/>

<StrengthTrainingSection data={workoutData.strength_training} />

<Phase2Integration data={workoutData.strength_training?.phase_2_integration} />

<TendonConditioning data={workoutData.strength_training?.advanced_tendon_conditioning} />

<StabilityPowerBlock data={workoutData.strength_training?.stability_power_block} />

<RecoveryChecklist data={workoutData.recovery_protocol} />

---

<EmailCapture />

---

**Navigation:** {workoutData.metadata.navigation?.daily}
```

## Component Mapping

### Available Components

| Component | Purpose | Data Source |
|-----------|---------|-------------|
| `PreWeekAssessment` | Pre-week assessments | `pre_week_assessment` |
| `MorningProtocol` | Morning routine with checkboxes | `morning_protocol` |
| `ProfessionalAssessmentSection` | Professional assessments | `professional_assessment` |
| `TennisTrainingTable` | Tennis training schedule | `tennis_training` |
| `MovementPrepSection` | Movement preparation | `movement_preparation` |
| `StrengthTrainingSection` | Main strength exercises | `strength_training.main_exercises` |
| `Phase2Integration` | Phase 2 exercises | `strength_training.phase_2_integration` |
| `TendonConditioning` | Tendon exercises | `strength_training.advanced_tendon_conditioning` |
| `StabilityPowerBlock` | Power exercises | `strength_training.stability_power_block` |
| `RecoveryChecklist` | Recovery protocol | `recovery_protocol` |

### Component Selection by Day Type

**Full Training Days** (Mon-Fri):
- All components available
- Include strength training sections
- Full morning protocol

**Recovery Days** (Sat-Sun):
- Focus on `RecoveryChecklist`
- Light `MovementPrepSection`
- Minimal strength components

**Rest Days**:
- Only `MorningProtocol`
- `RecoveryChecklist`

## Validation Checklist

After migration, verify:

### Content Completeness
- [ ] All headers converted to section structure
- [ ] All exercises have complete data (sets, reps, instructions, cues)
- [ ] All tables converted to structured data
- [ ] All checklists preserved as completion tracking
- [ ] Navigation links maintained
- [ ] All admonitions converted

### Data Structure
- [ ] YAML is valid (no syntax errors)
- [ ] All required metadata fields filled
- [ ] Component data matches expected structure
- [ ] Exercise IDs are unique
- [ ] Set tracking arrays match exercise sets

### Presentation
- [ ] MDX file builds without errors
- [ ] All sections render correctly
- [ ] Checkboxes display properly
- [ ] Tables format correctly
- [ ] Navigation works
- [ ] No content is missing from rendered page

### Performance
- [ ] File loads quickly
- [ ] No console errors
- [ ] Lighthouse score maintained

## Troubleshooting

### Common Issues

**YAML Syntax Errors**:
- Check indentation (use spaces, not tabs)
- Ensure strings with special characters are quoted
- Validate arrays have proper syntax

**Missing Components**:
- Check component imports in MDX
- Verify data structure matches component expectations
- Create new components for unique sections

**Content Not Displaying**:
- Check data path references in MDX
- Verify YAML key names match component props
- Check for undefined/null data handling

### Testing Changes

```bash
# Build and test locally
cd website
pnpm start

# Navigate to the migrated workout page
# Check for errors in browser console
# Verify all content displays correctly
```

## Next Steps

1. Choose a day to migrate (start with simpler days)
2. Follow the step-by-step process
3. Test thoroughly
4. Use the migrated day as reference for similar days
5. Create new components for unique content patterns
6. Update this guide with new patterns discovered

## Example Migration

See `week-1/monday.yml` and `docs/workouts/week-1/monday.mdx` for the complete reference implementation.
# Final Schema Patterns Documentation

This document contains the final, standardized YAML schema patterns established from the comprehensive Week 1 and Week 2 migration. These patterns should be used for implementing Weeks 3-12.

## FINAL SCHEMA STRUCTURE

### Complete Standardized Schema (Version 3.0)
Based on successful Week 1 and Week 2 implementation:

- `metadata`: Complete workout metadata with training parameters and elite methods
- `assessments`: Structured assessment protocols with full attribution
- `preparation_phases`: Morning protocols and activation sequences
- `tennis_training`: Court-based training with progressive development
- `movement_preparation`: Dynamic preparation for strength training
- `strength_training`: Progressive strength development with detailed instructions
- `recovery_protocol`: Comprehensive recovery and regeneration protocols

## MASTER TEMPLATE EXAMPLES

### Week 1 Monday - Foundation Template
**Complete structure**: 546 lines with comprehensive assessments, detailed exercise instructions, and full elite method attribution.
**Key patterns**: Baseline assessments, foundation-level loads, detailed technique instruction.

### Week 2 Monday - Progression Template  
**Enhanced structure**: 546 lines with progressive load increases, enhanced intensity protocols.
**Key patterns**: Week-over-week progression, load increases, technique refinement.

## FINAL PATTERNS FOR IMPLEMENTATION

### METADATA PATTERN (Standardized)
```yaml
metadata:
  period: 1
  period_name: "Elite Foundation"
  day_id: "week_X_dayname"
  day_name: "DayName"
  title: "Descriptive Workout Title"
  subtitle: "Week X specific subtitle with progression focus"
  phase: "Phase 1: Elite Foundation"
  focus_areas:
    - "Primary Focus Area"
    - "Secondary Focus Area"
    - "Tertiary Focus Area"
  training_parameters:
    volume: "X% (progression indicator)"
    intensity: "X-Y%"
    density: "descriptive level"
    duration: "X hours Y minutes"
  elite_methods:
    - name: "Method Name"
      type: "strength|tennis|recovery"
      attribution:
        method: "Specific method description"
        source: "Source attribution"
        verification: "Verification method"
        context: "Usage context"
```

### ASSESSMENT PATTERN (Final Standard)
```yaml
assessments:
  - id: "descriptive_assessment_name"
    type: "baseline|progression|daily|weekly"
    title: "Week X Assessment Title"
    timing: "pre-session|during|post-session"
    duration: "X minutes"
    description: "Assessment purpose and scope"
    attribution:
      source: "Assessment methodology source"
      methodology: "Development method"
      validation: "Validation approach"
      elite_use: "Elite athlete usage"
    components:
      - id: "component_identifier"
        name: "Component Display Name"
        type: "movement|strength|power|skill"
        category: "primary|secondary|optional"
        measurement:
          protocol: "Measurement protocol"
          repetitions: "Rep count or duration"
          equipment: "Required equipment"
        standards:
          elite_benchmark: "Elite level standard"
          good_standard: "Good level standard" 
          needs_work: "Improvement threshold"
        scoring:
          method: "Scoring approach"
          scale: "Scale type"
          recording: "What to record"
        context:
          description: "Why this matters"
          application: "Performance application"
```

### TENNIS TRAINING PATTERN (Final Standard)
```yaml
tennis_training:
  title: "Tennis Training Title"
  timing: "X:XX-X:XX"
  duration: "X minutes"
  description: "Training focus and intensity"
  attribution:
    source: "Tennis methodology source"
    methodology: "Training approach"
    validation: "Validation method"
    elite_use: "Professional usage"
  session_structure:
    warm_up:
      title: "Warm-up Title"
      duration: "X minutes"
      exercises:
        - name: "Exercise Name"
          duration: "X minutes"
          sets: X
          detailed_instructions:
            - "Instruction 1"
            - "Instruction 2"
    main_session:
      title: "Main Session Title"
      duration: "X minutes"
      drills:
        - name: "Drill Name"
          duration: "X minutes"
          balls: XXX
          intensity: "Intensity level"
          implementation:
            focus: "Primary focus"
            target: "Target outcome"
            progression: "Progression method"
            technique_points:
              - phase: "PHASE NAME"
                instruction: "Phase-specific instruction"
```

### STRENGTH TRAINING PATTERN (Final Standard)
```yaml
strength_training:
  title: "Strength Training Title"
  timing: "X:XX-X:XX"
  duration: "X minutes"
  description: "Training focus and progression"
  attribution:
    source: "Strength methodology source"
    methodology: "Training approach"
    validation: "Validation protocols"
    elite_use: "Professional usage"
  main_exercises:
    - name: "Exercise Name"
      sets: X
      reps: X
      rest_seconds: XXX
      load: "Load specification"
      tempo: "X-X-X-X"
      protocol: "Exercise protocol"
      tennis_application: "Tennis-specific application"
      detailed_instructions:
        title: "Instruction Title"
        technique_points:
          - phase: "PHASE NAME"
            instruction: "Phase-specific detailed instruction"
  stability_strength_block:
    title: "Core & Stability Title"
    timing: "X:XX-X:XX"
    exercises:
      - name: "Exercise Name"
        sets: X
        hold: "X seconds" # for isometric
        rest: "X seconds"
        protocol: "Exercise protocol"
        tennis_application: "Tennis application"
        detailed_instructions:
          title: "Instruction Title"
          technique_points:
            - phase: "PHASE NAME"
              instruction: "Detailed instruction"
```

### RECOVERY PROTOCOL PATTERN (Final Standard)
```yaml
recovery_protocol:
  title: "Recovery Protocol Title"
  timing: "X:XX-X:XX"
  duration: "X minutes"
  description: "Recovery focus and methods"
  attribution:
    source: "Recovery methodology source"
    methodology: "Recovery approach"
    validation: "Validation protocols"
    elite_use: "Professional usage"
  components:
    - name: "Recovery Component Name"
      duration: "X minutes"
      protocol: "Component protocol"
      implementation:
        method: "Implementation method"
        focus: "Primary focus"
        progression: "Progression approach"
```

## SPECIAL DAY PATTERNS

### Saturday Pattern - Dual Options
```yaml
workout_options:
  - option: "A"
    title: "Competition Match Play"
    description: "Full match intensity and competition focus"
  - option: "B"
    title: "Active Recovery Protocol"
    description: "Low-intensity recovery and regeneration"

option_a_match_play:
  pre_match_preparation: # phases array
  match_performance_tracking: # statistics
  post_match_recovery: # phases

option_b_active_recovery:
  low_intensity_movement: # activities
  recovery_monitoring: # metrics
```

### Sunday Pattern - Weekly Review
```yaml
weekly_review:
  physical_performance: # metrics with targets
  movement_quality: # component scores
  tennis_performance: # elements with averages

week_X_planning:
  program_modifications: # areas with assessments
  meal_preparation: # structured meal planning

daily_metrics_system:
  morning_assessment: # detailed protocols
nutrition_targets:
  nutrients: # calculations and distributions
sleep_optimization:
  environment_checklist: # factors
  sleep_routine: # time-based protocol
```

## PROGRESSIVE PATTERNS ACROSS WEEKS

### Week 1 Characteristics
- **Volume**: 100% baseline
- **Load Progression**: "Maintain perfect form priority" 
- **Assessment Focus**: Baseline establishment
- **Technique Points**: Foundation-level instruction
- **Attribution**: "Base building" and "foundation" methods

### Week 2 Characteristics  
- **Volume**: 110% (increased from baseline)
- **Load Progression**: "Add 5-10% more weight than Week 1"
- **Assessment Focus**: "Progression from Week 1 baseline"
- **Technique Points**: "Weight increase with maintained tempo control"
- **Attribution**: "Progressive overload" and "intensity building" methods

### Week 3+ Implementation Pattern
- **Volume**: Progressive increases (120%, 130%, etc.)
- **Load Progression**: "Add X% more than Week X-1" 
- **Assessment Focus**: "Assess progression from Week X-1"
- **Technique Points**: Week-specific progression focus
- **Attribution**: Phase-appropriate methods (power, competition, etc.)

## COMPONENT REQUIREMENTS FOR WEEKS 3-12

All React components are already built and tested for the standardized patterns:

### Existing Components (Ready for Weeks 3-12)
1. **PreWeekAssessment** - Handles assessment structure
2. **MorningProtocol** - Processes preparation_phases
3. **TennisTrainingTable** - Renders tennis_training with all sub-patterns
4. **StrengthTrainingSection** - Handles strength_training with technique_points
5. **RecoveryChecklist** - Processes recovery_protocol
6. **WorkoutCarouselFromData** - Timeline visualization
7. **ProfessionalAssessmentSection** - Assessment display
8. **MovementPrepSection** - Movement preparation

### Special Components (For specific days)
1. **WorkoutOptions** - Saturday dual pathways
2. **WeeklyReview** - Sunday review sections
3. **AMRAPTracking** - Max rep protocols
4. **VideoReference** - External video integration

## IMPLEMENTATION CHECKLIST FOR WEEKS 3-12

### For Each Week (Copy from Week 1-2 templates):
1. ✅ Copy YAML structure from appropriate Week 1 or Week 2 day
2. ✅ Update metadata with week number and progression parameters
3. ✅ Adjust elite_methods attribution for phase appropriateness  
4. ✅ Update training_parameters with progressive volume/intensity
5. ✅ Modify assessment titles and progression notes
6. ✅ Update exercise loads with week-appropriate progressions
7. ✅ Ensure MDX file imports workoutData correctly
8. ✅ Verify all components render properly with new data

### Quality Assurance:
- **Metadata consistency**: All day_id follow "week_X_dayname" format
- **Progressive loading**: Each week shows appropriate load increases
- **Attribution accuracy**: Elite methods match training phase
- **Component compatibility**: All YAML structures work with existing components

## FINAL SCHEMA VALIDATION

### Required Top-Level Sections (All weeks)
```yaml
metadata:          # ✅ Standardized across all weeks
assessments:       # ✅ Week-appropriate assessment types
preparation_phases: # ✅ Morning protocol standard
tennis_training:   # ✅ Progressive tennis development 
movement_preparation: # ✅ Pre-strength activation
strength_training: # ✅ Progressive strength protocols
recovery_protocol: # ✅ Session recovery protocols
```

### Optional Sections (Day-specific)
```yaml
workout_options:   # Saturday only - dual pathways
weekly_review:     # Sunday only - week analysis
mid_week_check:    # Wednesday only - readiness
competition_simulation: # Match play days
```

### Data Validation Rules
1. **day_id format**: Must be "week_X_dayname" (e.g., "week_3_monday")
2. **Progressive volume**: Must show increase from previous week
3. **Elite methods**: Must include 3-4 methods with full attribution
4. **Exercise structure**: Must include detailed_instructions with technique_points
5. **Component compatibility**: All structures must work with existing React components

## CONCLUSION

The schema is now fully standardized based on comprehensive Week 1 and Week 2 migration. All patterns, components, and validation rules are established for efficient implementation of Weeks 3-12.


### Week 1 Wednesday - 2024-01-08

**New Patterns Discovered:**
1. **Mid-Week Assessment** - Specific readiness checks with auto-regulation
2. **Competition Simulation** - Match play sets with different tactical focuses
3. **PAP Complex** - Post-activation potentiation exercise pairs
4. **AMRAP Tracking** - Recording max rep attempts
5. **Metabolic Finisher** - Work/rest interval training
6. **Contrast Breathing** - Phased breathing protocols
7. **Progress Check Items** - Structured mid-week evaluation
8. **Workout Carousel Data** - Full workout phase structure

**Schema Additions:**
```yaml
# Mid-week assessment
mid_week_assessment:
  protocol: detailed assessment steps

# Competition formats
match_play_sets: different tactical approaches

# PAP Complex
complex_tracking:
  exercise_1_reps: number
  transition_rest: string
  exercise_2_reps: number

# AMRAP tracking
amrap_tracking:
  - set: number
    target: "Max reps"
    record_field: "___"

# Work/rest intervals
work_time: string
rest_time: string

# Phased protocols
phases: array with duration and instructions

# Carousel structure
workout_carousel_data:
  phases with id, title, duration, timeRange, icon
```

**Decisions Made:**
1. **Complex exercises** - Track both parts and transition rest
2. **AMRAP format** - Use record fields for max attempts
3. **Interval training** - Use work_time/rest_time instead of sets/reps
4. **Phased recovery** - Break complex protocols into timed phases

### Week 1 Thursday - 2024-01-08

**New Patterns Discovered:**
1. **Aerobic Development Section** - Structured cardiovascular training
2. **Cardiovascular Phases** - Zone-based interval training
3. **Combination Exercises** - Side plank + clamshells format
4. **Tendon Health Protocols** - HSR-specific exercise variations
5. **Movement Quality Section** - Corrective exercise organization
6. **Skill Development Blocks** - Time-based technical skill work
7. **Zone-2 Training** - Sustained aerobic work structure
8. **Targeted Mobility by Area** - Body part specific mobility

**Schema Additions:**
```yaml
# Aerobic development
aerobic_development:
  cardiovascular_base:
    phases: array with HR targets
  core_integration: exercises within aerobic
  tendon_health: specialized protocols

# Exercise types
type: "combination" | "superset"
work: string (for combined exercises like "30s+10")

# Skill blocks
skill_development:
  blocks: array with time, technical_focus, success_criteria

# Zone training
zone_2_training:
  intensity: array of descriptors
  monitoring: array of metrics
  benefits: array of adaptations

# Targeted mobility
targeted_mobility:
  areas: array with area, exercise, duration, purpose
```

**Decisions Made:**
1. **Nested training sections** - Aerobic contains cardio, core, and tendon work
2. **Heart rate targets** - Use percentage ranges for cardiovascular work
3. **Skill blocks** - Technical work organized by time blocks with criteria
4. **Area-based mobility** - Organize by body part rather than exercise

### Week 1 Friday - 2024-01-08

**New Patterns Discovered:**
1. **Weekly Performance Assessment** - Comprehensive baseline vs current comparisons
2. **Contrast Training Complexes** - Detailed PAP protocols with transitions
3. **Plyometric Development Circuit** - Power endurance with specific metrics
4. **Power Output Assessment** - Testing vertical, broad jump, med ball throw
5. **Training Quality Review** - Daily tracking across multiple dimensions
6. **Week Completion Assessment** - Success criteria and achievement tracking

**Schema Additions:**
```yaml
# Contrast complexes
contrast_complexes:
  complex_1:
    exercises: array with transition_rest
  rest_between_complexes: string

# Plyometric circuit
plyometric_development:
  circuit:
    power_development_goals: array

# Weekly assessments
weekly_performance_assessment:
  comparison_table: baseline vs current
training_quality_review:
  days: array with multiple metrics
week_1_completion:
  objectives: array with criteria and achievement
```

### Week 1 Saturday - 2024-01-08

**New Patterns Discovered:**
1. **Workout Options** - Multiple pathways (match play or recovery)
2. **Pre-Match Preparation** - Structured 2-hour protocol
3. **Match Performance Tracking** - Competition statistics
4. **Post-Match Recovery** - Immediate recovery phases

**Schema Additions:**
```yaml
# Workout options
workout_options:
  - option: string
    title: string
    description: string

# Match play protocols
option_a_match_play:
  pre_match_preparation: phases array
  match_performance_tracking: statistics
  post_match_recovery: phases

option_b_active_recovery:
  low_intensity_movement: activities
  recovery_monitoring: metrics
```

### Week 1 Sunday - 2024-01-08

**New Patterns Discovered:**
1. **Comprehensive Weekly Review** - Multi-dimensional performance analysis
2. **Week 2 Planning** - Modifications based on Week 1
3. **Daily Metrics System** - Detailed monitoring protocols
4. **Strategic Nutrition Targets** - Personalized macronutrient planning
5. **Sleep Optimization System** - Environment and routine protocols

**Schema Additions:**
```yaml
# Weekly review
weekly_review:
  physical_performance: metrics with baselines and targets
  movement_quality: component scores and focus
  tennis_performance: elements with averages

# Planning systems
week_2_planning:
  program_modifications: areas with assessments
  meal_preparation: structured meal planning

# Monitoring systems
daily_metrics_system:
  morning_assessment: detailed protocols
nutrition_targets:
  nutrients: calculations and distributions
sleep_optimization:
  environment_checklist: factors
  sleep_routine: time-based protocol
```

---

## Pattern Catalog

### Exercise Variations
1. **Standard Exercise** (Week 1 pattern)
   - name, sets, reps, load, rest
   - set_tracking array
   - detailed_instructions
   - professional_cues
   - research_integration

2. **Phase-Based Exercise** (Week 2 pattern)
   - technique_points array with phase/instruction pairs
   - week_progression_notes object
   - detailed_title for section headers
   - per_side flag for unilateral tracking

3. **Isometric Exercise** (Week 2 core pattern)
   - duration instead of reps
   - type: "isometric"
   - set_tracking with target_duration

4. **Anti-Rotation Exercise** (Week 2 core pattern)
   - type: "anti-rotation"
   - per_side: true for alternating sides
   - hold time within instructions

### Table Structures
1. **Tennis Training Table** (Week 1)
   - Time | Component | Method | Standard | Tracking

2. **Schedule Overview Table** (Week 2)
   - Time | Exercise/Drill | Sets×Reps | Instructions
   - Supports nested exercises under time blocks

### Recovery Protocols
1. **Sectioned Recovery** (Week 1)
   - categories with items
   - completion_tracking

2. **(New recovery patterns to be documented)**

## Edge Cases

### Special Content Types
- (To be documented as discovered)

### Conditional Sections
- (To be documented as discovered)

### Cross-References
- (To be documented as discovered)

## Schema Changes Tracker

| Date | File | Change Type | Description | Impact |
|------|------|------------|-------------|---------|
| 2024-01-08 | week-2/monday | Addition | Added schedule_overview, technique_points, core_stability_block | Need new components |
| 2024-01-08 | week-2/monday | Enhancement | Enhanced tennis_training with drill_instructions | Update tennis component |
| 2024-01-08 | week-2/monday | Addition | Added key_focus_points and weekly_notes | New summary components |
| 2024-01-08 | week-2/tuesday | Addition | Added mobility_preparation section | Need MobilityPrep component |
| 2024-01-08 | week-2/tuesday | Enhancement | Tennis sessions array with multiple sessions | Need enhanced tennis renderer |
| 2024-01-08 | week-2/tuesday | Addition | Personal coaching session type | Need coaching component |
| 2024-01-08 | week-1/tuesday | Addition | Daily assessment, HSR protocol, personal coaching | Multiple new patterns |
| 2024-01-08 | week-1/wednesday | Addition | Mid-week assessment, PAP complex, AMRAP, metabolic finisher | Complex patterns |
| 2024-01-08 | week-1/thursday | Addition | Aerobic development, movement quality, skill blocks | Conditioning patterns |
| 2024-01-08 | week-1/friday | Addition | Contrast complexes, plyometrics, weekly assessments | Power patterns |
| 2024-01-08 | week-1/saturday | Addition | Workout options, match protocols | Dual pathway structure |
| 2024-01-08 | week-1/sunday | Addition | Weekly review, planning systems, monitoring protocols | Assessment patterns |
| 2024-01-09 | week-2/wednesday | Addition | AMRAP tracking, nested schedule exercises | New tracking format |
| 2024-01-09 | week-2/thursday | Enhancement | Video references, zone-2 protocols | External resources |
| 2024-01-09 | week-2/friday | Addition | Explosive tempo (X), distance tracking | Power metrics |
| 2024-01-09 | week-2/saturday | Enhancement | Refined dual options, match tracking | Competition focus |
| 2024-01-09 | week-2/sunday | Enhancement | Weekly review, nutrition summary | Recovery protocols |

## Normalization Tasks

After discovering all patterns, these normalizations will be needed:

### 1. **Instruction Normalization**
All instruction variants can be normalized to:
```yaml
# Instead of multiple formats, use:
instructions:
  - label: "SETUP"  # or phase, type, step number
    text: "Instruction text"
```
This covers: instructions, technique_points, drills, focus_areas, detailed_instructions

### 2. **Measurement/Tracking Normalization**
All metrics, assessments, and tracking can use:
```yaml
# Universal measurement format:
measurements:
  - name: "Metric name"
    baseline: "value"
    current: "value"
    target: "value"
    unit: "ms/kg/reps/%"
    change: "value"
    action: "what to do based on result"
```

### 3. **Time Specification Normalization**
Consolidate all time representations:
```yaml
# Instead of duration/time/time_range/rest_seconds:
time:
  type: "duration"  # or "range", "seconds"
  value: "20 min"   # or "07:00-07:10", "120"
```

### 4. **Exercise Structure Normalization**
Create standard exercise object that handles all variations:
```yaml
exercise:
  # Core (always present)
  name: "Exercise name"
  sets: "3"         # or "AMRAP"
  reps: "10"        # or "30s" for duration
  
  # Optional extensions
  load: "70% 1RM"
  rest: "2 min"
  type: "standard"  # or complex, isometric, etc.
  
  # Instructions (normalized format)
  instructions: [...]
  
  # Tracking (normalized format)
  tracking: [...]
```

### 5. **Section Structure Normalization**
All training sections follow pattern:
```yaml
section_name:
  title: "Display title"
  time: "time specification"
  components: []  # exercises, activities, phases, etc.
```

## Normalization Decisions

1. **Keep backwards compatibility** - Components handle both old and new formats
2. **Gradual migration** - Update files as they're edited, not all at once
3. **Prefer flat over nested** - Easier to query and transform
4. **Use type fields** - Instead of different property names
5. **Standardize field names** - "name" not "exercise", "metric", "assessment", etc.

### Week 2 Wednesday - 2024-01-09

**New Patterns Discovered:**
1. **Schedule Overview with Nested Exercises** - Time blocks containing multiple exercises
2. **Quick Exercise Instructions** - Simplified instruction format in MDX
3. **AMRAP (As Many Reps As Possible)** - New tracking format for max efforts
4. **Week Progression Notes** - Embedded in individual exercises
5. **Video References** - External video links for exercises

**Schema Additions:**
```yaml
# Exercise variations
loading:
  sets: "3"
  reps: "AMRAP"  # New format for max reps

# Tracking variations
tracking:
  type: "amrap"
  format: "sets_reps"
  sets:
    - set: 1
      target: "Max reps"
      actual: "___"

# Attribution enhancements
attribution:
  source: "Jeff Nippard - Guide Name"
  verification: "https://youtube.com/..."  # Direct links
```

### Week 2 Thursday - 2024-01-09

**New Patterns Discovered:**
1. **Week Progression in Individual Exercises** - Load increases noted per exercise
2. **Video Reference Integration** - Systematic video links for form guidance
3. **Zone-2 Training Structure** - Detailed aerobic training protocols
4. **Cardiovascular Phases** - Structured cardio with warm-up/work/cool-down

### Week 2 Friday - 2024-01-09

**New Patterns Discovered:**
1. **Explosive Tempo Notation** - "X" for explosive phase (1-1-X-1)
2. **Distance-based Exercises** - Farmer's carry with distance tracking
3. **Reactive Plyometric Structure** - Specific ground contact time metrics

### Week 2 Saturday - 2024-01-09

**New Patterns Discovered:**
1. **Dual Workout Options** - Structured choice between match/recovery
2. **Match Performance Tracking** - Competition-specific metrics
3. **Option-based Structure** - workout_options array with detailed sub-structures

### Week 2 Sunday - 2024-01-09

**New Patterns Discovered:**
1. **Weekly Review Structure** - Comprehensive performance analysis
2. **Nutrition & Recovery Summary** - Detailed recovery protocols
3. **Planning Section** - Forward-looking adjustments and goals

## Component Requirements

New components identified during migration:
1. **WorkoutOptions** - Handle dual pathway workouts (Saturday)
2. **WeeklyReview** - Comprehensive week analysis (Sunday)
3. **AMRAPTracking** - Handle max rep tracking format
4. **VideoReference** - Integrate external video links
5. **NutritionSummary** - Display recovery and nutrition guidelines
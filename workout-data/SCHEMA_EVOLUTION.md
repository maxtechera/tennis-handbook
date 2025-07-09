# Living Schema Evolution Document

This document tracks all schema patterns discovered during migration and decisions made.

## Core Schema Structure

### Version 1.0 (Based on Week 1 Monday)
- `metadata`: Basic workout information
- `pre_week_assessment`: Monday-only assessments
- `morning_protocol`: Daily morning routine
- `tennis_training`: Tennis-specific training
- `movement_preparation`: Dynamic warm-up
- `strength_training`: Main strength work
- `recovery_protocol`: Recovery activities

## Migration Log

### Week 2 Monday - 2024-01-08

**New Patterns Discovered:**
1. **Schedule Overview Table** - Time-based schedule with nested exercises
2. **Technique Points** - Phase-based instruction breakdown (SETUP, DESCENT, etc.)
3. **Drill Instructions** - Categorized tennis drill components
4. **Core & Stability Block** - Separate section for core work with isometric exercises
5. **Week Progression Notes** - Week-specific load/intensity adjustments
6. **Key Focus Points** - Categorized daily focus areas
7. **Weekly Notes** - Week-specific general notes

**Schema Additions:**
```yaml
# New top-level sections
schedule_overview:
  title: string
  sessions:
    - time: string
      activity: string
      sets_reps: string (optional)
      instructions: string (optional)
      exercises: array (optional)

# Enhanced exercise structure
technique_points:
  - phase: string
    instruction: string

week_progression_notes:
  title: string
  load_increase: string

# New exercise types
core_stability_block:
  exercises with type: "isometric" | "anti-rotation"
  duration field for timed exercises

# Tennis training enhancement
drill_instructions:
  - type: string
  - instruction: string

# Summary sections
key_focus_points:
  - category: string
    focus: string

weekly_notes:
  week: number
  content: string
```

**Decisions Made:**
1. **Nested schedule structure** - Created `schedule_overview` for time-based daily schedules
2. **Phase-based instructions** - Use `technique_points` array instead of flat instruction list
3. **Exercise variations** - Support both rep-based and time-based exercises
4. **Per-side tracking** - Added `per_side: true` flag for unilateral exercises
5. **Exercise subtitles** - Added `detailed_title` field for section headers
6. **Separate core work** - Core exercises go in `core_stability_block` not main exercises

**Components Needed:**
1. **ScheduleOverview** - Render time-based schedule tables
2. **CoreStabilityBlock** - Handle isometric and anti-rotation exercises
3. **KeyFocusPoints** - Display categorized focus areas
4. **Enhanced StrengthTrainingSection** - Support technique_points structure

### Week 2 Tuesday - 2024-01-08

**New Patterns Discovered:**
1. **Mobility Preparation Section** - Dedicated mobility work with components
2. **Tennis Sessions Array** - Multiple tennis sessions with different focuses
3. **Personal Coaching Session** - One-on-one technical work structure
4. **Component-based Instructions** - Nested components within sections
5. **Focus Areas** - Different from drills, more conceptual

**Schema Additions:**
```yaml
# New mobility section
mobility_preparation:
  title: string
  duration: string
  detailed_title: string
  components:
    - name: string
      instructions: array of phase/instruction
      exercises: array (optional)

# Enhanced tennis training
tennis_training:
  sessions: array of session objects
    - session_name: string
      duration: string
      title: string
      components:
        - name: string
          drills: array of type/instruction
          focus_areas: array (alternative to drills)

# Instruction variations
instructions: array of phase/instruction objects
exercises: array of type/instruction objects
drills: array of type/instruction objects
focus_areas: array of type/instruction objects
```

**Decisions Made:**
1. **Multiple tennis sessions** - Use `sessions` array instead of single session
2. **Component nesting** - Components can have instructions, exercises, drills, or focus_areas
3. **Flexibility in instruction format** - Support both `drills` and `focus_areas` depending on content type
4. **Mobility as top-level section** - Separate from warm-up or movement prep

**Components Needed:**
1. **MobilityPreparation** - Handle mobility-specific warm-ups
2. **TennisSessionsRenderer** - Support multiple tennis sessions
3. **PersonalCoachingSession** - Specialized component for 1-on-1 work

---

### Week 1 Tuesday - 2024-01-08

**New Patterns Discovered:**
1. **Daily Assessment with Comparison** - Table comparing metrics between days
2. **HSR Protocol** - Detailed tempo/eccentric protocols for exercises
3. **Primary Movements vs Main Exercises** - Different categorization
4. **Tennis Preparation Section** - Separate from tennis training
5. **Serve Development Phases** - Progressive skill development
6. **Volley Development Drills** - Structured progression
7. **Personal Coaching Integration** - Movement corrections + technique refinement
8. **Breathing Protocols** - Structured recovery breathing
9. **Session Documentation** - End-of-session metrics tracking

**Schema Additions:**
```yaml
# Daily assessment
daily_assessment:
  title: string
  time: string
  comparison_table:
    headers: array
    rows: array of comparison objects

# HSR Protocol in exercises
hsr_protocol: array of protocol points
specific_coaching_cues: array of cues

# Tennis preparation (separate from training)
tennis_preparation:
  exercises: array with duration instead of sets/reps

# Phased skill development
serve_development:
  phases: array with time, focus, success_metrics

# Personal coaching
personal_coaching:
  movement_corrections: corrections from assessment
  technique_refinement: skill-specific improvements

# Session tracking
session_documentation:
  metrics: array of trackable metrics
```

**Decisions Made:**
1. **Duration-based exercises** - Some exercises use duration instead of sets/reps
2. **Multi-phase progressions** - Skills broken into timed phases
3. **Comparison tracking** - Compare metrics across days
4. **Nested recovery protocols** - Breathing as subsection of recovery

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

## Component Requirements

New components identified during migration:
1. (To be filled)
2. (To be filled)
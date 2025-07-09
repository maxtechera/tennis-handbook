# Workout Data Architecture

## Overview

This directory contains the structured workout data for the 12-week Elite Tennis Training program. All workout information is stored in YAML format for easy editing and maintenance.

## Structure

```
workout-data/
├── week-1/
│   ├── monday.yml
│   ├── tuesday.yml
│   ├── wednesday.yml
│   ├── thursday.yml
│   ├── friday.yml
│   ├── saturday.yml
│   └── sunday.yml
├── week-2/
│   └── ... (same structure)
...
├── week-12/
│   └── ... (same structure)
├── INTEGRATION_ARCHITECTURE.md
├── MIGRATION_EXAMPLE.md
└── README.md
```

## YAML Data Structure

Each workout file contains comprehensive data including:

### 1. Metadata
```yaml
metadata:
  week: 1
  week_name: "Elite Foundation"
  day: "monday"
  title: "Lower Body Foundation & Tennis"
  phase: "Phase 1: Elite Foundation"
  intensity_target: "60-70%"
  athlete_methods: ["Alcaraz base building"]
```

### 2. Timeline
Complete daily schedule with activities, times, and locations

### 3. Tennis Training
Detailed drills with:
- Sets and duration
- Intensity levels
- Technical focus points
- Target areas

### 4. Strength Training
Complete exercise details:
- Sets, reps, and load
- Tempo and rest periods
- Technique cues
- Alternative exercises
- Velocity targets (VBT)

### 5. Recovery Protocols
- Nutrition timing
- Stretching routines
- Recovery tools

### 6. Metrics & Tracking
- Volume calculations
- Intensity measures
- Equipment needs

## Implementation Status

### ✅ Completed
1. Created comprehensive YAML structure for Week 1 Monday
2. Built React components for displaying workout data:
   - `WorkoutDay.tsx` - Full day view
   - `WorkoutProgramTable.tsx` - Week overview tables
   - `WorkoutLoader.ts` - Data loading utilities
3. Created CSS modules for styling
4. Built Docusaurus plugin for processing YAML
5. Documentation for migration process

### 🚧 In Progress
1. Converting remaining Week 1 days to YAML
2. Testing integration with live site

### 📋 Next Steps
1. **Immediate Actions**:
   - Extract Week 1 Tuesday-Sunday to YAML format
   - Test the plugin integration
   - Update one MDX file to use new components
   
2. **Week 2-12 Migration**:
   - Extract all workout data from existing files
   - Create YAML files for each day
   - Validate data completeness

3. **Component Enhancement**:
   - Add interactive features (collapsible sections)
   - Implement progress tracking
   - Add export functionality

4. **Future Features**:
   - User customization (load percentages)
   - Mobile app views
   - API endpoints for data access
   - Analytics integration

## Usage

### For Developers

1. **Adding/Editing Workouts**: 
   - Edit YAML files directly
   - Run build to process changes
   - Components auto-update

2. **Using in MDX**:
   ```mdx
   import WorkoutDay from '@site/src/components/workout/WorkoutDay';
   
   <WorkoutDay week={1} day="monday" view="full" />
   ```

3. **Different Views**:
   - `view="full"` - Complete workout details
   - `view="summary"` - Condensed version

### For Content Editors

1. YAML files are human-readable
2. Follow existing structure
3. Validate YAML syntax before committing
4. Test changes locally

## Benefits

1. **Single Source of Truth**: All workout data in one place
2. **Reusability**: Same data powers multiple views
3. **Maintainability**: Easy to update without touching code
4. **Extensibility**: Simple to add new fields
5. **Performance**: Optimized loading and rendering
6. **Future-Proof**: Ready for API/database migration

## Validation

Before deploying:
1. Validate all YAML files
2. Check component rendering
3. Verify no data loss from migration
4. Test responsive design
5. Ensure accessibility compliance

## Questions?

See `INTEGRATION_ARCHITECTURE.md` for technical details or `MIGRATION_EXAMPLE.md` for practical examples.
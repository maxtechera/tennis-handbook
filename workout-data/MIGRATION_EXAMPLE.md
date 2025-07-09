# Migration Example: How to Update MDX Files

## Example 1: Individual Day Page

### Before (week-1/monday.mdx):
```mdx
---
sidebar_position: 2
---

import WorkoutNav from '@site/src/components/WorkoutNav';

<WorkoutNav weekNumber={1} />

# Monday – Lower Body Foundation & Tennis

## Monday Schedule

| Time | Exercise/Drill | Sets×Reps | Instructions |
|------|---------------|-----------|--------------|}
| 07:15–08:15 | Tennis Baseline Construction | - | Focus on consistency, controlled power |
| 08:25–09:35 | Barbell Squat | 3×10 | Controlled descent, explosive ascent |
...
```

### After (week-1/monday.mdx):
```mdx
---
sidebar_position: 2
---

import WorkoutNav from '@site/src/components/WorkoutNav';
import WorkoutDay from '@site/src/components/workout/WorkoutDay';

<WorkoutNav weekNumber={1} />

<WorkoutDay week={1} day="monday" view="full" />
```

## Example 2: Week Program Table

### Before (week-program-table.md):
```md
## Week 1: Elite Foundation - Building the Base

### 📅 Monday - Lower Body Foundation & Tennis

| Time | Activity | Duration | Details |
|------|----------|----------|---------|
| 6:00-6:20 | Morning Protocol | 20 min | Elite Yoga Flow + 4-7-8 Breathing (8 cycles) |
...
```

### After (week-program-table.md):
```mdx
---
sidebar_position: 2
---

import WorkoutProgramTable from '@site/src/components/workout/WorkoutProgramTable';

# 12-Week Elite Tennis Program Overview Table

## Complete Weekly Structure with Daily Breakdowns

This comprehensive guide provides detailed daily tables for the entire 12-week elite tennis training program...

### Phase 1: Elite Foundation (Weeks 1-3)

<WorkoutProgramTable week={1} view="detailed" />
<WorkoutProgramTable week={2} view="detailed" />
<WorkoutProgramTable week={3} view="detailed" />

### Phase 2: Power Development (Weeks 4-6)

<WorkoutProgramTable week={4} view="detailed" />
<WorkoutProgramTable week={5} view="detailed" />
<WorkoutProgramTable week={6} view="detailed" />

### Phase 3: Elite Integration (Weeks 7-9)

<WorkoutProgramTable week={7} view="detailed" />
<WorkoutProgramTable week={8} view="detailed" />
<WorkoutProgramTable week={9} view="detailed" />

### Phase 4: Championship Peaking (Weeks 10-12)

<WorkoutProgramTable week={10} view="detailed" />
<WorkoutProgramTable week={11} view="detailed" />
<WorkoutProgramTable week={12} view="detailed" />

## Quick Reference Guide
[Keep existing reference content...]
```

## Example 3: Week Overview Page

### Before (week-1-plan.md):
```md
# Week 1 - Detailed Daily Training Routine

## Monday – Lower Body Foundation & Tennis

| Time | Exercise/Drill | Sets×Reps | Instructions |
|------|---------------|-----------|--------------|
...
```

### After (week-1-plan.md):
```mdx
---
sidebar_position: 3
---

import WeekOverview from '@site/src/components/workout/WeekOverview';

# Week 1 - Elite Foundation

<WeekOverview week={1} />

### Recovery & Nutrition Week 1
- Protein: 1.8–2.2 g/kg body weight
- Hydration: 2–3 liters water daily, electrolytes as needed
- Sleep: Maintain 7.5–9 hours per night
- Daily monitoring: Adjust intensity based on fatigue, soreness, and HRV data
```

## Component Benefits

### 1. **Single Source of Truth**
- All workout data in YAML files
- No duplication across different views
- Easy to update and maintain

### 2. **Consistent Presentation**
- Same data structure everywhere
- Unified styling
- Responsive design built-in

### 3. **Interactive Features**
- Expandable sections
- Filtering capabilities
- Progress tracking (future)

### 4. **Performance**
- Lazy loading of data
- Optimized rendering
- Smaller page sizes

## Data Processing Pipeline

```bash
# Future automation script
npm run process-workouts

# This will:
1. Validate all YAML files
2. Generate JSON for runtime
3. Create TypeScript types
4. Update component data
```

## Adding New Features

### Example: Add RPE Tracking
```yaml
# In YAML file
metrics:
  rpe:
    tennis: 7
    strength: 8
    overall: 7.5
```

```tsx
// In component
<RPEDisplay rpe={data.metrics.rpe} />
```

## Testing Strategy

1. **Visual Testing**: Compare old vs new renders
2. **Data Validation**: Ensure no content lost
3. **Performance**: Measure load times
4. **Accessibility**: Screen reader testing
5. **Mobile**: Responsive design verification
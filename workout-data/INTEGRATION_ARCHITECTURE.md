# Workout Data Integration Architecture

## Overview
This document outlines how YAML workout data integrates with the Docusaurus site structure.

## Data Flow Architecture

```
workout-data/
├── week-1/
│   ├── monday.yml      # Source of truth
│   ├── tuesday.yml
│   └── ...
└── components/         # React components
    ├── WorkoutDay.tsx
    ├── WorkoutTable.tsx
    └── WorkoutLoader.ts
```

## Integration Points

### 1. Individual Day Pages (`week-1/monday.mdx`)

**Current Structure:**
```mdx
---
sidebar_position: 2
---

import WorkoutNav from '@site/src/components/WorkoutNav';

<WorkoutNav weekNumber={3} />

# Monday – Lower Body Foundation & Tennis
[Static content...]
```

**New Structure:**
```mdx
---
sidebar_position: 2
---

import WorkoutNav from '@site/src/components/WorkoutNav';
import WorkoutDay from '@site/src/components/WorkoutDay';

<WorkoutNav weekNumber={1} />

<WorkoutDay week={1} day="monday" />
```

**Component Renders:**
- Full schedule table
- Detailed gym session table
- Key focus points
- Notes section

### 2. Week Program Table (`week-program-table.md`)

**Table View Requirements:**
- Condensed daily schedule
- Main exercises only (no alternatives)
- Key timing and structure
- Elite player methods highlighted

**New Structure:**
```mdx
import WorkoutProgramTable from '@site/src/components/WorkoutProgramTable';

## Week 1: Elite Foundation - Building the Base

<WorkoutProgramTable week={1} view="detailed" />
```

### 3. Week Overview Pages (`week-1-plan.md`)

**Current:** Static tables for each day

**New Structure:**
```mdx
import WeekOverview from '@site/src/components/WeekOverview';

# Week 1 - Elite Foundation

<WeekOverview week={1} />
```

**Renders:**
- Condensed daily tables
- Week metrics summary
- Phase information
- Recovery protocols

### 4. Workout Navigation Component

**Enhanced WorkoutNav:**
```tsx
// Reads metadata from YAML to show:
- Current phase and week
- Daily focus
- Progress indicators
- Quick stats (volume, intensity)
```

## Component Architecture

### Core Components

```typescript
// 1. Data Loader Utility
// src/utils/workoutLoader.ts
export interface WorkoutData {
  metadata: WorkoutMetadata;
  timeline: TimelineEntry[];
  tennis_training: TennisTraining;
  strength_training: StrengthTraining;
  // ... all YAML fields typed
}

export async function loadWorkoutData(week: number, day: string): Promise<WorkoutData> {
  // Load and parse YAML file
}

// 2. Main Day Component
// src/components/WorkoutDay.tsx
export default function WorkoutDay({ week, day }: { week: number; day: string }) {
  const data = useWorkoutData(week, day);
  
  return (
    <>
      <DayHeader metadata={data.metadata} />
      <ScheduleTable timeline={data.timeline} />
      <TennisSection training={data.tennis_training} />
      <GymSection training={data.strength_training} />
      <RecoverySection protocol={data.recovery_protocol} />
      <NotesSection notes={data.coaching_notes} />
    </>
  );
}

// 3. Table Components
// src/components/WorkoutTables.tsx
export function ScheduleTable({ timeline }: { timeline: TimelineEntry[] }) {
  // Renders the time-based schedule table
}

export function GymSessionTable({ exercises }: { exercises: Exercise[] }) {
  // Renders detailed exercise table with all parameters
}

// 4. Week Overview Component
// src/components/WeekOverview.tsx
export default function WeekOverview({ week }: { week: number }) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return days.map(day => (
    <DayOverviewTable week={week} day={day} />
  ));
}
```

## Data Display Levels

### Level 1: Navigation (Minimal)
- Week/Day metadata
- Phase information
- Basic stats

### Level 2: Week Table (Summary)
```yaml
# Only these fields used:
- metadata.title
- timeline (condensed)
- strength_training.exercises (name, sets, reps, load only)
- metrics.volume
```

### Level 3: Day Overview (Detailed)
```yaml
# Most fields except:
- equipment (shown separately)
- level_modifications (collapsible)
- tracking (advanced section)
```

### Level 4: Full Day View (Complete)
- All YAML data rendered
- Interactive elements
- Tracking capabilities

## Build vs Runtime Loading

### Recommended Approach: Hybrid

1. **Build Time:**
   - Process YAML files into JSON
   - Generate static pages for SEO
   - Create manifest of available workouts

2. **Runtime:**
   - Load specific workout data on demand
   - Enable interactive features
   - Support future personalization

### Implementation Steps:

```javascript
// docusaurus.config.js - Add plugin
plugins: [
  [
    './plugins/workout-data-plugin',
    {
      dataDir: './workout-data',
      outputDir: './src/data/workouts'
    }
  ]
]

// plugins/workout-data-plugin.js
module.exports = function workoutDataPlugin(context, options) {
  return {
    name: 'workout-data-plugin',
    async loadContent() {
      // Process YAML files
      // Generate JSON outputs
    },
    async contentLoaded({ content, actions }) {
      // Create data files for components
    }
  };
};
```

## Responsive Design Considerations

### Mobile View
- Collapsed exercise details
- Swipeable day navigation
- Condensed tables

### Tablet View
- Side-by-side tennis/gym
- Expandable sections

### Desktop View
- Full tables with all columns
- Multi-day comparison views

## Future Extensibility

### 1. Personalization
```yaml
# User profile integration
user_modifications:
  load_percentage: 0.85  # 85% of prescribed
  skip_exercises: ["overhead_press"]
  add_exercises: ["face_pulls"]
```

### 2. Progress Tracking
```yaml
# Completion data
completed:
  date: "2024-01-15"
  actual_loads:
    squat: "100kg"
    bench: "80kg"
  notes: "Felt strong today"
```

### 3. API Integration
```typescript
// Future API endpoints
GET /api/workouts/{week}/{day}
POST /api/workouts/{week}/{day}/complete
GET /api/workouts/recommendations
```

## Migration Strategy

### Phase 1: Create Components (Week 1)
1. Build core components
2. Test with Week 1 data
3. Validate all views

### Phase 2: Migrate Existing Weeks (Week 2)
1. Convert existing content to YAML
2. Update MDX files to use components
3. Verify no content loss

### Phase 3: Complete Integration
1. Add remaining weeks
2. Implement advanced features
3. Add analytics/tracking

## Component Props Interface

```typescript
// Shared interfaces
interface WorkoutComponentProps {
  week: number;
  day: string;
  view?: 'full' | 'summary' | 'compact';
  highlights?: string[];
  interactive?: boolean;
}

// Table-specific props
interface WorkoutTableProps extends WorkoutComponentProps {
  showAlternatives?: boolean;
  showTechniqueCues?: boolean;
  showVelocity?: boolean;
  collapsible?: boolean;
}

// Custom hooks
function useWorkoutData(week: number, day: string) {
  // Load and cache workout data
}

function useWorkoutProgress(week: number) {
  // Track user progress
}
```

## Style Considerations

### CSS Classes
```css
.workout-table
.workout-table--compact
.workout-exercise
.workout-exercise--highlighted
.workout-timeline
.workout-metric
```

### Theming
- Support dark/light modes
- Color coding for intensity levels
- Visual indicators for completed workouts

## Performance Optimizations

1. **Lazy Loading**: Load workout data only when needed
2. **Caching**: Cache parsed YAML data
3. **Code Splitting**: Separate components per week
4. **Static Generation**: Pre-render common views

## Testing Strategy

1. **Unit Tests**: Component rendering
2. **Integration Tests**: Data loading
3. **Visual Tests**: Table layouts
4. **E2E Tests**: User workflows

This architecture provides:
- Clean separation of data and presentation
- Reusability across different views
- Future-proof extensibility
- Performance optimization
- Consistent user experience
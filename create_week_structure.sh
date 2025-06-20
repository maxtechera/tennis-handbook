#!/bin/bash

# Create basic structure for weeks 2-12
for week in {2..12}; do
    echo "Creating structure for Week $week..."
    
    # Create the directory
    mkdir -p "docs/workouts/week-$week"
    
    # Create index.mdx
    cat > "docs/workouts/week-$week/index.mdx" << EOF
---
sidebar_position: 2
---

import WorkoutNav from '@site/src/components/WorkoutNav';

<WorkoutNav weekNumber={$week} />

# Week $week - Training Overview

_Week $week training program and daily structure_

## Week $week Objectives

Detailed week objectives and focus areas will be added here.

## Training Schedule

- **Monday**: Lower Body & Tennis
- **Tuesday**: Upper Body & Tennis Skills  
- **Wednesday**: Power & Conditioning
- **Thursday**: Aerobic & Technical Work
- **Friday**: Explosive & Agility
- **Saturday**: Match or Recovery
- **Sunday**: Rest & Recovery

---

**Navigate to specific days using the tabs above.**
EOF

    # Create daily files
    for day in monday tuesday wednesday thursday friday saturday sunday; do
        day_title=$(echo $day | sed 's/./\U&/')
        cat > "docs/workouts/week-$week/$day.mdx" << EOF
---
sidebar_position: 2
---

import WorkoutNav from '@site/src/components/WorkoutNav';

<WorkoutNav weekNumber={$week} />

# $day_title - Week $week

_$day_title training session for Week $week_

## Training Session

Training content for $day_title of Week $week will be detailed here.

### Session Structure
- Warm-up
- Main training
- Cool-down

### Performance Tracking
- Key metrics
- RPE tracking
- Technical notes

---

**Use the navigation above to move between days and weeks.**
EOF
    done
    
    echo "Week $week structure created!"
done

echo "All week structures created successfully!"
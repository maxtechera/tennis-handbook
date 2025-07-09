# Week 1 Monday Review - Current vs Normalized Patterns

## Current Structure Analysis

### 1. **MDX File (monday.mdx)**
- Clean and minimal (73 lines)
- Component-based rendering
- All data comes from YAML
- Good separation of concerns

### 2. **YAML File (monday.yml)**
Current unique patterns that MUST be preserved:

#### Unique Data Elements
1. **Timeline Array** (lines 141-195)
   - Has phase_id, phase_title, phase_icon for carousel
   - Time-based workout phases
   - Location tracking

2. **Movement Screen Array** (lines 53-75)
   - Multiple optional fields per assessment
   - Research citations
   - Different fields for different exercises

3. **Professional Monitoring** (lines 124-132)
   - Unique protocol descriptions
   - Not just simple measurements

4. **Section Headers in Metadata** (lines 38-45)
   - Used by components for display
   - Contains admonition structure

## Normalization Opportunities (WITHOUT DATA LOSS)

### 1. **Instructions Pattern**
Current variations in monday.yml:
```yaml
# Pattern 1: Simple array (line 268)
professional_notes:
  - "Note 1"
  - "Note 2"

# Pattern 2: Detailed instructions (line 922)
detailed_instructions:
  - "Lower the barbell slowly over 3 seconds"
  - "Pause briefly at chest level"

# Pattern 3: Professional cues (line 944)
professional_cues:
  - "Sit back and down like sitting in a chair"
  - "Drive through heels, not toes"
```

Could normalize to:
```yaml
instructions:
  type: "notes|detailed|cues"  # Preserve the intent
  items:
    - "Instruction text"
```

### 2. **Time Specifications**
Current variations:
```yaml
# Pattern 1: duration field
duration: "20 minutes"

# Pattern 2: rest_seconds
rest_seconds: 150

# Pattern 3: time ranges
time_start: "6:00"
time_end: "7:15"
```

### 3. **Assessment/Measurement Pattern**
Current has rich, varied fields:
```yaml
- name: "Single-leg Glute Bridge Test"
  reps: "15 reps each leg"
  assessment: "Force assessment"  # Unique field
  research: "Test gluteal force capability"  # Unique field
  imbalance_detection: ">20% difference"  # Unique field
```

## Recommendations

### 1. **Keep All Current Data**
- Don't force normalization if it loses meaning
- The current structure works well with components
- Unique fields provide valuable context

### 2. **Add Type Hints**
Instead of changing structure, add type fields:
```yaml
movement_screen:
  - name: "Assessment Name"
    type: "force_test"  # Helps components know what fields to expect
    # ... all current fields remain
```

### 3. **Document Pattern Variations**
Rather than force everything into one pattern, document the variations:
- Movement assessments can have: research, imbalance_detection, elite_standard, etc.
- Exercises can have: detailed_instructions, professional_cues, tennis_applications
- Time can be: duration, seconds, ranges

### 4. **Component Flexibility**
Components should handle optional fields gracefully:
```tsx
// Component checks for field existence
{exercise.detailed_instructions && (
  <InstructionList items={exercise.detailed_instructions} type="detailed" />
)}
{exercise.professional_cues && (
  <InstructionList items={exercise.professional_cues} type="cues" />
)}
```

## Conclusion

The current monday.yml structure is actually quite good:
1. **It's already normalized** in many ways (consistent exercise structure)
2. **Rich data is preserved** through optional fields
3. **Components handle variations** well
4. **No data loss** from original MDX

Rather than forcing strict normalization, we should:
1. Document the patterns that exist
2. Make components flexible to handle variations
3. Use the template as a guide, not a strict schema
4. Preserve all the rich, specific data that makes each workout unique
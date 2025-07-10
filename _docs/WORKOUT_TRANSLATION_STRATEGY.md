> **Status: ACTIVE** | Last updated: 2025-07-10

# Workout YAML Translation Strategy

> Created: 2025-01-09
> Purpose: Define translation approach for 84 workout YAML files

## Current State

### Files Requiring Translation
- **84 YAML workout files** in `/workout-data/` directory
- Structured across 12 weeks (week-1 through week-12)
- 7 files per week (monday.yml through sunday.yml)
- Currently **NOT tracked** by the translation system

### Translation System Gap
The current translation system (`translation-status.json`) only tracks:
- MDX files in `docs/` directory
- Spanish translations in `i18n/es/docusaurus-plugin-content-docs/current/`
- Does NOT track YAML data files

## Translation Requirements

### Fields Requiring Translation
Each YAML file contains approximately 50-100 translatable strings:

1. **Metadata Section**
   - `title`: Workout title
   - `subtitle`: Workout subtitle  
   - `focus_areas`: Array of focus area descriptions
   - `elite_methods[].name`: Method names
   - `elite_methods[].attribution.context`: Context descriptions

2. **Assessment Sections**
   - `title`: Assessment titles
   - `description`: Assessment descriptions
   - `components[].name`: Component names
   - `components[].measurement.protocol`: Protocol descriptions
   - `components[].notes`: Assessment notes

3. **Training Sections**
   - `exercises[].name`: Exercise names
   - `exercises[].instructions`: Detailed instructions
   - `exercises[].protocol`: Protocol descriptions
   - `exercises[].tennis_application`: Tennis-specific applications
   - `exercises[].implementation.focus`: Focus points
   - `exercises[].implementation.execution`: Execution details

4. **Recovery Sections**
   - `components[].name`: Recovery method names
   - `components[].protocol`: Recovery protocols
   - `components[].implementation.method`: Implementation methods

## Proposed Translation Architecture

### Option 1: Parallel YAML Structure (Recommended)
Create Spanish YAML files alongside English files:
```
workout-data/
├── week-1/
│   ├── monday.yml          (English)
│   ├── monday.es.yml       (Spanish)
│   ├── tuesday.yml
│   ├── tuesday.es.yml
│   └── ...
```

**Pros:**
- Clean separation of languages
- Easy to maintain and update
- Can be loaded conditionally based on locale
- Preserves original structure

**Cons:**
- Requires updating import logic
- Duplicate file management

### Option 2: Embedded Translations
Add Spanish translations within the same YAML:
```yaml
title: 
  en: "Elite Lower Body Foundation"
  es: "Fundación Elite de Tren Inferior"
```

**Pros:**
- Single source of truth
- Easier to keep in sync

**Cons:**
- Makes YAML files complex
- Requires significant refactoring
- Harder to maintain

### Option 3: Translation JSON Files
Create separate translation JSON files:
```
translations/
├── week-1/
│   ├── monday.json
│   └── ...
```

**Pros:**
- Standard i18n approach
- Can use existing tools

**Cons:**
- Disconnected from source
- Complex key management

## Implementation Plan

### Phase 1: Infrastructure (Week 1)
1. Update `workout-data-plugin` to support locale-based loading
2. Create translation helper functions
3. Set up file structure for Spanish YAMLs
4. Create translation tracking system for YAML files

### Phase 2: Priority Translations (Week 2-3)
Based on quality scores from WORKOUT_COMPLETION_TRACKER.md:
1. Translate Week 1 (highest quality, 78-93% scores)
2. Translate Week 3 & 4 (good examples, 81-88% scores)
3. Create translation templates and guidelines

### Phase 3: Full Translation (Week 4-6)
1. Translate remaining weeks (2, 5-12)
2. Focus on improving low-quality workouts before translation
3. Implement quality checks for translations

## Translation Priority Matrix

| Week | Priority | Reason | Quality Score |
|------|----------|--------|---------------|
| 1 | 🔴 High | Best quality, foundation week | 84% avg |
| 3 | 🔴 High | Phase completion, good examples | 81% avg |
| 4 | 🔴 High | Phase 2 intro, velocity training | 81% avg |
| 2 | 🟡 Medium | Good foundation progression | 79% avg |
| 5-6 | 🟡 Medium | Power integration phase | 72% avg |
| 7-9 | 🟢 Low | Needs quality improvement first | 64% avg |
| 10-12 | 🟢 Low | Needs major rewrite first | 54% avg |

## Key Spanish Terms Glossary

### Training Terms
- Sets → Series
- Reps → Repeticiones  
- Rest → Descanso
- Load → Carga
- Tempo → Tempo
- Duration → Duración
- Intensity → Intensidad

### Exercise Categories
- Lower Body → Tren Inferior
- Upper Body → Tren Superior
- Power → Potencia
- Strength → Fuerza
- Assessment → Evaluación
- Recovery → Recuperación

### Tennis-Specific
- Serve → Servicio/Saque
- Forehand → Derecha
- Backhand → Revés
- Rally → Peloteo
- Footwork → Trabajo de Pies
- Court → Cancha

## Quality Assurance

### Translation Validation
1. Technical accuracy of exercise descriptions
2. Consistency of terminology across files
3. Cultural appropriateness for Spanish-speaking audience
4. Preservation of elite athlete attributions
5. Correct translation of measurements and units

### Review Process
1. Initial translation by qualified Spanish-speaking fitness professional
2. Technical review by tennis coach
3. Final review by native Spanish speaker
4. User testing with target audience

## Automation Opportunities

### Translation Memory
- Build glossary of common terms
- Create reusable translation segments
- Automate repetitive translations

### Validation Scripts
- Check for missing translations
- Verify terminology consistency
- Validate YAML structure
- Track translation progress

## Next Steps

1. **Immediate**: Update workout-data-plugin for locale support
2. **Week 1**: Translate Week 1 Monday as pilot
3. **Week 2**: Complete Week 1 translations
4. **Month 1**: Complete Phase 1 weeks (1-3)
5. **Month 2**: Complete all high-quality weeks
6. **Month 3**: Improve and translate remaining weeks

## Success Metrics

- 100% field coverage (no missing translations)
- Consistent terminology across all files
- Load time performance maintained
- User engagement metrics in Spanish market
- Error-free YAML parsing in both languages
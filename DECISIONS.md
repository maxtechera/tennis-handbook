# Architecture & Technical Decisions

## Project Structure

### Monorepo vs Separate Repos
**Decision**: Keep website in root directory (moved from `/website`)
**Rationale**: Simpler deployment, easier navigation, follows Docusaurus conventions
**Date**: 2024-12

### Content Organization
**Decision**: Two-sidebar system (Training Guide + Weekly Workouts)
**Rationale**: Clear separation between theory and practice, better UX for different use cases
**Date**: 2024-12

## Technology Choices

### Framework
**Decision**: Docusaurus v3.8.1
**Rationale**: 
- Best-in-class documentation framework
- Built-in i18n support
- Great SEO out of the box
- Static site generation
**Date**: 2024-11

### Styling
**Decision**: CSS Modules + Docusaurus theming
**Rationale**: Maintains consistency with Docusaurus, lightweight, no additional dependencies
**Date**: 2024-11

### Package Manager
**Decision**: pnpm
**Rationale**: Faster installs, better monorepo support, disk space efficient
**Date**: 2024-11

## Content Decisions

### Translation Strategy
**Decision**: English as source, manual translation to Spanish
**Rationale**: 
- Maintains quality over machine translation
- Allows for cultural adaptation
- Better for SEO in Spanish markets
**Date**: 2025-06

### Exercise Documentation
**Decision**: Detailed written instructions over videos
**Rationale**:
- Faster to produce and update
- Better for SEO
- No hosting costs
- Accessible offline
**Date**: 2024-12

### Workout Structure
**Decision**: 12-week progressive program
**Rationale**: 
- Standard training cycle length
- Allows for proper adaptation
- Matches most tennis seasons
**Date**: 2024-11

## Infrastructure

### Hosting
**Decision**: GitHub Pages
**Rationale**: Free, reliable, integrates with GitHub workflow
**Date**: 2024-11

### Domain
**Decision**: tennis-training.dev
**Rationale**: Developer-friendly TLD, clear purpose, available
**Date**: 2024-11

### Analytics
**Decision**: TBD - Considering privacy-first options
**Options**: Plausible, Fathom, or Simple Analytics
**Date**: Pending

## Development Workflow

### Git Strategy
**Decision**: Feature branches with descriptive names
**Rationale**: Clear history, easy rollbacks, supports collaboration
**Date**: 2024-11

### Commit Standards
**Decision**: Conventional commits where applicable
**Rationale**: Better changelog generation, clear intent
**Date**: 2025-06

### Testing
**Decision**: Manual testing for now, automated tests for critical paths later
**Rationale**: Fast iteration in early stages, will add tests as project matures
**Date**: 2024-12

## Future Considerations

### Mobile App
**Status**: Under consideration
**Options**: PWA vs React Native
**Timeline**: After web platform stable

### User Accounts
**Status**: Not planned for v1
**Rationale**: Keep it simple, focus on content
**Future**: May add for progress tracking

### Monetization
**Status**: Content remains free
**Options**: Premium content, coaching marketplace, affiliate programs
**Timeline**: After significant traffic achieved
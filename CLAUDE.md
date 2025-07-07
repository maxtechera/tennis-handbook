# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docusaurus-powered website for Elite Tennis Training Research - a comprehensive collection of research-backed tennis-specific training programs and methodologies. The project focuses on elite coaching methods from Olympic gold medalist coaches and ATP tour fitness experts working with world #1 players.

## Project Context

- **Linear Project**: [Tennis Handbook](https://linear.app/max-techera/project/tennis-handbook)
- **Current Phase**: Progressive Disclosure Implementation
- **Documentation Hub**: See _docs/README.md for all docs
- **Active Work**: Check _docs/ACTIVE_SPRINT.md
- **Key Decisions**: See _docs/context/decisions.json

## Memory Sync Points

1. **Before Starting Work**:
   - Check PROJECT_STATUS.md for current state
   - Read _docs/ACTIVE_SPRINT.md for today's priorities
   - Review _docs/context/decisions.json for recent decisions
   - Check git status for work in progress

2. **During Work**:
   - Update Linear issues when starting tasks
   - Document decisions in _docs/context/decisions.json
   - Check _docs/context/constraints.md before implementing
   - Reference _docs/context/patterns.md for proven approaches

3. **After Work**:
   - Update _docs/ACTIVE_SPRINT.md with daily notes
   - Update PROJECT_STATUS.md if metrics change
   - Commit with descriptive messages
   - Update Linear issue status

## 🔑 Key Context

- **Spanish users = 3x engagement** (validated)
- **Target price = €19-29/month** Spanish first
- **Current phase = Progressive disclosure** implementation
- **Never break 95+ Lighthouse** performance scores
- **Strategy**: Daily Training Revolution (not just content)

## Development Commands

### Setup
```bash
cd website
nvm use 20
pnpm install
```

### Development
```bash
pnpm start          # Start development server at http://localhost:3000
pnpm build          # Build for production
pnpm serve          # Serve built site locally
pnpm clear          # Clear Docusaurus cache
pnpm typecheck      # Run TypeScript type checking
```

### Deployment
```bash
pnpm deploy         # Deploy to GitHub Pages
```

## Architecture Overview

### Project Structure
- **Root**: Contains README.md and project-level documentation
- **website/**: Main Docusaurus application containing all website code and content
- **source-archive/**: Backup of original markdown files (not actively used)

### Website Architecture
- **Docusaurus v3.8.1** with TypeScript support
- **Two main sidebar configurations**: Training Guide and Weekly Workouts
- **Custom React components** for enhanced homepage experience
- **Static site generation** optimized for documentation

### Key Configuration Files
- `website/docusaurus.config.ts`: Main site configuration, navigation, metadata
- `website/sidebars.ts`: Defines navigation structure for both main sidebars
- `website/package.json`: Dependencies and scripts
- `website/tsconfig.json`: TypeScript configuration extending Docusaurus defaults

### Content Organization
All content lives in `website/docs/` with the following structure:
- `training-philosophy/`: Elite coaching methods and philosophies
- `exercises/`: Comprehensive exercise database
- `programming/`: Training program design and templates
- `specialized/`: Advanced methods (tendon health, power development, etc.)
- `recovery/`: Recovery protocols and methods
- `nutrition/`: Performance and daily nutrition guidance
- `assessment/`: Performance testing and monitoring
- `workouts/`: 12-week progressive training program

### Component Structure
- **Homepage**: Custom React components with tennis-specific content paths
- **Layout**: Standard Docusaurus theming with custom CSS overrides
- **Navigation**: Two-sidebar system separating training theory from workout plans

## Development Notes

### Content Management
- All content editing should be done in `website/docs/` directories
- Markdown files use frontmatter with `sidebar_position` for ordering
- Links use Docusaurus markdown linking syntax: `[text](/path/to/doc)`

### Styling
- Custom CSS in `website/src/css/custom.css`
- Uses Docusaurus CSS variables and theming system
- Responsive design with mobile-first approach

### Node.js Requirements
- Node.js 18+ required (project uses Node.js 20 via nvm)
- Uses pnpm as package manager
- TypeScript configured for React and Docusaurus types

### Deployment Configuration
- Configured for GitHub Pages deployment
- Production URL: https://tennis-training.dev
- Organization: elite-tennis, Project: tennis-training
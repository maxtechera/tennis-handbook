# Tennis Handbook Documentation Consolidation - Implementation Checklist

**Created**: January 2025  
**Purpose**: Step-by-step guide for consolidating _docs directory for Claude Code optimization  
**Time Estimate**: 4-6 hours  

## Phase 1: Preparation & Backup (30 min)

- [ ] Create backup of entire _docs directory
- [ ] Review current git status to ensure clean working state
- [ ] Create new branch: `docs/consolidation-claude-code`
- [ ] Update TodoWrite with detailed task list

## Phase 2: Archive Cleanup (45 min)

### Delete Outdated Archive Files
- [ ] Delete `Archive/STRATEGIC-PLATFORM-OPTIONS.md` (superseded by Strategy/STRATEGY.md)
- [ ] Delete `Archive/STRATEGIC-SUMMARY.md` (outdated strategic thinking)
- [ ] Delete `Archive/business-context.md` (superseded by Strategy/BUSINESS-MODEL.md)
- [ ] Delete `Archive/platform-evolution-prd.md` (superseded by Strategy/PLATFORM-ROADMAP.md)
- [ ] Delete `Archive/CLEANUP-SUMMARY.md` (documentation cleanup already done)
- [ ] Delete `Archive/pr-summary.md` (historical PR, no ongoing value)
- [ ] Delete `Archive/project-timeline.md` (historical milestones, outdated)
- [ ] Delete `Archive/program-optimization-summary.md` (completed optimization)
- [ ] Delete `Archive/DEPLOYMENT.md` (generic deployment guide)
- [ ] Delete `Archive/DOCUMENTATION-GAPS-ANALYSIS.md` (gaps already addressed)

### Archive Completed Implementation Guides
- [ ] Move `Implementation/convertkit-setup.md` to Archive (setup complete)
- [ ] Move `Implementation/implementation-guide.md` to Archive (email capture done)
- [ ] Move `Implementation/testing-guide.md` to Archive (testing complete)
- [ ] Move `Implementation/api-deployment.md` to Archive (API deployed)

### Keep for Reference
- [ ] Keep `Archive/convertkit-multi-touchpoint-plan.md` (future feature ideas)
- [ ] Keep `Archive/convertkit-simple-implementation.md` (implementation reference)

## Phase 3: Content Consolidation (90 min)

### 1. Create Master STRATEGY.md at Root
- [ ] Start with `_docs/Strategy/STRATEGY.md` as base
- [ ] Add revenue model section from `_docs/Strategy/BUSINESS-MODEL.md`
- [ ] Add implementation timeline from `_docs/Strategy/PROGRESSIVE-DISCLOSURE-STRATEGY.md`
- [ ] Add technical roadmap summary from `_docs/Strategy/PLATFORM-ROADMAP.md`
- [ ] Structure:
  ```markdown
  # Tennis Handbook Strategy
  ## Executive Summary
  ## Strategic Direction (Daily Training Revolution)
  ## Spanish Market Advantage (3x engagement)
  ## Revenue Model (€19-29/month)
  ## Progressive Disclosure Strategy
  ## Implementation Roadmap
  ## Success Metrics
  ```

### 2. Create ARCHITECTURE.md at Root
- [ ] Start with `_docs/Implementation/TECHNICAL-ARCHITECTURE.md` as base
- [ ] Add technical decisions from `_docs/Strategy/IMPLEMENTATION-GUIDE.md`
- [ ] Add performance requirements and benchmarks
- [ ] Add ConvertKit integration patterns
- [ ] Structure:
  ```markdown
  # Tennis Handbook Architecture
  ## Tech Stack (Docusaurus 3.8.1, TypeScript, React)
  ## Performance Requirements (95+ Lighthouse)
  ## Progressive Enhancement Approach
  ## i18n Architecture
  ## ConvertKit Integration
  ## Deployment Pipeline
  ```

### 3. Create ACTIVE_SPRINT.md at Root
- [ ] Current sprint goals from Linear
- [ ] Active experiments (email capture optimization)
- [ ] Technical tasks with acceptance criteria
- [ ] Daily standup notes section
- [ ] Structure:
  ```markdown
  # Active Sprint: [Date Range]
  ## Sprint Goals
  ## Active Experiments
  ## Technical Tasks
  ## Blockers
  ## Daily Notes
  ```

### 4. Update PROJECT_STATUS.md
- [ ] Add quick metrics snapshot section
- [ ] Add last 5 key decisions with rationale
- [ ] Add active branches with purpose
- [ ] Keep current sprint focus
- [ ] Link to ACTIVE_SPRINT.md for details

## Phase 4: Context System Setup (60 min)

### Create Context Directory
- [ ] Create `_docs/context/` directory
- [ ] Create `decisions.json` with structure:
  ```json
  {
    "decisions": [
      {
        "date": "2025-01-15",
        "decision": "Implement progressive disclosure",
        "rationale": "Users overwhelmed by 300+ pages",
        "outcome": "Email signups increased 2x",
        "reversible": true
      }
    ]
  }
  ```

- [ ] Create `patterns.md` with:
  - Spanish content gets 3x engagement
  - Email capture via 7-day PDF works
  - Progressive enhancement maintains SEO
  - Test with Spanish users first

- [ ] Create `constraints.md` with:
  - Never break 95+ Lighthouse scores
  - Don't promise to make users pros
  - Avoid complex JavaScript
  - No aggressive monetization

## Phase 5: Documentation Updates (45 min)

### Update _docs/README.md
- [ ] Create new index with clear categorization
- [ ] Add quick start section for Claude Code
- [ ] Link to all active documents
- [ ] Remove references to deleted files

### Update Root CLAUDE.md
- [ ] Add memory hooks section
- [ ] Update file references
- [ ] Add quick context section
- [ ] Update development notes

### Clean Up References
- [ ] Update any cross-references in kept documents
- [ ] Remove links to deleted documents
- [ ] Ensure all paths are correct

## Phase 6: Validation & Commit (30 min)

### Validation Checklist
- [ ] All strategic information preserved
- [ ] No duplicate content remains
- [ ] All links work correctly
- [ ] Claude Code can find key information
- [ ] Spanish market data prominently featured

### Git Operations
- [ ] Stage all changes
- [ ] Create detailed commit message
- [ ] Push to branch
- [ ] Create PR with summary of changes

## Success Criteria

✅ **Reduced file count**: 25+ files → ~15 active files  
✅ **Clear hierarchy**: Strategy → Technical → Reference  
✅ **No duplication**: Each document has unique purpose  
✅ **Claude Code optimized**: Quick context loading  
✅ **Spanish focus**: Strategy embedded throughout  

## Key Content That MUST Be Preserved

1. **Spanish Market Advantage**
   - 3x engagement metrics
   - Spanish-first strategy
   - €19-29 pricing validation

2. **Business Model**
   - 218,400 serviceable market
   - Revenue projections
   - Unit economics (15:1 to 30:1 LTV:CAC)

3. **Technical Decisions**
   - Docusaurus 3.8.1 architecture
   - Performance requirements
   - Progressive enhancement

4. **Brand Voice**
   - "Actually" positioning
   - Elite coach methodologies
   - No false promises

5. **Current Status**
   - Progressive disclosure implementation
   - ConvertKit integration complete
   - Spanish translation 100%

## Notes

- Keep commits atomic and descriptive
- Test navigation after each major change
- Ensure PROJECT_STATUS.md stays current
- Update Linear with progress
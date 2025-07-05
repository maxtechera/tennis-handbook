# Documentation Standards

Battle-tested conventions for founder-led projects. Start sparse, grow as needed.

---

## 🚀 Start Sparse Principle

**Only create folders when you have content.** Most projects need just 3 folders to start:

```
/_docs/                          # Your documentation root
  00_PROJECT_OVERVIEW/           # Vision & strategy (START HERE)
  01_PRODUCT/                    # What you're building
  06_OPERATIONS/                 # Daily work & AI memory
    context/                     # MANDATORY - AI agent memory
      decisions.json
      patterns.md
      constraints.md
```

Add other folders only when you have real content for them. Empty folders = confusion.

---

## 📁 Full Structure (When Mature)

```
/_docs/
  00_PROJECT_OVERVIEW/   # Vision, strategy, business model
  01_PRODUCT/            # Roadmap, features, user research
  02_TECH_ARCHITECTURE/  # Architecture, ADRs, deployment
  03_MARKETING/          # Growth experiments, audience analysis
  04_CONTENT/            # Content strategy, localization
  05_BRAND/              # Guidelines, voice, assets
  06_OPERATIONS/         # Current work, decisions, AI memory ⚡
  07_EXTERNAL/           # Third-party docs, API references, vendor keys
  99_TEMPORARY/          # Scratch work, archive
```

### Naming Rules
- `lower-kebab-case.md` for all files
- ADRs: `adr-001-topic.md` (increment number)
- Meeting notes: `2024-01-15-topic.md`
- Git commits: `docs: [description]` prefix
- .gitignore: Add `*.tmp`, `*-draft.md`, `.DS_Store`

---

## 🧠 AI Memory System (MANDATORY)

```
06_OPERATIONS/context/
  decisions.json     # Every significant decision with rationale
  patterns.md        # What works well in this project
  constraints.md     # What to avoid, gotchas, failures
```

This is NOT optional. It's how AI agents maintain context across sessions.

### decisions.json Template
```json
{
  "decisions": [
    {
      "date": "2024-01-15",
      "decision": "Use Docusaurus for documentation site",
      "rationale": "Best for 100+ workout files, built-in i18n for Spanish",
      "alternatives_considered": ["Next.js", "Hugo"],
      "outcome": "SUCCESS - Fast build times, great SEO"
    }
  ]
}
```

---

## 📄 Essential Templates

### vision.md (00_PROJECT_OVERVIEW) - START WITH THIS
```markdown
# [Project Name] Vision

> **Status: ACTIVE** | Last updated: YYYY-MM-DD

## What We're Building
[One paragraph - what is this?]

## Why It Matters
[The problem we're solving]

## 3-Year Vision
[Where we want to be]

## Success Metrics
- [Specific measurable outcome]
- [Another metric]

## Key Insights
- [Unique market insight]
- [Technical advantage]

Related: [[roadmap]], [[business-model]]
```

### roadmap.md (01_PRODUCT) - REQUIRED
```markdown
# Product Roadmap

> **Status: ACTIVE** | Last updated: YYYY-MM-DD

## Current Sprint
[What we're building right now]

## Next 30 Days
- [ ] Feature 1
- [ ] Feature 2

## Next Quarter
- Major initiative 1
- Major initiative 2

## 12-Month Vision
[Where the product will be]

Related: [[current-sprint]], [[progressive-disclosure]]
```

### current-sprint.md (06_OPERATIONS) - REQUIRED
```markdown
# Current Sprint

> **Status: ACTIVE** | Daily updates

## Active Tasks
- [x] Completed task
- [ ] In progress task
- [ ] Upcoming task

## Daily Updates
### 2024-01-15
- Completed X
- Blocked on Y
- Tomorrow: Z

### 2024-01-14
- [Previous updates...]

Related: [[roadmap]], [[implementation-checklist]]
```

### ADR Template (02_TECH_ARCHITECTURE)
```markdown
# ADR-001: [Decision Title]

> **Status: ACCEPTED** | Date: YYYY-MM-DD

## Context
[What situation forced this decision?]

## Decision
[What we decided to do]

## Consequences
**Positive:**
- [Good outcome]

**Negative:**
- [Trade-off we accepted]

Related: [[adr-002]], [[architecture-overview]]
```

---

## 🎯 Project-Specific Content ONLY

**Before writing anything, ask:** "Could this apply to any project?"
- If YES → Delete it
- If NO → Keep it

### ✅ Keep (Project-Specific)
- Your API keys, form IDs, endpoints
- Your market insights ("Spanish users = 3x engagement")
- Your architectural decisions for THIS project
- Your user research findings
- Vendor-specific setup (ConvertKit form #12345)

### ❌ Remove (Generic)
- How to write clean code
- What REST APIs are
- Generic best practices
- Standard deployment steps

### 📁 External Vendor Docs (07_EXTERNAL)
Store project-specific external integrations:
```
07_EXTERNAL/
  convertkit-integration.md    # YOUR form IDs, sequences, automation
  stripe-setup.md              # YOUR product IDs, webhook endpoints
  vercel-config.md            # YOUR env vars, domain config
```
Never store generic "how to use X" - only YOUR configuration.

---

## 🔄 Lifecycle States (Just Two!)

```markdown
> **Status: ACTIVE** | Last updated: 2024-01-15
```

- **ACTIVE** – This is current truth
- **ARCHIVED** – No longer accurate (move to 99_TEMPORARY/archive/)

That's it. No DRAFT, no DEPRECATED. Either it's true or it's not.

---

## 🚨 Consolidation Triggers

Time to consolidate when you see:
- Multiple files with overlapping content
- `STRATEGY.md` + `Strategy/STRATEGY.md` situations  
- More than 10 files in one folder
- Similar file names (`email-capture-flow.md`, `email-implementation.md`)

### Consolidation Process
1. Read all related files
2. Create unified document with clear sections
3. Archive originals with note: "Consolidated into [new-file.md]"
4. Update all references

---

## 🤖 Agent Workflows

### Quick Paths
```
Current work:    /_docs/06_OPERATIONS/current-sprint.md
Decisions:       /_docs/06_OPERATIONS/context/decisions.json
Vision:          /_docs/00_PROJECT_OVERVIEW/vision.md
Roadmap:         /_docs/01_PRODUCT/roadmap.md
Architecture:    /_docs/02_TECH_ARCHITECTURE/adr/
External APIs:   /_docs/07_EXTERNAL/
```

### Common Agent Tasks
| Task | Action | Location |
|------|--------|----------|
| **Daily standup** | Update progress bullets | `06_OPERATIONS/current-sprint.md` |
| **New decision** | Append to decisions array | `06_OPERATIONS/context/decisions.json` |
| **Tech choice** | Create `adr-XXX-topic.md` | `02_TECH_ARCHITECTURE/adr/` |
| **API setup** | Document keys, endpoints | `07_EXTERNAL/service-name.md` |
| **Found issue** | Add to constraints | `06_OPERATIONS/context/constraints.md` |
| **What works** | Add to patterns | `06_OPERATIONS/context/patterns.md` |

---

## ✅ Weekly Health Check (2 min)

Every Monday:
- [ ] Is current-sprint.md updated?
- [ ] Any duplicate content brewing?
- [ ] Empty folders to remove?
- [ ] decisions.json current?
- [ ] Any docs without status headers?

---

## 🔨 Implementation Workflow

### Starting New Project
1. Create `/_docs/` with only 00, 01, 06 folders
2. Copy vision.md template → Fill it out
3. Copy roadmap.md template → Define next 30 days
4. Create current-sprint.md → List this week's tasks
5. Initialize context/ folder with empty JSON files

### Daily Flow
1. Update current-sprint.md with progress
2. Big decision? → Add to decisions.json
3. Technical choice? → Create ADR
4. New insight? → Update patterns.md or constraints.md

### Before Creating New Doc
1. Can this go in existing doc? → Add section
2. Multiple related files? → Consolidate first
3. Truly new topic? → Create with status header

### Cross-linking Implementation
- Use relative paths: `../01_PRODUCT/roadmap.md`
- Link related docs at bottom: `Related: [[adr-001]], [[roadmap]]`
- In 00_PROJECT_OVERVIEW/index.md, maintain full navigation map

---

## 📋 Migration Checklist

When your docs get messy:
- [ ] Run consolidation on duplicate content
- [ ] Move old docs to 99_TEMPORARY/archive/
- [ ] Ensure all active docs have status headers
- [ ] Update index.md with current structure
- [ ] Remove empty folders
- [ ] Verify context/ system is current

### Automated Migration (for agents)
```json
{
  "migration_rules": [
    {
      "pattern": "multiple files with 'strategy' in name",
      "action": "merge",
      "target": "00_PROJECT_OVERVIEW/vision.md"
    },
    {
      "pattern": "email-*.md or *-email.md files",
      "action": "consolidate", 
      "target": "01_PRODUCT/features/[feature-name]-spec.md"
    },
    {
      "pattern": "decisions in various docs",
      "action": "extract",
      "target": "06_OPERATIONS/context/decisions.json"
    }
  ]
}
```

---

## 🎓 Why This Works

1. **Sparse Start** prevents over-engineering
2. **AI Memory** maintains context across sessions
3. **Simple States** (active/archived) reduce confusion
4. **Templates** ensure consistency without overhead
5. **Consolidation** fights natural documentation sprawl
6. **Project-Specific** focus keeps docs valuable

Remember: Documentation should help, not hinder. Start simple, grow as needed.

---

## 🔧 Claude Code Configuration

Add to your project's CLAUDE.md to enforce these standards:

```markdown
## Documentation Rules (MANDATORY)

1. **All docs go in /_docs/** - No exceptions
2. **Start with only 3 folders**: 00_PROJECT_OVERVIEW, 01_PRODUCT, 06_OPERATIONS
3. **Every decision goes in** `/_docs/06_OPERATIONS/context/decisions.json`
4. **Check before creating**: Can this go in an existing doc?
5. **Status headers required**: Every .md file needs `> **Status: ACTIVE** | Last updated: YYYY-MM-DD`

### Quick Paths for Claude
- Current work: `/_docs/06_OPERATIONS/current-sprint.md`
- Decisions: `/_docs/06_OPERATIONS/context/decisions.json`
- Vision: `/_docs/00_PROJECT_OVERVIEW/vision.md`

### Before Creating Any Doc
Ask yourself: "Could this apply to any project?" If yes, don't create it.
```

### Auto-setup Script
```bash
#!/bin/bash
# setup-docs.sh - Run this when starting any project
mkdir -p _docs/{00_PROJECT_OVERVIEW,01_PRODUCT,06_OPERATIONS/context}
echo '{"decisions": []}' > _docs/06_OPERATIONS/context/decisions.json
echo '# Patterns\n\n## What works well\n- ' > _docs/06_OPERATIONS/context/patterns.md
echo '# Constraints\n\n## What to avoid\n- ' > _docs/06_OPERATIONS/context/constraints.md
echo "✅ Documentation structure created. Start with vision.md!"
```
# Documentation Standards Guide

**Last Updated**: January 2025  
**Purpose**: Ensure consistency and high quality across all Tennis Handbook documentation  
**Scope**: All files within the `_docs` directory

## 📋 File Naming Conventions

### Standard Format

Use **kebab-case** for all documentation files:

- ✅ `business-context.md`
- ✅ `api-deployment.md`
- ✅ `user-validation-toolkit.md`
- ❌ `BUSINESS_CONTEXT.md`
- ❌ `ApiDeployment.md`
- ❌ `MAX-73-CONVERTKIT-SETUP.md`

### Exceptions

- `README.md` - Always uppercase for visibility
- Acronyms stay together: `api-deployment.md` not `a-p-i-deployment.md`

### Category Prefixes

Avoid redundant category prefixes in filenames:

- ✅ `_docs/04-Email-Capture-Feature/implementation-guide.md`
- ❌ `_docs/04-Email-Capture-Feature/email-capture-implementation-guide.md`

## 🏗️ Document Structure

### Required Metadata Header

Every document must start with:

```markdown
# Document Title

**Last Updated**: YYYY-MM-DD  
**Status**: Draft | Active | Deprecated  
**Category**: Business | Technical | Feature | Process  
**Related**: [Link to related docs]
```

### Content Organization

1. **Purpose Statement** - One paragraph explaining why this document exists
2. **Key Concepts** - Bullet points of main ideas
3. **Detailed Content** - Organized with clear headings
4. **Next Steps** - Actionable items or related documents

### Heading Hierarchy

- `#` - Document title only
- `##` - Major sections
- `###` - Subsections
- `####` - Rarely used, only for detailed breakdowns

## 🎯 Content Quality Standards

### Tennis Handbook Specifics

Every document should reinforce our three core advantages:

1. **Elite Coach Methods** - Reference Ferrero/Panichi when relevant
2. **Spanish Market Opportunity** - Include Spanish considerations
3. **Content-First Strategy** - Emphasize depth over features

### Writing Style

- **Active Voice**: "We discovered Spanish users engage 3x more"
- **Specific Data**: "3x engagement" not "much higher engagement"
- **Clear Value**: Why does this matter for Tennis Handbook?
- **Actionable**: What should the reader do with this information?

### Avoid Generic Content

❌ "This document describes our technical architecture"  
✅ "Our Docusaurus + static site architecture enabled the 3x Spanish engagement discovery"

## 📊 Documentation Categories

### 01. Business Strategy

**Purpose**: Strategic decisions and market positioning  
**Key Documents**:

- `business-context.md` - Market opportunity and positioning
- `strategic-summary.md` - Current strategic options
- `platform-options.md` - Decision framework

### 02. Technical Architecture

**Purpose**: Technical decisions that enable business strategy  
**Key Documents**:

- `technical-architecture.md` - System design and rationale
- `api-deployment.md` - Implementation guides

### 03. Content Management

**Purpose**: Our competitive moat through content  
**Key Documents**:

- `content-taxonomy.md` - Organization system
- `notion-integration/` - Knowledge extraction

### 04. Email Capture Feature

**Purpose**: Converting traffic to audience  
**Key Documents**:

- `convertkit-requirements.md` - Business requirements
- `implementation-guide.md` - Technical implementation

### 05. Technique Learning Feature

**Purpose**: Future platform evolution  
**Key Documents**:

- `architecture.md` - System design
- `implementation-plan.md` - Rollout strategy

### 06. Internationalization

**Purpose**: Our biggest discovery and advantage  
**Key Documents**:

- `structure.md` - Technical implementation
- `translation-guide.md` - Quality process

### 07. Miscellaneous

**Purpose**: Supporting tools and frameworks  
**Key Documents**:

- `knowledge-extraction.md` - Pattern capture
- `user-validation-toolkit.md` - Research frameworks

## 🔄 Maintenance Guidelines

### Regular Reviews

- Monthly: Check for outdated information
- Quarterly: Validate strategic alignment
- Annually: Major reorganization if needed

### Update Triggers

- New feature launches
- Strategic pivots
- Major discoveries (like 3x Spanish engagement)
- Team growth requiring onboarding

### Deprecation Process

1. Mark status as "Deprecated" in header
2. Add deprecation notice with alternative
3. Keep for 6 months for reference
4. Archive to `_docs/archive/` if still valuable

## ✅ Quality Checklist

Before committing any documentation:

- [ ] Follows naming conventions
- [ ] Has complete metadata header
- [ ] Reinforces Tennis Handbook advantages
- [ ] Contains specific, not generic content
- [ ] Includes actionable next steps
- [ ] Links to related documents
- [ ] Free of typos and formatting issues

## 🚀 Quick Start for New Documents

```bash
# Create new document with template
cat > _docs/CATEGORY/new-document.md << 'EOF'
# Document Title

**Last Updated**: $(date +%Y-%m-%d)
**Status**: Draft
**Category**: [Business | Technical | Feature | Process]
**Related**: [Links to related docs]

## 🎯 Purpose

One paragraph explaining why this document exists and its unique value for Tennis Handbook.

## 📋 Key Concepts

- Main idea 1 with Tennis Handbook context
- Main idea 2 with specific data
- Main idea 3 with actionable insight

## 🏗️ [Main Content Section]

### Subsection
Content that reinforces our advantages...

## 🚀 Next Steps

1. Immediate action
2. Follow-up task
3. Related reading

---

*How this connects to Tennis Handbook's success formula: [Brief explanation]*
EOF
```

---

_This standards guide ensures every piece of documentation reinforces Tennis Handbook's unique advantages while maintaining professional quality and consistency._

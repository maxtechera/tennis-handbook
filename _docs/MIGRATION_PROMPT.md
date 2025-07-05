# Documentation Migration Prompt

Use this prompt to initiate documentation migration in any project:

---

## Migration Initiation Prompt

```
I need to migrate my project documentation to follow the new documentation standards. Please execute a parallel agent migration following these steps:

1. First, read the documentation standards at: _docs/DOCUMENTATION_STANDARDS.md

2. Analyze my current documentation structure by:
   - Listing all files in docs/, _docs/, or similar folders
   - Identifying documentation types (technical, product, operations, etc.)
   - Finding duplicate or overlapping content
   - Checking for existing organization patterns

3. Create a migration plan that:
   - Maps current files to new structure (00-99 folders)
   - Identifies consolidation opportunities
   - Preserves project-specific content only
   - Removes generic best practices

4. Execute the migration using parallel agents where possible:
   - Agent 1: Merge strategy/vision documents
   - Agent 2: Consolidate feature documentation
   - Agent 3: Create ADRs from past decisions
   - Agent 4: Migrate technical/operational docs

5. Focus on:
   - Start sparse - only create folders with content
   - Preserve AI memory system (context folder)
   - Add lifecycle headers to all docs
   - Keep only project-specific information

6. After migration:
   - Update navigation index
   - Create migration tracker showing what moved where
   - Validate all files have status headers
   - Ensure no broken cross-references

The goal is clean, project-specific documentation that helps rather than hinders.
```

---

## Quick Version (for familiar users)

```
Migrate my docs to the new standards (_docs/DOCUMENTATION_STANDARDS.md). 
Start sparse, consolidate duplicates, keep project-specific only, preserve AI memory.
Use parallel agents for speed. Create migration tracker when done.
```

---

## Post-Migration Validation

After migration completes, run these checks:

```
Please validate the migration:
1. Check all docs have lifecycle headers
2. Verify no empty folders exist
3. Confirm decisions.json is current
4. Test cross-links work correctly
5. Ensure only project-specific content remains
```
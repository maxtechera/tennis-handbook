# Spanish Translation Guide

This project uses LibreTranslate for Spanish translations with Docusaurus i18n.

## Quick Start

### 1. Start LibreTranslate

```bash
docker compose -f docker-compose.libretranslate.yml up -d
```

Note: First run will download language models (takes a few minutes).

### 2. Translate Files

```bash
# Single file
node scripts/translate.js docs/intro.md

# Overwrite existing
node scripts/translate.js docs/intro.md --force
```

### 3. View Spanish Site

```bash
pnpm start:es
```

The site will be available at `http://localhost:3000/es/`

## Translating All Files

```bash
# Translate all documentation
for file in docs/**/*.md; do
  node scripts/translate.js "$file"
  sleep 1
done
```

## Building for Production

```bash
pnpm build:es
```

## Manual Improvements

Edit files in `i18n/es/docusaurus-plugin-content-docs/current/` to improve translations.

## Important: Link Translation Pattern

**CRITICAL:** When translating files, ensure internal links use **relative paths** instead of absolute paths:

### ❌ Wrong (causes broken links)
```markdown
[Training Philosophy](/training-philosophy/overview)
[12-Week Program](/workouts/overview)
[Exercise Database](/exercises/exercise-database)
```

### ✅ Correct (works with i18n)
```markdown
[Training Philosophy](training-philosophy/overview)
[12-Week Program](workouts/overview)
[Exercise Database](exercises/exercise-database)
```

### Cross-section links (use relative paths)
```markdown
[Professional Standards](../professional-standards)
[Exercise Database](../exercises/exercise-database)
```

**Why:** Docusaurus i18n expects relative paths so it can automatically handle locale routing:
- English: `/docs/training-philosophy/overview`
- Spanish: `/es/docs/training-philosophy/overview`

Absolute paths break this automatic routing and cause 404 errors in translated versions.

## Troubleshooting

If translation fails:

1. Check LibreTranslate is running: `docker ps`
2. Wait for language models to download on first run
3. Check logs: `docker logs libretranslate`

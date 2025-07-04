# i18n Folder Structure

This document explains how Docusaurus i18n works for maintaining English as the source and translating to Spanish.

## Key Concepts

1. **English is the source** - All content in `/docs` is in English
2. **Spanish is a translation** - Spanish content lives in `/i18n/es/`
3. **Language selector** - Automatically appears in the navbar
4. **Single codebase** - No need for separate commands

## Folder Structure

```
tennis-workout/
├── docs/                      # English source files (you edit these)
│   ├── intro.md
│   ├── equipment-guide.md
│   └── ...
│
├── i18n/es/                   # Spanish translations (generated)
│   ├── code.json              # UI translations (buttons, etc.)
│   ├── docusaurus-theme-classic/
│   │   ├── navbar.json        # Navbar translations
│   │   └── footer.json        # Footer translations
│   └── docusaurus-plugin-content-docs/
│       ├── current.json       # Sidebar labels
│       └── current/           # Translated markdown files
│           ├── intro.md
│           ├── equipment-guide.md
│           └── ...
```

## How It Works

### Language Selector

- Docusaurus automatically adds a language dropdown in the navbar
- Users can switch between English and Spanish
- URLs change: `/docs/intro` → `/es/docs/intro`

### Translation Workflow

1. **Edit English content** in `/docs`
2. **Run translation** `node scripts/translate.js docs/file.md`
3. **Spanish file created** in `/i18n/es/.../current/`
4. **Both languages available** immediately

### What Gets Translated

- **Markdown content** - Automatically via LibreTranslate
- **UI strings** - Already translated in navbar.json, footer.json
- **Sidebar labels** - Translated in current.json
- **Page metadata** - Title, description in frontmatter

### Fallback Behavior

- If a Spanish translation doesn't exist, English is shown
- This means you can translate incrementally
- Priority pages first, others later

## Commands

```bash
# Start dev server (supports both languages)
pnpm start

# Build for production (both languages)
pnpm build

# Translate a file
node scripts/translate.js docs/intro.md

# Force retranslate
node scripts/translate.js docs/intro.md --force
```

## No Separate Commands Needed!

You DON'T need:

- ❌ `pnpm start:en` and `pnpm start:es`
- ❌ `pnpm build:en` and `pnpm build:es`
- ❌ Duplicate configuration files
- ❌ Separate deployments

Just use:

- ✅ `pnpm start` - Serves both languages
- ✅ `pnpm build` - Builds both languages
- ✅ One deployment - Users choose their language

## Best Practices

1. **Always edit English files** - Never edit Spanish translations directly
2. **Retranslate after changes** - Use `--force` flag
3. **Review important content** - Medical/safety information
4. **Test both languages** - Check formatting preserved

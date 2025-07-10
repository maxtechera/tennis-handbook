# Tenis Manual Localization Guide

**Document Status**: 🟢 Active  
**Lifecycle**: Per Sprint Updates  
**Last Updated**: January 2025  
**Linear Project**: [Tenis Manual](https://linear.app/max-techera/project/tennis-handbook)

---

## 🚀 Quick Start

### Check Translation Status

```bash
# Run verification script
node scripts/check-translations.js
```

Shows:

- ✅ Updated files
- ⚠️ Files needing update
- ❌ Missing translations

### Translate Specific File

```bash
# Get instructions for specific file
node scripts/translate-file.js workouts/week-1/monday.mdx
```

## 🛠️ Translation Workflow

### When Modifying English Content:

1. **After editing English files**, run:

   ```bash
   node scripts/check-translations.js
   ```

2. **Review report** to identify files needing translation

3. **Request Claude Code** to translate:

   ```
   "I've modified English content. The script detected these files need updating:

   [copy list from script]

   Please translate/update these files maintaining all React components and structure."
   ```

4. **Verify build** after completion:
   ```bash
   pnpm build
   ```

## 📋 Available Scripts

### `check-translations.js`

- **Purpose**: Verify complete translation status
- **Output**: Detailed report + JSON + suggested commands
- **Usage**: `node scripts/check-translations.js`

### `translate-file.js`

- **Purpose**: Analyze specific file for translation
- **Output**: File info + Claude Code instructions
- **Usage**: `node scripts/translate-file.js <relative-path>`

## 🎾 Tennis-Specific Terminology

### Core Terms (ES → EN)

- **entrenamiento** → training
- **ejercicio** → exercise
- **sesión** → session
- **semana** → week
- **potencia** → power
- **fuerza** → strength
- **movilidad** → mobility
- **tendinoso** → tendon
- **pliométrico** → plyometric
- **elástico** → elastic/resistance band

### Technical Terms

- **trabajo de tendones** → tendon work
- **desarrollo de potencia** → power development
- **preparación física** → physical preparation
- **periodización** → periodization
- **sobrecarga progresiva** → progressive overload

### Spanish Player References

- Always use Spanish players as primary examples
- Alcaraz, Nadal, Ferrer for Spanish content
- Maintain cultural relevance

## 🎯 Best Practices

### For Translations:

1. **Verify regularly** (after each editing session)
2. **Translate in small batches** (5-10 files) for accuracy
3. **Always verify build** after translations
4. **Maintain terminology consistency**

### For Claude Code:

1. **Provide clear context** about files to translate
2. **Preserve all technical elements**:

   - React components (`<WorkoutNav>`, etc.)
   - Frontmatter (`sidebar_position`, etc.)
   - Markdown tables
   - Video references
   - Internal links

3. **Cultural adaptation**:
   - Use metric system for Spanish
   - Spanish player examples
   - Local tournament references
   - Culturally appropriate metaphors

## 🔧 Advanced Configuration

### Add to package.json

```json
{
  "scripts": {
    "check-translations": "node scripts/check-translations.js",
    "translate-help": "node scripts/translate-file.js",
    "build-check": "pnpm build && echo '✅ Build successful'"
  }
}
```

### Git Integration

Pre-commit hook example:

```bash
#!/bin/sh
echo "🔍 Checking translation status..."
node scripts/check-translations.js
```

## 📊 Understanding Reports

### Console Report

- **✅ Updated**: Translations current
- **⚠️ Outdated**: English modified after Spanish
- **❌ Missing**: Files without translation

### JSON Output (`translation-status.json`)

- Numeric summary
- Detailed file list
- Modification dates
- Full paths

## 🚨 Troubleshooting

### MDX Build Errors

1. Check unescaped characters (`<`, `>`, `&`)
2. Verify Markdown table syntax
3. Ensure React components are correct

### Date Issues

- Script uses Git for accurate dates
- Falls back to filesystem dates
- Commit changes for better accuracy

### Missing Files

1. Verify `.md` or `.mdx` extension
2. Check not in ignored patterns
3. Confirm in `docs/` directory

## 🌐 Spanish Market Focus

### Key Differences

- **Community emphasis** over individual
- **WhatsApp preference** over email
- **Video content critical** (82% preference)
- **PDF downloads popular** for gym use

### Translation Guidelines

1. Maintain warm, direct tone
2. Use "nosotros" for inclusivity
3. Reference Spanish tennis culture
4. Adapt metaphors culturally

### Quality Checklist

- [ ] All tennis terms consistent
- [ ] Spanish players as examples
- [ ] Metric system used
- [ ] Cultural references appropriate
- [ ] Build passes without errors

---

**Remember**: Spanish market shows 3x engagement. Quality translations directly impact revenue potential.

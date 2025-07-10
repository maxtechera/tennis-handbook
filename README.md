> **Status: ACTIVE** | Last updated: 2025-07-10

# Elite Tennis Training Website

This is a Docusaurus-powered website for the Elite Tennis Training Research Collection, featuring comprehensive, research-backed tennis-specific training programs.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (managed via nvm)
- pnpm package manager

### Installation

```bash
# Install and use Node.js 20
nvm install 20
nvm use 20

# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm start
```

The site will be available at `http://localhost:3000`

## 📁 Project Structure

```
website/
├── docs/                    # Training content
│   ├── training-philosophy/ # Elite training methods
│   ├── exercises/           # Exercise database
│   ├── programming/         # Training programming
│   ├── specialized/         # Advanced methods
│   ├── recovery/            # Recovery protocols
│   ├── nutrition/           # Nutrition support
│   ├── assessment/          # Assessment methods
│   └── workouts/            # 12-week program
├── src/                     # React components
├── static/                  # Static assets
├── docusaurus.config.ts     # Site configuration
└── sidebars.ts             # Navigation structure
```

## 🎾 Content Features

- **Elite Training Philosophy**: Methods from world-class coaches
- **Exercise Database**: Comprehensive tennis-specific exercises
- **12-Week Program**: Progressive training plans
- **Recovery Protocols**: Advanced recovery methods
- **Assessment Tools**: Performance monitoring systems

## 🛠️ Available Scripts

```bash
# Development
pnpm start          # Start dev server
pnpm build          # Build for production
pnpm serve          # Serve built site locally
pnpm clear          # Clear cache

# Deployment
pnpm deploy         # Deploy to GitHub Pages
```

## 🌐 Deployment

### GitHub Pages

1. Update `docusaurus.config.ts` with your GitHub info:

   ```ts
   organizationName: "your-github-username";
   projectName: "tennis-training";
   ```

2. Deploy:
   ```bash
   pnpm deploy
   ```

### Other Platforms

The built site (in `build/`) can be deployed to any static hosting service:

- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

## 📝 Content Management

### Adding New Content

1. Create markdown files in appropriate `docs/` subdirectories
2. Add frontmatter with `sidebar_position` for ordering
3. Update `sidebars.ts` if creating new sections

### Updating Existing Content

Simply edit the markdown files - changes will be reflected immediately in development mode.

## 🎨 Customization

- **Styling**: Edit `src/css/custom.css`
- **Layout**: Modify React components in `src/`
- **Configuration**: Update `docusaurus.config.ts`
- **Navigation**: Edit `sidebars.ts`

## 📚 Documentation

- [Docusaurus Documentation](https://docusaurus.io/)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [Configuration](https://docusaurus.io/docs/configuration)

## 🏆 Tennis Training Content

This website contains elite-level tennis training methodologies from:

- Carlos Alcaraz & Juan Carlos Ferrero
- Jannik Sinner & Marco Panichi
- Evidence-based sports science research
- Comprehensive 12-week training programs

---

_Built with ❤️ using Docusaurus for the tennis community_

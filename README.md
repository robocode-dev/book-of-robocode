# The Book of Robocoding

“May your aim be true and your dodges unpredictable.” — Adopted Robocode Community Motto

_Build the best - destroy the rest!_

[![Deploy Documentation](https://github.com/robocode-dev/robocoding/actions/workflows/deploy.yml/badge.svg)](https://github.com/robocode-dev/robocoding/actions/workflows/deploy.yml)

A structured, modern knowledge base covering **Robocode** and **Robocode Tank Royale**—from fundamentals and physics to
movement, targeting, and competitive strategy—distilling two decades of community experience.

---

## 📦 Deployable Documentation

The site is automatically deployed to **GitHub Pages** via **GitHub Actions**. Pushing changes to `main` triggers a new
build and publication at:

🔗 **Live Site**: https://robocode-dev.github.io/robocoding/

---

## 🎯 Purpose

**The Book of Robocoding** unifies knowledge previously scattered across RoboWiki.net, forums, and historical sources.
It focuses on concepts, strategy patterns, math, and reasoning (code examples appear when they clarify concepts;
otherwise pseudocode is preferred). The goal is to teach principles that transfer between the classic Java-based
Robocode and Robocode Tank Royale.

---

## 📚 What's Inside

### Articles

- What is Robocode?
- Physics (game mechanics & formulas)
- Scoring
- Coordinates and Angles
- History (classic Robocode → Tank Royale)
- Targeting Systems
- Movement & Evasion
- Energy Management
- Radar & Scanning
- Team Robots
- Robocode Tank Royale Differences
- Glossary
- References & Credits

### Tutorials

- Getting Started
- My First Bot
- Beyond the Basics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ (for building the site)
- npm or yarn

### Local Development

1. Clone
   ```bash
   git clone https://github.com/robocode-dev/robocoding.git
   cd robocoding
   ```
2. Install
   ```bash
   npm install
   ```
3. Develop
   ```bash
   npm run dev
   ```
   Serves at: http://localhost:8080/robocoding/ (or as shown in your terminal)
4. Build
   ```bash
   npm run build
   ```
   Output: `docs/.vuepress/dist/`

---

## 🛠️ Technology Stack

- VuePress 1.x (static site generator)
- Vue 2
- KaTeX (math rendering)
- markdown-it (Markdown parsing)
- GitHub Pages (hosting)

---

## 📝 Project Structure

```
robocoding/
├── docs/
│   ├── .vuepress/
│   │   ├── config.js          # VuePress configuration
│   │   ├── styles/
│   │   │   ├── index.styl     # Custom styles (dark mode)
│   │   │   └── palette.styl   # Color palette
│   │   └── public/
│   │       ├── robocode-logo.svg
│   │       └── favicon.ico
│   ├── articles/              # Article pages
│   ├── tutorial/              # Tutorial pages
│   └── README.md              # Home page
├── .github/workflows/deploy.yml
├── package.json
├── LICENSE-CODE               # MIT License for code
├── LICENSE-DOCS               # CC BY-SA 4.0 for documentation
├── ATTRIBUTION.md             # Author credits
├── NOTICE.md                  # RoboWiki acknowledgments
└── README.md                  # This file
```

---

## 🎨 Features

- Dark theme optimized for reading
- Math formulas via KaTeX (e.g. `v = a × t`)
- Multi-language code examples
- Mobile-friendly responsive layout
- Built-in search
- Structured sidebar navigation

---

## 🤝 Contributing

Ways to help:

- Report issues
- Improve explanations
- Add examples / diagrams
- Refine formulas
- Suggest new topics

### Workflow

1. Fork & branch: `git checkout -b feature/topic`
2. Implement & preview locally
3. Commit: `git commit -m "Describe change"`
4. Push & open a Pull Request

### Writing Guidelines

- Prefer clarity over cleverness
- Use headings for structure
- Keep paragraphs short
- Use KaTeX for math (`$inline$`, `$$block$$`)
- Provide minimal, focused examples
- Avoid language-specific code when a concept is universal

### Adding a New Page (Articles or Tutorials)

1. Create a Markdown file under `docs/articles/` or `docs/tutorial/` (e.g. `advanced-movement.md`).
2. Start with a top-level `# Title` header; optional front matter is not required for standard pages.
3. Add the filename (without extension) to the appropriate sidebar list in `docs/.vuepress/config.js`:
    - Articles: add to the array under `'/articles/'` and to the home sidebar children if desired.
    - Tutorials: add to the array under `'/tutorial/'`.
4. Keep section heading levels consistent (`#` for page title, then `##`, `###` ...).
5. Cite sources or inspiration at the bottom when derived from RoboWiki or forum analysis.
6. Run `npm run dev` and verify navigation and sidebar entries before opening a PR.

Example sidebar addition (in `config.js`):
```js
// In docs/.vuepress/config.js
module.exports = {
  // ...existing config...
  themeConfig: {
    // ...existing themeConfig...
    sidebar: {
      '/articles/': [
        '', // maps to /articles/ README index
        'what-is-robocode',
        'physics',
        'scoring',
        'coordinates-and-angles',
        'history',
        'advanced-movement' // new page
      ],
      // ...existing sidebars...
    }
  }
}
```

---

## 📜 License

Dual licensed:

### Documentation

Creative Commons Attribution–ShareAlike 4.0 (CC BY-SA 4.0)
https://creativecommons.org/licenses/by-sa/4.0/

### Code Examples & Configuration

MIT License
https://opensource.org/licenses/MIT

---

## 🙏 Credits & Acknowledgments

Draws on the collective effort of an informal Robocode community of developers, competitors, and researchers.

### Special Thanks

- **Mathew Nelson** – Original creator of Robocode (2001–2005)
- **Flemming Nørnberg Larsen** – Maintainer (2005–present), creator of Robocode Tank Royale, author of this book
- **Pavel Savara** – Major contributor (modularization, replay, more)
- **Albert Perez** – Creator of RoboRumble ([RoboRumble on RoboWiki](http://robowiki.net/robowiki/RoboRumble))
- **Julian Kent (Skilgannon)** – Creator/maintainer of
  LiteRumble ([LiteRumble on RoboWiki](http://robowiki.net/robowiki/LiteRumble)); host of RoboWiki.net
- **RoboWiki** contributors – Foundational research & analysis
- All bot authors, tournament organizers, and knowledge sharers

### Source Foundations

- Official Robocode & Tank Royale docs
- RoboWiki analytical articles
- Historic forum discussions
- Long-term competitive meta observations

See `ATTRIBUTION.md` and `NOTICE.md` for detailed credits and licensing provenance.

---

## 👥 Authors & Maintainers

- Mathew Nelson – Original creator (2001–2005)
- Flemming Nørnberg Larsen – Maintainer & author (2005–present)
- Additional notable contributors: Pavel Savara, Albert Perez, Julian Kent (Skilgannon) — and others listed in
  `ATTRIBUTION.md`.

---

## Robocode Community & Motto

The term "Robocode Community" informally covers everyone engaging in development, bot design, competitions,
infrastructure (RoboRumble / LiteRumble), documentation, and knowledge sharing.

The motto appears at the top of this document and is a community-inspired adoption—not an official historical slogan.

(Already shown at top; not repeated here to avoid redundancy.)

---

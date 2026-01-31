# The Book of Robocode

“May your aim be true and your dodges unpredictable.” — Flemming Nørnberg Larsen

“Build the best — destroy the rest!” — Mathew A. Nelson

[![Deploy Documentation](https://github.com/robocode-dev/robocoding/actions/workflows/deploy.yml/badge.svg)](https://github.com/robocode-dev/robocoding/actions/workflows/deploy.yml)

A structured, modern knowledge base covering **Robocode** and **Robocode Tank Royale** — from fundamentals and physics
to movement, targeting, and competitive strategy — distilling two decades of community experience.

---

## 📦 Deployable Documentation

Automatically deployed to **GitHub Pages** via **GitHub Actions**. Pushing changes to `main` triggers a new build and
publication.

🔗 **Live Site**: https://robocode-dev.github.io/robocoding/

---

## 🎯 Purpose

**The Book of Robocode** (authored by **Flemming Nørnberg Larsen**) unifies knowledge previously scattered across
RoboWiki.net, forums, and historical sources. It focuses on concepts, strategy patterns, math, and reasoning. Code
examples appear when they clarify principles; otherwise, pseudocode is preferred. The goal is to teach ideas that
transfer between classic Java-based Robocode and Robocode Tank Royale.

---

## 📚 Contents Overview

### Introduction

- Author's Foreword
- What is Robocode?
- History (classic Robocode → Tank Royale)

### Getting Started

- Your First Bot
- Bot Anatomy
- The Bot API
- Blocking vs Non-Blocking Movement
- Robot Properties File
- Your First Battle

### Battlefield Physics

- Coordinates and Angles
- Movement Constraints
- Bullet Physics
- Gun Heat & Cooling
- Wall Collisions
- Scoring Basics

### Radar & Scanning

- Radar Basics
- One-on-One Radar (Spinning, Perfect Locks)
- Melee Radar (Spinning & Corner Arc, Oldest Scanned, Gun Heat Lock)

### Targeting Systems

- Simple Targeting (Head-On, Linear, Circular, Random Area)
- The Targeting Problem (Understanding the Challenge, Introducing Waves)
- Statistical Targeting (GuessFactor, Segmentation Visit Count Stats)
- Targeting Tactics (Fire Power & Timing, Saving Gun Data)

### Movement & Evasion

- Basic Movement (Fundamentals, Wall Avoidance, Distancing)
- Simple Evasion (Random, Stop and Go, Oscillator)
- Strategic Movement (Anti-Gravity)
- Advanced Evasion (Gun Heat Waves & Bullet Shadows, Wave Surfing)

### Energy & Scoring

- Energy as a Resource
- Bullet Power Selection Strategy
- Scoring Systems & Battle Types
- Competition Formats & Rankings

### Appendices

- Glossary
- Quick Reference (Formulas)
- Wall of Fame

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ (or newer)
- npm (or yarn)

### Local Development

1. Clone
   ```bash
   git clone https://github.com/robocode-dev/book-of-robocode.git
   cd book-of-robocode
   ```
2. Install
   ```bash
   npm install
   ```
3. Develop (serve locally with hot reload)
   ```bash
   npm run dev
   ```
   Default: http://localhost:5173/

> **Note:** Production builds (`npm run build`) are handled automatically by GitHub Actions when pushing to `main`. You
> can preview a production build locally with `npm run preview` after building.

---

## 🛠️ Technology Stack

- VitePress (static site generator)
- Vue 3
- KaTeX (math rendering)
- Mermaid (diagrams)
- markdown-it (extended Markdown)
- GitHub Pages (hosting)

---

## 📝 Project Structure

```
book-of-robocode/
├── book/
│   ├── .vitepress/
│   │   ├── config.js          # VitePress configuration
│   │   └── styles/            # Custom styling (palette, dark mode)
│   ├── public/                # Static assets (logo, favicon)
│   ├── images/                # SVG illustrations
│   ├── introduction/          # Foreword, What is Robocode?, History
│   ├── getting-started/       # First bot, Bot anatomy, API basics
│   ├── physics/               # Coordinates, Movement, Bullets, Scoring
│   ├── radar/                 # Radar basics, 1v1 and Melee strategies
│   ├── targeting/             # Simple to Statistical targeting systems
│   ├── movement/              # Basic to Advanced evasion techniques
│   ├── energy-and-scoring/    # Energy management, Scoring systems
│   ├── appendices/            # Glossary, Quick Reference, Wall of Fame
│   └── index.md               # Home page (VitePress landing)
├── specs/                     # Page generation specs, RoboWiki links
├── package.json
├── LICENSE-CODE               # MIT License for code examples/config
├── LICENSE-DOCS               # CC BY-SA 4.0 for documentation
├── ATTRIBUTION.md             # Detailed author & contributor credits
├── NOTICE.md                  # Source & license provenance notes
└── README.md                  # This file
```

---

## 🎨 Features

- Reading-oriented dark theme
- Math formulas via KaTeX (`E = m c^2` etc.)
- Multi-language & pseudocode examples
- Mobile-friendly responsive layout
- Built-in search & structured sidebar navigation

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
- Favor pseudocode when language neutrality helps
- Cite sources (RoboWiki, forum posts) when adapting analysis

### Adding a New Page

1. Create a Markdown file in the appropriate chapter folder (e.g., `book/movement/basic/my-topic.md`).
2. Start with `# Title` as first header.
3. Add the filename (without extension) to the relevant sidebar list in `book/.vitepress/config.js`.
4. Maintain heading hierarchy (`#`, `##`, `###`).
5. Attribute external inspirations at the bottom.
6. Run `npm run dev` and verify sidebar and nav.

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

This project draws on the collective effort of an informal Robocode community: developers, competitors, researchers,
infrastructure maintainers (RoboRumble / LiteRumble), and documentation contributors.

### Special Thanks

- **Mathew A. Nelson** — Original creator of Robocode (2001–2005)
- **Flemming Nørnberg Larsen** — Maintainer (2005–present); creator of Robocode Tank Royale; author of this book
- **Pavel Savara** — Major Robocode contributor (modularization, replay, refactoring)
- **Albert Perez** — Creator of RoboRumble ([RoboRumble](http://robowiki.net/robowiki/RoboRumble))
- **Julian Kent (Skilgannon)** — Creator/maintainer of LiteRumble; host of
  RoboWiki.net ([LiteRumble](http://robowiki.net/robowiki/LiteRumble))
- **RoboWiki contributors** — Foundational research & analysis
- All bot authors, tournament organizers, and knowledge sharers

### Source Foundations

- Official Robocode & Tank Royale documentation
- RoboWiki analytical articles (CC BY-SA 3.0)
- Historic forum discussions
- Long-term competitive meta observations

See `ATTRIBUTION.md` and `NOTICE.md` for detailed credits and licensing provenance.

---

## 👥 Authors & Maintainers

- Mathew A. Nelson — Original creator (2001–2005)
- Flemming Nørnberg Larsen — Maintainer & primary author (2005–present)
- Additional notable contributors: Pavel Savara, Albert Perez, Julian Kent (Skilgannon) — plus others listed in
  `ATTRIBUTION.md`.

---

## Robocode Community & Motto

"Robocode community" informally refers to everyone engaged in engine development, bot design, competitions,
infrastructure (RoboRumble / LiteRumble), documentation, and knowledge sharing. The motto is an adopted, inspirational
phrase — not an official historical slogan — and is intentionally placed under the title for visibility.

(Already shown at top; not repeated.)

---

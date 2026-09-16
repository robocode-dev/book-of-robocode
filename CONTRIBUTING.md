# Contributing to The Book of Robocode

Thank you for your interest in contributing to The Book of Robocode! This guide explains how to contribute content,
report issues, and use the AI-assisted workflow with GitHub Copilot.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Writing Guidelines](#writing-guidelines)
- [AI-Assisted Workflow with GitHub Copilot](#ai-assisted-workflow-with-github-copilot)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to
uphold a welcoming, inclusive, and harassment-free environment.

---

## Ways to Contribute

### 🐛 Report Issues

- Found an error or unclear explanation? [Open an issue](https://github.com/robocode-dev/book-of-robocode/issues/new).
- Include the page URL, what's wrong, and suggested fix if possible.

### ✍️ Improve Content

- Fix typos, grammar, or unclear wording.
- Improve code examples or pseudocode.
- Add missing explanations or context.

### 🎨 Add Illustrations

- Create or improve SVG diagrams.
- Use the `create-illustration` skill for consistent styling.

### 📖 Write New Pages

- Check `BOOK_STRUCTURE.md` for planned pages.
- Use the `create-page` skill for consistent formatting.

### 💡 Suggest Topics

- Open an issue with the "enhancement" label.
- Describe the topic and why it would help readers.

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (included with Node.js)
- Git
- A code editor (VS Code or JetBrains IDE recommended for Copilot integration)

### Local Development

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/book-of-robocode.git
   cd book-of-robocode
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The site will be available at http://localhost:5173/

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-topic-name
   ```

5. **Make your changes** and preview locally.

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add: description of your change"
   git push origin feature/your-topic-name
   ```

7. **Open a Pull Request** on GitHub.

---

## Writing Guidelines

All writing rules are collected in [`AGENTS.md`](AGENTS.md), which applies to human contributors as well. It covers the
global rules (sources, terminology, voice) and what makes a strong article, and it links to the detailed instructions:

| Document                                                           | Covers                                     |
|--------------------------------------------------------------------|--------------------------------------------|
| [writing-voice](.agents/instructions/writing-voice.md)             | Prose voice, openings, words to avoid      |
| [page-format](.agents/instructions/page-format.md)                 | Frontmatter, page structure, sidebar       |
| [sources-and-credits](.agents/instructions/sources-and-credits.md) | Sources, platform notes, Origins credits   |
| [illustrations](.agents/instructions/illustrations.md)             | Illustration markers, SVG style, palette   |
| [`BOOK_STRUCTURE.md`](BOOK_STRUCTURE.md)                           | Table of contents, difficulty, page status |
| [`BOOK_STRATEGY.md`](BOOK_STRATEGY.md)                             | Mission, audience, licensing               |

---

## AI-Assisted Workflow

The repository ships three agent skills in [`.agents/skills/`](.agents/skills/). Claude Code finds them through the
`.claude/skills` link, and other agents can read them directly.

> **⚠️ AI Model Requirement:** The skills need a capable model. Lower-tier models may not reliably follow the source
> and attribution requirements.

| Skill                      | What it does                                                 |
|----------------------------|--------------------------------------------------------------|
| `/create-page <Page Name>` | Writes and integrates a page, then runs the two skills below |
| `/create-illustration`     | Draws SVGs for the page's illustration markers               |
| `/review-page`             | Reviews a page for structure, accuracy, voice, and images    |

The page name must already exist in `BOOK_STRUCTURE.md` (add it there first), and the topic needs documentation on
[RoboWiki](https://robowiki.net/) or [robocode.dev](https://robocode.dev/). Always review the generated page and
images yourself before opening a pull request.

---

## Pull Request Process

### Before Submitting

1. **Preview locally** with `npm run dev`
2. **Check for errors** in the browser console
3. **Verify sidebar** entries appear correctly
4. **Run build** to catch issues: `npm run build`

### PR Guidelines

- Use a descriptive title (e.g., "Add: Circular Targeting page")
- Reference any related issues
- Describe what you changed and why
- Include screenshots for visual changes

### Review Process

1. A maintainer will review your PR.
2. Address any feedback or requested changes.
3. Once approved, the PR will be merged.
4. The site automatically deploys on merge to `main`.

---

## Project Structure

```
book-of-robocode/
├── book/                      # VitePress site content
│   ├── .vitepress/
│   │   ├── config.js          # Site configuration, sidebar, nav
│   │   └── styles/            # Custom CSS
│   ├── public/                # Static assets (favicon, CNAME)
│   ├── images/                # SVG illustrations
│   ├── introduction/          # Foreword, What is Robocode?, History
│   ├── getting-started/       # First bot, Bot anatomy, API
│   ├── physics/               # Coordinates, Movement, Bullets
│   ├── radar/                 # Radar strategies
│   ├── targeting/             # Targeting systems
│   ├── movement/              # Movement and evasion
│   ├── energy-and-scoring/    # Energy, Scoring, Competitions
│   └── appendices/            # Glossary, Quick Reference, Wall of Fame
├── specs/                     # RoboWiki links, research notes
├── .agents/
│   ├── instructions/          # Writing instructions (voice, format, sources, illustrations)
│   └── skills/                # Agent skills (create-page, create-illustration, review-page)
├── .github/
│   └── workflows/             # GitHub Actions (deploy)
├── AGENTS.md                  # Agent guide: rules, workflow, instruction map
├── BOOK_STRATEGY.md           # Content strategy
├── BOOK_STRUCTURE.md          # Table of contents
├── CONTRIBUTING.md            # This file
├── CODE_OF_CONDUCT.md         # Community guidelines
└── README.md                  # Project overview
```

---

## Questions?

- Open an issue for questions about contributing
- Check existing issues and discussions
- Review the reference documents listed above

---

*Thank you for helping make The Book of Robocode better!* 🤖

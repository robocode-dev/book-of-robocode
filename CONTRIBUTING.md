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

### Core Principles

Follow the rules in [`AGENTS.md`](AGENTS.md) and [`BOOK_STRATEGY.md`](BOOK_STRATEGY.md):

- **Audience**: Curious teenagers, students, new programmers, educators
- **Tone**: Neutral, friendly, encouraging, clear
- **Style**: Third person only (no "I" or "we")
- **Length**: 300–800 words per page unless specified

### Terminology

| Use   | Don't Use                   |
|-------|-----------------------------|
| bot   | robot (except in API names) |
| units | pixels                      |

### Formatting

- UTF-8 encoding
- Line length ≤ 120 characters
- Short paragraphs (2–4 sentences)
- Use Markdown headings, lists, callouts
- Emoji allowed when supportive

### Page Structure

Every page must include:

1. **Frontmatter** with title, category, summary, tags, difficulty, source
2. **H1 heading** matching the title
3. **Origins callout** crediting technique originators
4. **2–3 line overview**
5. **3–6 content sections**
6. **Further Reading section** with source links

See [`specs/page-generation-spec.md`](specs/page-generation-spec.md) for complete details.

---

## AI-Assisted Workflow with GitHub Copilot

This project includes GitHub Copilot skills that automate page and illustration creation. These skills ensure
consistent formatting, proper attribution, and correct sidebar configuration.

> **⚠️ AI Model Requirement:** These skills require advanced AI models such as **Claude Sonnet 4.5**, **GPT-5.1**, or
> better. Lower-tier models may not reliably follow the complex instructions and source attribution requirements.

### Available Skills

#### `/create-page` — Generate New Book Pages

Creates a complete book page from just a page name.

**Prerequisites:**

- The page name **must** exist in `BOOK_STRUCTURE.md` — update this file first to add new pages.
- The topic **must** have existing documentation on [RoboWiki.net](https://robowiki.net/) (for classic Robocode)
  or [robocode.dev](https://robocode-dev.github.io/tank-royale/) (for Tank Royale).
- For topics without existing documentation, manual page creation is required.

**How to use:**

1. Open GitHub Copilot Chat in your editor.
2. Type: `/create-page <Page Name>` or "Create page: <Page Name>"
3. The page name must match an entry in `BOOK_STRUCTURE.md`.

**What it does:**

- Parses hierarchy from `BOOK_STRUCTURE.md` (section, difficulty, output path)
- Gathers sources from `specs/robowiki-links.md` and Tank Royale docs
- Generates the page following all style guidelines
- Updates `book/.vitepress/config.js` sidebar
- Updates glossary if new terms are introduced
- Updates "What's Coming Next" page

**Example:**

```
/create-page Circular Targeting
```

See [`.github/skills/create-page.md`](.github/skills/create-page.md) for complete documentation.

#### `/create-illustration` — Generate SVG Diagrams

Creates SVG illustrations from TODO markers in book pages.

**How to use:**

1. Open a page with `<!-- TODO: Illustration` markers.
2. Open GitHub Copilot Chat.
3. Type: `/create-illustration` or "Create illustration"

**What it does:**

- Parses TODO markers for illustration specifications
- Generates SVG with proper tank rendering and battlefield background
- Saves to `book/images/`
- Inserts `<img>` tag in the page

**Example marker:**

```markdown
<!-- TODO: Illustration
**Filename:** circular-targeting.svg
**Caption:** "Circular targeting geometry"
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1000, 4500), body: 20, turret: 60, radar: 90
-->
```

See [`.github/skills/create-illustration.md`](.github/skills/create-illustration.md) for complete documentation.

### Skill Reference Documents

The skills use these reference documents:

| Document                          | Purpose                                              |
|-----------------------------------|------------------------------------------------------|
| `AGENTS.md`                       | Writing rules, terminology, page generation contract |
| `BOOK_STRUCTURE.md`               | Complete table of contents with hierarchy            |
| `BOOK_STRATEGY.md`                | Audience, tone, content philosophy                   |
| `specs/page-generation-spec.md`   | Detailed frontmatter and body structure              |
| `specs/robowiki-links.md`         | RoboWiki links for classic Robocode sources          |
| `book/appendices/wall-of-fame.md` | Known originators for attribution                    |

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
├── specs/                     # Generation specs, RoboWiki links
├── .github/
│   ├── skills/                # Copilot skill definitions
│   └── workflows/             # GitHub Actions (deploy)
├── AGENTS.md                  # AI collaboration guidelines
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

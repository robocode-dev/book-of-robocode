# 📘 The Book of Robocode — Strategy Document

## 🎯 Mission

The Book of Robocode is a modern, structured, and educational documentation project designed to:

- Preserve and modernize the knowledge from RoboWiki.net.
- Teach bot AI programming, physics, and strategy clearly and visually.
- Serve as the official learning hub for Classic Robocode and Robocode Tank Royale, with examples in Java, Python, C#,
  and TypeScript.
- Present concepts, formulas, and reasoning clearly, adding concise real code when implementation clarifies the idea.

It aims to make Robocode approachable to students, educators, hobbyists, and AI learners.

> AI agents: start at [`AGENTS.md`](AGENTS.md), which links to the detailed writing instructions.

## 👥 Audience

1. Teenagers and young beginners learning programming and AI through games.
2. Students in universities or technical schools using Robocode in courses, labs, or competitions.
3. Robocode players and developers who want to improve their bots.
4. Educators and researchers using Robocode for teaching AI or simulation.
5. Contributors rewriting and organizing RoboWiki knowledge for clarity.

## 📚 Content Philosophy

Core principles:

- Clarity first: short, focused explanations over walls of text.
- Primarily teen-friendly: explain ideas as if to a curious teenager, then deepen formality and math in advanced
  sections.
- Visual and mathematical reasoning preferred over code dumps.
- Neutral tone, summarizing community consensus.
- Short, real code where implementation clarifies the idea.
- Parallel support for both Robocode and Tank Royale.
- Attribution to RoboWiki authors and contributors.
- Educational reuse under CC BY-SA 4.0.
- Clear separation of sources: RoboWiki for classic Robocode, robocode.dev and its GitHub pages for Tank Royale.

Difficulty progression:

- Beginner & intermediate chapters assume a teen reader who may be new to programming.
- Advanced Topics may assume university-level math or prior competitive Robocode experience but still aim to be
  readable and inspiring.

## 🧩 Structure Overview

Each topic = a short, self-contained concept page.

Example section tree:
📘 The Book of Robocode
├─ Introduction
├─ Getting Started
├─ Battlefield Physics
│ ├─ Coordinate Systems
│ ├─ Bullet Travel
│ ├─ Wall Collisions
│ └─ Movement Constraints
├─ Targeting Systems
│ ├─ Head-On Targeting
│ ├─ Linear Targeting
│ ├─ Circular Targeting
│ └─ GuessFactor Targeting
├─ Movement & Evasion
│ ├─ Oscillations
│ ├─ Wave Surfing
│ └─ Anti-Gravity
├─ Energy Management
├─ Radar & Scanning
├─ Team Strategies
├─ Robocode Tank Royale Differences
├─ Glossary
└─ References & Credits

## ⚖️ Licensing Rules

- Text and educational content: CC BY-SA 4.0
- Code examples: MIT License
- Project credits in ATTRIBUTION.md; each page lists its sources in frontmatter and Further Reading.

## 🏗️ Technical Setup

- Framework: VitePress
- Build system: reuse robocode-dev/tank-royale/docs-build
- Output: GitHub Pages
- Features: sidebar, search, dark mode, KaTeX, code syntax highlighting, SVG/Mermaid diagrams.
- Prefer SVG or Mermaid (including emojis) for new diagrams when practical; PNG or JPEG is acceptable for screenshots,
  historical photos, and legacy or illustrative artwork.

## 🧱 Deliverables

- /book/*.md — concept pages.
- /ATTRIBUTION.md — source credits.
- /NOTICE.md — acknowledgments.

## 🧩 Future Goals

- Add interactive diagrams.
- Provide translations.
- Build formula index and glossary.
- Enable AI-assisted content generation that respects this strategy.

## 🏁 Motto

"May your aim be true and your dodges unpredictable."
— The Robocode Community Motto

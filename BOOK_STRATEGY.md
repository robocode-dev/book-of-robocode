# 📘 The Book of Robocode — Strategy Document

## 🎯 Mission

The Book of Robocode is a modern, structured, and educational documentation project designed to:

- Preserve and modernize the knowledge from RoboWiki.net.
- Teach bot AI programming, physics, and strategy clearly and visually.
- Serve as the official learning hub for Classic Robocode and Robocode Tank Royale, with examples in Java, Python, C#, and TypeScript.
- Present concepts, formulas, and reasoning clearly, adding concise real code when implementation clarifies the idea.

It aims to make Robocode approachable to students, educators, hobbyists, and AI learners.

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
- Short, real code for implementation examples; pseudocode for conceptual teaching or algorithms whose implementations are
  not yet verified.
- Parallel support for both Robocode and Tank Royale.
- For shared implementations, use one `::: code-group` with tabs in this order: `Classic · Java`, `Tank Royale · Python`,
  `Tank Royale · Java`, `Tank Royale · C#`, `Tank Royale · TypeScript`.
- Attribution to RoboWiki authors and contributors.
- Educational reuse under CC BY-SA 4.0.
- Clear separation of sources: RoboWiki for classic Robocode, robocode.dev, and its GitHub pages for Robocode Tank
  Royale.

Difficulty progression:

- Beginner & intermediate chapters assume a teen reader who may be new to programming.
- Advanced Topics may assume university-level math or prior competitive Robocode experience but still aim to be readable
  and inspiring.

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

## ✍️ Writing Guidelines

Tone & Style:

- Neutral, factual language with a friendly, encouraging feel.
- Assume a teen reader in beginner and intermediate sections: introduce jargon slowly and always with a concrete
  example.
- In Advanced Topics, it is okay to be more technical but avoid unnecessary formality and keep explanations
  motivating.
- No first-person phrasing.
- Short paragraphs (3–4 sentences max).
- Use Markdown lists, callouts, and tables.
- Math via KaTeX or MathJax.
- Use language-specific syntax for code examples. Use pseudocode only for deliberately platform-neutral or not-yet-verified algorithms.
- Use **UTF-8** encoding; emoji characters are allowed when they add clarity or motivation.
- Keep each line at **120 characters or fewer** for readability and clean diffs.

Example algorithm sketch:

# Predict future position

function predictPosition(bot, timeAhead):
x = bot.x + cos(bot.heading) * bot.velocity * timeAhead
y = bot.y + sin(bot.heading) * bot.velocity * timeAhead
return (x, y)

## 🧮 Math & Physics Representation

Use LaTeX/KaTeX for formulas. Always define symbols and context.

Example:
Robocode: heading increases clockwise from north.
Tank Royale: heading increases counterclockwise from east.

x_new = x + v * sin(theta)
y_new = y + v * cos(theta)

## ⚖️ Licensing Rules

- Text and educational content: CC BY-SA 4.0
- Code examples: MIT License
- Attribution in ATTRIBUTION.md
- Summarize consensus, avoid forum debates.

Every AI-assisted page that adapts RoboWiki or official Tank Royale docs SHOULD end with a short attribution footer, for
example:

*Based on RoboWiki content (CC BY-SA 3.0) for classic Robocode and the official Robocode Tank Royale documentation.
Rewritten and structured for The Book of Robocode.*

## 🏗️ Technical Setup

- Framework: VitePress
- Build system: reuse robocode-dev/tank-royale/docs-build
- Output: GitHub Pages
- Features: sidebar, search, dark mode, KaTeX, code syntax highlighting, SVG/Mermaid diagrams.
- Prefer SVG or Mermaid (including emojis) for new diagrams when practical; PNG or JPEG is acceptable for screenshots,
  historical photos, and legacy or illustrative artwork.

## 📜 Page Metadata Template

Each concept page (.md) begins with frontmatter:
---
title: "Head-On Targeting"
category: "Targeting Systems"
summary: "The simplest form of aiming where bullets travel directly toward the enemy’s current position."
tags: ["targeting", "aiming", "beginner"]
difficulty: "beginner"
source: ["RoboWiki - Head-On Targeting"]
---

Then follow with Markdown content.

## ⚙️ Workflow for AI Agents

When using an LLM or code assistant:

1. Load this document as the system context.
2. Follow tone, structure, and format rules.
3. When generating new pages:
    - Use the frontmatter structure.
    - 300–800 words max.
    - Include 1–2 formulas or implementation/algorithm blocks.
    - Add a short summary.
4. When adapting RoboWiki content:
    - Rewrite for clarity and neutrality.
    - Include attribution.
    - Omit outdated bot examples.
    - Remember that RoboWiki documents **classic Robocode only**, not Robocode Tank Royale.
5. When describing Robocode Tank-Royale-specific features or APIs:
    - Prefer information from **robocode-dev.github.io/tank-royale** and the official GitHub repositories.
    - Make platform distinctions explicit when behavior differs between classic Robocode and Tank Royale.

## 🧭 Example Prompt for LLM Agent

"Using the Book of Robocode strategy, generate a beginner-friendly Markdown page explaining GuessFactor Targeting for
both Robocode and Tank Royale. Include formulas for bearing offset and a short implementation or algorithm sketch for
GuessFactor calculation. Use a five-language code group when implementation is central. Maintain educational tone, short paragraphs, and proper attribution format."

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

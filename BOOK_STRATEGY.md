# 📘 The Book of Robocoding — Strategy Document

## 🎯 Mission

The Book of Robocoding is a modern, structured, and educational documentation project designed to:

- Preserve and modernize the knowledge from RoboWiki.net.
- Teach robot AI programming, physics, and strategy clearly and visually.
- Serve as the official learning hub for both Robocode (Java) and Robocode Tank Royale (TypeScript).
- Present concepts, formulas, and reasoning clearly — not raw implementation.

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
 - Primarily teen-friendly: explain ideas as if to a curious teenager, then deepen formality and math in advanced sections.
 - Visual and mathematical reasoning preferred over code dumps.
 - Neutral tone, summarizing community consensus.
 - Pseudocode over real code for conceptual teaching.
 - Parallel support for both Robocode and Tank Royale.
 - Attribution to RoboWiki authors and contributors.
 - Educational reuse under CC BY-SA 4.0.
 - Clear separation of sources: RoboWiki for classic Robocode, robocode.dev and its GitHub pages for Robocode Tank Royale.

Difficulty progression:

- Beginner & intermediate chapters assume a teen reader who may be new to programming.
- Advanced Topics may assume university-level math or prior competitive Robocode experience, but still aim to be readable and inspiring.

## 🧩 Structure Overview

Each topic = a short, self-contained concept page.

Example section tree:
📘 The Book of Robocoding
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
- Assume a teen reader in beginner and intermediate sections: introduce jargon slowly and always with a concrete example.
- In Advanced Topics, it is okay to be more technical, but avoid unnecessary formality and keep explanations motivating.
- No first-person phrasing.
- Short paragraphs (3–4 sentences max).
- Use Markdown lists, callouts, and tables.
- Math via KaTeX or MathJax.
- Pseudocode syntax for code logic.

Example pseudocode:

# Predict future position

function predictPosition(robot, timeAhead):
x = robot.x + cos(robot.heading) * robot.velocity * timeAhead
y = robot.y + sin(robot.heading) * robot.velocity * timeAhead
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

## 🏗️ Technical Setup

- Framework: Vue 2 + VuePress 1.x
- Build system: reuse robocode-dev/tank-royale/docs-build
- Output: GitHub Pages
- Features: sidebar, search, dark mode, KaTeX, pseudocode highlighting, SVG/Mermaid diagrams.

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
    - Include 1–2 formulas or pseudocode snippets.
    - Add a short summary.
4. When adapting RoboWiki content:
    - Rewrite for clarity and neutrality.
    - Include attribution.
    - Omit outdated bot examples.
    - Remember that RoboWiki documents **classic Robocode only**, not Robocode Tank Royale.
5. When describing Robocode Tank Royale–specific features or APIs:
    - Prefer information from **robocode-dev.github.io/tank-royale** and the official GitHub repositories.
    - Make platform distinctions explicit when behavior differs between classic Robocode and Tank Royale.

## 🧭 Example Prompt for LLM Agent

"Using the Book of Robocoding strategy, generate a beginner-friendly Markdown page explaining GuessFactor Targeting for
both Robocode and Tank Royale. Include formulas for bearing offset and sample pseudocode for guess factor calculation.
Maintain educational tone, short paragraphs, and proper attribution format."

## 🧱 Deliverables

- /docs/*.md — concept pages.
- /ATTRIBUTION.md — source credits.
- /NOTICE.md — acknowledgments.
- /docs-build/ — VuePress setup from tank-royale.
- GitHub Pages deployment from main.

## 🧩 Future Goals

- Add interactive diagrams.
- Provide translations.
- Build formula index and glossary.
- Enable AI-assisted content generation that respects this strategy.

## 🏁 Motto

"May your aim be true and your dodges unpredictable."
— The Robocode Community Motto

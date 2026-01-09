# Copilot Instructions for The Book of Robocode

## Core Guidelines

Follow the rules in `/AI_GUIDELINES.md` for all content generation.

## Creating New Pages

Use the **create-page** skill to generate new book pages:

- **Slash command:** `/create-page <Page Name>`
- **Natural language:** "Create page: <Page Name>"

The page name must match an entry in `BOOK_STRUCTURE.md` (e.g., "Circular Targeting", "Wave Surfing Introduction").

The skill will:
1. Parse the hierarchy to derive slug, section, difficulty, and output path.
2. Gather sources from `specs/robowiki-links.md` (classic Robocode) and https://robocode.dev (Tank Royale).
3. Generate the page following `specs/page-generation-spec.md`.
4. Update `book/.vitepress/config.js` with sidebar and nav entries.

## Reference Documents

- `/AI_GUIDELINES.md` — Writing rules, terminology, page generation contract.
- `/BOOK_STRATEGY.md` — Audience, tone, and content philosophy.
- `/BOOK_STRUCTURE.md` — Complete table of contents with hierarchy and difficulty markers.
- `/specs/page-generation-spec.md` — Detailed frontmatter and body structure rules.
- `/specs/robowiki-links.md` — RoboWiki links for classic Robocode sources (not Tank Royale).
- `/.github/skills/create-page.md` — The create-page skill definition.

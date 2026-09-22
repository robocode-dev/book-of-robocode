---
name: review-page
description: Review a Book of Robocode page for structure, accuracy, voice, images, and build readiness.
---

# Review Page

Review a Book of Robocode page. Change it only if the request also asks for fixes, or if `create-page` called this
skill.

## 1. Prepare

Read `AGENTS.md`, `BOOK_STRUCTURE.md`, and these files in `.agents/instructions/`: `page-format.md`,
`sources-and-credits.md`, and `writing-voice.md`. If the page has images, also read `illustrations.md`.

## 2. Check

- **Format:** check the page against the checklist in `page-format.md`: frontmatter, H1, Origins callout, overview,
  section count, length, formulas and code, Further Reading, and sidebar, nav, and roadmap integration.
- **Accuracy:**
  - Every number and mechanism must match its cited source.
  - Classic and Tank Royale material must be kept apart.
  - Platform notes appear only for real differences.
  - Real names follow the credits policy.
  - Code uses verified API names.
- **Global rules** from `AGENTS.md`: terminology, third person, no em dashes or semicolons in prose, lines of 120
  characters or fewer, no footer.
- **Craft:**
  - Apply the focus, deletion, and referent tests from `writing-voice.md` to each paragraph.
  - Flag throat-clearing openings, bland section endings, forbidden words, repeated sentence shapes, and invented
    evidence.
  - Check the page against "What makes a strong article" in `AGENTS.md`.
- **Illustrations:**
  - Every marker has an SVG, and every `<img>` resolves.
  - Alt text equals the caption.
  - The SVG includes the tank definitions and matches its marker.
  - The picture agrees with the text.

## 3. Report

- List findings first, ordered by severity: **blocking** (wrong facts, broken build or images, missing required
  structure, rule violations) before **optional** (style and clarity).
- Give each finding a location, the reason, and a specific fix.
- If nothing is blocking, say so clearly.

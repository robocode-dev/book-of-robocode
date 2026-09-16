---
name: create-page
description: Create, illustrate, review, and integrate a source-grounded Book of Robocode page.
---

# Create Page

Create one new page whose title appears in `BOOK_STRUCTURE.md`. Do not use this skill for a small edit to an
existing page.

## 1. Prepare

Read `AGENTS.md`, `BOOK_STRUCTURE.md`, and these files in `.agents/instructions/`: `page-format.md`,
`sources-and-credits.md`, and `writing-voice.md`.

Derive the title, section, sub-section, difficulty, slug, and output path (`page-format.md`, Section 1). If the title is
not in `BOOK_STRUCTURE.md`, ask before continuing. Check `git status` so existing changes are not overwritten.

## 2. Research

- Collect the RoboWiki articles from `specs/robowiki-links.md` and the relevant robocode.dev pages. Read them.
- Note the facts the page will rely on, including every number, and where each one comes from.
- Decide who the Origins callout credits (`sources-and-credits.md`).
- Decide whether the platforms really differ for this topic.
- Look at the neighboring pages in the same section so the new page builds on them instead of repeating them.

## 3. Write

- Write the page in the structure from `page-format.md`, following "What makes a strong article" in `AGENTS.md` and
  the voice rules.
- Link to earlier book pages where the reader needs background.
- Add an illustration marker (`illustrations.md`) for every visual concept.

## 4. Integrate

Apply `page-format.md`, Section 6: add the sidebar entry, update the roadmap, set the `BOOK_STRUCTURE.md` status, and
add a glossary entry only if one is warranted.

## 5. Illustrate, review, and build

1. Run the `create-illustration` skill for every marker on the page.
2. Run the `review-page` skill on the page, and fix every blocking finding. Repeat until none remain.
3. Run `npm run build`.

Report the page path, its sources, the images created, and any open questions for the maintainer.

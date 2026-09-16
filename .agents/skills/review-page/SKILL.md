---
name: review-page
description: Review a Book of Robocode page for structure, source accuracy, voice, and VitePress readiness.
---

# Review Page

Review a supplied Book of Robocode page without changing it unless the request also asks for fixes.

Read `AGENTS.md`, `BOOK_STRATEGY.md`, `VOICE.md`, `BOOK_STRUCTURE.md`, and `specs/page-generation-spec.md`. Check
frontmatter, H1, Origins callout, overview, page length, illustration requirement, source distinction, platform notes,
Further Reading, terminology, line length, and VitePress compatibility.

Evaluate whether each paragraph explains a concrete mechanism, constraint, tradeoff, or example. Flag unsupported
claims, unverified real-name attribution, filler, terminology violations, em dashes, semicolons in prose, and tone that
does not match the book's science-teacher-with-a-smile voice.

Report findings first, ordered by severity. Give each finding a label, location, reason, and a specific fix. If there
are no blocking issues, say so clearly and list any optional improvements separately.

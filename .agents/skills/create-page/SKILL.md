---
name: create-page
description: Create a source-grounded Book of Robocode Markdown page and integrate it into the VitePress book.
---

# Create Page

Create one page whose title appears in `BOOK_STRUCTURE.md`. Use this skill for new Book of Robocode concept pages,
not for a small edit to an existing page.

## Before writing

Read `AGENTS.md`, `BOOK_STRATEGY.md`, `VOICE.md`, `BOOK_STRUCTURE.md`, and `specs/page-generation-spec.md`.
Determine the title, section, subsection, difficulty, slug, and output path from the structure. If the requested title
does not appear there, ask for confirmation before creating a page.

Use `specs/robowiki-links.md` to identify classic Robocode sources. Verify any claims that could be uncertain, and keep
classic RoboWiki material distinct from Tank Royale documentation. Credit a real name only when a reliable public source
identifies it. Otherwise use the documented handle or credit the RoboWiki community.

## Page requirements

Create a UTF-8 Markdown page with lines no longer than 120 characters. It must include:

- VitePress frontmatter with title, category, summary, tags, difficulty, and source URLs.
- An H1 matching the title and an Origins callout immediately after it.
- A 2–3 line overview, followed by 3–6 focused sections.
- 300–800 words, short paragraphs, correct bot and units terminology, and the voice defined in `VOICE.md`.
- One or two concise formulas or implementation/algorithm blocks when they clarify the concept.
- Platform notes when classic Robocode and Tank Royale differ.
- One or more structured `<!-- TODO: Illustration ... -->` markers for visual concepts.
- A final `## Further Reading` section linking to the sources in frontmatter and relevant platform documentation.

Use unnumbered headings for a conceptual page and numbered headings only for a procedural tutorial. Do not add an
attribution footer because VitePress supplies it globally.

## Integrate and validate

Add the page in book-structure order to the appropriate VitePress sidebar. Remove its completed roadmap entry from
`book/introduction/whats-coming-next.md`. Add a glossary entry only for a term that is central, newly introduced, and
not already defined.

Check frontmatter, links, line length, terminology, and existing working-tree changes. Run the VitePress build before
handing off. Keep illustration TODO markers for the `create-illustration` skill.

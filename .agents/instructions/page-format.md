# Page Format

How a book page is located, structured, formatted, and wired into VitePress. Global rules (sources, terminology,
line length, punctuation) live in `AGENTS.md`. Prose craft lives in `writing-voice.md`.

## 1. From book structure to file

A page request names a title exactly as it appears in `BOOK_STRUCTURE.md`. Derive:

| Field                 | Source                                  | Example                             |
|-----------------------|-----------------------------------------|-------------------------------------|
| **Title**             | Page name, suffixes stripped            | "Circular Targeting"                |
| **Top-level section** | Parent section                          | "Targeting Systems"                 |
| **Sub-section**       | Intermediate parent, if any             | "Simple Targeting"                  |
| **Difficulty**        | Marker `[B]` / `[I]` / `[A]`            | `intermediate`                      |
| **Slug**              | Kebab-case of the title                 | `circular-targeting`                |
| **Output path**       | `book/<section>/<subsection>/<slug>.md` | `book/targeting/simple-targeting/…` |

If the title is not in `BOOK_STRUCTURE.md`, ask before creating a page.

Title suffixes are stripped from the display title but guide sources and shape:

- `(with Walkthrough)` / `(with Tutorial)`: include the RoboWiki `/Walkthrough` or `/Tutorial` sub-page.
- `(Guided Tutorial)`: write a step-by-step page with numbered headings.
- `(Factored Variants)`: include the related variant pages.

| Book section                     | Folder               |
|----------------------------------|----------------------|
| Introduction                     | `introduction`       |
| Getting Started                  | `getting-started`    |
| Battlefield Physics              | `physics`            |
| Radar & Scanning                 | `radar`              |
| Targeting Systems                | `targeting`          |
| Movement & Evasion               | `movement`           |
| Energy & Scoring                 | `energy-and-scoring` |
| Team Strategies                  | `team-strategies`    |
| Melee Combat                     | `melee-combat`       |
| Advanced Topics                  | `advanced`           |
| Robocode Tank Royale Differences | `tank-royale`        |
| Appendices                       | `appendices`         |

## 2. Frontmatter

```yaml
---
title: "<Title>"
category: "<Top-level section>"
summary: "<1–2 sentences on what the reader learns>"
tags: ["<slug>", "<section>", "<subsection>", "<difficulty>", "robocode", "tank-royale"]
difficulty: "beginner|intermediate|advanced"
source:
  - "RoboWiki - <Article> (classic Robocode) https://robowiki.net/wiki/<Article>"
  - "Robocode Tank Royale Docs - <Page> https://robocode.dev/<path>"
---
```

- `title`: the cleaned title, unchanged. `category`: exact top-level spelling from `BOOK_STRUCTURE.md`.
- `difficulty`: must match the structure marker.
- `source`: every entry carries a URL. See `sources-and-credits.md` for which sources to use.

## 3. Body structure

1. **H1** identical to `title`.
2. **Origins callout** immediately after the H1 (who to credit: `sources-and-credits.md`):

   ```markdown
   > [!TIP] Origins
   > **Technique Name** was pioneered by **Name** and refined by the RoboWiki community.
   ```

3. **Overview**: 2–3 lines that expand the summary and create the page's tension.
4. **3–6 sections.** Unnumbered headings for conceptual pages, numbered (`## 1. …`) only for procedural tutorials.
   Useful shapes: the core idea, the math or algorithm, an implementation, platform notes, tips and common mistakes.
5. **1–2 formula or code blocks per major concept** (Section 5).
6. **Platform notes** only when the platforms actually differ (`sources-and-credits.md`).
7. **Illustration markers** for every visual concept (`illustrations.md`). Most physics, targeting, and movement pages
   need 1–3.
8. **`## Further Reading`** as the last section:

   ```markdown
   ## Further Reading

   - [Article Name](https://robowiki.net/wiki/Article_Name) - RoboWiki (classic Robocode)
   - [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
   ```

   Include every source from the frontmatter, plus other relevant pages from `specs/robowiki-links.md`.

**Length:** target 500–700 words, maximum 800 unless the request justifies more. **Paragraphs:** 2–4 sentences.

## 4. Markdown features

- Callouts: `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]`. Tables for comparisons, lists for steps and options.
- American English spelling. Emoji only when they add clarity.
- Bold for a term the reader must track, not as decoration.

## 5. Formulas and code

- Math uses inline KaTeX, `$formula$`, never `$$` blocks. Define every symbol right before or after the formula.
- Prefer short, real code. For an implementation shared across platforms, use one `::: code-group` with tabs in this
  order: `Classic · Java`, `Tank Royale · Python`, `Tank Royale · Java`, `Tank Royale · C#`,
  `Tank Royale · TypeScript`. Use the official sample bots' style and verified API names.
- Use pseudocode (a `txt` block) only for deliberately platform-neutral ideas or algorithms whose implementations are
  not yet verified. Keep it short.

## 6. VitePress integration

- Add the page to the sidebar in `book/.vitepress/config.js`: find the key for the section folder (for example
  `'/targeting/'`), then the nested `items` array for the sub-section. Add `{text: '<Title>', link: '/<path>'}` with no
  `.md`, in `BOOK_STRUCTURE.md` order.
- Add the section to `nav:` too: find the existing dropdown whose theme fits (a combat-technique chapter joins
  the other combat-technique chapters) and add `{ text: '<Section>', link: '<first sidebar link>' }` to its
  `items`, matching entries like `Radar & Scanning`. Add `// TODO: Review nav entry for <section>` above the
  sidebar key only when no existing dropdown is a reasonable fit. That should be rare.
- Remove the page from the pending lists in `book/introduction/whats-coming-next.md`.
- Mark the page `[✅]` in `BOOK_STRUCTURE.md`.
- Add a glossary entry in `book/appendices/glossary.md` only for a central, newly introduced term.

## 7. Checklist

- [ ] Frontmatter is valid YAML, every source has a URL, and difficulty matches the marker.
- [ ] H1 equals `title`, the Origins callout follows it, and `## Further Reading` is last.
- [ ] Length and paragraph limits hold, and every line is 120 characters or fewer.
- [ ] Every illustration marker has a rendered SVG and a matching `<img>`.
- [ ] `config.js` is valid, the sidebar entry is in the right place, the nav entry (or its TODO) is set, and
  the roadmap is updated.
- [ ] `npm run build` passes.

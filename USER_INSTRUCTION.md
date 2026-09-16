# How to Create a New Page

## Quick Start

1. Find the page name in `BOOK_STRUCTURE.md` (e.g., "Circular Targeting", "Wave Surfing Introduction").
2. Ask the AI to create the page using one of these methods:

   **Slash command:**
   ```
   /create-page Circular Targeting
   ```

   **Natural language:**
   ```
   Create page: Circular Targeting
   ```

3. The AI will:
   - Parse the book structure to determine section, difficulty, and output path.
   - Gather relevant sources from RoboWiki (classic) and robocode.dev (Tank Royale).
   - Generate the complete page with frontmatter and content.
   - Draw SVG illustrations for the page's illustration markers.
   - Review the page and fix blocking findings.
   - Update `book/.vitepress/config.js`, the roadmap, and `BOOK_STRUCTURE.md`, then run the build.

4. Review the generated page, images, and config changes, then commit.

## What You Don't Need to Do

- ❌ Fill out a long template.
- ❌ Manually look up RoboWiki links.
- ❌ Manually edit `config.js`.
- ❌ Specify the output path or slug.

The AI derives everything from the page name and `BOOK_STRUCTURE.md`.

## When the AI Will Ask

The AI will only prompt you if:
- The page name is not found in `BOOK_STRUCTURE.md`.
- There's ambiguity about which sources to include.
- A section is missing from the nav structure (flags for review).

## Reference

- Agent guide and rule map: `AGENTS.md`
- Skill definitions: `.agents/skills/`
- Detailed writing instructions: `.agents/instructions/`

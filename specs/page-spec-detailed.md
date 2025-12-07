# page spec – detailed AI-facing interpretation

This document is the detailed AI-facing specification for interpreting
human page requests. Humans are not expected to fill this in directly.
Instead, they use `page-request-template.md`, and you (the AI) map that
minimal request into a full page.

---

## 1. Identity mapping

From the page request:

- **Slug / file id** → used to form:
  - default output path: `docs/articles/<slug>.md` unless overridden.  
  - part of the frontmatter `tags` list.  
  - internal references between pages.

- **Book section (top-level)** → maps to frontmatter `category`.  
  Use the exact spelling from `BOOK_STRUCTURE.md`.

- **Planned title** → maps to frontmatter `title`.  
  If missing, derive a concise, descriptive title from the goal and
  required topics.

- **Difficulty** → maps directly to the frontmatter `difficulty` field.  
  Valid values: `beginner`, `intermediate`, `advanced`.

---

## 2. Sources → frontmatter `source`

From the request’s **Sources** section:

- Collect all listed URLs and source notes.  
- Normalize them into a frontmatter array, for example:

```yaml
source: [
  "RoboWiki – Head-On Targeting (classic Robocode)",
  "Robocode Tank Royale Docs – Targeting Overview",
  "Internal notes – lecture slides 2024-10-01"
]
```

Keep the descriptions short but clear enough for reviewers to trace the
original material.

---

## 3. Purpose & scope → summary and section plan

Use the request’s **Goal of the page** and **Must include** bullets to
define:

- The frontmatter `summary` (1–2 sentences).  
- The short overview paragraph under the frontmatter.  
- The main subsections of the page.

You SHOULD:

- Turn each “must include” bullet into at least one explicit paragraph or
  subsection.  
- Confirm that anything listed under “avoid or keep minimal” is either
  omitted or only briefly mentioned with a cross-link to a more
  appropriate page.

---

## 4. Audience, emphasis, and difficulty

Use the request’s **Primary audience** and **Emphasis** fields together
with the `difficulty` to tune:

- Level of formality and mathematical depth.  
- Amount of step-by-step guidance vs. conceptual discussion.  
- Number and complexity of formulas or pseudocode snippets.

Always keep the global rules from `BOOK_STRATEGY.md` and
`AI_GUIDELINES.md` in mind:

- Start from intuition and concrete examples.  
- Add formal math or more advanced reasoning later in the page.  
- Use short paragraphs and accessible language.

---

## 5. Platform notes

From the request’s **Platform notes**:

- If the page applies to both classic Robocode and Robocode Tank Royale,
  include a brief comparison section (for example, "Platform Notes" or
  "Classic vs Tank Royale").
- If it applies to only one platform, state this clearly early in the
  page.

When differences are important (for example, coordinate systems, heading
conventions, bullet physics, or scoring):

- Describe both behaviors carefully.  
- Avoid inventing APIs or constants; rely on the official docs.

---

## 6. Constraints & preferences

Use the **Constraints & preferences** section of the request to adjust:

- Approximate length (still capped at 800 words unless clearly justified).  
- Example choices (favored language, scenario, or bot behavior).  
- Cross-references to other pages.

When in doubt, prefer:

- Shorter, clearer explanations over extra detail.  
- Pseudocode over detailed language-specific code.  
- One well-chosen example over several similar ones.

---

## 7. Shared terminology and formatting rules

All terminology and formatting rules from `AI_GUIDELINES.md` apply here
and SHOULD NOT be duplicated in human-facing templates. In particular:

- Always say **"bot"**, not "robot", except in quoted titles and
  references.  
- Express distances and sizes in **units**, not pixels.  
- Keep lines ≤ 120 characters.  
- Prefer a neutral, friendly, and encouraging tone.  
- Use American English spelling.

Refer back to `AI_GUIDELINES.md` for more detail when needed.

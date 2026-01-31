# Skill: Create Page for The Book of Robocode

This skill creates a new page for *The Book of Robocode* from just a page name.

## Trigger

- Slash command: `/create-page <Page Name>`
- Natural language: "Create page: <Page Name>"

Where `<Page Name>` is the exact title from `BOOK_STRUCTURE.md` (e.g., "Circular Targeting", "Wave Surfing Introduction").

---

## Workflow

When invoked, perform these steps in order:

### 1. Parse the Page Name from `BOOK_STRUCTURE.md`

1. Look up the page name in `BOOK_STRUCTURE.md`.
2. Extract from the hierarchy:
   - **Top-level section** (e.g., "Targeting Systems", "Movement & Evasion")
   - **Sub-section** if any (e.g., "Simple Targeting", "Advanced Evasion")
   - **Difficulty** from the `[B]`, `[I]`, or `[A]` marker:
     - `[B]` → `beginner`
     - `[I]` → `intermediate`
     - `[A]` → `advanced`
3. Strip suffixes like "(with Walkthrough)", "(with Tutorial)", "(Guided Tutorial)" from the title — but remember them for source lookup.
4. Derive the **slug** by converting the cleaned title to kebab-case (e.g., "Circular Targeting" → `circular-targeting`).
5. Derive the **output path** from the hierarchy:
   - Top-level section → folder name (e.g., "Targeting Systems" → `targeting`)
   - Sub-section → subfolder (e.g., "Simple Targeting" → `simple-targeting`)
   - Final path: `book/<section>/<subsection>/<slug>.md`

**If the page name is not found in `BOOK_STRUCTURE.md`**, ask the user to confirm or provide the correct name.

### 2. Gather Sources

#### RoboWiki (Classic Robocode only)

1. Search `specs/robowiki-links.md` for matching entries.
2. Include the main page link and any sub-pages (e.g., `/Walkthrough`, `/Tutorial`, `/Implementations`).
3. If the page name had a suffix like "(with Walkthrough)", ensure the corresponding sub-page is included.

#### Robocode Tank Royale

1. Reference https://robocode.dev for Tank Royale-specific content.
2. For API-related pages, reference the appropriate API docs (Java, .NET, or Python).

#### Optional Historical Sources

- https://robocode.sourceforge.io/developerWorks.php for classic Robocode historical content.

### 3. Generate the Page

Follow the rules in `AGENTS.md` and `specs/page-generation-spec.md`:

#### Frontmatter

```yaml
---
title: "<Cleaned Title>"
category: "<Top-level Section>"
summary: "<1–2 sentence summary>"
tags: ["<slug>", "<section>", "<subsection>", "<difficulty>", "robocode", "tank-royale"]
difficulty: "<beginner|intermediate|advanced>"
source: [
  "RoboWiki - <Article Name> (classic Robocode) <URL>",
  "Robocode Tank Royale Docs - <relevant section> https://robocode.dev/..."
]
---
```

#### Body Structure

Follow the detailed structure rules in `specs/page-generation-spec.md` Section 4.

**Required elements:**
1. **H1 heading** matching the title.
2. **Origins callout** (see Section 4.2 in page-generation-spec.md).
3. **2–3 line overview** expanding the summary.
4. **3–6 sections** with clear headings (e.g., "Key Idea", "How It Works", "Platform Notes", "Tips").
5. **1–2 pseudocode or formula blocks** per major concept.
6. **Platform comparison section** when concepts differ between classic and Tank Royale.
7. **Illustration placeholders** (see Section 4.3 in page-generation-spec.md).
8. **Further Reading section** (see Section 4.4 in page-generation-spec.md).

#### Rules

- Use **"bot"** not "robot" (except in quoted titles/APIs).
- Use **"units"** not "pixels" for measurements.
- Line length ≤ 120 characters.
- UTF-8 encoding, emoji allowed.
- American English spelling.
- Short paragraphs (2–4 sentences).

#### Illustration Placeholders

**You MUST include at least one illustration placeholder** for any page that involves geometric concepts, movement patterns, coordinate systems, or algorithm visualizations.

See `specs/page-generation-spec.md` Section 4.3 for the complete structured format specification, including:
- Required fields (Filename, Caption, Viewport, Battlefield)
- Optional fields (Bots, Lines, Arcs, Circles, Texts, Bullets, Description)
- Book color palette
- SVG sizing rules

**Quick reference example:**

```markdown
<!-- TODO: Illustration
**Filename:** circular-targeting-geometry.svg
**Caption:** "Circular targeting predicts where the enemy will be based on its turn rate"
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1000, 4500), body: 20, turret: 60, radar: 90
  - type: enemy, position: (6500, 1500), body: -3, turret: 260, radar: 260
**Lines:**
  - from: (1400, 4500), to: (6100, 1700), color: #cc0, arrow: true, dashed: true
**Texts:**
  - text: "bullet path", position: (3000, 3000), color: #cc0
-->
```

#### Origins Callout

**Every page MUST include an Origins callout** immediately after the H1 heading.

See `specs/page-generation-spec.md` Section 4.2 for complete attribution guidelines and format. Key points:

1. Check `book/appendices/wall-of-fame.md` for known originators.
2. Credit specific people when known (e.g., Paul Evans "PEZ" for Wave Surfing).
3. Otherwise credit the RoboWiki community.

**Format:**

```markdown
> [!TIP] Origins
> **Technique Name** was developed by **Person Name ("Alias")** and refined by the RoboWiki community.
```

#### Further Reading Section

**Every page MUST end with a Further Reading section** linking to RoboWiki and Tank Royale documentation.

See `specs/page-generation-spec.md` Section 4.4 for complete guidelines.

**Format:**

```markdown
## Further Reading

- [Article Name](https://robowiki.net/wiki/Article_Name) — RoboWiki (classic Robocode)
- [Tank Royale Topic](https://robocode.dev/articles/topic.html) — Tank Royale documentation
```


### 4. Update `config.js`

After generating the page, update `book/.vitepress/config.js`:

#### Sidebar Update

Add the new page to the appropriate sidebar section. The sidebar uses this nested structure:

```javascript
sidebar: {
  '/targeting/': [
    {
      text: 'Targeting Systems',
      items: [
        { text: 'Simple Targeting', items: [
          { text: 'Head-On Targeting', link: '/targeting/simple-targeting/head-on-targeting' },
          { text: 'Linear Targeting', link: '/targeting/simple-targeting/linear-targeting' },
          // Add new page here in correct position
        ]},
        // ...
      ]
    }
  ],
  // ...
}
```

**Placement rules:**
- Find the correct top-level sidebar key (e.g., `'/targeting/'`).
- Navigate to the correct nested `items` array based on the sub-section.
- Add the new entry in logical order (alphabetical or following book structure order).

#### Nav Update

Map to the existing `themeConfig.nav` structure. The nav typically links to the first page of each section.

**If the section is not found in nav:**
- Flag for human review with a comment: `// TODO: Review nav entry for <section>`
- Do not create new nav dropdowns automatically.

### 5. Update Glossary (if needed)

After generating the page, check if any new terms should be added to `book/appendices/glossary.md`.

#### When to add glossary entries

Add a glossary entry when the page introduces:

1. **New terminology** — Technical terms not yet defined in the glossary (e.g., "wave surfing", "GuessFactor", "pattern matching")
2. **Battle format references** — If the page discusses 1v1, melee, or team battles in depth, ensure these are in the glossary
3. **Algorithm names** — Specific targeting or movement algorithms (e.g., "circular targeting", "minimum risk movement")
4. **Physics concepts** — Game mechanics terms (e.g., "gun heat", "bullet power", "energy")

#### How to check

1. Read `book/appendices/glossary.md` to see existing terms.
2. Identify key terms introduced or heavily used in the new page.
3. For each term, check if it already exists in the glossary.

#### How to add entries

If a term is missing, add it to the appropriate section in the glossary:

- **Battle formats** — 1v1, melee, team definitions
- **General terms** — Core game concepts (bot, energy, turn, wave, etc.)
- **Platform-specific terms** — Classic Robocode, Tank Royale, RoboRumble, LiteRumble
- **Movement terms** — Movement strategies and techniques
- **Targeting terms** — Targeting algorithms and concepts

**Entry format:**

```markdown
### Term Name

Brief 1-3 sentence definition explaining what the term means in the Robocode context.

See: [Related Page](../path/to/related-page.md) (optional, if a dedicated page exists)
```

#### When NOT to add entries

- The term is already defined in the glossary
- The term is self-explanatory (e.g., "battlefield", "bullet")
- The term is only used once and explained inline in the page

### 6. Validate

1. Check for errors in the generated `.md` file.
2. Check for errors in `config.js` after the update.
3. Check for errors in `glossary.md` if updated.
4. Report any issues to the user.

---

## Example

**Input:** `/create-page Circular Targeting`

**Actions:**
1. Found in `BOOK_STRUCTURE.md` under:
   - Section: "Targeting Systems"
   - Sub-section: "Simple Targeting"
   - Full entry: "Circular Targeting (with Walkthrough) [I]"
   - Difficulty: intermediate
2. Cleaned title: "Circular Targeting"
3. Slug: `circular-targeting`
4. Output path: `book/targeting/simple-targeting/circular-targeting.md`
5. Sources from `robowiki-links.md`:
   - https://robowiki.net/wiki/Circular_Targeting
   - https://robowiki.net/wiki/Circular_Targeting/Walkthrough
6. Generated page with:
   - Frontmatter (title, category, summary, tags, difficulty, source)
   - **Origins callout** crediting the RoboWiki community
   - Body sections (overview, key idea, math, pseudocode, platform notes, tips)
   - Illustration placeholders with detailed descriptions for geometric concepts
   - **Further Reading section** with RoboWiki links
7. Updated `config.js`:
   - Added to `/targeting/` sidebar under "Simple Targeting" items.
8. Checked glossary:
   - "Circular targeting" already exists in glossary → no update needed.
   - (If missing, would add entry under "Targeting terms" section)

**Generated page structure:**

```markdown
---
title: "Circular Targeting"
# ...frontmatter...
---

# Circular Targeting

> [!TIP] Origins
> **Circular Targeting** is a foundational technique documented by the RoboWiki community as the next step after linear targeting.

Circular targeting predicts where to aim by assuming the enemy...

## Key Idea
...

## How It Works
...

## Platform Notes
...

## Tips
...

## Further Reading

- [Circular Targeting](https://robowiki.net/wiki/Circular_Targeting) — RoboWiki (classic Robocode)
- [Circular Targeting/Walkthrough](https://robowiki.net/wiki/Circular_Targeting/Walkthrough) — RoboWiki (classic Robocode)
```

---

## Reference Documents

- `AGENTS.md` — Writing rules, terminology, page generation contract.
- `specs/page-generation-spec.md` — Detailed frontmatter and body structure rules.
- `BOOK_STRUCTURE.md` — Complete table of contents with hierarchy and difficulty markers.
- `BOOK_STRATEGY.md` — Audience, tone, and content philosophy.
- `specs/robowiki-links.md` — RoboWiki links for classic Robocode sources.
- `book/appendices/wall-of-fame.md` — Known originators of techniques for Origins attributions.


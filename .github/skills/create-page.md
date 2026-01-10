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

Follow the rules in `AI_GUIDELINES.md` and `specs/page-generation-spec.md`:

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

1. **H1 heading** matching the title.
2. **2–3 line overview** expanding the summary.
3. **3–6 sections** with clear headings (e.g., "Key Idea", "How It Works", "Platform Notes", "Tips").
4. **1–2 pseudocode or formula blocks** per major concept.
5. **Platform comparison section** when concepts differ between classic and Tank Royale.
6. **Illustration placeholders** (REQUIRED for visual concepts — see below).

#### Rules

- Use **"bot"** not "robot" (except in quoted titles/APIs).
- Use **"units"** not "pixels" for measurements.
- Line length ≤ 120 characters.
- UTF-8 encoding, emoji allowed.
- American English spelling.
- Short paragraphs (2–4 sentences).

#### Illustration Placeholders (REQUIRED)

**You MUST include at least one illustration placeholder** for any page that involves:
- Geometric concepts (angles, trajectories, predictions)
- Movement patterns (orbiting, strafing, wave surfing)
- Coordinate systems and angle conventions
- Before/after comparisons
- Algorithm visualizations

Most targeting, movement, and physics pages will need 1–3 illustration placeholders.

Use the structured format from `specs/page-generation-spec.md` Section 4.1. These placeholders can be
converted to SVG images using the `/create-illustration` skill.

Insert TODO comments where illustrations should go:

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
**Arcs:**
  - center: (7000, 2000), radius: 1000, startAngle: 180, endAngle: 270, color: chocolate, arrow: true, dashed: true
**Circles:**
  - center: (6100, 1600), radius: 100, color: red, fill: none
**Texts:**
  - text: "turn rate", position: (5500, 2800), color: chocolate
  - text: "predicted position", position: (5800, 1200), color: chocolate
  - text: "bullet path", position: (3000, 3000), color: #cc0
-->
```

**Required fields:**
- `Filename`: kebab-case, descriptive, with `.svg` extension
- `Caption`: Short description for display under the image
- `Viewport`: Dimensions as `WxH` (max 8000×8000); display size = W/8 × H/8
- `Battlefield`: `true` for grey border + black arena; `false` for transparent

**Optional fields:**
- `Bots`: List with `type` (friendly/enemy), `position`, `body`/`turret`/`radar` angles
- `Lines`, `Arcs`, `Circles`, `Texts`, `Bullets`: Structured element definitions
- `Description`: Free-form description for complex illustrations

See `specs/page-generation-spec.md` Section 4.1 for full field definitions and color palette.

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

### 5. Validate

1. Check for errors in the generated `.md` file.
2. Check for errors in `config.js` after the update.
3. Report any issues to the user.

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
   - Body sections (overview, key idea, math, pseudocode, platform notes, tips)
   - Illustration placeholders with detailed descriptions for geometric concepts
7. Updated `config.js`:
   - Added to `/targeting/` sidebar under "Simple Targeting" items.

---

## Reference Documents

- `AI_GUIDELINES.md` — Writing rules, terminology, page generation contract.
- `specs/page-generation-spec.md` — Detailed frontmatter and body structure rules.
- `BOOK_STRUCTURE.md` — Complete table of contents with hierarchy and difficulty markers.
- `BOOK_STRATEGY.md` — Audience, tone, and content philosophy.
- `specs/robowiki-links.md` — RoboWiki links for classic Robocode sources.


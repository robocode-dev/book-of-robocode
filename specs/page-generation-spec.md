~~# Page Generation Specification

This document defines how AI agents generate pages for *The Book of Robocode*.
It consolidates rules from the previous spec files into a single reference.

**Encoding:** All pages must be UTF-8 encoded. Emoji characters are allowed and preserved.

---

## 1. Input: Page Name from Book Structure

The AI receives a page name exactly as it appears in `BOOK_STRUCTURE.md`.

From the book structure hierarchy, extract:

| Field                 | Source                                  | Example                                                 |
|-----------------------|-----------------------------------------|---------------------------------------------------------|
| **Title**             | Page name (strip suffixes)              | "Circular Targeting"                                    |
| **Top-level section** | Parent section                          | "Targeting Systems"                                     |
| **Sub-section**       | Intermediate parent (if any)            | "Simple Targeting"                                      |
| **Difficulty**        | Marker: `[B]`/`[I]`/`[A]`               | `intermediate`                                          |
| **Slug**              | Kebab-case of title                     | `circular-targeting`                                    |
| **Output path**       | `book/<section>/<subsection>/<slug>.md` | `book/targeting/simple-targeting/circular-targeting.md` |

### Title Suffix Handling

Strip these suffixes from the display title, but use them for source lookup:

- `(with Walkthrough)` → include RoboWiki `/Walkthrough` sub-page
- `(with Tutorial)` → include RoboWiki `/Tutorial` sub-page
- `(Guided Tutorial)` → structure as step-by-step guide
- `(Factored Variants)` → include related variant pages

### Section to Folder Mapping

| Book Section                     | Folder               |
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

---

## 2. Source Attribution

### RoboWiki (Classic Robocode Only)

Search `specs/robowiki-links.md` for matching entries. Include:

- Main article URL
- Related sub-pages (`/Walkthrough`, `/Tutorial`, `/Implementations`, etc.)
- Category pages when relevant

**Format in frontmatter:**

```yaml
source: [
  "RoboWiki - Circular Targeting (classic Robocode) https://robowiki.net/wiki/Circular_Targeting",
  "RoboWiki - Circular Targeting/Walkthrough (classic Robocode) https://robowiki.net/wiki/Circular_Targeting/Walkthrough"
]
```

### Robocode Tank Royale

Reference https://robocode.dev for:

- API documentation (Java, .NET, Python)
- Physics and game rules
- Sample bots and tutorials

**Format in frontmatter:**

```yaml
source: [
  "Robocode Tank Royale Docs - API Reference https://robocode.dev/api/"
]
```

### Historical Sources (Optional)

For classic Robocode historical content:

- https://robocode.sourceforge.io/developerWorks.php

---

## 3. Frontmatter Generation

Every page begins with VitePress-compatible YAML frontmatter:

```yaml
---
title: "<Title>"
category: "<Top-level Section>"
summary: "<1–2 sentence summary for sidebar/SEO>"
tags: [ "<slug>", "<section>", "<subsection>", "<difficulty>", "robocode", "tank-royale" ]
difficulty: "beginner|intermediate|advanced"
source: [
  "<Source 1>",
  "<Source 2>"
]
---
```

### Field Rules

| Field        | Rule                                                                                     |
|--------------|------------------------------------------------------------------------------------------|
| `title`      | Use the cleaned title exactly. Do not rewrite or "improve" it.                           |
| `category`   | Exact spelling from `BOOK_STRUCTURE.md` top-level section.                               |
| `summary`    | 1–2 sentences describing what the reader will learn.                                     |
| `tags`       | Include: slug, section folder, subsection folder, difficulty, "robocode", "tank-royale". |
| `difficulty` | One of: `beginner`, `intermediate`, `advanced`.                                          |
| `source`     | Array of source strings with URLs.                                                       |

---

## 4. Body Structure

### Required Elements

1. **H1 Heading** — Must match the frontmatter `title` exactly.

2. **Origins Callout** — **REQUIRED** immediately after the H1 heading (see Section 4.2).

3. **Overview** — 2–3 lines expanding the summary. Explain what the concept is and why it matters.

4. **Main Sections** — 3–6 sections with clear headings. Suggested patterns:
    - "Key Idea" or "Core Concept"
    - "How It Works" or "The Math"
    - "Pseudocode" or "Algorithm"
    - "Platform Notes" (when concepts differ)
    - "Tips & Common Mistakes"
    - "When to Use It"

5. **Pseudocode/Formulas** — 1–2 blocks per major concept. Keep them short and readable.

6. **Platform Comparison** — Include when behavior differs between classic Robocode and Tank Royale.

7. **Illustration Placeholders** — **REQUIRED** for visual concepts (see Section 4.3).

8. **Further Reading Section** — **REQUIRED** at the end of the page (see Section 4.4).

### 4.2 Origins Callout (REQUIRED)

**Every page MUST include an Origins callout** immediately after the H1 heading. This credits the people and community
who developed the technique or concept.

**Format:**

```markdown
# Page Title

> [!TIP] Origins
> **Technique Name** was developed by **Person Name ("Alias")** and refined by the RoboWiki community.
```

**Attribution guidelines:**

1. **Check `book/appendices/wall-of-fame.md`** for known originators of techniques.
2. **Known attributions include:**
    - **Mathew A. Nelson (Mat Nelson)** — Original creator of Robocode; Linear/Circular Targeting (original IBM samples)
    - **Flemming Nørnberg Larsen (fnl)** — Long-time maintainer of classic Robocode; creator of Robocode Tank Royale
    - **David Alves** — Invented the Wave concept; co-pioneer of GuessFactor Targeting; pioneered Pattern Matching (Phoenix); pioneered Random Orbital Movement
    - **Paul Evans** — Co-pioneer of GuessFactor Targeting (discovered "bins"); popularized Segmentation
    - **Alexandros (ABC)** — Invented Wave Surfing; pioneered Dynamic Clustering; co-pioneered Minimum Risk Movement (with Aelryen)
    - **Patrick Cupka (Voidious)** — Refined Wave Surfing and movement flattening; former RoboWiki manager
    - **Kev (kc)** — Current 1-vs-1 champion; author of GresSuffurd; pushed statistical targeting and movement to absolute limits
    - **Albert Perez** — Creator of RoboRumble; pioneered Precise Prediction physics simulation
    - **Julian Kent (Skilgannon)** — Perfected Dynamic Clustering; developed Bucket-PR k-D tree; LiteRumble maintainer; current RoboWiki.net host
    - **Kyle Huntington (Kawigi)** — Popularized GuessFactor Targeting through tutorials and FloodMini
    - **Peter Strömberg (PEZ)** — RoboWiki founder (2003); popularized techniques through CassiusClay
    - **Crippa** — Co-founder of RoboWiki (2003)
    - **Corbos** — First to mention k-D Trees on RoboWiki
    - **Chase-san** — Early explorer of k-D trees in Robocode
    - **Nathaniel Simonton (Simonton)** — Built the first k-D tree implementation in a bot (Diamond); pushed Dynamic Clustering to its limits
    - **Alex Schultz (Rednaxela)** — Developed highly optimized Java k-D tree implementations with advanced pruning strategies; sparked performance race with Skilgannon
    - **Aelryen** — Co-pioneered Minimum Risk Movement (with ABC)
    - **MultiplyByZer0** — Documented complex wave mechanics and provided code samples
3. **If no specific originator is known**, credit the RoboWiki community:
   ```markdown
   > [!TIP] Origins
   > **Technique Name** was developed and documented by the RoboWiki community.
   ```
4. **If multiple people contributed**, list them:
   ```markdown
   > [!TIP] Origins
   > **Technique Name** was pioneered by **Person A ("Alias")** and refined by **Person B ("Alias")** and the RoboWiki community.
   ```

### 4.3 Illustration Placeholders (REQUIRED)

**You MUST include at least one illustration placeholder** for any page that involves:

- Geometric concepts (angles, trajectories, predictions)
- Movement patterns (orbiting, strafing, wave surfing)
- Coordinate systems and angle conventions
- Before/after comparisons
- Algorithm visualizations

Most targeting, movement, and physics pages will need 1–3 illustration placeholders.

Use the `/create-illustration` skill (see `.github/skills/create-illustration.md`) to generate SVG images
from these placeholders.

Insert detailed TODO comments where illustrations should go:

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
  - from: (1400, 4500), to: (6100, 1700), color: #cc0, arrow: true, dashed: true, label: "bullet path"
**Arcs:**
  - center: (7000, 2000), radius: 1000, startAngle: 180, endAngle: 270, color: chocolate, arrow: true, 
    dashed: true, label: "enemy arc"
**Circles:**
  - center: (6100, 1600), radius: 100, color: red, fill: none, label: "predicted position"
**Texts:**
  - text: "turn rate", position: (5500, 2800), color: chocolate
-->
```

**When to include:**

- Geometric concepts (angles, trajectories, predictions)
- Movement patterns (orbiting, strafing, wave surfing)
- Coordinate systems and angle conventions
- Before/after comparisons
- Algorithm visualizations

**Required fields in each placeholder:**

| Field         | Description                                                                  |
|---------------|------------------------------------------------------------------------------|
| `Filename`    | Kebab-case, descriptive name with `.svg` extension                           |
| `Caption`     | Short description for display under the image (1 sentence)                   |
| `Viewport`    | Viewport dimensions as `WxH` (max 8000×8000). Display size = W/8 × H/8       |
| `Battlefield` | `true` to draw grey border + black arena background; `false` for transparent |

**Optional structured fields:**

| Field         | Description                                                                                                |
|---------------|------------------------------------------------------------------------------------------------------------|
| `Bots`        | List of bots with: `type` (friendly/enemy), `position` (x,y), `body`/`turret`/`radar` angles in degrees    |
| `Lines`       | List of lines with: `from` (x,y), `to` (x,y), `color`, `arrow` (bool), `dashed` (bool), `label`            |
| `Arcs`        | List of arcs with: `center` (x,y), `radius`, `startAngle`, `endAngle`, `color`, `arrow`, `dashed`, `label` |
| `Circles`     | List of circles with: `center` (x,y), `radius`, `color`, `fill` (color or `none`), `label`                 |
| `Texts`       | List of text labels with: `text`, `position` (x,y), `color`, `rotate` (optional angle)                     |
| `Bullets`     | List of bullets with: `position` (x,y), `radius` (50–100), `color`                                         |
| `Description` | Free-form description for complex illustrations not fully captured by structured fields                    |

**Book color palette:**

| Element               | Color       | Hex/Name    |
|-----------------------|-------------|-------------|
| Friendly bot (body)   | Blue        | `#019`      |
| Friendly bot (turret) | Blue        | `#06c`      |
| Friendly bot (radar)  | Light blue  | `#aaf`      |
| Enemy bot (body)      | Red         | `#c00`      |
| Enemy bot (turret)    | Red         | `#e22`      |
| Enemy bot (radar)     | Light red   | `#faa`      |
| Default text/lines    | Chocolate   | `chocolate` |
| Bullet                | Orange      | `#F59E0B`   |
| Path/trajectory       | Gray dashed | `#6B7280`   |
| Safe zone             | Green       | `#10B981`   |
| Danger zone           | Red         | `#EF4444`   |
| Highlight             | Yellow      | `#cc0`      |
| Battlefield border    | Gray        | `grey`      |
| Battlefield arena     | Black       | `black`     |

**SVG sizing rules:**

- Viewport is set via `viewBox="0 0 W H"` where W and H are from the `Viewport` field
- Display width = viewport width / 8 (e.g., 8000 → 1000px)
- Display height = viewport height / 8 (e.g., 6000 → 750px)
- Maximum viewport: 8000×8000 (maximum display: 1000×1000px)
- Tank size is 800×800 units, centered at (400, 400) relative to its position

**Battlefield rendering (when `Battlefield: true`):**

- Grey rectangle fills entire viewport (border)
- Black rectangle inset by 200 units on all sides (arena)

### 4.4 Further Reading Section (REQUIRED)

**Every page MUST end with a Further Reading section** that links to relevant RoboWiki pages and Tank Royale
documentation.

**Format:**

```markdown
## Further Reading

- [Article Name](https://robowiki.net/wiki/Article_Name) — RoboWiki (classic Robocode)
- [Sub-page Name](https://robowiki.net/wiki/Article_Name/Sub_page) — RoboWiki (classic Robocode)
- [Tank Royale Topic](https://robocode.dev/articles/topic.html) — Tank Royale documentation
```

**Guidelines:**

1. Include all RoboWiki links from the `source` frontmatter field.
2. Add any additional relevant RoboWiki pages found in `specs/robowiki-links.md`.
3. Include Tank Royale documentation links when applicable.
4. Use descriptive link text matching the article title.
5. Add the suffix "— RoboWiki (classic Robocode)" or "— Tank Royale documentation" for clarity.

### Heading Style

- **Procedural/tutorial pages:** Use numbered headings (`## 1. First Step`).
- **Conceptual pages:** Use unnumbered headings (`## Key Idea`).

### Length

- Target: 500–700 words.
- Maximum: 800 words (unless explicitly justified).

---

## 5. Terminology and Formatting

### Required Terminology

| Always Use | Never Use | Exception                               |
|------------|-----------|-----------------------------------------|
| **bot**    | robot     | Quoted titles, API names, external docs |
| **units**  | pixels    | —                                       |

### Text Formatting

- **Line length:** ≤ 120 characters.
- **Paragraphs:** 2–4 sentences maximum.
- **Language:** American English spelling.
- **Encoding:** UTF-8, no escape characters.
- **Emoji:** Allowed when they add clarity or motivation.

### Markdown Features

Use these VitePress/Markdown features:

- **Callouts:** `> [!TIP]`, `> [!WARNING]`, `> [!NOTE]`
- **Code blocks:** Use `pseudocode` or language-specific syntax highlighting.
- **Tables:** For comparisons and reference data.
- **Lists:** For steps, options, or related items.
- **KaTeX:** For mathematical formulas (e.g., `$a^2 + b^2 = c^2$`).

### Formula Rules

- Use KaTeX notation enclosed in single dollar signs: `$formula$`
- **Do not** use `$$` blocks (display math).
- Define all symbols before or immediately after the formula.
- All formulas, whether simple or complex, should use inline `$formula$` notation.

## 6. Platform Distinction

### Source Rules

| Source                  | Platform              | Use For                                          |
|-------------------------|-----------------------|--------------------------------------------------|
| RoboWiki.net            | Classic Robocode only | Concepts, strategies, historical implementations |
| robocode.dev            | Tank Royale only      | APIs, physics, game rules, sample bots           |
| robocode.sourceforge.io | Classic Robocode only | Historical documentation                         |

### When Concepts Differ

**ONLY include a "Platform Notes" or "Platform Differences" section when there are ACTUAL differences** between
classic Robocode and Tank Royale that affect the technique or concept.

**Do NOT create a platform section if:**

- The mechanics are identical (e.g., gun heat cooling rate, bullet power formulas)
- Only API method names differ but both platforms have equivalent methods
- The concept works the same way in both platforms

**DO create a platform section if:**

- Physics behavior differs (e.g., coordinate systems, angle conventions)
- API capabilities differ (e.g., one platform has features the other doesn't)
- Game rules differ (e.g., team damage, scoring mechanics)
- Implementation approaches differ significantly

When you identify actual differences:

1. Explain the general concept first (platform-agnostic).
2. Add a "Platform Notes" section with specific differences.
3. Use callouts to highlight critical differences:

```markdown
> [!WARNING] Platform Difference
> In classic Robocode, heading 0° points north (up).
> In Tank Royale, heading 0° points east (right).
```

**Example of what NOT to do:**

```markdown
### Platform Differences

**Classic Robocode:**

- Gun heat cooling: 0.1 per turn
- Gun heat after firing: `1.0 + bulletPower / 5.0`

**Tank Royale:**

- Gun heat cooling: 0.1 per turn (same)
- Gun heat after firing: `1.0 + bulletPower / 5.0` (same)

The mechanics are identical.
```

**Better approach when mechanics are identical:**

Simply state: "Gun heat mechanics work identically in both classic Robocode and Tank Royale, with a cooling rate of
0.1 per turn and heat generation of `1.0 + bulletPower / 5.0` after firing." No separate platform section needed.

---

## 7. Config.js Updates

After creating a page, update `book/.vitepress/config.js`.

### Sidebar Structure

The sidebar uses nested `items` arrays:

```javascript
sidebar: {
    '/targeting/':
    [
        {
            text: 'Targeting Systems',
            items: [
                {
                    text: 'Simple Targeting', items: [
                        {text: 'Head-On Targeting', link: '/targeting/simple-targeting/head-on-targeting'},
                        {text: 'Linear Targeting', link: '/targeting/simple-targeting/linear-targeting'},
                        {text: 'Circular Targeting', link: '/targeting/simple-targeting/circular-targeting'},
                    ]
                },
            ]
        }
    ],
}
```

**Rules:**

- Find the sidebar key matching the section folder (e.g., `'/targeting/'`).
- Navigate to the correct nested `items` array.
- Add the new entry with `text` (display name) and `link` (path without `.md`).
- Maintain logical order (follow `BOOK_STRUCTURE.md` order).

### Nav Structure

The nav typically links to the first page of each section. Do not add new nav dropdowns automatically.

**If the section is missing from nav:**

- Add a comment: `// TODO: Review nav entry for <section>`
- Flag for human review.

---

## 8. Validation Checklist

Before completing, verify:

- [ ] Frontmatter is valid YAML.
- [ ] Title in frontmatter matches H1 heading.
- [ ] All sources have URLs.
- [ ] Difficulty matches the `[B]`/`[I]`/`[A]` marker from book structure.
- [ ] Line length ≤ 120 characters.
- [ ] Uses "bot" not "robot" (except in quotes/APIs).
- [ ] Uses "units" not "pixels".
- [ ] `config.js` has valid JavaScript syntax after update.
- [ ] Sidebar entry is in the correct nested location.
- [ ] Updated `book/introduction/whats-coming-next.md` to remove the completed page from pending lists.~~


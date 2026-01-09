# Page Generation Specification

This document defines how AI agents generate pages for *The Book of Robocode*.
It consolidates rules from the previous spec files into a single reference.

**Encoding:** All pages must be UTF-8 encoded. Emoji characters are allowed and preserved.

---

## 1. Input: Page Name from Book Structure

The AI receives a page name exactly as it appears in `BOOK_STRUCTURE.md`.

From the book structure hierarchy, extract:

| Field | Source | Example |
|-------|--------|---------|
| **Title** | Page name (strip suffixes) | "Circular Targeting" |
| **Top-level section** | Parent section | "Targeting Systems" |
| **Sub-section** | Intermediate parent (if any) | "Simple Targeting" |
| **Difficulty** | Marker: `[B]`/`[I]`/`[A]` | `intermediate` |
| **Slug** | Kebab-case of title | `circular-targeting` |
| **Output path** | `book/<section>/<subsection>/<slug>.md` | `book/targeting/simple-targeting/circular-targeting.md` |

### Title Suffix Handling

Strip these suffixes from the display title, but use them for source lookup:

- `(with Walkthrough)` → include RoboWiki `/Walkthrough` sub-page
- `(with Tutorial)` → include RoboWiki `/Tutorial` sub-page
- `(Guided Tutorial)` → structure as step-by-step guide
- `(Factored Variants)` → include related variant pages

### Section to Folder Mapping

| Book Section | Folder |
|--------------|--------|
| Introduction | `introduction` |
| Getting Started | `getting-started` |
| Battlefield Physics | `physics` |
| Radar & Scanning | `radar` |
| Targeting Systems | `targeting` |
| Movement & Evasion | `movement` |
| Energy & Scoring | `energy-and-scoring` |
| Team Strategies | `team-strategies` |
| Melee Combat | `melee-combat` |
| Advanced Topics | `advanced` |
| Robocode Tank Royale Differences | `tank-royale` |
| Appendices | `appendices` |

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
tags: ["<slug>", "<section>", "<subsection>", "<difficulty>", "robocode", "tank-royale"]
difficulty: "beginner|intermediate|advanced"
source: [
  "<Source 1>",
  "<Source 2>"
]
---
```

### Field Rules

| Field | Rule |
|-------|------|
| `title` | Use the cleaned title exactly. Do not rewrite or "improve" it. |
| `category` | Exact spelling from `BOOK_STRUCTURE.md` top-level section. |
| `summary` | 1–2 sentences describing what the reader will learn. |
| `tags` | Include: slug, section folder, subsection folder, difficulty, "robocode", "tank-royale". |
| `difficulty` | One of: `beginner`, `intermediate`, `advanced`. |
| `source` | Array of source strings with URLs. |

---

## 4. Body Structure

### Required Elements

1. **H1 Heading** — Must match the frontmatter `title` exactly.

2. **Overview** — 2–3 lines expanding the summary. Explain what the concept is and why it matters.

3. **Main Sections** — 3–6 sections with clear headings. Suggested patterns:
   - "Key Idea" or "Core Concept"
   - "How It Works" or "The Math"
   - "Pseudocode" or "Algorithm"
   - "Platform Notes" (when concepts differ)
   - "Tips & Common Mistakes"
   - "When to Use It"

4. **Pseudocode/Formulas** — 1–2 blocks per major concept. Keep them short and readable.

5. **Platform Comparison** — Include when behavior differs between classic Robocode and Tank Royale.

6. **Illustration Placeholders** — Insert TODO comments where visuals would help (see Section 4.1).

### 4.1 Illustration Placeholders

For concepts that benefit from visual explanation, insert detailed TODO comments:

```markdown
<!-- TODO: Illustration
**Filename:** circular-targeting-geometry.svg
**Caption:** "Circular targeting predicts where the enemy will be based on its turn rate"
**Description:** Show a bot (blue) at center-left aiming at an enemy (red) that is moving in a 
circular arc. Draw the enemy's curved path as a dashed arc. Show the predicted intercept point 
with a crosshair marker. Draw the bullet trajectory as a straight line from the bot to the 
intercept point. Label: "turn rate", "predicted position", "bullet path".
**Colors:** Bot = blue (#3B82F6), Enemy = red (#EF4444), Path = gray dashed, Bullet = orange (#F59E0B)
**Size:** 600×400 px recommended
-->
```

**When to include:**
- Geometric concepts (angles, trajectories, predictions)
- Movement patterns (orbiting, strafing, wave surfing)
- Coordinate systems and angle conventions
- Before/after comparisons
- Algorithm visualizations

**Required fields in each placeholder:**

| Field | Description |
|-------|-------------|
| `Filename` | Kebab-case, descriptive name with `.svg` (preferred) or `.png` extension |
| `Caption` | Short description for display under the image (1 sentence) |
| `Description` | Detailed instructions for creating the illustration — what to show, how to arrange elements, what to label |
| `Colors` | Specific hex codes for consistency (use book color palette below) |
| `Size` | Recommended dimensions in pixels |

**Book color palette:**

| Element | Color | Hex |
|---------|-------|-----|
| Bot (self) | Blue | `#3B82F6` |
| Enemy | Red | `#EF4444` |
| Bullet | Orange | `#F59E0B` |
| Path/trajectory | Gray | `#6B7280` |
| Safe zone | Green | `#10B981` |
| Danger zone | Red | `#EF4444` (lighter: `#FCA5A5`) |
| Highlight | Yellow | `#FBBF24` |
| Walls/boundaries | Dark gray | `#374151` |

### Heading Style

- **Procedural/tutorial pages:** Use numbered headings (`## 1. First Step`).
- **Conceptual pages:** Use unnumbered headings (`## Key Idea`).

### Length

- Target: 500–700 words.
- Maximum: 800 words (unless explicitly justified).

---

## 5. Terminology and Formatting

### Required Terminology

| Always Use | Never Use | Exception |
|------------|-----------|-----------|
| **bot** | robot | Quoted titles, API names, external docs |
| **units** | pixels | — |

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

- Define all symbols before or immediately after the formula.
- Prefer inline math for simple expressions.
- Use display math (block) for important or complex equations.

---

## 6. Platform Distinction

### Source Rules

| Source | Platform | Use For |
|--------|----------|---------|
| RoboWiki.net | Classic Robocode only | Concepts, strategies, historical implementations |
| robocode.dev | Tank Royale only | APIs, physics, game rules, sample bots |
| robocode.sourceforge.io | Classic Robocode only | Historical documentation |

### When Concepts Differ

If a concept works differently between platforms:

1. Explain the general concept first (platform-agnostic).
2. Add a "Platform Notes" section with specific differences.
3. Use callouts to highlight critical differences:

```markdown
> [!WARNING] Platform Difference
> In classic Robocode, heading 0° points north (up).
> In Tank Royale, heading 0° points east (right).
```

---

## 7. Config.js Updates

After creating a page, update `book/.vitepress/config.js`.

### Sidebar Structure

The sidebar uses nested `items` arrays:

```javascript
sidebar: {
  '/targeting/': [
    {
      text: 'Targeting Systems',
      items: [
        { text: 'Simple Targeting', items: [
          { text: 'Head-On Targeting', link: '/targeting/simple-targeting/head-on-targeting' },
          { text: 'Linear Targeting', link: '/targeting/simple-targeting/linear-targeting' },
          { text: 'Circular Targeting', link: '/targeting/simple-targeting/circular-targeting' },
        ]},
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


# Page Spec – The Book of Robocode

## 1. Identity

- **Slug / file id**: `coordinates-and-angles`  
  (Must match the VuePress config entry, e.g., `'coordinates-and-angles'` in the sidebar.)
- **Output path** (optional if standard): `docs/articles/coordinates-and-angles.md`
- **Book section** (top-level): `Battlefield Physics`  
  (Use names from BOOK_STRUCTURE.md: Introduction, Getting Started, Battlefield Physics, Radar & Scanning, Targeting
  Systems, Movement & Evasion, Energy & Scoring, Team Strategies, Melee Combat, Advanced Topics, Robocode Tank Royale
  Differences, Appendices.)
- **Planned title** (if you want to override): `Coordinate Systems & Angles`
- **Difficulty**: `beginner` | `intermediate` | `advanced`

## 2. Sources

List the main references so the page can attribute correctly and stay accurate.

- **RoboWiki sources** (classic Robocode):
    - `http://robowiki.net/wiki/...`
    - `https://robocode.sourceforge.io/developerWorks.php/...`
- **Tank Royale sources** (robocode.dev / GitHub):
    - `https://robocode-dev.github.io/tank-royale/...`
    - `https://github.com/robocode-dev/tank-royale/...`
- **Other notes** (optional):
    - Any internal notes, diagrams, or prior drafts you want reflected.

## 3. Purpose & Scope

Describe what this page should cover, in your own words.

- **Goal of the page**:  
  (Example: “Explain how battlefield coordinates work and how angles are measured, focusing on differences between
  classic Robocode and Tank Royale.”)

- **What *must* be included** (bullet list):
    - Example: “Explain X/Y axes orientation for both platforms.”
    - Example: “Show the difference in heading conventions (clockwise vs counterclockwise, zero direction).”
    - Example: “Include one simple formula or pseudocode snippet that uses angles, such as converting heading to
      movement.”

- **What to avoid or keep minimal**:
    - Example: “No deep targeting math yet, just basic geometry.”

- **Illustration/image suggestions** (optional but recommended):
    - Give hints on the page in places where an illustration would help understanding and describe what each image
      should show.

## 4. Audience & Emphasis

- **Primary audience** (pick one):
    - `[x]` New players with basic programming knowledge
    - `[ ]` Intermediate Robocode players
    - `[ ]` Advanced/competitive players

- **Emphasis** (choose a few):
    - `[ ]` Conceptual understanding
    - `[ ]` Practical how-to
    - `[ ]` Tutorial/step-by-step
    - `[ ]` Historical context

(Add a short note if needed, e.g., “mostly conceptual, with one practical example.”)

## 5. Platform Notes

- **Applies to**:
    - `[x]` Classic Robocode
    - `[x]` Robocode Tank Royale

- **Specific platform differences to highlight**:
    - Example: “Tank Royale headings increase counterclockwise from east; classic Robocode headings increase clockwise
      from north (confirm exact conventions).”

## 6. Constraints & Preferences (optional)

- **Approximate word limit**:  
  (Default: 500–700; max 800.)
- **Preferred examples**:  
  (Example: “Show a small pseudocode loop that uses angles for movement. Bot size is 40x40 units, scan length is 1200
  units, and a bot can move up to 8 units per turn.”)
- **Anything else**:  
  (Example: “Mention how this links forward to the Bullet Physics page.”)

# Terminology Consistency: 'Bot' vs 'Robot'

Always use the term **"bot"** instead of "robot" throughout the book, except when quoting original titles or
references/links (e.g., RoboWiki page titles, API class names, or external documentation). This ensures consistent
language and avoids confusion for readers.

# Terminology Consistency: 'Units' vs 'Pixels'

Always use **"units"** for all measurements of distance, size, and movement in Robocode and Robocode Tank Royale. Do *
*not** use "pixels". For example, bot size is 40x40 units, scan length is 1200 units, and a bot can move up to 8 units
per turn. This ensures clarity and consistency for all contributors and readers.

# Header Numbering Consistency

To ensure consistency across all pages, use numbered headers (e.g., `## 1. Bot shape, size, and hitbox`) only when:

- The page is a step-by-step tutorial, procedure, or specification where sections are referenced by number.
- The structure benefits from explicit ordering (e.g., requirements, multi-part guides).

For narrative, conceptual, or general informational pages, use unnumbered headers.

**Examples:**

Numbered (for specs/tutorials):

```
## 1. Bot shape, size (in units), and hitbox
## 2. Movement and turning (in units)
## 3. Firing and targeting
```

Unnumbered (for narrative/conceptual):

```
## Bot shape, size (in units), and hitbox
## Movement and turning (in units)
## Firing and targeting
```

Agents and contributors should follow this rule for all new and updated pages.

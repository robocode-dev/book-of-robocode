# Skill: Create Illustration for The Book of Robocode

This skill generates SVG illustrations from `<!-- TODO: Illustration` markers in book pages.

## Trigger

- Slash command: `/create-illustration`
- Natural language: "Create illustration", "Generate the illustration", "Draw the SVG"

The skill scans the current file for `<!-- TODO: Illustration` markers and generates SVG files.

---

## Workflow

When invoked, perform these steps in order:

### 1. Find TODO Markers

1. Scan the current file for `<!-- TODO: Illustration` comment blocks.
2. Parse each marker to extract fields (see Section 3 for field definitions).
3. Validate that required fields are present.

### 2. Validate Fields

**Required fields:**

- `Filename` — Must end with `.svg`
- `Caption` — Short description for the image
- `Viewport` — Dimensions as `WxH` (e.g., `8000x6000`)

**Optional but recommended:**

- `Battlefield` — `true` or `false` (default: `false`)
- `Bots`, `Lines`, `Arcs`, `Circles`, `Texts`, `Bullets` — Structured element lists
- `Description` — Free-form description for complex illustrations

**If required fields are missing:**

- Output an error message listing the missing fields.
- Do not generate the SVG.

### 3. Generate SVG

1. Create the SVG with proper viewport and display dimensions.
2. Include the tank `<defs>` block (see Section 5).
3. Render the battlefield background if `Battlefield: true`.
4. Render all elements (bots, lines, arcs, circles, texts, bullets) in order.
5. Save the SVG to `book/images/<filename>`.

### 4. Insert Markdown Image Tag

After generating the SVG, insert the `<img>` tag immediately after the TODO marker:

```markdown
<!-- TODO: Illustration
...existing marker content...
-->

<img src="/images/filename.svg" alt="Caption text" width="1000">
<br>
*Caption text*
```

**Keep the TODO marker** for future regeneration. Insert the `<img>` tag below it.

### 5. Validate Output

1. Check the generated SVG file for syntax errors.
2. Verify the `<img>` tag was inserted correctly.
3. Report any issues to the user.

---

## Field Definitions

### Required Fields

| Field      | Format                | Example                                        |
|------------|-----------------------|------------------------------------------------|
| `Filename` | `kebab-case.svg`      | `circular-targeting-geometry.svg`              |
| `Caption`  | String (1 sentence)   | `"Circular targeting predicts enemy position"` |
| `Viewport` | `WxH` (max 8000×8000) | `8000x6000`                                    |

### Optional Fields

| Field         | Format         | Description                                       |
|---------------|----------------|---------------------------------------------------|
| `Battlefield` | `true`/`false` | Draw grey border + black arena                    |
| `Bots`        | YAML list      | List of bot definitions                           |
| `Lines`       | YAML list      | List of line definitions                          |
| `Arcs`        | YAML list      | List of arc definitions                           |
| `Circles`     | YAML list      | List of circle definitions                        |
| `Texts`       | YAML list      | List of text label definitions                    |
| `Bullets`     | YAML list      | List of bullet definitions                        |
| `Description` | Free text      | Additional instructions for complex illustrations |

### Bot Definition

```yaml
- type: friendly|enemy
  position: (x, y)
  body: <angle in degrees>
  turret: <angle in degrees>
  radar: <angle in degrees>
  scale: <optional, default 1.0>
```

### Line Definition

```yaml
- from: (x, y)
  to: (x, y)
  color: <color>
  arrow: true|false
  dashed: true|false
  label: "<optional text>"
```

### Arc Definition

```yaml
- center: (x, y)
  radius: <number>
  startAngle: <degrees>
  endAngle: <degrees>
  color: <color>
  arrow: true|false
  dashed: true|false
  label: "<optional text>"
```

### Circle Definition

```yaml
- center: (x, y)
  radius: <number>
  color: <color>
  fill: <color>|none
  label: "<optional text>"
```

### Text Definition

```yaml
- text: "<label text>"
  position: (x, y)
  color: <color>
  rotate: <optional angle in degrees>
```

### Bullet Definition

```yaml
- position: (x, y)
  radius: <50-100>
  color: <color, default #F59E0B>
```

---

## Color Palette

Use these colors for consistency across all illustrations:

| Element               | Color      | Value       |
|-----------------------|------------|-------------|
| Friendly bot (body)   | Blue       | `#019`      |
| Friendly bot (turret) | Blue       | `#06c`      |
| Friendly bot (radar)  | Light blue | `#aaf`      |
| Enemy bot (body)      | Red        | `#c00`      |
| Enemy bot (turret)    | Red        | `#e22`      |
| Enemy bot (radar)     | Light red  | `#faa`      |
| Default text/lines    | Chocolate  | `chocolate` |
| Bullet                | Orange     | `#F59E0B`   |
| Path/trajectory       | Gray       | `#6B7280`   |
| Highlight/prediction  | Yellow     | `#cc0`      |
| Safe zone             | Green      | `#10B981`   |
| Danger zone           | Red        | `#EF4444`   |
| Battlefield border    | Gray       | `grey`      |
| Battlefield arena     | Black      | `black`     |

---

## SVG Structure

### Viewport and Display Size

```xml

<svg version="1.1" width="W/8" height="H/8" viewBox="0 0 W H" xmlns="http://www.w3.org/2000/svg"/>
```

- `viewBox` uses the `Viewport` dimensions (e.g., `8000x6000`)
- `width` and `height` are viewport dimensions divided by 8 (e.g., `1000` and `750`)
- Maximum viewport: 8000×8000 (maximum display: 1000×1000)

### SVG Template

```xml

<svg version="1.1" width="1000" height="750" viewBox="0 0 8000 6000" xmlns="http://www.w3.org/2000/svg">

    <style>
        .text { font: 150px sans-serif; }
    </style>

    <!-- Arrow markers (one per color used) -->
    <marker id="arrow-head" markerWidth="20" markerHeight="20" refX="6" refY="3" orient="auto">
        <polygon points="6 0, 12 3, 6 6" fill="chocolate"/>
    </marker>

    <!-- Battlefield background (if Battlefield: true) -->
    <rect x="0" y="0" width="8000" height="6000" fill="grey"/>
    <rect x="200" y="200" width="7600" height="5600" fill="black"/>

    <!-- Lines (drawn BEFORE bots so bots appear on top) -->
    <line x1="..." y1="..." x2="..." y2="..." stroke="chocolate" stroke-width="20" marker-end="url(#arrow-head)"/>

    <!-- Arcs -->
    <path d="M ... A ..." stroke="chocolate" stroke-width="20" fill="none"/>

    <!-- Circles -->
    <circle cx="..." cy="..." r="..." stroke="..." stroke-width="20" fill="..."/>

    <!-- Bullets -->
    <circle cx="..." cy="..." r="75" fill="#F59E0B"/>

    <!-- Bots (drawn AFTER lines so they appear on top) -->
    <use href="#tank" transform="translate(x,y)"
         style="--body-rotation:Xdeg; --turret-rotation:Ydeg; --radar-rotation:Zdeg;"/>

    <!-- Texts -->
    <text class="text" x="..." y="..." fill="chocolate">Label</text>

    <!-- Tank defs block (REQUIRED - copy from book/images/tank.svg) -->
    <defs>
        <!-- Full defs content from tank.svg lines 7-155 -->
    </defs>
</svg>
```

---

## Tank Rendering

### Tank Size and Origin

- Tank is 800×800 units
- Tank rotates around its center at (400, 400) relative to its position
- Use `translate(x, y)` to position the tank's top-left corner
- The visual center of the tank is at `(x+400, y+400)`

### Friendly Bot (Blue)

```xml

<use href="#tank" transform="translate(1000,4500)"
     style="--body-rotation:20deg; --turret-rotation:60deg; --radar-rotation:90deg;"/>
```

Uses default colors from `<defs>`: body `#019`, turret `#06c`, radar `#aaf`.

### Enemy Bot (Red)

```xml

<use href="#tank" transform="translate(6500,1500)"
     style="--tank-body-color:#c00; --tank-turret-color:#e22; --tank-radar-color:#faa;
            --body-rotation:-3deg; --turret-rotation:260deg; --radar-rotation:260deg;"/>
```

### Scaling Tanks

**Important:** For large illustrations (viewport 8000×6000 or larger), scale tanks down using `scale()` to avoid them
appearing too large. Always add `scale()` AFTER `translate()`:

```xml

<use href="#tank" transform="translate(1000,4500) scale(0.75)"
     style="--body-rotation:20deg; --turret-rotation:60deg; --radar-rotation:90deg;"/>
```

**Scaling guidelines:**

- **8000×6000 or larger viewport:** Use `scale(0.75)` or `scale(0.5)`
- **4000×3000 or smaller viewport:** Use `scale(1)` or `scale(0.5)` depending on tank prominence
- Scale must come AFTER `translate()` in the transform attribute

---

## Line Rendering

### Basic Line

```xml

<line x1="400" y1="700" x2="3000" y2="295" stroke="chocolate" stroke-width="20"/>
```

### Line with Arrow

```xml

<line x1="400" y1="700" x2="3000" y2="295" stroke="chocolate" stroke-width="20"
      marker-end="url(#arrow-head)"/>
```

### Dashed Line

```xml

<line x1="400" y1="700" x2="3000" y2="295" stroke="chocolate" stroke-width="20"
      stroke-dasharray="150 20"/>
```

### Arrow Markers (Multiple Colors)

Each arrow color needs its own marker definition:

```xml

<marker id="arrow-head" markerWidth="20" markerHeight="20" refX="6" refY="3" orient="auto">
    <polygon points="6 0, 12 3, 6 6" fill="chocolate"/>
</marker>

<marker id="arrow-head-yellow" markerWidth="20" markerHeight="20" refX="6" refY="3" orient="auto">
<polygon points="6 0, 12 3, 6 6" fill="#cc0"/>
</marker>

<marker id="arrow-head-red" markerWidth="20" markerHeight="20" refX="6" refY="3" orient="auto">
<polygon points="6 0, 12 3, 6 6" fill="red"/>
</marker>
```

---

## Arc Rendering

Arcs use SVG path with the `A` (arc) command:

```xml

<path d="M startX startY A radius radius 0 largeArcFlag sweepFlag endX endY"
      stroke="chocolate" stroke-width="20" fill="none" marker-end="url(#arrow-head)"/>
```

**Arc flags:**

- `largeArcFlag`: 0 for arc ≤180°, 1 for arc >180°
- `sweepFlag`: 0 for counter-clockwise, 1 for clockwise

**Example (quarter circle arc):**

```xml

<path d="M 3650 1350 A 1000 1000 0 0 0 2760 230"
      stroke="chocolate" stroke-width="20" fill="none" stroke-dasharray="150 20"
      marker-end="url(#arrow-head)"/>
```

---

## Text Rendering

### Basic Text

```xml

<text class="text" x="650" y="690" fill="chocolate">Label text</text>
```

### Rotated Text

```xml

<text class="text" x="650" y="690" fill="chocolate" transform="rotate(-45, 650, 690)">Rotated label</text>
```

**Note:** The rotation is around the text's position (x, y).

### Text Style

Include in the `<style>` block:

```xml

<style>
    .text { font: 150px sans-serif; }
</style>
```

Font size is typically 120–150px depending on overall image size.

---

## Bullet Rendering

Bullets are filled circles:

```xml

<circle cx="2500" cy="1800" r="75" fill="#F59E0B"/>
```

- Radius: 50–100 units (75 is a good default)
- Default color: `#F59E0B` (orange)

---

## Battlefield Background

When `Battlefield: true`, render:

```xml
<!-- Grey border (full viewport) -->
<rect x="0" y="0" width="8000" height="6000" fill="grey"/>

        <!-- Black arena (inset by 200 units) -->
<rect x="200" y="200" width="7600" height="5600" fill="black"/>
```

**Important:** Only include the battlefield if the arena borders are relevant to the illustration (e.g., wall collision
mechanics, boundary demonstrations). For most targeting and movement concept illustrations, omit the battlefield
background for clarity.

---

## Lines of Fire

When drawing a line from a bot that fires a bullet:

1. Draw the line FIRST (before the bot)
2. Start the line from the bot's center: `(x + 400, y + 400)`
3. The bot is drawn AFTER, so it appears on top of the line
4. Point the turret angle in the direction of the line

---

## Markdown Output

After generating the SVG, insert below the TODO marker:

```markdown
<img src="/images/circular-targeting-geometry.svg" alt="Circular targeting predicts enemy position" width="1000">
<br>
*Circular targeting predicts enemy position*
```

**Rules:**

- `src` uses absolute path from site root: `/images/<filename>`
- `alt` matches the `Caption` field
- `width` = viewport width / 8
- Caption is repeated below in italics after a `<br>`

---

## Tank Defs Block

Copy this entire `<defs>` block into every generated SVG. This is from `book/images/tank.svg`:

```xml

<defs>
    <style>
        .tank-body, .tank-turret, .tank-radar {
        transform-origin: 400px 400px;
        }
        .tank-body {
        transform: rotate(var(--body-rotation, 0deg));
        }
        .tank-turret {
        transform: rotate(var(--turret-rotation, 0deg));
        }
        .tank-radar {
        transform: rotate(var(--radar-rotation, 0deg));
        }
        svg {
        --tank-body-color: #019;
        --tank-turret-color: #06c;
        --tank-radar-color: #aaf;
        --left-belt-track-1: inline;
        --left-belt-track-2: none;
        --left-belt-track-3: none;
        --right-belt-track-1: none;
        --right-belt-track-2: inline;
        --right-belt-track-3: none;
        }
        .tank-body-fill {
        fill: var(--tank-body-color, #019);
        }
        .tank-turret-fill {
        fill: var(--tank-turret-color, #06c);
        }
        .tank-radar-fill {
        fill: var(--tank-radar-color, #aaf);
        }
        .left-belt, .right-belt {
        display: none;
        }
        .left-belt.track1 {
        display: var(--left-belt-track-1, none);
        }
        .left-belt.track2 {
        display: var(--left-belt-track-2, none);
        }
        .left-belt.track3 {
        display: var(--left-belt-track-3, none);
        }
        .right-belt.track1 {
        display: var(--right-belt-track-1, none);
        }
        .right-belt.track2 {
        display: var(--right-belt-track-2, none);
        }
        .right-belt.track3 {
        display: var(--right-belt-track-3, none);
        }
    </style>

    <linearGradient id="cannon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#333"/>
        <stop offset="50%" stop-color="#CCC"/>
        <stop offset="100%" stop-color="#333"/>
    </linearGradient>

    <symbol id="link0">
        <rect x="5" y="55" width="125" height="25" fill="#aaaaaa"/>
        <rect x="10" y="70" width="116" height="35" fill="#666666" rx="10" ry="10"/>
        <rect x="5" y="55" width="125" height="50" fill="none" stroke="black" stroke-width="10" rx="10" ry="10"/>
    </symbol>

    <symbol id="link30">
        <rect x="5" y="55" width="125" height="25" fill="#939393"/>
        <rect x="10" y="70" width="116" height="30" fill="#585858" rx="10" ry="10"/>
        <rect x="5" y="55" width="125" height="42" fill="none" stroke="black" stroke-width="10" rx="10" ry="10"/>
    </symbol>

    <symbol id="link60">
        <rect x="5" y="55" width="125" height="20" fill="#555555"/>
        <rect x="5" y="55" width="125" height="20" fill="none" stroke="black" stroke-width="10" rx="10" ry="10"/>
    </symbol>

    <symbol id="main-track">
        <rect x="20" y="75" width="95" height="450" fill="#333333" stroke="black" stroke-width="10"/>
    </symbol>

    <symbol id="track1">
        <use href="#main-track"/>
        <use href="#link30"/>
        <use href="#link0" y="60"/>
        <use href="#link0" y="140"/>
        <use href="#link0" y="220"/>
        <use href="#link0" y="300"/>
        <use href="#link0" y="380"/>
        <use href="#link30" y="448"/>
    </symbol>

    <symbol id="track2">
        <use href="#main-track"/>
        <use href="#link60"/>
        <use href="#link0" y="33"/>
        <use href="#link0" y="113"/>
        <use href="#link0" y="193"/>
        <use href="#link0" y="273"/>
        <use href="#link0" y="353"/>
        <use href="#link0" y="433"/>
    </symbol>

    <symbol id="track3">
        <use href="#main-track"/>
        <use href="#link0" y="7"/>
        <use href="#link0" y="87"/>
        <use href="#link0" y="167"/>
        <use href="#link0" y="247"/>
        <use href="#link0" y="327"/>
        <use href="#link0" y="407"/>
        <use href="#link60" y="470"/>
    </symbol>

    <symbol id="body">
        <use href="#track1" x="150" y="100" class="left-belt track1"/>
        <use href="#track2" x="150" y="100" class="left-belt track2"/>
        <use href="#track3" x="150" y="100" class="left-belt track3"/>
        <use href="#track1" x="515" y="100" class="right-belt track1"/>
        <use href="#track2" x="515" y="100" class="right-belt track2"/>
        <use href="#track3" x="515" y="100" class="right-belt track3"/>

        <rect class="tank-body-fill" x="240" y="190" width="320" height="420" stroke="black" stroke-width="20"
              rx="10" ry="10"/>
        <rect x="250" y="520" width="300" height="80" opacity="0.5"/>
    </symbol>

    <symbol id="turret">
        <rect class="tank-turret-fill" x="300" y="320" width="200" height="200" stroke="black" stroke-width="20"
              rx="10" ry="10"/>
        <rect x="310" y="460" width="180" height="50" fill="black" opacity="0.5"/>

        <rect x="360" y="240" width="80" height="80" fill="url(#cannon-grad)" stroke="black" stroke-width="20"/>
        <rect x="375" y="70" width="50" height="170" fill="url(#cannon-grad)" stroke="black" stroke-width="20"/>
    </symbol>

    <symbol id="radar">
        <circle class="tank-radar-fill" cx="400" cy="400" r="30" stroke="black" stroke-width="20"/>
        <path class="tank-radar-fill" d="M 290 420 q 110 100 220 0 z" stroke="black" stroke-width="20"/>
    </symbol>

    <symbol id="tank">
        <use class="tank-body" href="#body"/>
        <use class="tank-turret" href="#turret"/>
        <use class="tank-radar" href="#radar"/>
    </symbol>
</defs>
```

---

## Example

**Input:** A markdown file containing:

```markdown
<!-- TODO: Illustration
**Filename:** circular-targeting-geometry.svg
**Caption:** "Circular targeting predicts where the enemy will be based on its turn rate"
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (600, 4500), body: 20, turret: 60, radar: 90
  - type: enemy, position: (6100, 1100), body: -3, turret: 260, radar: 260
**Lines:**
  - from: (1000, 4900), to: (5700, 1300), color: #cc0, arrow: true, dashed: true
**Arcs:**
  - center: (6900, 1900), radius: 1000, startAngle: 135, endAngle: 225, color: chocolate, arrow: true, dashed: true
**Circles:**
  - center: (5800, 1200), radius: 100, color: red, fill: none
**Texts:**
  - text: "predicted position", position: (4200, 1000), color: chocolate
  - text: "bullet path", position: (2500, 3500), color: #cc0, rotate: -40
  - text: "enemy arc", position: (5800, 3000), color: chocolate
-->
```

**Output:**

1. Creates `book/images/circular-targeting-geometry.svg` with:
    - Viewport 8000×6000, display size 1000×750
    - Grey/black battlefield background
    - Friendly bot at (600, 4500) with rotations 20°/60°/90°
    - Enemy bot at (6100, 1100) with red colors and rotations -3°/260°/260°
    - Yellow dashed line with arrow from (1000, 4900) to (5700, 1300)
    - Chocolate dashed arc with arrow
    - Red circle at predicted position
    - Text labels

2. Inserts below the TODO marker:

```markdown
<img src="/images/circular-targeting-geometry.svg" alt="Circular targeting predicts where the enemy will be based on its turn rate" width="1000">
<br>
*Circular targeting predicts where the enemy will be based on its turn rate*
```

---

## Reference Documents

- `specs/page-generation-spec.md` — Illustration placeholder format and color palette
- `book/images/tank.svg` — Tank symbol definitions (source of truth for bot rendering)
- `AI_GUIDELINES.md` — General writing and content rules


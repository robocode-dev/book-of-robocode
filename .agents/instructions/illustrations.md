# Illustrations

How to mark, draw, and embed diagrams. Follow the `create-illustration` skill for the procedure.

## When a page needs one

Add at least one illustration marker for geometry (angles, trajectories, predictions), movement patterns, coordinate
and angle conventions, before/after comparisons, and algorithm walkthroughs. Put the marker where the picture helps.

## The marker

The marker is a regeneration contract, so keep it in the page after drawing and update it to match the final SVG.

```markdown
<!-- TODO: Illustration
**Filename:** circular-targeting-geometry.svg
**Caption:** "Circular targeting predicts where the enemy will be based on its turn rate."
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1000, 4500), body: 20, turret: 60, radar: 90
  - type: enemy, position: (6500, 1500), body: 357, turret: 260, radar: 260
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

| Field         | Req. | Meaning                                                                           |
|---------------|------|-----------------------------------------------------------------------------------|
| `Filename`    | yes  | Kebab-case `.svg` name, saved to `book/images/`                                   |
| `Caption`     | yes  | One sentence shown under the image and used verbatim as alt text                  |
| `Viewport`    | yes  | `WxH`, at most 8000×8000                                                          |
| `Battlefield` | no   | `true` draws the grey border and dark arena. Default `false`                      |
| `Bots`        | no   | `type`, `position`, `body`/`turret`/`radar` degrees, optional `scale`             |
| `Lines`       | no   | `from`, `to`, optional `via`, `color`, `arrow`, `dashed`, `label`                 |
| `Arcs`        | no   | `center`, `radius`, `startAngle`, `endAngle`, `color`, `arrow`, `dashed`, `label` |
| `Circles`     | no   | `center`, `radius`, `color`, `fill` (color or `none`), `dashed`, `label`          |
| `Bullets`     | no   | `position`, `radius` (50–100), `color`                                            |
| `Texts`       | no   | `text`, `position`, `color`, optional `rotate`                                    |
| `Description` | no   | Free text for anything the structured fields cannot express                       |

**Coordinates and angles:**
- Coordinates are SVG viewport units with y pointing down.
- Bot `position` is the tank's top-left translate. Its center is `position + 400 × scale` (default scale 0.75).
- Any line, arrow, or circle that should meet a bot (an arrowhead, a highlight ring, a "skip" mark) must target
  that center, not the raw `position`. Compute it, do not eyeball it against the tank artwork: rotation spins the
  bot around its center, so the formula holds no matter what `body`/`turret`/`radar` angle it uses.
- An arrow's `marker-end` triangle extends past the line's literal end coordinate in the direction of travel, and
  bots are drawn after lines, so a line aimed exactly at a bot's center buries the arrowhead behind the tank
  artwork. Stop the line 300-450 units short of the center (scale the distance with the bot's own `scale`) so the
  full arrowhead renders in the open, then confirm it in the render, not from the coordinates alone.
- Bot angles follow the tank symbol: 0° points up, clockwise.
- Arc angles are SVG angles: 0° points right, clockwise.

## Embedding

Right after the marker:

```html
<img src="/images/<Filename>"
alt="<Caption>"
style="max-width:100%;height:auto;"/><br>
*<Caption>*
```

## Drawing rules

- `viewBox="0 0 W H"`, with `width`/`height` set to W/8 and H/8. Include `role="img"`, `<title>`, and a `<desc>`
  that describes the scene for screen readers.
- **Copy the tank `<defs>` block from `book/images/tank.svg` into every SVG** and use `<use href="#tank">`. A
  reference to another file (`tank.svg#tank`) does not render inside `<img>`, so the bots silently disappear.
- Set bot colors and rotations with the CSS variables, for example `--body-rotation`. Enemy bots set
  `--tank-body-color:#c00; --tank-turret-color:#e22; --tank-radar-color:#faa`.
- Draw waves and paths that should pass behind a bot before the bots block, so the bot stays visible where its
  line starts. Draw a ring, slash, or other annotation that highlights one specific bot after that bot's `<use>`
  element instead, or the bot paints over the annotation and hides it.
- Compute geometry with a small script rather than guessing: arc endpoints, bearings, wave radii, and turn-limited
  paths (turn rate $10 - 0.75|v|$ degrees per turn). The diagram must not contradict the page's physics.
- Keep labels short (150px sans-serif, 120px for secondary notes). Do not let a label overlap a line, arc, or bot.
  Clip waves to the arena with a `clipPath`.
- Encode meaning with more than color: solid vs dashed, filled vs hollow, arrows, and text.

## Style and palette

Match the existing images in `book/images/`, for example `wave-guessfactor-concept.svg` and `virtual-guns-concept.svg`.

| Element                        | Color                      |
|--------------------------------|----------------------------|
| Friendly bot body/turret/radar | `#019` / `#06c` / `#aaf`   |
| Enemy bot body/turret/radar    | `#c00` / `#e22` / `#faa`   |
| Default labels and axes        | chocolate `#D2691E`        |
| Bullets and bullet waves       | orange `#F59E0B`           |
| Neutral paths, virtual data    | gray `#6B7280` / `#9CA3AF` |
| Safe, reachable, selected      | green `#10B981`            |
| Danger, impossible, excluded   | red `#EF4444`              |
| Friendly-side labels           | light blue `#60A5FA`       |
| Highlight                      | yellow `#cc0`              |
| Battlefield border / arena     | `grey` / `#111`            |
| Chart background / panels      | `#1a1a2e` / `#2d3748`      |

Never use a pure white background. Every image must read well on both the light and the dark VitePress theme.

Mermaid charts follow the same rule. Use a transparent background and chocolate text:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'xyChart': { 'backgroundColor': 'transparent', 'plotColorPalette': '#3b82f6', 'xAxisLabelColor': '#d2691e', 'yAxisLabelColor': '#d2691e', 'xAxisTitleColor': '#d2691e', 'yAxisTitleColor': '#d2691e', 'xAxisTickColor': '#d2691e', 'yAxisTickColor': '#d2691e', 'xAxisLineColor': '#d2691e', 'yAxisLineColor': '#d2691e', 'titleColor': '#d2691e' } }}}%%
```

## Checking the result

1. The SVG is well-formed XML, and the `<img>` path matches the file.
2. Render it through an `<img>` tag on a white page and a dark page, then look at the result. On Windows, headless
   Edge works:
   `msedge --headless --user-data-dir=<tmp> --allow-file-access-from-files --screenshot=<out.png> file:///<page.html>`.
3. Fix missing bots, overlapping labels, and clipped text, then render again.
4. Confirm every line, arrow, and circle that targets a bot actually touches its silhouette in the render, and
   that any on-bot annotation (a ring, a slash) is layered after that bot rather than hidden underneath it.
5. Update the marker (positions, angles, description) so it matches what was drawn.

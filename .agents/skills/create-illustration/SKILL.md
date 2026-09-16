---
name: create-illustration
description: Generate accessible, theme-safe SVG illustrations from Book of Robocode illustration TODO markers.
---

# Create Illustration

Create or regenerate native SVG illustrations for the structured `<!-- TODO: Illustration ... -->` marker in a Book of
Robocode page. Use this skill for vector teaching diagrams, not for photographic or painterly artwork.

## Read the marker first

Parse the marker before drawing. Require `Filename`, `Caption`, and `Viewport`; use `Battlefield: false` unless the
marker calls for a battlefield. Treat `Bots`, `Lines`, `Arcs`, `Circles`, `Bullets`, `Texts`, and `Description` as the
visual contract. If a required field is missing or contradictory, report it rather than inventing a different diagram.

Read `AGENTS.md` and `specs/page-generation-spec.md`. Reuse the tank symbol definitions from `book/images/tank.svg`
when drawing bots. Preserve the TODO marker so the illustration can be regenerated later.

## Draw and embed

Write the asset to `book/images/<Filename>`. Set `viewBox` to the requested viewport and display dimensions to one
eighth of it. Include an accessible `<title>` and `<desc>`, readable labels, and distinct color and stroke treatments
so the meaning is not encoded by color alone.

Use the book palette: friendly blue, enemy red, chocolate labels, orange bullets, green safe paths, and red danger.
For light and dark theme compatibility, avoid pure-white and pure-black backgrounds. Use a neutral or semi-transparent
background, with sufficient contrast for text and paths. Draw paths before bots so a bot remains visible at a line's
origin.

Immediately after the marker, retain or update this Markdown pattern:

```html
<img src="/images/<Filename>" alt="<Caption>" style="max-width:100%;height:auto;"><br>
*<Caption>*
```

Use the caption verbatim for alt text and the visible caption unless a shorter equivalent improves accessibility without
losing meaning.

## Validate

Confirm the SVG is well-formed XML, the referenced asset exists, the image tag resolves to the same filename, and the
page builds with VitePress. Inspect a rendered result when a browser or SVG renderer is available.

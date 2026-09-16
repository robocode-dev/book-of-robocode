---
name: create-illustration
description: Generate accessible, theme-safe SVG illustrations from Book of Robocode illustration TODO markers.
---

# Create Illustration

Turn each `<!-- TODO: Illustration ... -->` marker on a page into an SVG teaching diagram. Do not use this skill for
photographic or painterly artwork.

## 1. Prepare

Read `AGENTS.md` and `.agents/instructions/illustrations.md`, the page itself, and one or two similar images in
`book/images/` for style.

## 2. Read the marker

- Parse the marker. `Filename`, `Caption`, and `Viewport` are required.
- Treat the other fields as the visual contract.
- If a field is missing, or it contradicts the page text or the physics, report it instead of guessing.

## 3. Draw

- Write `book/images/<Filename>` following the drawing rules and palette.
- Copy the tank `<defs>` block into the SVG.
- Compute coordinates with a small script when the diagram involves arcs, bearings, or simulated paths.
- Make the picture teach the page's point, not just decorate it.

## 4. Embed

Keep the marker, and add or update the `<img>` block right after it. Use the caption verbatim as the alt text and as
the visible caption.

## 5. Check

- Confirm the SVG is well-formed and the image path resolves.
- Render it on a light page and a dark page, then look at the result.
- Fix missing bots, overlaps, and clipping.
- Update the marker to match the final drawing.
- Run `npm run build` if the page changed.

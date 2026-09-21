---
title: "Corner Movement"
category: "Movement & Evasion"
summary: >-
  Corner Movement trades the battlefield's open middle for a corner, where two walls block most of the directions an
  enemy could ever fire from, at the cost of becoming a specialist that struggles outside melee.
tags:
  - corner-movement
  - movement
  - strategic-movement
  - melee
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Corner Movement (classic Robocode) https://robowiki.net/wiki/Corner_Movement"
  - "RoboWiki - Anti-Gravity Movement (classic Robocode) https://robowiki.net/wiki/Anti-Gravity_Movement"
  - "RoboWiki - Minimum Risk Movement (classic Robocode) https://robowiki.net/wiki/Minimum_Risk_Movement"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Corner Movement

> [!TIP] Origins
> **Corner Movement** was documented by **Kyle Huntington (Kawigi)** after watching SandboxLump's plain
> corner-seeking beat far more sophisticated opponents. He built **Lib**, the most complex Corner Movement ever
> packed into a NanoBot. The Sample Bot **Corners** ships a primitive version, and the RoboWiki community refined
> the idea further.

A crowded middle of the battlefield means more bots close enough to hit, and more bullets crossing paths with a
bot that has nowhere to hide from any of them. RoboWiki's observation: fewer bots survive near the walls, because
fewer bots bother to fight there. **Corner Movement** just drives to the nearest corner and stays.

## Two walls cut the exposure to a quarter

A bot in open battlefield can take fire from a full circle around it. Tuck the same bot into a corner and two walls
now block most of that circle, leaving only the roughly quarter-turn wedge of open battlefield between them for an
enemy to approach or shoot from. Fewer approach angles mean fewer bots can line up a shot at once, which is the
whole advantage RoboWiki credits to the technique.

<!-- TODO: Illustration
**Filename:** corner-movement-exposure.svg
**Caption:** "Two walls block most of the directions an enemy could fire from, shrinking a full circle of exposure
to one open wedge."
**Viewport:** 8000x4200
**Battlefield:** false
**Description:** Two side-by-side dark panel cards, no battlefield rectangle drawn, each titled and each showing one
bot and a shaded exposure region around it. Left panel, titled "open field": a bot near the panel's center with a
full translucent red circle around it, representing exposure from every direction. Right panel, titled "corner": a
solid gray vertical wall bar runs down the panel's left edge and a solid gray horizontal wall bar runs along its
bottom edge, meeting at the bottom-left corner. The bot sits just inside that corner, and only a translucent red
quarter-circle wedge spanning the open upper-right direction (away from both walls) is shaded, showing the much
smaller share of directions still open to an enemy.
**Bots:**
  - type: friendly, position: (1725, 1725), body: 45, turret: 45, radar: 45
  - type: friendly, position: (4250, 3200), body: 45, turret: 45, radar: 45
**Circles:**
  - center: (2025, 2025), radius: 1500, color: "#EF4444", fill: "#EF4444"
**Arcs:**
  - center: (4550, 3500), radius: 1500, startAngle: 270, endAngle: 360, color: "#EF4444", fill: "#EF4444"
**Texts:**
  - text: "open field", position: (2025, 450), color: chocolate
  - text: "corner", position: (6025, 450), color: chocolate
  - text: "exposed from every side", position: (2025, 3750), color: chocolate
  - text: "exposed from one wedge", position: (6025, 3750), color: chocolate
**Description (walls):** Two solid gray bars represent the walls: a vertical bar along the right panel's left edge
and a horizontal bar along its bottom edge, drawn independently of the structured fields above.
-->

<img src="/images/corner-movement-exposure.svg"
alt="Two walls block most of the directions an enemy could fire from, shrinking a full circle of exposure to one
open wedge."
style="max-width:100%;height:auto;"/><br>
*Two walls block most of the directions an enemy could fire from, shrinking a full circle of exposure to one open
wedge.*

## A destination, not a new engine

Corner Movement is less a targeting-proof algorithm and more a place to stand, so bots reach it through the
movement systems already covered. [Anti-Gravity Movement](anti-gravity-movement.md) can pull a bot toward a chosen
corner by giving that corner a negative, attractive strength in the same force sum used for enemies and walls.
[Minimum Risk Movement](minimum-risk-movement.md) can fold corner distance into its risk score, or bias its
point generator to propose corner-adjacent candidates alongside the usual ones. The Sample Bot Corners skips both
and drives straight there.

```txt
nearestCorner = corner of the four battlefield corners closest to currentPosition
driveTo(nearestCorner, safetyMargin)
while alive:
    patrol a short pattern inside the corner (oscillate, small orbit, or stay put)
    if a wall or enemy forces a move, re-evaluate the nearest safe corner
```

A more developed corner mover can layer scoring on top of that skeleton, weighing which corner is genuinely least
crowded rather than assuming the nearest one always is.

## Name the cost

The technique "tends to work better against the best melee bots than against mediocre ones," per RoboWiki, which
makes a dedicated corner mover a specialist rather than a generalist. It has nothing to offer in one-on-one, where
there is no crowd to avoid in the first place. A bot parked in a known spot is also easier to target once an
opponent learns to check that spot first, and if every bot in the match reaches for corners, the least crowded one
stops being guaranteed.

## Platform notes

Battlefield corners come from the same width and height query on both platforms, and the technique adds no
platform-specific rule of its own. Convert the corner's bearing into the platform's angle convention before
steering toward it, since classic Robocode headings are compass-style while Tank Royale headings are mathematical.

## Further Reading

- [Corner Movement](https://robowiki.net/wiki/Corner_Movement) - RoboWiki (classic Robocode)
- [Anti-Gravity Movement](https://robowiki.net/wiki/Anti-Gravity_Movement) - RoboWiki (classic Robocode)
- [Minimum Risk Movement](https://robowiki.net/wiki/Minimum_Risk_Movement) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation

---
title: "Movement Analysis"
category: "Movement & Evasion"
summary: >-
  RoboWiki's catalog of common movement flaws doubles as a checklist for judging any bot's movement, including a
  bot's own, before a gun ever fires a shot.
tags:
  - movement-analysis
  - movement
  - offensive-movement
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Movement Weaknesses (classic Robocode) https://robowiki.net/wiki/Movement_Weaknesses"
  - "RoboWiki - Ramming Movement (classic Robocode) https://robowiki.net/wiki/Ramming_Movement"
---

# Movement Analysis

> [!TIP] Origins
> **Movement Analysis** draws on RoboWiki's **Movement Weaknesses** page, developed and documented by the RoboWiki
> community as a catalog of the habits that let a gun read a bot's movement instead of just reacting to it.

A bot's movement can look busy and still be predictable in a way that a gun can exploit. RoboWiki's Movement
Weaknesses page catalogs the habits that give a bot away. Read it in reverse and it becomes a checklist for judging
any bot's movement, including a bot's own, before that bot ever meets an opponent.

## Six habits that give a bot away

A bot that switches direction on a fixed timer rather than watching the enemy's
[energy drop](../../energy-and-scoring/energy-as-a-resource.md) dodges one bullet power well and every other power
badly. One that ignores how far a bullet has to travel gets caught by precise or
[circular](../../targeting/simple-targeting/circular-targeting.md) prediction. One that repeats the same shape,
the extreme case covered on the
[Pattern & Enemy Dodging Movement](pattern-enemy-dodging-movement.md) page, hands a pattern matcher exactly what
it needs.

Three more habits are about how much the bot actually moves. Fewer than 30 units of travel between shots leaves a
bot close enough to a stationary target that [Head-On Targeting](../../targeting/simple-targeting/head-on-targeting.md)
at a 45-degree angle can land hits, which is exactly why [Distancing](../basic/distancing.md) matters. Moving
mostly in one direction gives an opponent's gun roughly 50% more chances to hit, per RoboWiki, since it only has
to solve for one side. Orbiting an enemy without ever closing in or backing off invites a corner or a wall, and
also invites [Ramming & Mirror Movement](ramming-mirror-movement.md) from an opponent that notices the orbit never
breaks.

<!-- TODO: Illustration
**Filename:** movement-analysis-weak-strong.svg
**Caption:** "Weak movement repeats one short hop. Strong movement varies both the distance traveled and the
direction it travels in."
**Viewport:** 8000x4200
**Battlefield:** false
**Description:** Two side-by-side dark panel cards, no battlefield rectangle drawn. Left panel, titled "weak
movement", shows a short solid red path segment with a bot at its center, and a fainter dashed gray copy of the
same segment just below it, showing the same short hop taken over and over. Right panel, titled "strong
movement", shows an irregular zigzag path of four segments with different lengths and angles, ending at a bot,
showing distance and direction both changing leg to leg.
**Texts:**
  - text: "weak movement", position: (2025, 450), color: chocolate
  - text: "strong movement", position: (6025, 450), color: chocolate
  - text: "same short hop, every time", position: (2025, 3750), color: chocolate
  - text: "distance and direction both vary", position: (6025, 3750), color: chocolate
-->

<img src="/images/movement-analysis-weak-strong.svg"
alt="Weak movement repeats one short hop. Strong movement varies both the distance traveled and the direction it
travels in."
style="max-width:100%;height:auto;"/><br>
*Weak movement repeats one short hop. Strong movement varies both the distance traveled and the direction it
travels in.*

## Reading the list from the other side

The same six items work as a live cue, not only a design flaw. RoboWiki points to rambots like SledgeHammer and
Tide, which lean on exactly this: an opponent running low energy and short hops draws ramming attacks that land
above 90% of the time while collecting the ramming bonus on top. A bot that notices a short-hop, low-energy
opponent has a real reason to close in rather than keep firing from range.

## Name the cost

The checklist gives a snapshot, not a running score. A bot can clear one item on the list, say movement distance,
while still failing another, say fixed timing. A real
[segmentation or statistical](../../targeting/statistical-targeting/segmentation-visit-count-stats.md) gun still
earns its keep by adapting shot to shot, something a static checklist cannot do. The checklist behaves the same on
both platforms, since it describes behavior rather than any platform-specific API.

## Further Reading

- [Movement Weaknesses](https://robowiki.net/wiki/Movement_Weaknesses) - RoboWiki (classic Robocode)
- [Ramming Movement](https://robowiki.net/wiki/Ramming_Movement) - RoboWiki (classic Robocode)

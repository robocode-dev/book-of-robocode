---
title: "Melee-Specific Targeting"
category: "Melee Combat"
summary: >-
  Most targeting systems assume the enemy is reacting to this bot's bullets. In melee that assumption breaks,
  and a gun built for one has to learn to aim at whichever of several enemies it can actually hit.
tags:
  - melee-specific-targeting
  - melee-combat
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Melee Strategy (classic Robocode) https://robowiki.net/wiki/Melee_Strategy"
  - "RoboWiki - Shadow/Melee Gun (classic Robocode) https://robowiki.net/wiki/Shadow/Melee_Gun"
  - "RoboWiki - Segmentation (classic Robocode) https://robowiki.net/wiki/Segmentation"
---

# Melee-Specific Targeting

> [!TIP] Origins
> **Melee-specific targeting** was pioneered by **ABC**, whose bot **Shadow** set the standard for evaluating
> every enemy on the field at once instead of locking onto a single target, and was further documented by the
> RoboWiki community.

[GuessFactor Targeting](/targeting/statistical-targeting/guessfactor-targeting) works because an enemy dodging
this bot's bullets tends to move a certain way relative to this bot. In melee, an enemy is rarely dodging any one
bot in particular, it is just trying to survive everyone at once, so that relationship weakens. A gun built
around one assumption from [Simple Targeting](/targeting/simple-targeting) and the statistical pages needs new
judgment calls before it works in a crowd.

## Why GuessFactor loses its edge

[GuessFactor](/appendices/glossary#guessfactor) Targeting leans on the enemy moving roughly perpendicular to the
bot doing the shooting, since that
is what produces a clean escape-angle distribution to learn from. In melee, most bots spend their movement
budget reacting to several threats at once, not specifically dodging this bot, so the perpendicular pattern a
guess-factor gun depends on shows up far less often. The technique still works, it is just a smaller edge than it
is in a duel, and a bot that leans on it exclusively is leaving a duel-only advantage on the table.

## Distance decides the algorithm

Close enemies favor [Linear Targeting](/targeting/simple-targeting/linear-targeting), since a bullet that only
has to travel a short distance does not need much lead to land. Far enemies favor
[Head-On Targeting](/targeting/simple-targeting/head-on-targeting), a simpler baseline that holds up once
distance shrinks the payoff of tracking angular movement precisely. A gun that blends the two by distance,
weighting linear more heavily up close and head-on more at range, often called percent-of-linear, beats
committing to either one alone.

## Scans arrive late and uneven

A [Melee Radar](/radar/melee-radar/spinning-and-corner-arc) sweeps past every enemy in turn instead of locking
one, so the gun sees each enemy roughly every 8 ticks on average instead of every tick. That gap breaks
[Pattern Matching](/targeting/predictive-targeting/pattern-matching), which expects a steady log of positions,
unless it is rewritten to tolerate uneven gaps. Statistical guns cope by interpolating a missed scan linearly
between the two real ones instead of discarding the gap, and by reading the sign of an enemy's velocity: if it
flips from the previous scan, that enemy is probably accelerating, a cheap signal even from sparse data.

## One gun, every enemy

Shadow's melee gun changed the question from "where will this enemy be" to "which enemy can this bot actually
hit." It computes a firing solution for every enemy still alive, not just the closest one, weighs each solution
by hit probability, roughly the inverse of the distance to that enemy, and fires at whichever solution scores
highest. The reported payoff was about a 10% hit rate increase over locking onto one target and hoping.

That framing opens two judgment calls a single-target gun never has to make. Preying on the weak, favoring a
low-energy enemy's solution over a healthier one even at slightly lower hit probability, claims kills instead of
just damage. Checking a miss's flight path catches a shot that would fly past its target and waste itself on a
wall instead of a second enemy standing behind it.

<!-- TODO: Illustration
**Filename:** melee-multi-target-solutions.svg
**Caption:** "A melee gun scores a firing solution for every enemy present and fires at the strongest one."
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1200, 4200), body: 30, turret: 30, radar: 30
  - type: enemy, position: (4600, 3600), body: 200, turret: 200, radar: 200, scale: 0.6
  - type: enemy, position: (5600, 1200), body: 240, turret: 240, radar: 240, scale: 0.6
  - type: enemy, position: (2400, 900), body: 120, turret: 120, radar: 120, scale: 0.6
**Lines:**
  - from: (1814, 4438), to: (4399, 3927), color: "#10B981", arrow: true, dashed: false,
    label: "highest-probability solution"
  - from: (1762, 4316), to: (5472, 1699), color: "#6B7280", arrow: false, dashed: true
  - from: (1603, 4197), to: (2495, 1566), color: "#6B7280", arrow: false, dashed: true
**Texts:**
  - text: "highest-probability solution", position: (2600, 4300), color: "#10B981"
  - text: "weaker solutions, not fired", position: (4600, 2100), color: "#9CA3AF"
-->

<img src="/images/melee-multi-target-solutions.svg"
alt="A melee gun scores a firing solution for every enemy present and fires at the strongest one."
style="max-width:100%;height:auto;"/><br>
*A melee gun scores a firing solution for every enemy present and fires at the strongest one.*

## Further Reading

- [Melee Strategy](https://robowiki.net/wiki/Melee_Strategy) - RoboWiki (classic Robocode)
- [Shadow/Melee Gun](https://robowiki.net/wiki/Shadow/Melee_Gun) - RoboWiki (classic Robocode)
- [Segmentation](https://robowiki.net/wiki/Segmentation) - RoboWiki (classic Robocode)

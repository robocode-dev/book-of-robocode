---
title: "Melee Movement Tactics"
category: "Melee Combat"
summary: >-
  1v1 movement has one job, dodge the gun aimed at this bot. Melee movement has two jobs running at once, stand
  where fewer guns can reach in the first place, and still dodge the ones that do.
tags:
  - melee-movement-tactics
  - melee-combat
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Melee Strategy (classic Robocode) https://robowiki.net/wiki/Melee_Strategy"
  - "RoboWiki - Movement (classic Robocode) https://robowiki.net/wiki/Movement"
---

# Melee Movement Tactics

> [!TIP] Origins
> **Melee movement tactics** were developed and documented by the RoboWiki community, drawing on Anti-Gravity
> Movement, Minimum Risk Movement, and Corner Movement, each pioneered for its own use and adapted to melee's
> crowd of simultaneous threats.

A 1v1 bot's movement has one job: dodge the gun currently aimed at it. A melee bot's movement runs two jobs at
once, being in the right place so fewer guns can reach it, and moving in the right direction to dodge the ones
that do anyway. [Melee Strategy](/melee-combat/melee-strategy) already covers how the right answer shifts as
bots die. This page covers the movement tools for each of those two jobs.

## Tools for standing somewhere safer

[Anti-Gravity Movement](/movement/strategic-movement/anti-gravity-movement) already covers why it excels here:
summed repulsion from every enemy and wall naturally spaces a bot away from clusters, recalculated every turn
instead of every few. Its weakness shows up exactly where melee lives, weighting many simultaneous force sources
well is the hard part, and a scheme tuned for five enemies can wobble once only two remain.
[Minimum Risk Movement](/movement/strategic-movement/minimum-risk-movement) sidesteps that by scoring real
candidate destinations instead of summing forces, which is why it tends to resist the local minima that trip up a
pure force sum when the field size keeps changing.
[Corner Movement](/movement/strategic-movement/corner-movement) is the extreme version of the same goal, trading
the open field for two walls' worth of blocked angles, at the cost of becoming a specialist that only pays off
against a field it can dominate.

<!-- TODO: Illustration
**Filename:** melee-open-center-exposure.svg
**Caption:** "A bot in the open center faces fire from every enemy on the field at once."
**Viewport:** 8000x8000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (3600, 3600), body: 45, turret: 45, radar: 45
  - type: enemy, position: (900, 900), body: 135, turret: 135, radar: 135, scale: 0.6
  - type: enemy, position: (6500, 900), body: 225, turret: 225, radar: 225, scale: 0.6
  - type: enemy, position: (6500, 6500), body: 315, turret: 315, radar: 315, scale: 0.6
  - type: enemy, position: (900, 6500), body: 45, turret: 45, radar: 45, scale: 0.6
**Lines:**
  - from: (1423, 1423), to: (3653, 3653), color: "#EF4444", arrow: true, dashed: true
  - from: (6453, 1419), to: (4151, 3656), color: "#EF4444", arrow: true, dashed: true
  - from: (6457, 6457), to: (4147, 4147), color: "#EF4444", arrow: true, dashed: true
  - from: (1419, 6453), to: (3656, 4151), color: "#EF4444", arrow: true, dashed: true
**Texts:**
  - text: "the center takes fire from every direction", position: (4000, 5300), color: "#EF4444", anchor: middle
-->

<img src="/images/melee-open-center-exposure.svg"
alt="A bot in the open center faces fire from every enemy on the field at once."
style="max-width:100%;height:auto;"/><br>
*A bot in the open center faces fire from every enemy on the field at once.*

## The safe spot moves as the field shrinks

None of the three tools above point to a fixed spot on the map. Early on, with the field crowded and force
sources everywhere, the open middle is the worst place a bot can stand, since it is the one position every enemy
can reach at once. As bots die and the count drops toward the handful of survivors
[Melee Strategy](/melee-combat/melee-strategy#four-battles-in-one) treats as its own phase, fewer simultaneous
threats mean less reason to sacrifice mobility for a corner's blocked angles, and a bot still anchored to a
corner it no longer needs is trading speed for safety it does not need anymore.

## Tools for dodging what reaches you anyway

Positioning thins the field of guns that can reach a bot, it never reaches zero. The
[closest-bot heuristic](/melee-combat/melee-strategy#guess-who-is-aiming-back) already covers estimating which
enemy is actually aiming, and moving perpendicular to that one enemy specifically beats splitting attention
evenly across every bot on the field. [Pattern & Enemy Dodging Movement](
/movement/offensive-movement/pattern-enemy-dodging-movement) offers a cheaper alternative that needs no
per-enemy math at all: dancing in a geometric shape blunts Linear and Circular guns without tracking who is
shooting. [Wave Surfing](/movement/advanced-evasion/wave-surfing-introduction) stays mostly out of this toolkit,
since it depends on tracking one gun's waves closely, exactly the assumption melee removes until the final duel
turns the fight back into a 1v1.

## Housekeeping only a crowd punishes

A collision that costs a little energy in 1v1 costs it at the worst possible moment in melee, when several other
bots are already shooting. Staying still, or settling into any movement a gun can predict, gets punished faster
with more eyes potentially watching than with one. Constant, irregular movement is not a specific technique here,
it is the tax every technique above has to keep paying.

## Further Reading

- [Melee Strategy](https://robowiki.net/wiki/Melee_Strategy) - RoboWiki (classic Robocode)
- [Movement](https://robowiki.net/wiki/Movement) - RoboWiki (classic Robocode)

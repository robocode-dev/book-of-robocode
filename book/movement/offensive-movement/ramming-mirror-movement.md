---
title: "Ramming & Mirror Movement"
category: "Movement & Evasion"
summary: >-
  Ramming Movement turns a deliberate collision into a scoring shortcut, and Mirror Movement drives by copying the
  enemy's own path instead of reacting to it.
tags:
  - ramming-mirror-movement
  - movement
  - offensive-movement
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Ramming Movement (classic Robocode) https://robowiki.net/wiki/Ramming_Movement"
  - "RoboWiki - Mirror Movement (classic Robocode) https://robowiki.net/wiki/Mirror_Movement"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
  - "Robocode Tank Royale Docs - Scoring https://robocode.dev/articles/scoring.html"
---

# Ramming & Mirror Movement

> [!TIP] Origins
> Neither **Ramming Movement** nor **Mirror Movement** credits a single inventor. Both were documented and refined
> by the RoboWiki community as bot authors experimented with driving straight at the enemy and with copying its
> path instead of reacting to it.

Every technique so far in this book tries to keep the bot away from the enemy. These two point it the other way.
Ramming drives straight into a collision on purpose, and Mirror Movement drives wherever the enemy just drove,
trusting that the enemy's own path is a reasonable place to be.

## A collision pays twice

When two bots collide, both take a fixed 0.6 damage, on classic Robocode and Tank Royale alike. Ramming turns that
fixed cost into a scoring shortcut: a bot earns 2 points for every point of damage it causes by ramming, and if the
ram itself finishes the enemy off, it collects a bonus of 30% of all the damage it dealt that opponent. Both numbers
hold on both platforms.

<!-- TODO: Illustration
**Filename:** ramming-collision-path.svg
**Caption:** "A rambot drives straight at the enemy. The collision costs both bots a fixed 0.6 damage, but the
rammer scores twice for it."
**Viewport:** 6000x3200
**Battlefield:** true
**Bots:**
  - type: friendly, position: (900, 1400), body: 90, turret: 90, radar: 90
  - type: enemy, position: (4300, 1400), body: 270, turret: 270, radar: 270
**Lines:**
  - from: (1550, 1700), to: (4060, 1700), color: "#60A5FA", arrow: true, dashed: false, label: "ramming path"
**Circles:**
  - center: (4300, 1700), radius: 200, color: "#EF4444", fill: none, dashed: true
**Texts:**
  - text: "ramming path", position: (2900, 1550), color: "#60A5FA", anchor: middle
  - text: "0.6 damage to both", position: (4300, 1420), color: "#EF4444", anchor: middle
-->

<img src="/images/ramming-collision-path.svg"
alt="A rambot drives straight at the enemy. The collision costs both bots a fixed 0.6 damage, but the rammer scores
twice for it."
style="max-width:100%;height:auto;"/><br>
*A rambot drives straight at the enemy. The collision costs both bots a fixed 0.6 damage, but the rammer scores
twice for it.*

RoboWiki calls a bot built around this a rambot or rammer, and names GrubbmThree, LunarTwins, and NightmareTeam as
strong examples in the [1v1](/appendices/glossary#_1v1-one-on-one-duel), Twin Duel, and team formats. Nearly all of
them still carry a simple gun, usually
[Head-On](../../targeting/simple-targeting/head-on-targeting.md), Linear, or Circular Targeting, because closing
the distance with no gun running is dangerous on its own.
A rammer used as a finishing move waits until the last bullet fired at it has passed before it commits to the
charge, and gives up and fires again if the ram has not landed within 300 ticks, so it does not lose the ordinary
damage bonus while chasing the ramming one.

## Mirror Movement copies instead of reacting

Where a rammer commits to one line, a mirror bot commits to whatever the enemy is already doing. RoboWiki describes
three ways to copy it. **Coordinate Mirror Movement** reflects the enemy's current position across a vertical line,
a horizontal line, or the battlefield center, then drives to that reflected point with a
[GoTo](../basic/movement-fundamentals-goto.md). **Relative Mirror Movement** copies the enemy's direction and
velocity outright from the bot's own position, though it needs solid
[wall smoothing](../basic/wall-avoidance-wall-smoothing.md) to keep from copying the enemy straight into a wall.
**Perpendicular Mirror Movement** turns perpendicular to the enemy and matches its speed, orbiting it using the
same bearing and velocity math the earlier movement chapters use to close or hold distance.

<!-- TODO: Illustration
**Filename:** mirror-movement-reflection.svg
**Caption:** "Coordinate Mirror Movement reflects the enemy's position through the battlefield center and drives
to the reflected point."
**Viewport:** 6000x4500
**Battlefield:** true
**Bots:**
  - type: friendly, position: (4300, 2900), body: 315, turret: 315, radar: 315
  - type: enemy, position: (900, 700), body: 130, turret: 130, radar: 135
**Lines:**
  - from: (1300, 1100), to: (4700, 3400), color: "#9CA3AF", arrow: false, dashed: true, label: "reflection line"
**Circles:**
  - center: (3000, 2250), radius: 90, color: "#60A5FA", fill: "#60A5FA"
  - center: (4700, 3400), radius: 120, color: "#10B981", fill: none, dashed: true
**Texts:**
  - text: "battlefield center", position: (2850, 2300), color: "#60A5FA", anchor: end
  - text: "mirror drives here", position: (4700, 3720), color: "#10B981", anchor: middle
-->

<img src="/images/mirror-movement-reflection.svg"
alt="Coordinate Mirror Movement reflects the enemy's position through the battlefield center and drives to the
reflected point."
style="max-width:100%;height:auto;"/><br>
*Coordinate Mirror Movement reflects the enemy's position through the battlefield center and drives to the
reflected point.*

All three variants need a decent radar lock to track the enemy accurately, and RoboWiki names PolishedRuby as the
current state of the art. None of them work without that lock, since a mirror bot that loses the enemy is just
guessing at where to go next.

## Name the cost

A rammer's straight-line approach is exactly the predictable motion the earlier chapters on
[linear](../../targeting/simple-targeting/linear-targeting.md) and
[circular](../../targeting/simple-targeting/circular-targeting.md) targeting were built to punish, and RoboWiki
notes the style remains largely untested against Wave Surfing or [GuessFactor](/appendices/glossary#guessfactor)
guns. Ramming is a strong finishing
move and a weak full-time plan.

Mirror Movement's cost shows up against the opponents it should struggle with most. RoboWiki is blunt about it:
the technique is "utterly useless against opponents with weak movement or anti-mirror targeting," since copying a
bot that barely moves gives the mirror almost nothing to copy, and a gun built to notice the mirroring can exploit
the pattern directly.

## Platform notes

The 0.6 collision damage, the 2 points per point of ramming damage, and the 30% ram kill bonus all match between
classic Robocode and Tank Royale. Convert bearings into one consistent angle convention before reflecting a
position or matching a velocity, since classic Robocode headings are compass-style while Tank Royale headings are
mathematical.

## Further Reading

- [Ramming Movement](https://robowiki.net/wiki/Ramming_Movement) - RoboWiki (classic Robocode)
- [Mirror Movement](https://robowiki.net/wiki/Mirror_Movement) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
- [Scoring](https://robocode.dev/articles/scoring.html) - Tank Royale documentation

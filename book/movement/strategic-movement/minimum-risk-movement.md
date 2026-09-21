---
title: "Minimum Risk Movement"
category: "Movement & Evasion"
summary: >-
  Minimum Risk Movement scores real candidate destinations with a flexible risk function instead of summing forces,
  trading Anti-Gravity's elegant math for a search that resists settling into a "happy" but unsafe local minimum.
tags:
  - minimum-risk-movement
  - movement
  - strategic-movement
  - melee
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Minimum Risk Movement (classic Robocode) https://robowiki.net/wiki/Minimum_Risk_Movement"
  - "RoboWiki - Anti-Gravity Movement (classic Robocode) https://robowiki.net/wiki/Anti-Gravity_Movement"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Minimum Risk Movement

> [!TIP] Origins
> **Minimum Risk Movement** was pioneered by **Aelryen** and **ABC** as a more flexible alternative to
> [Anti-Gravity Movement](anti-gravity-movement.md) for melee combat, and refined by the RoboWiki community.

Anti-gravity sums a force from every enemy, wall, and teammate, then moves wherever that single vector points. The
sum is cheap to compute, but it can only express ideas that behave like a force, so a bot's real goal, staying alive,
gets bent into a shape it does not naturally fit. The sum can also settle into a spot that balances forces neatly
without being genuinely safe, RoboWiki's "happy" local minimum.

Minimum Risk Movement skips the force sum. It proposes several real destinations, scores each one directly against
whatever a good melee spot actually needs, then moves to the lowest-scoring point.

## Two functions instead of one sum

The technique splits into a **point-generating function**, which proposes candidate destinations, and a **risk
function**, which rates each one. RoboWiki calls the result more versatile than anti-gravity and less likely to
converge on a local minimum, though some bot authors treat the two techniques as different framings of the same
idea. Their implementations diverge enough in practice that the distinction is worth keeping.

Because a risk score is just a number a function returns, it can combine anything worth caring about, not only
inverse-square forces. Point generators vary by bot: HawkOnFire tests angular offsets at random distances, Tron
checks four cardinal points at a uniform distance, and FloodHT recursively subdivides the battlefield into
rectangles and tests their centers.

<!-- TODO: Illustration
**Filename:** minimum-risk-candidate-points.svg
**Caption:** "A risk function scores several candidate destinations at once. The bot moves to the lowest-risk one."
**Viewport:** 8000x5000
**Battlefield:** true
**Description:** A friendly bot near the middle of the arena has five small filled-circle candidate points scattered
around it at different angles and distances, each connected to the bot by a thin dashed line in the same color as
its risk level. Two candidates near an enemy cluster or the battlefield center are colored red and labeled with
their risk reason. Two farther candidates are colored orange. One candidate, farthest from every enemy and
reasonably close to reach, is colored green with a solid arrow instead of a dashed line, labeled as the chosen
destination. Three enemy bots are scattered near the corners of the arena.
**Bots:**
  - type: friendly, position: (3200, 2600), body: 30, turret: 30, radar: 30
  - type: enemy, position: (900, 700), body: 130, turret: 130, radar: 130, scale: 0.6
  - type: enemy, position: (6500, 900), body: 210, turret: 210, radar: 210, scale: 0.6
  - type: enemy, position: (5500, 3900), body: 300, turret: 300, radar: 300, scale: 0.6
**Lines:**
  - from: (3500, 2900), to: (4000, 2500), color: "#EF4444", arrow: false, dashed: true
  - from: (3500, 2900), to: (2100, 1600), color: "#EF4444", arrow: false, dashed: true
  - from: (3500, 2900), to: (3400, 4600), color: "#F59E0B", arrow: false, dashed: true
  - from: (3500, 2900), to: (5200, 2600), color: "#F59E0B", arrow: false, dashed: true
  - from: (3500, 2900), to: (2708, 3252), color: "#10B981", arrow: true, dashed: false
**Circles:**
  - center: (4000, 2500), radius: 90, color: "#EF4444", fill: "#EF4444"
  - center: (2100, 1600), radius: 90, color: "#EF4444", fill: "#EF4444"
  - center: (3400, 4600), radius: 90, color: "#F59E0B", fill: "#F59E0B"
  - center: (5200, 2600), radius: 90, color: "#F59E0B", fill: "#F59E0B"
  - center: (2600, 3300), radius: 110, color: "#10B981", fill: "#10B981"
**Texts:**
  - text: "near center", position: (4150, 2540), color: "#EF4444"
  - text: "near an enemy", position: (1930, 1650), color: "#EF4444", anchor: end
  - text: "long travel", position: (3560, 4650), color: "#F59E0B"
  - text: "poor angle to enemies", position: (5350, 2640), color: "#F59E0B"
  - text: "lowest risk: chosen", position: (1900, 3550), color: "#10B981"
-->

<img src="/images/minimum-risk-candidate-points.svg"
alt="A risk function scores several candidate destinations at once. The bot moves to the lowest-risk one."
style="max-width:100%;height:auto;"/><br>
*A risk function scores several candidate destinations at once. The bot moves to the lowest-risk one.*

## What a risk score usually weighs

RoboWiki describes risk functions built from the same ingredients as an anti-gravity force, evaluated at a point
instead of summed as a force: each enemy's energy and distance, how close the point sits to the nearest other bot,
how close it sits to the battlefield center, and how far the bot must travel to reach it. Most also weigh the
lateral angle to each enemy, since moving perpendicular to an enemy's gun is safer than closing in or backing
straight away.

```txt
candidates = pointGenerator(currentPosition)
bestPoint = null
bestRisk = infinity
for point in candidates:
    risk = 0
    for enemy in enemies:
        risk += enemyRisk(point, enemy)          // energy, distance, lateral angle
    risk += crowdingRisk(point, allBots)          // distance to the closest other bot
    risk += centerRisk(point, battlefieldCenter)  // central ground is exposed from every side
    risk += travelRisk(currentPosition, point)    // turns spent getting there are turns not spent evading
    if risk < bestRisk:
        bestRisk, bestPoint = risk, point
moveTo(bestPoint)
```

The exact weights are a tuning problem, not a fixed formula. RoboWiki does not publish a canonical set of
coefficients, so treat this shape as a starting structure and test any weights against real opponents.

## Name the cost

Anti-gravity's force sum costs one pass over every entity, however many candidates a bot considers. Minimum Risk
Movement costs a risk evaluation for every candidate, so more candidates buy a better search of the surrounding
space at a direct CPU price. A bot that only samples a handful of points each turn can also miss a genuinely good
destination that none of those points happened to land near. The search is only as good as the points it generates.

## Platform notes

The technique depends only on scan data, energy readings, and position math that classic Robocode and Tank Royale
both provide. Convert bearings into one consistent internal angle convention before scoring candidates, since
classic Robocode headings are compass-style while Tank Royale headings are mathematical.

## Further Reading

- [Minimum Risk Movement](https://robowiki.net/wiki/Minimum_Risk_Movement) - RoboWiki (classic Robocode)
- [Anti-Gravity Movement](https://robowiki.net/wiki/Anti-Gravity_Movement) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation

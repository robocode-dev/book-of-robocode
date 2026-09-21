---
title: "Pattern & Enemy Dodging Movement"
category: "Movement & Evasion"
summary: >-
  Pattern Movement repeats a fixed shape that only fools simple guns, while Enemy Dodging Movement reacts to nearby
  enemies turn by turn without any strategic sense of where the rest of the battlefield is.
tags:
  - pattern-enemy-dodging-movement
  - movement
  - offensive-movement
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Pattern Movement (classic Robocode) https://robowiki.net/wiki/Pattern_Movement"
  - "RoboWiki - Enemy Dodging Movement (classic Robocode) https://robowiki.net/wiki/Enemy_Dodging_Movement"
  - "RoboWiki - Minimum Risk Movement (classic Robocode) https://robowiki.net/wiki/Minimum_Risk_Movement"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Pattern & Enemy Dodging Movement

> [!TIP] Origins
> **Pattern Movement** is a catch-all name documented by the RoboWiki community for bots that repeat a fixed
> trajectory. **Enemy Dodging Movement**, a reactive variant that steers by nearby enemies instead of a fixed shape,
> was documented by RoboWiki contributor **jdev**.

A bot that always drives the same square, circle, or oscillation is cheap to write and, against a gun that has never
seen it before, surprisingly hard to hit. That cheapness has a short shelf life. Any gun that logs a few seconds of
movement and looks for a repeat sees through it immediately.

## A shape repeated is a shape guessed

RoboWiki groups several sample bots and nanobots under Pattern Movement because each one commits to a fixed
trajectory and never deviates. **Corners** drives to a corner and stays there. **Walls** rides the battlefield
edges in straight lines, while **SpinBot** just circles. **MyFirstRobot** oscillates back and forth, and
**Infinity** and **Crazy** trace tuned squares and quarter-circle turns instead. [Stop and
Go](../simple-evasion/stop-and-go.md) and the Musashi Trick count too, since both commit to one repeating rhythm
rather than reacting to the match in front of them.

The repetition buys two things. In melee, staying near a known position avoids wandering into a fresh cluster of
enemies. Against [Linear](../../targeting/simple-targeting/linear-targeting.md) or
[Circular](../../targeting/simple-targeting/circular-targeting.md) Targeting, a fixed shape defeats the assumption
that velocity or turn rate stays constant, since both extrapolate from the bot's current motion rather than its
history. Neither defense survives a gun that studies the history.
[Pattern Matching](../../targeting/predictive-targeting/pattern-matching.md) logs recent moves and searches for the
same sequence before, then fires at whatever followed it last time, which is exactly the corner Corners always
turns.

<!-- TODO: Illustration
**Filename:** pattern-movement-square.svg
**Caption:** "A bot that repeats the same square every lap gives a pattern matcher the one thing it needs: a
repeat."
**Viewport:** 6000x4000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1300, 2700), body: 0, turret: 0, radar: 0
**Lines:**
  - from: (1600, 3000), to: (1600, 1200), color: "#60A5FA", arrow: false, dashed: false, label: "lap 1"
  - from: (1600, 1200), to: (4400, 1200), color: "#60A5FA", arrow: false, dashed: false
  - from: (4400, 1200), to: (4400, 3000), color: "#60A5FA", arrow: true, dashed: false
  - from: (1800, 3000), to: (1800, 1200), color: "#9CA3AF", arrow: false, dashed: true, label: "lap 2 (same path)"
**Circles:**
  - center: (4400, 1200), radius: 180, color: "#EF4444", fill: none, dashed: true
**Texts:**
  - text: "lap 1", position: (1480, 2100), color: "#60A5FA", anchor: end
  - text: "lap 2 (same path)", position: (1900, 2100), color: "#9CA3AF"
  - text: "next corner: predicted", position: (4400, 900), color: "#EF4444"
-->

<img src="/images/pattern-movement-square.svg"
alt="A bot that repeats the same square every lap gives a pattern matcher the one thing it needs: a repeat."
style="max-width:100%;height:auto;"/><br>
*A bot that repeats the same square every lap gives a pattern matcher the one thing it needs: a repeat.*

## Enemy Dodging: react instead of repeat

Enemy Dodging Movement drops the fixed shape and scores real points around the bot instead, in the same spirit as
[Minimum Risk Movement](../strategic-movement/minimum-risk-movement.md) but far simpler. jdev's version samples
roughly 18 candidate points around the bot at a fixed radius (a "field of vision" of 50 units, spaced at intervals
of $\pi/9$ radians), counts only enemies inside a 150-unit danger distance, and drops any candidate that falls
within 20 units of a battlefield edge. For every surviving candidate it averages the distance to each nearby enemy,
then drives to the point with the highest average, the one that sits furthest from danger right now.

```txt
candidates = pointsOnCircle(currentPosition, FIELD_OF_VISION, count = 18)
bestPoint = null
bestAvgDist = -infinity
for point in candidates:
    if point is within ACTIVITY_MARGIN of a battlefield edge:
        continue
    nearby = [enemy for enemy in enemies if distance(point, enemy) < DANGER_DISTANCE]
    if nearby is empty:
        continue
    avgDist = average(distance(point, enemy) for enemy in nearby)
    if avgDist > bestAvgDist:
        bestAvgDist, bestPoint = avgDist, point
moveTo(bestPoint)
```

<!-- TODO: Illustration
**Filename:** enemy-dodging-candidates.svg
**Caption:** "Enemy Dodging Movement samples points on a small circle around the bot and drives to the one
furthest from nearby enemies."
**Viewport:** 6000x4500
**Battlefield:** true
**Bots:**
  - type: friendly, position: (2500, 2400), body: 35, turret: 35, radar: 35
  - type: enemy, position: (3960, 760), body: 215, turret: 215, radar: 215, scale: 0.6
**Circles:**
  - center: (2800, 2700), radius: 900, color: "#9CA3AF", fill: none, dashed: true, label: "candidate ring"
  - center: (4200, 1000), radius: 1300, color: "#EF4444", fill: "#EF4444", dashed: true, label: "danger distance"
  - center: (3700, 2700), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (3436, 3336), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (2800, 3600), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (1900, 2700), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (2164, 2064), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (2800, 1800), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (3436, 2064), radius: 60, color: "#9CA3AF", fill: "#9CA3AF"
  - center: (2164, 3336), radius: 90, color: "#10B981", fill: "#10B981"
**Lines:**
  - from: (2800, 2700), to: (2355, 3145), color: "#10B981", arrow: true, dashed: false
**Texts:**
  - text: "candidate ring", position: (1800, 2730), color: "#9CA3AF", anchor: end
  - text: "danger distance", position: (5390, 1000), color: "#EF4444", anchor: end
  - text: "furthest: chosen", position: (2020, 3400), color: "#10B981", anchor: end
-->

<img src="/images/enemy-dodging-candidates.svg"
alt="Enemy Dodging Movement samples points on a small circle around the bot and drives to the one furthest from
nearby enemies."
style="max-width:100%;height:auto;"/><br>
*Enemy Dodging Movement samples points on a small circle around the bot and drives to the one furthest from nearby
enemies.*

## Name the cost

Pattern Movement's cost is the same repetition that makes it cheap: any gun that remembers more than a few seconds
of history reads the pattern and fires at the next repeat. It is a technique for beating simple guns, not a lasting
defense.

Enemy Dodging Movement gives up scope for that simplicity. RoboWiki calls it "a clear tactical method" on its own,
since it only asks where the nearest enemies are right now, with no notion of battlefield center, ally crowding, or
energy, the ingredients a [Minimum Risk Movement](../strategic-movement/minimum-risk-movement.md) risk function
weighs alongside enemy distance. A bot using it alone can dodge its way into a corner, a wall, or a second enemy it
never sampled for, which is why RoboWiki pairs it with a strategic technique rather than running it by itself.

## Platform notes

Both techniques depend only on scan history and position math that classic Robocode and Tank Royale both expose.
Convert bearings into one consistent angle convention before comparing candidate points or logged moves, since
classic Robocode headings are compass-style while Tank Royale headings are mathematical.

## Further Reading

- [Pattern Movement](https://robowiki.net/wiki/Pattern_Movement) - RoboWiki (classic Robocode)
- [Enemy Dodging Movement](https://robowiki.net/wiki/Enemy_Dodging_Movement) - RoboWiki (classic Robocode)
- [Minimum Risk Movement](https://robowiki.net/wiki/Minimum_Risk_Movement) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation

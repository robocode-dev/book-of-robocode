---
title: "Angular Targeting"
category: "Targeting Systems"
summary: >-
  Angular Targeting extrapolates the enemy's bearing rather than its position, and the Factored variant learns one
  adaptive number without building a full GuessFactor histogram.
tags:
  - angular-targeting
  - targeting
  - advanced-targeting
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Angular Targeting (classic Robocode) https://robowiki.net/wiki/Angular_Targeting"
  - "RoboWiki - Angular Targeting/Factored (classic Robocode) https://robowiki.net/wiki/Angular_Targeting/Factored"
  - >-
    RoboWiki - GuessFactor Targeting (traditional) (classic Robocode)
    https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Angular Targeting

> [!TIP] Origins
> **Angular Targeting** was developed and documented by the RoboWiki community. **Peter Strömberg (PEZ)** designed
> the **Factored** variant and first built it into his bot **Gouldingi**.

Most targeting systems in this book predict a position: where the enemy's x and y coordinates will be when the
bullet arrives. Angular Targeting skips position entirely and predicts an angle, extrapolating how the enemy's
bearing has been swinging between scans and firing along wherever that swing points next.

## Bearing swing instead of position

RoboWiki describes the base idea in one line: extrapolate the bearing difference between two scans of the enemy.
Take the bearing from the bot to the enemy on the last two scans, find the difference between them, and assume the
next stretch of bearing change looks like the last one. The bullet fires along that projected bearing rather than
at a simulated future position.

<!-- TODO: Illustration
**Filename:** angular-targeting-bearing-swing.svg
**Caption:** "The bearing to the enemy swings between two scans. Angular Targeting fires further along that same
swing instead of predicting a position."
**Viewport:** 7000x5000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (900, 2500), body: 0, turret: 0, radar: 0
  - type: enemy, position: (4460, 1160), body: 200, turret: 200, radar: 200, scale: 0.6 (ghost, opacity 0.45)
  - type: enemy, position: (4760, 1960), body: 220, turret: 220, radar: 220, scale: 0.6
**Lines:**
  - from: (1200, 2800), to: (4700, 1400), color: "#9CA3AF", arrow: false, dashed: true, label: "scan 1"
  - from: (1200, 2800), to: (5000, 2200), color: "#60A5FA", arrow: false, dashed: false, label: "scan 2"
  - from: (1200, 2800), to: (5223, 4006), color: "#10B981", arrow: true, dashed: false, label: "further along
    the same swing"
**Arcs:**
  - center: (1200, 2800), radius: 900, startAngle: 338, endAngle: 351, color: "#9CA3AF", dashed: false, label: "bd"
  - center: (1200, 2800), radius: 1300, startAngle: 351, endAngle: 377, color: "#10B981", dashed: false
**Texts:**
  - text: "scan 1", position: (2775, 1820), color: "#9CA3AF"
  - text: "scan 2", position: (3100, 2650), color: "#60A5FA"
  - text: "bd", position: (2200, 2600), color: "#9CA3AF"
  - text: "further along the same swing", position: (3000, 3750), color: "#10B981"
-->

<img src="/images/angular-targeting-bearing-swing.svg"
alt="The bearing to the enemy swings between two scans. Angular Targeting fires further along that same swing
instead of predicting a position."
style="max-width:100%;height:auto;"/><br>
*The bearing to the enemy swings between two scans. Angular Targeting fires further along that same swing instead
of predicting a position.*

## PEZ's Factored refinement

Plain bearing extrapolation trusts the most recent swing completely, which is fragile against any enemy that
changes its turning at all. Factored Angular Targeting keeps the same shape but scales the swing by an adaptive
factor $F$ instead of taking it at face value, aiming at the current bearing plus $F$ times the raw bearing delta
between the last two scans.

Every shot gets logged: the bot's own location, the enemy's location, the fire time, the bullet speed, and the raw
bearing delta $bd$ that produced the shot. When the bullet would have reached the enemy's original position,
Factored Angular Targeting looks back at where the enemy actually ended up and works out the bearing swing $BD$
that shot would have needed to land. The ratio $f = \frac{BD}{bd}$ is the factor that would have hit that one
shot. RoboWiki does not publish a fixed way to fold $f$ into $F$, only that some kind of rolling average works, so
each new shot nudges $F$ toward whatever ratio has been landing hits lately, without resetting it from scratch.

```txt
onScan(enemy):
    bd = bearing(now) - bearing(lastScan)
    fireBearing = bearing(now) + F * bd
    fire(fireBearing)
    logShot(ownLocation, enemyLocation, fireBearing, bulletSpeed, bd)

onBulletArrival(shot):
    BD = bearingSwing(shot.ownLocation, shot.enemyLocationThen, enemyLocationNow)
    f = BD / shot.bd
    F = rollingAverage(F, f)   // RoboWiki leaves the exact averaging step open
```

## Where it sits next to GuessFactor

[GuessFactor Targeting](../statistical-targeting/guessfactor-targeting.md) normalizes every bearing offset by the
physics-based escape angle and bins the results into a histogram, so it can represent an enemy with two favorite
escape directions at once. Factored Angular Targeting keeps a single running number, closer to RoboWiki's
[Averaged Bearing Offset Targeting](https://robowiki.net/wiki/Averaged_Bearing_Offset_Targeting) than to a full
[segmentation](../statistical-targeting/segmentation-visit-count-stats.md) system. That single factor is cheap to
keep and quick to adapt, but it can only aim at one place at a time, so it blurs together an enemy that genuinely
alternates between two escape directions.

## Platform notes

Both platforms expose the scan history and bearing data the technique depends on. Convert bearings into one
consistent angle convention before computing $bd$ or $BD$, since classic Robocode headings are compass-style while
Tank Royale headings are mathematical.

## Further Reading

- [Angular Targeting](https://robowiki.net/wiki/Angular_Targeting) - RoboWiki (classic Robocode)
- [Angular Targeting/Factored](https://robowiki.net/wiki/Angular_Targeting/Factored) - RoboWiki (classic Robocode)
- [GuessFactor Targeting (traditional)](https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)) - RoboWiki
  (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation

---
title: "Radar Basics"
category: "Radar & Scanning"
summary: "Learn how radar scanning works, why scan data is always slightly old, and when to lock vs sweep to keep enemies tracked."
tags: [ "radar", "scanning", "onscannedrobot", "robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "RoboWiki - Radar (classic Robocode) https://robowiki.net/wiki/Radar",
  "Robocode Rules (classic Robocode) https://robocode.sourceforge.io/docs/robocode/robocode/Rules.html",
  "Robot.onScannedRobot() (classic Robocode API) https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html#onScannedRobot-robocode.ScannedRobotEvent-",
  "Robocode Tank Royale Docs - Anatomy https://robocode.dev/articles/anatomy.html",
  "Robocode Tank Royale Tutorial - Beyond the basics https://robocode.dev/tutorial/beyond-the-basics.html"
]
---

# Radar Basics

Radar is the main sensor in Robocode. If scan data is stale, a bot aims worse, reacts slower, and makes questionable
movement decisions.

A good radar strategy keeps updates frequent and intentional: find enemies quickly, keep track of the most important
ones, and recover fast when contact is lost.

## What a scan really means (and why it is “history”)

A scan happens when the radar beam sweeps across an enemy bot. The engine then delivers a scan event (such as
`onScannedRobot`) containing information measured at that moment.

That means every scan is already a tiny bit old when it is received:

- The enemy has already moved a little by the time the bot reacts.
- The longer the time between scans, the more “wrong” the last known position becomes.

A simple rule of thumb: the enemy being aimed at should also be scanned often. Prediction can be clever, but it is still
built on observations.

## Radar geometry: direction, arc, and range

The radar can be thought of as a rotating wedge (an arc) extending outward from the bot:

- **Radar heading**: where the radar is pointing.
- **Scan arc angle**: how "wide" the radar beam is.
- **Scan length**: how far the scan reaches (commonly described as 1200 units).

<img src="../images/radar-geometry.svg" alt="Radar geometry" width="675"><br>
*Radar geometry: The illustration is not to scale – the scan arc is actually longer than shown. The scan length is
always 1200 units. The radar heading is depicted, and in this illustration the scan arc is 30°, but can be up to 45°*

Narrow arcs can be precise, but they also make it easier to miss scans if the target slips outside the beam between
turns. Wide arcs are easier to hit with, but can waste time scanning empty space.

## Turning and coupling: body, gun, and radar

Radar movement is affected by how the bot turns its body and gun unless it is explicitly handled. In practice, this is
one of the biggest beginner pitfalls:

- A bot turns to move.
- The gun turns to aim.
- The radar gets dragged along.
- The bot stops scanning the enemy without noticing.

Bots often “decouple” or “unchain” the radar so the radar can keep tracking while the gun aims and the body moves. The
exact API differs between platforms and bot base classes, but the idea is the same: radar control should be deliberate.

## From scan event to enemy position

Scan events typically provide a **relative bearing** (angle offset from the bot’s heading) and a **distance** in units.

- **Classic Robocode:** You must compute the enemy's coordinates from your position, heading, the relative bearing, and
  distance.
- **Robocode Tank Royale:** The scan event provides the enemy's coordinates (`x`, `y`) directly—no calculation needed.

**Classic Robocode calculation:**

```text
absoluteBearing = myHeading + relativeBearing

enemyX = myX + sin(absoluteBearing) * distance
enemyY = myY + cos(absoluteBearing) * distance
```

Definitions:

- `myX`, `myY`: the bot’s current position.
- `myHeading`: the bot’s current heading.
- `relativeBearing`: the bearing from the scan event.
- `distance`: the distance from the scan event.

*In classic Robocode, you can use real Java code and the `ScannedRobotEvent` to compute the enemy's coordinates. For
example:*

```java
// Inside onScannedRobot(ScannedRobotEvent event):
double absoluteBearing = getHeadingRadians() + event.getBearingRadians();
double enemyX = getX() + Math.sin(absoluteBearing) * event.getDistance();
double enemyY = getY() + Math.cos(absoluteBearing) * event.getDistance();
```

> [!NOTE] Note
> In classic Robocode, `sin` is used for X and `cos` for Y because the coordinate system has (0,0) at the bottom left,
> 0° points up (North), and angles increase clockwise. This is the opposite of the standard math convention.
> See [Coordinate Systems & Angles](../physics/coordinates-and-angles.md) for details.

**Tank Royale:** Use the provided `x` and `y` fields from the scan event (`ScannedBotEvent`) for the enemy's position.

Angle conventions differ between classic Robocode and Robocode Tank Royale. Use the rules from
[Coordinate Systems & Angles](../physics/coordinates-and-angles.md) when converting between headings and bearings.

## Lock vs. sweep: two core radar strategies

### Locking (best in 1v1)

In a one-on-one battle, the goal is usually to scan the same enemy as often as possible.

Concept:

- Turn the radar toward the enemy’s last known bearing.
- Add a small overshoot so the beam keeps crossing the target even if both bots are turning.
- If contact is lost, switch back to a wide sweep to reacquire.

Locking improves targeting because aim and prediction are based on fresh data rather than guesses from many turns ago.

### Sweeping (essential in melee)

In melee, scanning one bot perfectly can lead to getting surprised by a different bot. Sweeping solves discovery and
keeps general awareness.

A practical “efficient sweep” mindset:

- Prefer short sweeps that revisit known enemies frequently.
- Track the **time since last scan** for each enemy.
- Prioritize scanning:
    - the bot being targeted for shooting,
    - nearby or high-threat bots,
    - bots aren’t scanned for the longest time.

When there are many enemies, it is often better to keep good data on a few important bots than stale data on everyone.

## Tips and common mistakes

- **Stopping the radar**: a stationary radar goes blind quickly.
- **Oversweeping**: rotating far past the target wastes turns that could have produced more scans.
- **No reacquire plan**: always have a fallback sweep when the lock breaks (no new scan events occur).
- **Scanning everything equally in melee**: it often produces uniformly stale data.
- **Wasting radar sweeps outside the battlefield**: A good radar strategy takes borders into account—there’s no reason
  to scan behind the borders where no bot can go. Near a corner, you only need to scan about a quarter to third of the
  arena, thanks to the two nearby borders.

## Linking forward

- **One-on-One Radar**: spinning radar, infinity lock, and “perfect lock” patterns.
- **Melee Radar**: oldest-scanned strategies, corner arcs, and selective focus under chaos.

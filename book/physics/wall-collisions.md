---
title: "Wall Collisions"
category: "Battlefield Physics"
summary: "Understanding battlefield walls, the damage from collisions, and why wall avoidance is essential for bot survival and competitive play."
tags: ["wall-collisions", "battlefield-physics", "damage", "beginner", "classic-robocode", "tank-royale"]
difficulty: "beginner"
source: [
  "RoboWiki - Wall Avoidance",
  "IBM DeveloperWorks - Fighting with Algorithms",
  "Robocode Tank Royale Docs - Physics"
]
---

# Wall Collisions

The battlefield has hard boundaries called walls. When your bot collides with a wall, it takes damage and stops moving.
Understanding walls and learning to avoid them is one of the first skills every competitive bot must master.

## What Are Walls?

Walls are the invisible barriers at the edges of the battlefield. They form a rectangular boundary:

- The **bottom wall** is at `y = 0`.
- The **left wall** is at `x = 0`.
- The **top wall** is at `y = battlefieldHeight`.
- The **right wall** is at `x = battlefieldWidth`.

Your bot cannot move beyond these edges. If you try, your bot will collide, stop, and take damage.

## Battlefield Dimensions

Battlefields vary in size depending on the battle type and format. The allowed size range and standard configurations
are:

### Size Range

- **Minimum size:** 400 × 400 units
- **Maximum size:** 5000 × 5000 units

### Standard Battle Sizes

- **1v1 (Standard):** 800 × 600 units
- **Melee (Free-for-all):** 1000 × 1000 units

Larger battlefields give bots more space to maneuver and evade, while smaller battlefields force closer combat. The
dimensions affect movement strategy significantly—on a 400 × 400 battlefield, escape routes are limited, while a 5000 ×
5000
battlefield allows for extended long-range engagements.

## Damage from Wall Collisions

When your bot hits a wall, you lose energy based on your velocity at impact:

- **Classic Robocode:** You take damage equal to `abs(velocity) * 0.5 - 1` energy per hit.
- **Robocode Tank Royale:** Similar damage rules apply, scaled to velocity on impact.

For example, hitting a wall at full speed (8 units/turn) in classic Robocode costs you `(8 * 0.5) - 1 = 3` energy.
Multiple collisions quickly add up, and can disable or destroy your bot.

> **Tip:** Collisions also bring your bot to a complete stop, wasting precious movement time and making you an easy
> target.

## Why Wall Avoidance Matters

Avoiding walls is critical for several reasons:

1. **Survival:** Every collision drains your energy. Repeated hits can cost you the match.
2. **Mobility:** Being stuck on a wall means you can't dodge enemy bullets effectively.
3. **Predictability:** Bots that hug walls are easy to target — experienced opponents know where you'll be.

Elite bots rarely touch walls except in very specific tactical situations. Learning to maintain safe distances from
boundaries is a foundational skill.

## Simple Wall Avoidance

The most basic wall avoidance strategy is to check your distance from each wall and reverse or turn before you get too
close:

```pseudocode
if distance to nearest wall < safeDistance:
    reverse direction
    or turn away from wall
```

For example, if your bot is moving forward and nears the top wall, you can:

- Call `setBack(distance)` to reverse.
- Call `setTurnRight(angle)` or `setTurnLeft(angle)` to steer away.

A common safe distance is around 100–150 units from the wall, giving you plenty of room to maneuver and dodge.

## Advanced Considerations

As you improve, you'll refine your wall avoidance:

- **Predictive movement:** Calculate exactly when you'll reach the wall based on your current velocity and
  deceleration rate, and plan your turn in advance.
- **Wall smoothing:** Move parallel to walls at a safe distance, rather than bouncing away abruptly. This keeps your
  movement fluid and less predictable.
- **Tactical positioning:** Sometimes staying near (but not touching) a wall can limit the angles an enemy can attack
  you from — but only if you're confident you can dodge effectively.

These techniques are explored in depth in the *Movement & Evasion* section of this book.

## Platform Notes

Wall collision damage formulas are slightly different between classic Robocode and Tank Royale, but the core principle
is the same on both platforms:

- Walls are fixed rectangular boundaries.
- Hitting them costs energy and stops movement.
- Avoidance is essential for competitive play.

## Further Reading & References

- [RoboWiki - Wall Avoidance](https://www.cse.chalmers.se/~bergert/robowiki-mirror/RoboWiki/robowiki.net/wiki/Wall_Avoidance.html)
- [IBM DeveloperWorks - Fighting with Algorithms](https://web.archive.org/web/20121113061509/http://www.ibm.com/developerworks/library/j-fwa/index.html)
- [Robocode Tank Royale - Physics](https://robocode.dev/articles/physics.html)
- [Movement Constraints & Bot Physics](./movement-constraints.md) — for velocity and deceleration formulas
- [Coordinate Systems & Angles](./coordinates-and-angles.md) — for battlefield dimensions and position tracking

## Linking Forward

Once you understand wall collisions, you're ready to explore more sophisticated movement strategies. See the
*Movement & Evasion* section for advanced wall smoothing, orbital movement, and wave surfing techniques that help you
stay mobile and unpredictable.

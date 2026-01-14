---
title: "Virtual Guns & Mean Targeting"
category: "Targeting Systems"
summary: "Run multiple targeting algorithms simultaneously and pick the one with the best performance against each enemy."
tags: [ "targeting", "simple-targeting", "virtual-guns", "mean-targeting", "adaptive-targeting", "robocode", "tank-royale", "advanced" ]
difficulty: "advanced"
source: [
  "RoboWiki - Virtual Guns (classic Robocode) https://robowiki.net/wiki/Virtual_Guns",
  "RoboWiki - Mean Targeting (classic Robocode) https://robowiki.net/wiki/Mean_Targeting"
]
---

# Virtual Guns & Mean Targeting

Virtual guns let a bot run multiple targeting strategies at the same time and dynamically choose the one performing best
against each opponent.
Instead of committing to a single algorithm, the bot "fires" imaginary bullets from each strategy and tracks which one
would have hit most often.

This adaptive approach is especially powerful in competitive play, where enemy movement patterns vary widely.

## Key idea: measure, then choose

A virtual gun system maintains:

- **Multiple targeting algorithms** (e.g., head-on, linear, circular, random offset).
- **Hit statistics** for each algorithm per enemy.
- **A selection policy** that picks which gun to fire with based on recent performance.

At fire time:

1. Each virtual gun computes its aim angle (but doesn't actually fire).
2. The bot fires with the gun that has the best hit rate so far.
3. All guns record their predictions as "virtual bullets" moving across the battlefield.
4. When a real bullet hits or misses, all virtual bullets near the impact are scored.

Over time, the system learns which strategy works best against each opponent's movement style.

<img src="../../images/virtual-guns-concept.svg" alt="Multiple virtual guns aim at different predicted positions; the bot fires using the one with the best track record" width="1000"><br>
*Multiple virtual guns aim at different predicted positions; the bot fires using the one with the best track record*

## How virtual guns work

### Step 1: Track virtual bullets

Each gun stores:

- **Aim angle** computed at fire time.
- **Fire position** (where the real bot was).
- **Travel time** remaining (decreases each turn).
- **Predicted impact point** (optional, for visualization).

Every turn, each virtual bullet's travel time is decremented.
When it reaches zero, it's compared against the enemy's actual position at that time.

### Step 2: Score hits and misses

When a virtual bullet "arrives":

- If the enemy is within a hitbox radius (18 units) of the predicted point, record a **hit**.
- Otherwise, record a **miss**.

Some implementations also score "partial hits" based on proximity, giving credit for near-misses.

### Step 3: Select the best gun

Before firing, compute a **success rate** for each gun:

$\text{success rate} = \frac{\text{hits}}{\text{hits} + \text{misses}}$

Fire with the gun that has the highest success rate.

> [!TIP] Handling ties
> If multiple guns have the same rate, many bots prefer the more sophisticated algorithm (e.g., circular over head-on)
> as a tiebreaker, or simply stick with the last active gun.

### Step 4: Decay old data (optional)

Against adaptive opponents, recent performance matters more than ancient history.
Many implementations use a **decay factor** or a **rolling window** to forget old data gradually.

## Mean targeting: the original virtual gun

Mean targeting is a classic early implementation of virtual guns. It typically runs three simple strategies:

1. **Head-on** — aim at the enemy's current position.
2. **Linear** — predict straight-line movement.
3. **Circular** — predict constant turn rate.

The bot picks whichever has the best success rate so far.
Despite being "simple targeting," mean targeting can be surprisingly effective because it adapts to the opponent's
movement style without manual tuning.

## Pseudocode (platform-agnostic)

```pseudocode
# Each gun stores its own hit/miss stats per enemy
struct VirtualGun {
    name: string
    hits: int
    misses: int
    aimFunction: (scanData) -> angle
}

guns = [headOnGun, linearGun, circularGun, ...]

# On scan:
scanData = currentEnemyState

# On fire:
bestGun = null
bestRate = -1
for gun in guns:
    rate = gun.hits / (gun.hits + gun.misses + 1)  # +1 to avoid divide-by-zero
    if rate > bestRate:
        bestRate = rate
        bestGun = gun

aimAngle = bestGun.aimFunction(scanData)
turnGunTo(aimAngle)
fire(power)

# Record virtual bullets for all guns
for gun in guns:
    virtualAim = gun.aimFunction(scanData)
    gun.recordVirtualBullet(virtualAim, power, myPosition)

# Each turn, update virtual bullets and score them
for gun in guns:
    gun.updateVirtualBullets()
    for bullet in gun.expiredBullets:
        if distance(bullet.predictedPosition, enemy.actualPosition) < hitboxRadius:
            gun.hits += 1
        else:
            gun.misses += 1
```

## Platform notes (classic vs. Tank Royale)

The virtual gun concept is platform-independent, but:

- **Angle conventions differ:** always normalize angles using the platform's helpers.
  See [Coordinate Systems & Angles](../../physics/coordinates-and-angles.md).

- **Bullet speed:** in classic Robocode, `bulletSpeed = 20 - 3 × power`.
  Tank Royale uses similar formulas, but check the official docs.

- **Collision detection:**
    - **Classic Robocode** uses an axis-aligned bounding box (36×36 units) that does *not* rotate with the bot's
      heading.
    - **Tank Royale** uses a bounding circle (radius 18 units) that is independent of the bot's actual heading.

  This difference affects how you calculate virtual bullet impacts. See
  the [Tank Royale anatomy documentation](https://robocode.dev/articles/anatomy.html#collision-detection) for details.

## Tips & common mistakes

- **Firing before gathering data:** virtual guns need time to accumulate statistics.
  Against a new enemy, start with a reasonable default (e.g., linear) until enough data exists.

- **Not cleaning up old bullets:** virtual bullets that leave the battlefield or expire should be removed to avoid
  eating up memory and waste of CPU cycles.

- **Ignoring bullet power differences:** if the real gun fires with varying power, virtual bullets should match that
  power (or at least track performance per power level).

- **Overcounting hits:** ensure each virtual bullet is scored exactly once when it expires, not every turn.

- **Forgetting per-enemy stats:** in melee or teams, track statistics separately for each opponent.

- **Not testing gun performance:** log success rates during development to verify that the selection logic is working.

## When to use virtual guns

Virtual guns shine when:

- **Enemy movement styles vary** across opponents (e.g., tournaments with diverse bots).
- **A single targeting algorithm isn't enough** (one strategy can't handle both stationary and surfing bots).
- **Development time is limited** (combine multiple simple guns instead of tuning one complex gun).

They're less useful when:

- The bot only faces one opponent repeatedly (offline tuning can beat adaptive selection).
- All guns perform similarly (no statistical difference to exploit).
- Memory or CPU is very constrained (tracking many virtual bullets has overhead).

## Beyond mean targeting

Advanced bots extend the virtual gun idea with:

- **More sophisticated guns** (GuessFactor, pattern matching, neural nets).
- **Per-situation selection** (different gun per range, velocity, or wall proximity).
- **Confidence intervals** (prefer guns with more data when rates are close).
- **Hybrid aiming** (average multiple gun angles weighted by success rate).

But the core principle remains: measure performance, then adapt.

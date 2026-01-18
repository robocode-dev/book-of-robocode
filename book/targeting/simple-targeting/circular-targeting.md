---
title: "Circular Targeting (with Walkthrough)"
category: "Targeting Systems"
summary: "A predictive aiming method that assumes the enemy keeps turning at a constant rate, so its path curves."
tags: [ "targeting", "simple-targeting", "circular-targeting", "predictive-aiming", "classic-robocode", "tank-royale", "intermediate" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Circular Targeting (classic Robocode) https://robowiki.net/wiki/Circular_Targeting",
  "RoboWiki - Circular Targeting/Walkthrough (classic Robocode) https://robowiki.net/wiki/Circular_Targeting/Walkthrough"
]
---

# Circular Targeting (with Walkthrough)

> [!TIP] Origins
> **Circular Targeting** is a foundational technique documented by the RoboWiki community as the next step after linear
> targeting.

Circular targeting predicts where to aim by assuming the enemy keeps moving with **constant speed** and a **constant
turn rate**.
That means the enemy follows an arc (part of a circle), not a straight line.

Compared to [Linear Targeting](./linear-targeting.md), this tends to hit better against bots that keep turning while
they
strafe (a very common movement style).

## When does circular targeting work well?

Circular targeting is a good fit when the enemy:

- turns smoothly for many turns (constant-ish angular velocity),
- changes speed less often than it changes heading,
- is a "circle-strafer" or otherwise keeps curving around the bot.

It still struggles when the enemy:

- frequently switches direction, stops, or jitters its heading,
- deliberately *breaks* prediction by varying turn rate,
- is very far away (small prediction errors become large misses).

> [!TIP] Baseline mindset
> Circular targeting is still **simple targeting**: it assumes a clean pattern.
> It's a great stepping stone toward wave-based and statistical guns.

## The model: constant turn rate

At fire time, a circular gun typically keeps this state from the last scan:

- Enemy position: `(enemyX, enemyY)`
- Enemy heading: `enemyHeading`
- Enemy speed: `enemySpeed`
- Enemy turn rate: `enemyTurnRate` (how much the enemy heading changes per turn)

Then it simulates forward, one tick at a time:

1. Increase the enemy heading by `enemyTurnRate`.
2. Move the enemy forward by `enemySpeed` in the new heading.
3. Stop when bullet travel time "catches up" to the predicted distance.

This "play it forward" loop avoids hard math and stays readable.

<img src="../../images/circular-targeting.svg" alt="Top-down diagram showing a blue shooter bot firing a yellow bullet at the predicted intercept point on an orange enemy bot's curved trajectory" width="500"/><br>
*Diagram: Circular targeting predicts the enemy's curved path and aims at the intercept point where the bullet meets the
enemy.*

## Minimal pseudocode (platform-agnostic)

Definitions:

- `bulletSpeed`: bullet speed for the chosen firepower.
- `distance(a, b)`: Euclidean distance in units.
- `stepForward(x, y, heading, speed)`: moves one turn forward.
- `headingTo(myX, myY, x, y)`: angle from shooter to point.

```text
# State from latest scan:
myX, myY
enemyX, enemyY
enemyHeading
enemySpeed
enemyTurnRate
bulletSpeed

# Predict forward until bullet can reach the predicted point
predX = enemyX
predY = enemyY
predHeading = enemyHeading

turnsAhead = 0
while bulletSpeed * turnsAhead < distance((myX,myY), (predX,predY)):
    predHeading = predHeading + enemyTurnRate
    (predX, predY) = stepForward(predX, predY, predHeading, enemySpeed)
    turnsAhead = turnsAhead + 1

aimHeading = headingTo(myX, myY, predX, predY)
turnGunShortest(aimHeading)
fire()
```

This is intentionally the **simple** version.
More robust circular guns clamp the predicted point inside a safe rectangle or stop if the point exits the battlefield.

## Walkthrough: building a simple circular gun

This walkthrough focuses on *what to compute and store* each time a scan happens.
It does not depend on a specific language.

### Step 1: Track the enemy's absolute heading

Circular targeting needs the enemy headings from consecutive scans.
That means the scan must be frequent enough that the heading difference is meaningful.

- In **classic Robocode**, the scan event provides enemy heading directly (`e.getHeading()` in degrees).
- In **Tank Royale**, the scan provides direction as well (names vary by SDK), but the angle convention differs.

### Step 2: Compute turn rate from two scans

The enemy turn rate (per turn) can be estimated as:

- `enemyTurnRate = normalizeAngle(enemyHeadingNow - enemyHeadingPrev) / deltaTime`

Where:

- `deltaTime` is how many turns passed since the last scan of that enemy.
- `normalizeAngle(...)` wraps to a **short** signed angle (e.g. in `(-180°, +180°]` or `(-π, +π]`).

> [!NOTE] Sign matters
> A positive turn rate means the enemy keeps turning in the same direction.
> If turn rate flips sign often, circular targeting won't predict well.

### Step 3: Store speed (and optionally smooth it)

Most simple implementations use the latest reported `enemySpeed` directly.
To reduce noise, a bot can also keep a small moving average, but that is optional.

### Step 4: Predict and aim

At fire time:

1. Start at the latest known enemy position.
2. Simulate forward with the constant `(speed, turnRate)` model.
3. Aim at the final predicted `(predX, predY)`.

A common loop condition is:

- "simulate while bullet travel distance < current predicted distance".

This works because bullet travel distance grows linearly with prediction time.

## Platform notes (classic vs. Tank Royale)

The *idea* is the same across platforms, but be careful with two details:

- **Angle conventions differ** (where 0° points and which direction is positive).
  Always use the platform's standard helpers and normalize relative angles.
  See [Coordinate Systems & Angles](../../physics/coordinates-and-angles.md).

- **Asynchronous scans:** depending on radar strategy, scans might not happen every turn.
  Always divide heading change by `deltaTime` when estimating turn rate.

## Tips & common mistakes

- **Forgetting angle normalization:** heading differences must be normalized before dividing by `deltaTime`.

- **Assuming constant turn rate during sharp cornering:** many bots vary turn rate when near walls.
  If prediction goes outside the battlefield, clamp or fall back to head-on.

- **Not handling missing scans:** if the enemy hasn't been scanned for a while, prediction becomes guesswork.
  Consider falling back to [Head-On Targeting](./head-on-targeting.md) for stale data.

- **Firing too early (gun not aligned):** prediction doesn't help if the gun isn't turned.
  Many bots wait until gun error is below a small threshold.

## Further Reading

- [Circular Targeting](https://robowiki.net/wiki/Circular_Targeting) — RoboWiki (classic Robocode)
- [Circular Targeting/Walkthrough](https://robowiki.net/wiki/Circular_Targeting/Walkthrough) — RoboWiki (classic
  Robocode)


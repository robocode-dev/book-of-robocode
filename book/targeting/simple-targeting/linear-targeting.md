---
title: "Linear Targeting"
category: "Targeting Systems"
summary: "A simple predictive aiming method: assume the enemy keeps moving in a straight line at constant speed, then aim
  where it will be when the bullet arrives."
tags: [ "targeting", "simple-targeting", "linear-targeting", "predictive-aiming", "classic-robocode", "tank-royale",
        "intermediate" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Linear Targeting (classic Robocode) https://robowiki.net/wiki/Linear_Targeting"
]
---

# Linear Targeting

> [!TIP] Origins
> **Linear Targeting** is a foundational technique documented by the RoboWiki community as the classic first step beyond
> head-on targeting.

Linear targeting is the classic “next step” after head-on targeting.
Instead of firing at the enemy’s last scanned position, it predicts an intercept point by assuming the enemy keeps
moving in a straight line at constant velocity.

This assumption is often wrong (bots turn and change speed), but even an imperfect prediction can greatly improve hit
rate against bots that strafe steadily.

## Key idea: meet the enemy where the bullet will be

A fired bullet travels at (roughly) constant speed.
If the enemy also keeps a constant velocity vector, the problem becomes:

- A bullet starts at the bot’s position now.
- The enemy starts at the last scanned position now.
- Find the time `t` where bullet distance traveled equals enemy distance moved.

Then aim the gun at the predicted enemy position at time `t`.

> [!TIP] When to use it
> Linear targeting typically performs well against “circle strafers” and other bots that keep a steady heading for many
> turns.

## What information is needed?

At fire time, these values are needed:

- The bot’s position: `(myX, myY)`.
- The enemy’s current estimate: `(enemyX, enemyY)`.
- The enemy’s velocity components: `(enemyVx, enemyVy)`.
- Bullet speed `bulletSpeed` based on chosen firepower.

Enemy velocity is normally derived from the scan event:

- **Classic Robocode:** scans provide enemy heading + speed, so velocity components can be computed.
- **Robocode Tank Royale:** scans provide enemy `speed` and `direction` as well, but angle conventions differ.

## Intercept math (constant-velocity prediction)

Let:

- `dx = enemyX - myX`, `dy = enemyY - myY` (relative position).
- `vx = enemyVx`, `vy = enemyVy` (enemy velocity).
- `s = bulletSpeed`.
- `t` = time until impact (in turns).

At time `t`, the enemy would be at:

- `predX = enemyX + vx * t`
- `predY = enemyY + vy * t`

The bullet must travel the distance from the bot to `(predX, predY)` in the same time `t`:

- `distance(my, pred) = s * t`

Square both sides (to avoid square roots) and substitute:

$(dx + v_x t)^2 + (dy + v_y t)^2 = (s \times t)^2$

This is a quadratic equation $a \times t^2 + b \times t + c = 0$ with:

$a = vx^2 + vy^2 - s^2$
$b = 2 \times (dx \times vx + dy \times vy)$
$c = dx^2 + dy^2$

Solve for `t` and pick the **smallest positive** solution.
If there is no positive solution, it means “with this bullet speed, a straight-line intercept is not possible” (the
enemy is effectively moving away too fast in the assumed direction).

> [!NOTE] Bullet speed
> In classic Robocode, bullet speed is `20 - 3×power`.
> (See [Bullet Travel & Bullet Physics](../../physics/bullet-physics.md).)

<img src="../../images/linear-targeting.svg" alt="Top-down diagram showing a blue shooter bot firing a yellow bullet at the predicted intercept point on an orange enemy bot's curved trajectory" width="500"/><br>
*Diagram: Circular targeting predicts the enemy's linear path and aims at the intercept point where the bullet meets the
enemy.*

## Minimal pseudocode

This is platform-agnostic and focuses on the linear targeting idea.
It assumes the coordinate system is consistent and that a helper exists to compute “heading to point”.

```text
# Inputs at fire time:
myX, myY
enemyX, enemyY
enemyVx, enemyVy
bulletSpeed

# Relative position
dx = enemyX - myX
dy = enemyY - myY

# Quadratic coefficients
a = enemyVx*enemyVx + enemyVy*enemyVy - bulletSpeed*bulletSpeed
b = 2 * (dx*enemyVx + dy*enemyVy)
c = dx*dx + dy*dy

# Solve a*t^2 + b*t + c = 0
if abs(a) < tiny:
    # Degenerate: treat as linear b*t + c = 0
    t = -c / b
else:
    disc = b*b - 4*a*c
    if disc < 0:
        t = null
    else:
        t1 = (-b - sqrt(disc)) / (2*a)
        t2 = (-b + sqrt(disc)) / (2*a)
        t = smallestPositive(t1, t2)

if t is null:
    aimPoint = (enemyX, enemyY)  # fallback: head-on
else:
    aimPoint = (enemyX + enemyVx*t, enemyY + enemyVy*t)

gunHeading = headingTo(myX, myY, aimPoint.x, aimPoint.y)
turnGunShortest(gunHeading)
fire()
```

## Platform notes (classic vs. Tank Royale)

The math above is the same, but *inputs* differ.

- **Angles and trig:**
    - Classic Robocode uses 0° = North and angles increase clockwise.
    - Tank Royale uses 0° = East and angles increase counterclockwise.
      Use the correct conversion helpers for the platform.
      See [Coordinate Systems & Angles](../../physics/coordinates-and-angles.md).

- **Deriving `(enemyVx, enemyVy)`:**
    - Classic Robocode: `enemyVx = sin(enemyHeading) * enemySpeed`, `enemyVy = cos(enemyHeading) * enemySpeed` using the
      same “sin is X / cos is Y” convention as other classic Robocode coordinate math.
    - Tank Royale: velocity components are usually `enemyVx = cos(dir) * speed`, `enemyVy = sin(dir) * speed` because
      the
      axis/angle conventions are different.

- **Prediction outside the battlefield:** linear prediction can point outside the walls.
  Many bots clamp the aim point to a “safe rectangle” or fall back to head-on when the predicted point is invalid.

## Tips & common mistakes

- **Using stale scans:** prediction amplifies scan error.
  A radar that keeps the enemy continuously scanned gives much better results.

- **Picking the wrong quadratic root:** use the smallest positive `t`.
  A negative `t` means “the intercept would have happened in the past”.

- **Not handling the `a ≈ 0` case:** when enemy speed is close to bullet speed, floating point issues can explode.
  Special-case it as a linear equation.

- **Assuming linear targeting is “smart”:** good bots change heading and speed on purpose.
  Linear targeting still matters as a baseline, and it is often used as a virtual gun.

- **Forgetting unit limits:** enemy speed is capped (e.g., 8 units/turn in classic), but can still be large enough to
  make some intercept solutions impossible with low bullet speed.

## Further Reading

- [Linear Targeting](https://robowiki.net/wiki/Linear_Targeting) — RoboWiki (classic Robocode)
- [Linear Targeting/Buggy Implementations](https://robowiki.net/wiki/Linear_Targeting/Buggy_Implementations) —
  RoboWiki (classic Robocode)


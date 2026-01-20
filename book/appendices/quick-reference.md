---
title: "Quick Reference (Formulas)"
category: "Appendices"
summary: "Essential formulas, physics constants, and calculations for Robocode and Tank Royale bot development—a quick lookup for angles, velocities, bullet speeds, and targeting math."
tags: [ "reference", "formulas", "physics", "math", "quick-reference", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Robocode/Game Physics (classic Robocode) https://robowiki.net/wiki/Robocode/Game_Physics",
  "RoboWiki - Robocode/Scoring (classic Robocode) https://robowiki.net/wiki/Robocode/Scoring",
  "Robocode Tank Royale Docs - Game Rules https://robocode.dev/articles/game-rules.html",
  "Robocode Tank Royale Docs - Scoring https://robocode.dev/articles/scoring.html"
]
---

# Quick Reference (Formulas)

This page provides a quick lookup for essential formulas and constants used throughout bot development. For detailed
explanations, see the linked pages.

---

## Physics Constants

### Bot Dimensions

Both games render the bot as a **36×36 unit square** visually, centered at the bot's position.

**Collision hitbox:**

- **Classic Robocode:** Axis-aligned 36×36 square (does **not** rotate with bot heading)
    - Diagonal: ~50.9 units
- **Tank Royale:** Circle with radius 18 units (diameter 36; always circular)

### Movement Limits

Both Classic Robocode and Tank Royale use **identical movement physics**:

| Property                        | Value | Units        |
|---------------------------------|-------|--------------|
| Max velocity ($v_{\text{max}}$) | 8     | units/turn   |
| Max acceleration                | 1     | units/turn²  |
| Max deceleration                | 2     | units/turn²  |
| Max turn rate (at rest)         | 10    | degrees/turn |
| Max turn rate (at max speed)    | 4     | degrees/turn |

> [!NOTE] Linear velocity has acceleration/deceleration limits, but **rotation (body, gun, radar) has no
> acceleration/deceleration**—turn rate changes instantly up to the maximum limit.

**Notation:**

- $v$: current speed (units/turn)
- $v_{\text{max}}$: maximum speed ($=8$ units/turn)
- $v_{\text{rest}}$: rest ($=0$ units/turn)

**Turn rate formula:**

$\text{turnRate} = 10 - \frac{3}{4} \times |v|$

$\text{maxTurnRate}_{\text{max}} = 10 - \frac{3}{4} \times |v_{\text{max}}| = 10 - \frac{3}{4} \times 8 = 10 - 6 = 4^\circ$

$\text{maxTurnRate}_{\text{rest}} = 10 - \frac{3}{4} \times |v_{\text{rest}}| = 10 - \frac{3}{4} \times 0 = 10 - 0 = 10^\circ$

### Rotation Limits

| Component               | Max Rate | Units        |
|-------------------------|----------|--------------|
| Body                    | 10°      | degrees/turn |
| Gun (relative to body)  | 20°      | degrees/turn |
| Radar (relative to gun) | 45°      | degrees/turn |

**Maximum combined rates:**

- Gun relative to battlefield: **30°/turn** (body 10° + gun 20°)
- Radar relative to battlefield: **75°/turn** (body 10° + gun 20° + radar 45°)

---

## Bullet Physics

### Bullet Speed

$\text{bulletSpeed} = 20 - 3 \times \text{bulletPower}$

| Power | Speed | Units/turn |
|-------|-------|------------|
| 0.1   | 19.7  | units/turn |
| 1.0   | 17.0  | units/turn |
| 2.0   | 14.0  | units/turn |
| 3.0   | 11.0  | units/turn |

### Bullet Damage

$\text{damage} = \begin{cases} 4 \times \text{bulletPower} & \text{if } \text{bulletPower} \leq 1 \\ 4 \times \text{bulletPower} + 2 \times (\text{bulletPower} - 1) & \text{if } \text{bulletPower} > 1 \end{cases}$

| Power | Damage | Bonus | Total |
|-------|--------|-------|-------|
| 0.1   | 0.4    | 0     | 0.4   |
| 1.0   | 4.0    | 0     | 4.0   |
| 2.0   | 8.0    | 2.0   | 10.0  |
| 3.0   | 12.0   | 4.0   | 16.0  |

### Gun Heat

$\text{gunHeat} = 1 + \frac{\text{bulletPower}}{5}$

$\text{coolingRate} = 0.1 \text{ per turn}$

| Power | Heat | Cool Time |
|-------|------|-----------|
| 0.1   | 1.02 | 11 turns  |
| 1.0   | 1.20 | 12 turns  |
| 2.0   | 1.40 | 14 turns  |
| 3.0   | 1.60 | 16 turns  |

---

## Angle & Distance Calculations

### Coordinate Systems

**Classic Robocode:**

- Origin: bottom-left (0, 0)
- Heading 0°: **North** (up)
- Angles: clockwise from north

**Tank Royale:**

- Origin: bottom-left (0, 0)
- Heading 0°: **East** (right)
- Angles: counterclockwise from east

### Absolute Bearing

Angle from your position to a target:

```
dx = target.x - my.x
dy = target.y - my.y
absoluteBearing = atan2(dx, dy)  // Classic: atan2(x, y)
absoluteBearing = atan2(dy, dx)  // Tank Royale: atan2(y, x)
```

### Relative Bearing

Angle from your heading to a target:

$\text{relativeBearing} = \text{absoluteBearing} - \text{myHeading}$

$\text{relativeBearing} = \text{normalizeAngle}(\text{relativeBearing})$ (wrap to $[-180°, +180°]$)

### Distance

$\text{distance} = \sqrt{(\text{target.x} - \text{my.x})^2 + (\text{target.y} - \text{my.y})^2}$

### Normalize Angle to [-180°, +180°]

$\text{while } \text{angle} > 180°: \quad \text{angle} \mathrel{-}= 360°$

$\text{while } \text{angle} < -180°: \quad \text{angle} \mathrel{+}= 360°$

---

## Targeting Formulas

### Head-On Targeting

Aim directly at the current enemy position:

$\text{gunTurnRequired} = \text{normalizeAngle}(\text{absoluteBearing} - \text{gunHeading})$

### Linear Targeting

Predict enemy position assuming constant velocity:

```
// Solve for bullet flight time (iterative)
bulletSpeed = 20 - 3 * bulletPower
time = distance / bulletSpeed  // Initial guess

for iteration in 1..5:
  futureX = enemy.x + enemy.velocityX * time
  futureY = enemy.y + enemy.velocityY * time
  distance = sqrt((futureX - my.x)² + (futureY - my.y)²)
  time = distance / bulletSpeed

aimAngle = atan2(futureX - my.x, futureY - my.y)
```

### Circular Targeting

Predict enemy position assuming a constant turn rate:

```
// Estimate angular velocity
angleToEnemy = atan2(enemy.x - my.x, enemy.y - my.y)
lateralVelocity = enemy.velocity * sin(enemy.heading - angleToEnemy)
angularVelocity = lateralVelocity / distance

// Solve for time iteratively
bulletSpeed = 20 - 3 * bulletPower
time = distance / bulletSpeed

for iteration in 1..5:
  futureHeading = enemy.heading + angularVelocity * time
  futureX = enemy.x + enemy.velocity * sin(futureHeading) * time
  futureY = enemy.y + enemy.velocity * cos(futureHeading) * time
  distance = sqrt((futureX - my.x)² + (futureY - my.y)²)
  time = distance / bulletSpeed

aimAngle = atan2(futureX - my.x, futureY - my.y)
```

### GuessFactor Formula

$\text{lateralDirection} = \text{sign}(\text{lateralVelocity})$

$\text{maxEscapeAngle} = \arcsin\left(\frac{8}{\text{bulletSpeed}}\right)$

$\text{angleOffset} = \text{actualBearingAtHit} - \text{bearingAtFire}$

$\text{guessFactor} = \frac{\text{angleOffset}}{\text{maxEscapeAngle}}$

GuessFactor ranges from **-1.0** (maximum clockwise dodge) to **+1.0** (maximum counter-clockwise dodge).

---

## Movement Calculations

### Lateral Velocity

Velocity perpendicular to the enemy line of fire:

$\text{angleToEnemy} = \text{atan2}(\text{enemy.x} - \text{my.x}, \text{enemy.y} - \text{my.y})$

$\text{lateralVelocity} = \text{my.velocity} \times \sin(\text{my.heading} - \text{angleToEnemy})$

**Sign:**

- Positive: moving counter-clockwise (left) around an enemy
- Negative: moving clockwise (right) around an enemy

### Advancing Velocity

Velocity toward/away from enemy:

$\text{advancingVelocity} = \text{my.velocity} \times \cos(\text{my.heading} - \text{angleToEnemy})$

**Sign:**

- Positive: moving toward an enemy
- Negative: moving away from an enemy

### Orbital Movement

Maintain a constant distance while orbiting:

$\text{orbitAngle} = 90° \text{ (perpendicular to enemy)}$

$\text{orbitDirection} = +1 \text{ or } -1 \text{ (counter-clockwise or clockwise)}$

$\text{desiredHeading} = \text{angleToEnemy} + \text{orbitDirection} \times \text{orbitAngle}$

$\text{turnRequired} = \text{normalizeAngle}(\text{desiredHeading} - \text{my.heading})$

### Wall Distance

Minimum distance to any wall:

$\text{wallDistance} = \min(\text{my.x}, \text{my.y}, \text{fieldWidth} - \text{my.x}, \text{fieldHeight} - \text{my.y})$

### Wall Smoothing (Basic)

Adjust heading to avoid hitting walls. For each wall, calculate push force proportional to proximity:

$\text{margin} = 150 \text{ (safety margin in units)}$

$\text{adjustHeading} \mathrel{+}= \begin{cases} ({\text{margin} - \text{my.x}}) \times 0.1 & \text{if } \text{my.x} < \text{margin} \\ 0 & \text{otherwise} \end{cases}$

Similar calculations apply for the right wall, top wall, and bottom wall.

---

## Energy & Scoring

### Energy Bonuses

**Bullet hit:**

$\text{energyGained} = 3 \times \text{bulletPower}$

> [!NOTE]
> Neither Classic Robocode nor Tank Royale awards energy bonuses for killing enemies. Energy is only gained from bullet hits (3× bullet power). Kills award **scoring points** (see Damage Scoring below), not energy.

### Damage Scoring

**Bullet hit damage:**

$\text{score} \mathrel{+}= \text{damage}$

**Bullet kill bonus:**

When a bot kills an enemy with a bullet, it scores an additional bonus:

**Both Classic Robocode and Tank Royale:** 

$\text{bulletDamageBonus} = 20\% \text{ of all bullet damage dealt to that enemy}$

Or equivalently: $\text{bulletDamageBonus} = 0.20 \times \sum \text{bullet damage}$

**Ram damage:**

$\text{damage} = 0.6 \text{ per turn of contact}$

$\text{score} \mathrel{+}= 2 \times \text{ram damage}$

**Ram kill bonus:**

When a bot kills an enemy by ramming, it scores an additional bonus:

**Both Classic Robocode and Tank Royale:**

$\text{ramDamageBonus} = 30\% \text{ of all ram damage dealt to that enemy}$

Or equivalently: $\text{ramDamageBonus} = 0.30 \times \sum \text{ram damage}$

**Survival score:**

$\text{survivalScore} = 50 \times \text{number of bots that died while you survived}$

**Last survivor bonus:**

$\text{lastSurvivorBonus} = 10 \times \text{number of opponent bots}$

---

## Wave Calculations

### Max Escape Angle

Maximum angle the enemy can reach by moving perpendicular at full speed:

$\text{maxEscapeAngle} = \arcsin\left(\frac{8}{\text{bulletSpeed}}\right)$

| Bullet Power | Speed | Max Escape Angle |
|--------------|-------|------------------|
| 0.1          | 19.7  | ~24°             |
| 1.0          | 17.0  | ~28°             |
| 2.0          | 14.0  | ~35°             |
| 3.0          | 11.0  | ~47°             |

### Wave Intersection

Time until a wave intersects bot position:

$\text{distanceFromWaveOrigin} = \sqrt{(\text{my.x} - \text{wave.x})^2 + (\text{my.y} - \text{wave.y})^2}$

$\text{waveFront} = (\text{currentTime} - \text{wave.fireTime}) \times \text{wave.bulletSpeed}$

$\text{timeUntilHit} = \frac{\text{distanceFromWaveOrigin} - \text{waveFront}}{\text{wave.bulletSpeed}}$

If $\text{timeUntilHit} \leq 0$, wave has already passed.

---

## Turn Radius

Minimum turn radius at a given velocity:

$turnRate = 10 - \frac{3}{4} \times |velocity|$

$radius = \frac{|velocity|}{\sin(turnRate \times \frac{π}{180})}$

| Velocity | Turn Rate | Radius     |
|----------|-----------|------------|
| 0        | 10°       | 0          |
| 4        | 7°        | ~33 units  |
| 8        | 4°        | ~115 units |

---

## Common Trigonometry

**Radians ↔ Degrees:**

$\text{radians} = \text{degrees} \times \frac{\pi}{180}$

$\text{degrees} = \text{radians} \times \frac{180}{\pi}$

**Pythagorean theorem:**

$\text{hypotenuse} = \sqrt{a^2 + b^2}$

**Sine law:**

$\frac{\sin(A)}{a} = \frac{\sin(B)}{b} = \frac{\sin(C)}{c}$

**Small angle approximation** ($|\theta| < 15°$):

$\sin(\theta) \approx \theta$

$\cos(\theta) \approx 1$

$\tan(\theta) \approx \theta$

---

## Platform-Specific API Equivalents

| Classic Robocode         | Tank Royale           | Purpose                          |
|--------------------------|-----------------------|----------------------------------|
| `getX()`                 | `getX()`              | Bot X position                   |
| `getY()`                 | `getY()`              | Bot Y position                   |
| `getHeading()`           | `getDirection()`      | Body heading (note: 0° differs!) |
| `getGunHeading()`        | `getGunDirection()`   | Gun absolute heading             |
| `getRadarHeading()`      | `getRadarDirection()` | Radar absolute heading           |
| `getVelocity()`          | `getSpeed()`          | Current velocity                 |
| `getEnergy()`            | `getEnergy()`         | Current energy                   |
| `getBattleFieldWidth()`  | `getArenaWidth()`     | Arena width                      |
| `getBattleFieldHeight()` | `getArenaHeight()`    | Arena height                     |

---

## Further Reading

- [Coordinate Systems & Angles](../physics/coordinates-and-angles.md) — Detailed angle conventions
- [Movement Constraints & Bot Physics](../physics/movement-constraints.md) — Physics deep dive
- [Bullet Travel & Bullet Physics](../physics/bullet-physics.md) — Bullet mechanics
- [GuessFactor Targeting](../targeting/statistical-targeting/guessfactor-targeting.md) — GuessFactor formula explained
- [Wave Surfing Introduction](../movement/advanced-evasion/wave-surfing-introduction.md) — Wave math in action

---
title: "Anti-Gravity Movement"
category: "Movement & Evasion"
summary: "Anti-gravity movement uses repulsive force fields to maintain optimal positioning relative to enemies, walls, and battlefield features. This strategic movement approach excels in melee combat and provides flexible, dynamic positioning in one-on-one battles."
tags: [ "anti-gravity-movement", "movement", "strategic-movement", "melee", "advanced", "robocode", "tank-royale" ]
difficulty: "advanced"
source: [
  "RoboWiki - Anti-Gravity Movement (classic Robocode) https://robowiki.net/wiki/Anti-Gravity_Movement",
  "Robocode Tank Royale Docs - API Reference https://robocode.dev/api/"
]
---

# Anti-Gravity Movement

> [!TIP] Origins
> **Anti-Gravity Movement** was developed and documented by the RoboWiki community, with significant contributions from
> melee bot developers seeking dynamic positioning strategies.

Antigravity movement treats battlefield entities—enemies, walls, bullets, and even teammates—as gravitational sources
that exert repulsive (or attractive) forces on the bot. By calculating the combined effect of all forces and moving in
the resultant direction, the bot achieves smooth, adaptive positioning that responds naturally to changing battlefield
conditions.

This technique excels in melee combat where maintaining optimal distance from multiple enemies is crucial. It also
provides flexible positioning in one-on-one battles and serves as a foundation for more sophisticated movement systems.

## The Core Concept

Antigravity movement models each battlefield entity as exerting a force on the bot. The size and direction of each force
depends on:

- **Distance**: Closer entities exert stronger forces (typically inverse square law: $force = strength / distance^2$)
- **Type**: Enemies repel, corners attract (for corner movement), bullets create shadows
- **Strength**: Different entity types have different force multipliers (the `strength` constant)

The bot sums all force vectors to get a resultant force, then moves in the direction that minimizes or maximizes this
force (depending on whether forces are repulsive or attractive).

<img src="../../images/anti-gravity-force-vectors.svg" alt="Multiple enemies exert repulsive forces on the bot, creating a resultant force vector away from crowded areas" width="800"><br>
*Multiple enemies exert repulsive forces on the bot, creating a resultant force vector away from crowded areas*

## Why Anti-Gravity Works

Traditional movement strategies often use discrete decisions: "move toward this point" or "orbit at this radius."

Antigravity provides several advantages:

- **Smooth adaptation**: Forces naturally blend, creating fluid movement without abrupt direction changes.

- **Multi-target awareness**: In melee, the bot automatically positions itself away from clusters of enemies without
  explicit logic for each opponent.

- **Tunable behavior**: Adjusting force strengths and distance calculations changes movement characteristics without
  rewriting algorithms.

- **Foundation for hybrid systems**: Antigravity can combine with other techniques like wave surfing or distancing by
  adding their goals as additional force sources.

Against simple targeting, antigravity provides evasion through constant motion. Against statistical targeting, the
smooth, adaptive nature makes patterns harder to predict than fixed orbits or oscillations.

## Basic Implementation

### Force Calculation

The fundamental calculation for each entity:

```pseudocode
function calculateForce(entity):
  dx = myX - entity.x
  dy = myY - entity.y
  distance = sqrt(dx² + dy²)
  
  if distance < minDistance:
    distance = minDistance  // Prevent division by zero
  
  // Inverse square law: force decreases with distance
  forceMagnitude = strength / distance²
  
  // Force components along x and y axes
  forceX = forceMagnitude * (dx / distance)
  forceY = forceMagnitude * (dy / distance)
  
  return (forceX, forceY)
```

Where `strength` is a tunable constant that determines how strongly the entity repels (positive) or attracts (negative).

### Summing All Forces

```pseudocode
function calculateTotalForce():
  totalForceX = 0
  totalForceY = 0
  
  // Add enemy repulsions
  for each enemy:
    (fx, fy) = calculateForce(enemy)
    totalForceX += fx * enemyStrength
    totalForceY += fy * enemyStrength
  
  // Add wall repulsions
  totalForceX += calculateWallForce(x direction)
  totalForceY += calculateWallForce(y direction)
  
  return (totalForceX, totalForceY)
```

### Converting Force to Movement

```pseudocode
on turn:
  (forceX, forceY) = calculateTotalForce()
  
  // Calculate angle to move (angle away from combined forces)
  targetAngle = atan2(forceY, forceX)
  
  // Convert to heading
  angleToTurn = normalizeAngle(targetAngle - myHeading)
  
  // Move in that direction
  setTurnRight(angleToTurn)
  setAhead(100)  // Full speed
```

## Tutorial: Building a Basic Anti-Gravity Bot

Let's build a simple antigravity movement system step by step.

### Step 1: Enemy Force Calculation

Start with basic enemy repulsion:

```pseudocode
class AntiGravityBot:
  enemyStrength = 50000  // Tune this value
  
  function getEnemyForce():
    forceX = 0
    forceY = 0
    
    for each scannedEnemy:
      dx = myX - enemy.x
      dy = myY - enemy.y
      distance = max(1, sqrt(dx² + dy²))  // Avoid zero division
      
      force = enemyStrength / distance²
      
      forceX += force * (dx / distance)
      forceY += force * (dy / distance)
    
    return (forceX, forceY)
```

### Step 2: Wall Avoidance

Add wall repulsion to keep the bot from corners:

```pseudocode
  wallStrength = 20000
  
  function getWallForce():
    forceX = 0
    forceY = 0
    
    // Distance to each wall
    distanceToLeft = myX
    distanceToRight = battlefieldWidth - myX
    distanceToBottom = myY
    distanceToTop = battlefieldHeight - myY
    
    // Repel from each wall
    forceX += wallStrength / distanceToLeft²
    forceX -= wallStrength / distanceToRight²
    forceY += wallStrength / distanceToBottom²
    forceY -= wallStrength / distanceToTop²
    
    return (forceX, forceY)
```

### Step 3: Movement Execution

Combine forces and move:

```pseudocode
  on turn:
    (enemyFX, enemyFY) = getEnemyForce()
    (wallFX, wallFY) = getWallForce()
    
    totalForceX = enemyFX + wallFX
    totalForceY = enemyFY + wallFY
    
    // Calculate movement angle
    targetAngle = atan2(totalForceY, totalForceX)
    angleToTurn = normalizeAngle(targetAngle - myHeading)
    
    setTurnRight(angleToTurn)
    setAhead(100)
```

### Step 4: Tuning Force Strengths

The effectiveness depends heavily on tuning:

- **Enemy strength**: Higher values = stay farther from enemies
- **Wall strength**: Higher values = stay farther from walls
- **Ratio between them**: Determines priority (avoid enemies vs. avoid walls)

Start with enemy strength around 50,000 and wall strength around 20,000, then adjust based on battlefield size and
combat style.

<img src="../../images/anti-gravity-movement-pattern.svg" alt="Antigravity movement creates smooth, adaptive paths that maintain distance from multiple threats" width="800"><br>
*Antigravity movement creates smooth, adaptive paths that maintain distance from multiple threats*

## Advanced Variations

### Distance-Dependent Forces

Instead of pure inverse square, use different force laws for different ranges:

```pseudocode
function calculateForce(entity, distance):
  if distance < closeRange:
    // Very strong repulsion when too close
    return strongStrength / distance²
  else if distance > farRange:
    // Weak or no force when far away
    return 0
  else:
    // Normal inverse square in medium range
    return normalStrength / distance²
```

### Enemy Energy Weighting

Adjust forces based on enemy threat level:

```pseudocode
function getEnemyForce():
  for each enemy:
    // More dangerous enemies exert stronger forces
    threatMultiplier = enemy.energy / 100.0
    
    force = (enemyStrength * threatMultiplier) / distance²
    // ... calculate force components
```

### Attractive Forces

Corner movement can be implemented by making corners attractive:

```pseudocode
function getCornerAttraction():
  corners = [(0, 0), (battleWidth, 0), (0, battleHeight), (battleWidth, battleHeight)]
  
  bestCorner = findNearestSafeCorner(corners)
  
  dx = bestCorner.x - myX
  dy = bestCorner.y - myY
  distance = sqrt(dx² + dy²)
  
  // Negative force = attraction
  force = -cornerStrength / distance²
  
  return (force * dx/distance, force * dy/distance)
```

### Bullet Shadows

Create repulsion from predicted bullet positions:

```pseudocode
function getBulletForce():
  for each trackedBullet:
    // Project bullet forward
    predictedX = bullet.x + bullet.velocityX * 5
    predictedY = bullet.y + bullet.velocityY * 5
    
    // Treat as temporary repulsive source
    (fx, fy) = calculateForce(predicted position)
    // ... add to total force
```

## Tuning and Optimization

### Finding the Right Constants

Start with these baseline values:

- Enemy strength: 50,000
- Wall strength: 20,000
- Minimum distance (to prevent divide by zero): 1

Then adjust:

1. **Too close to enemies**: Increase enemy strength or change distance exponent
2. **Hitting walls**: Increase wall strength or add a minimum wall distance threshold
3. **Too passive**: Decrease forces or add attractive forces toward optimal positions
4. **Jittery movement**: Smooth force calculations over multiple turns or add momentum

### Performance Considerations

Antigravity requires calculating forces for all entities at every turn:

- **Computational cost**: $O(n)$ where $n$ is the number of entities
- **Optimization**: Only calculate forces for entities within a certain range
- **Caching**: Store battlefield boundaries once rather than recalculating
- **Update frequency**: In melee, calculate every turn; in 1v1, can update less frequently

## Platform Notes

Antigravity movement works identically in classic Robocode and Tank Royale. Both platforms provide:

- Bot position tracking via scan events
- Battlefield dimension queries
- Trigonometric functions for angle calculations

The main difference is coordinate systems: classic Robocode uses north-up (0° = north), while Tank Royale uses
east-right (0° = east). Adjust angle calculations accordingly when porting code.

## Common Mistakes

**Divide by zero errors**: Always set a minimum distance threshold when calculating forces. Even a tiny distance like
1 unit prevents infinite forces.

**Inconsistent coordinates**: Ensure all force calculations use the same coordinate system. Mixing up enemy absolute
positions with relative bearings causes erratic movement.

**Ignoring walls until too late**: Wall forces should ramp up smoothly as the bot approaches boundaries, not suddenly
activate when already too close to turn safely.

**Over-tuning for one scenario**: Constants that work perfectly on a 1000×1000 battlefield may fail on different sizes.
Scale force strengths proportionally to battlefield dimensions.

**Static force values**: Against adaptive opponents, varying force strengths or adding randomization prevents
predictable patterns.

## When to Use Anti-Gravity

**Ideal for:**

- **Melee combat**: Natural multi-target awareness and spacing
- **Dynamic positioning**: Situations requiring smooth adaptation to changing conditions
- **Learning platforms**: Simple to implement, easy to visualize and tune
- **Hybrid systems**: As a base layer combined with wave surfing or statistical analysis

**Less effective for:**

- **Precision positioning**: Fixed radius orbits or specific angles are better with geometric movement
- **Wave surfing integration**: Requires careful integration to avoid conflicting with danger calculations
- **Bullet dodging**: React to actual bullet positions rather than forces for better accuracy

Antigravity shines when you need fluid, multifactor positioning without complex decision trees. It's a powerful
foundation that many advanced bots build upon.

## Further Reading

- [Anti-Gravity Movement](https://robowiki.net/wiki/Anti-Gravity_Movement) — RoboWiki (classic Robocode)
- [Minimum Risk Movement](https://robowiki.net/wiki/Minimum_Risk_Movement) — RoboWiki (classic Robocode)
- [Movement](https://robowiki.net/wiki/Movement) — RoboWiki (classic Robocode)
- [Tank Royale API - Bot Interface](https://robocode.dev/api/) — Tank Royale documentation

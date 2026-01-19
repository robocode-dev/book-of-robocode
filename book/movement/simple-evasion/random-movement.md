---
title: "Random Movement"
category: "Movement & Evasion"
summary: "Random movement uses unpredictable changes in speed and direction to make targeting difficult. While simple to implement, it forms the foundation of many advanced evasion strategies."
tags: [ "random-movement", "movement", "simple-evasion", "evasion", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Random Movement (classic Robocode) https://robowiki.net/wiki/Random_Movement",
  "Robocode Tank Royale Docs - API Reference https://robocode.dev/api/"
]
---

# Random Movement

> [!TIP] Origins
> **Random Movement** strategies were developed and documented by the RoboWiki community as foundational evasion
> techniques.

Random movement is an evasion strategy that uses unpredictable changes in speed and direction to make the bot harder to
target. By introducing randomness into movement decisions, the bot avoids falling into predictable patterns that simple
or statistical targeting systems can exploit.

While random movement may seem primitive compared to more sophisticated techniques like wave surfing, it remains highly
effective against many targeting strategies and serves as the foundation for more advanced movement systems.

## Why Randomness Works

Targeting systems aim to predict where a bot will be when a bullet arrives. Most targeting methods rely on
patterns—constant velocity, consistent turn rates, or predictable oscillations. Random movement breaks these patterns by
ensuring that future positions cannot be reliably predicted from past behavior.

Against **head-on targeting**, random movement provides minimal benefit since head-on aims at the current position.
Against **linear targeting**, random changes in velocity and heading make predictions fail. Against **statistical
targeting** (including GuessFactor), randomness prevents the targeting system from finding reliable patterns to exploit.

The effectiveness of a random movement depends on how unpredictable it truly is. Poor randomization or accidental
patterns can still be exploited by adaptive targeting systems.

## Basic Implementation Strategies

### Random Velocity Changes

The simplest form of random movement varies the bot's speed unpredictably:

```pseudocode
on turn:
  if random() < 0.1:  // 10% chance each turn
    targetVelocity = random(-8, 8)
    setAhead(targetVelocity * 100)
```

This approach creates irregular acceleration and deceleration, making travel time predictions difficult. However, it
doesn't address directional predictability.

### Random Direction Changes

Adding random turns creates more complex movement patterns:

```pseudocode
on turn:
  if random() < 0.15:  // 15% chance each turn
    targetVelocity = random(-8, 8)
    setAhead(targetVelocity * 100)
    
  if random() < 0.1:  // 10% chance each turn
    turnDirection = random(-1, 1)
    setTurnRight(turnDirection * 90)
```

Changing both speed and direction simultaneously creates more unpredictability than either alone. The probabilities can
be tuned based on battlefield size and opponent behavior.

### Random Wall Avoidance

Random movement must still avoid walls. A simple approach combines random decisions with boundary checking:

```pseudocode
on turn:
  // Check if approaching walls
  if distanceToNearestWall < 100:
    turnAwayFromWall()
  else:
    performRandomMovement()
```

More sophisticated implementations use wall smoothing to maintain randomness while preventing collisions.

<img src="../../images/random-movement-pattern.svg" alt="A bot using random movement creates an unpredictable zigzag pattern compared to linear movement" width="800"><br>
*A bot using random movement creates an unpredictable zigzag pattern compared to linear movement*

## Variations and Enhancements

### Probability-Based Randomness

Instead of completely random decisions, use weighted probabilities:

```pseudocode
on turn:
  roll = random(0, 1)
  
  if roll < 0.5:
    maintainSpeed()       // 50% stay same
  elif roll < 0.8:
    changeSpeedSlightly() // 30% minor change
  else:
    reverseDirection()    // 20% major change
```

This creates smoother movement while maintaining unpredictability.

### Contextual Randomness

Better random movement adapts to the situation:

```pseudocode
on turn:
  if enemyFiring:
    increaseRandomnessLevel()
  
  if lowEnergy:
    favorDefensivePositions()
  
  performRandomMovement(randomnessLevel)
```

Increasing randomness when the enemy fires helps dodge bullets. Reducing randomness when energy is low conserves
resources while maintaining some unpredictability.

### Random Orbiting

Combining random movement with orbiting (moving perpendicular to the enemy) creates effective evasion:

```pseudocode
on turn:
  angleToEnemy = calculateBearingToEnemy()
  orbitAngle = angleToEnemy + 90  // Perpendicular
  
  // Add random variation
  orbitAngle += random(-30, 30)
  
  setTurnRight(normalizeAngle(orbitAngle - heading))
  setAhead(8)
```

This maintains strategic positioning while being unpredictable.

## Common Pitfalls

### Insufficient Randomness

Using predictable random number patterns or limited variation reduces effectiveness. Ensure your random number generator
produces quality randomness and uses sufficient variation ranges.

### Ignoring Walls

Random movement that doesn't account for walls leads to frequent collisions, losing energy and becoming temporarily
predictable. Always combine random movement with wall avoidance.

### Forgetting Radar and Gun

Focusing only on movement can leave radar and gun with poor tracking. Ensure movement decisions don't prevent effective
scanning and targeting.

### Too Much Randomness

Completely chaotic movement can work against you—placing you in poor positions, causing unnecessary energy loss, or
moving toward danger. Some structure improves overall performance.

## Platform Differences

Both classic Robocode and Tank Royale support random movement with similar APIs:

**Classic Robocode:**

```java
setTurnRight(Math.random() *180-90);

setAhead(Math.random() *200-100);
```

**Tank Royale (Java):**

```java
setTurnRight(Math.random() *180-90);

setForward(Math.random() *200-100);
```

The physics and movement rules are identical, so random movement strategies transfer directly between platforms.

## When to Use Random Movement

Random movement is effective against:

- **Simple targeting** (head-on, linear, circular)
- **Weak statistical targeting** without enough data
- **New opponents** where you have no information about their targeting
- **Melee battles** where predictability is dangerous

It's less effective against:

- **Advanced statistical targeting** with anti-random techniques
- **Pattern matchers** designed to handle randomness
- **Precise prediction** that reads ahead many ticks

Random movement works best as part of a larger strategy—use it as a baseline, combine it with other techniques, or
switch to it when other movements fail.

## Tips for Success

**Start simple:** Begin with basic random velocity/direction changes. Add complexity only when needed.

**Test against variety:** Random movement performs differently against different opponents. Test against both simple and
advanced bots.

**Combine with other strategies:** Use random movement as a fallback or mix it with distancing, wall smoothing, and
targeting evasion.

**Measure randomness:** Track how predictable your movement actually is. If you notice patterns forming, increase
variation.

**Watch energy:** Random movement can waste energy through unnecessary turns and reversals. Balance unpredictability
with efficiency.

Random movement proves that sometimes the best defense is simply being impossible to predict—no complex calculations
required.

## Further Reading

- [Random Movement](https://robowiki.net/wiki/Random_Movement) — RoboWiki (classic Robocode)


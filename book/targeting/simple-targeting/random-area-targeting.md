---
title: "Random & Area Targeting"
category: "Targeting Systems"
summary: "Two unpredictable aiming strategies: Random Targeting fires at random angles within a range, while Area Targeting fires at predicted movement zones. Useful when enemies are hard to predict or as baseline defensive tactics."
tags: [ "targeting", "simple-targeting", "random-targeting", "area-targeting", "unpredictable-aiming", "robocode", "tank-royale", "intermediate" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Area Targeting (classic Robocode) https://robowiki.net/wiki/Area_Targeting",
  "RoboWiki - Random Movement (classic Robocode) https://robowiki.net/wiki/Random_Movement"
]
---

# Random & Area Targeting

**Random Targeting** and **Area Targeting** are two simple strategies for firing when an enemy is unpredictable or when
more advanced targeting methods fail.
Neither assumes the enemy moves in a predictable straight line—instead, they cover a zone or scatter shots
probabilistically.

These approaches are sometimes overlooked as "too simple," but they serve important roles: as defensive mechanisms
against adaptive enemies, as fallback aiming when no clear pattern exists, and as baseline comparisons for evaluating
smarter guns.

## Random Targeting: The Scatter Gun Approach

**Random Targeting** fires bullets in random directions within a spread cone or angular range.
The idea is simple: if the enemy is unpredictable, spread bullets across possible positions.

### When does it work?

Random targeting tends to help when:

- The enemy **dodges unpredictably** (or uses random movement itself).
- The bot **lacks radar lock** on the enemy or loses track frequently.
- The bot is **in melee** and needs to throw multiple shots to hit someone among many bots.
- The bot is a **learning or testing bot** that doesn't yet have targeting logic.

It tends to fail when:

- The enemy moves in a **clear, predictable pattern** (linear, circular, or wave surfing).
- The bot has **limited firepower** and wastes shots.
- The gun **overheats** from rapid, inefficient firing.

### How it works

At fire time, pick a random angle offset from a reference direction (e.g., the enemy's last bearing or gun's current
heading) and fire.

```text
# Simple Random Targeting

referenceAngle = absoluteBearingToEnemy()  # or gun's current heading

# Spread within ±spread degrees
randomOffset = random(-spread, spread)
fireAngle = referenceAngle + randomOffset

setGunHeading(fireAngle)
fire()
```

For tighter spreads, confine offsets to a narrow range (e.g., ±10°).
For wider spreads, allow offsets up to ±30° or more.

### Key tuning parameter: spread angle

The **spread angle** controls how wide the scatter is:

- **±5°:** Tight cluster; assumes the enemy is roughly in one direction but slightly dodging.
- **±15°:** Moderate spread; covers movement to left/right within a sector.
- **±45°:** Very wide scatter; covers most directions and relies on hitting by chance.

## Area Targeting: The Zone Spray

**Area Targeting** fires at a **predicted region** where the enemy might be, based on its last known position and
assumed movement range.
Instead of firing at a single intercept point (as in Linear or Circular targeting), the bot fires multiple shots or a
spray pattern to cover an area.

### When does it work?

Area targeting helps when:

- The enemy's **next position is uncertain** but confined to a zone (e.g., the enemy will move within 150 units of its
  last position).
- The bot **expects perpendicular movement** but doesn't know the exact speed or direction.
- Multiple shots are fired; at least one is likely to hit a region.

### How it works

Define a bounding box or circular zone around the enemy's predicted position, then fire shots scattered across that
zone:

```text
# Area Targeting: Fire a spray pattern

enemyX, enemyY = lastScannedPosition
maxMovement = maxEnemySpeed * turnsSinceLastScan + bufferZone

# Define a box or circle of likely positions
zoneX = enemyX ± maxMovement
zoneY = enemyY ± maxMovement

# Fire multiple shots across the zone
for shot in 1 to numShots:
    randomPointX = random(zoneX - maxMovement, zoneX + maxMovement)
    randomPointY = random(zoneY - maxMovement, zoneY + maxMovement)
    
    fireAngle = headingTo(myX, myY, randomPointX, randomPointY)
    setGunHeading(fireAngle)
    fire()
```

### Parameters: zone size and shot count

Two parameters control effectiveness:

1. **Zone size:** How far the enemy might have moved since the last scan.
    - Smaller zones assume the enemy hasn't moved far (recent scan, slow enemy).
    - Larger zones hedge against long delays or fast enemies.
    - Formula: `maxDistance = lastKnownEnemySpeed * turnsSinceLastScan + safetyBuffer`

2. **Number of shots:** More shots increase hit probability but consume energy.
    - Single shot at the enemy's last position (inefficient).
    - 2–5 shots in a burst (moderate cost, reasonable hit rate).
    - 10+ shots (heavy spray; rarely practical due to cooling delays).

## Comparison: Random vs. Area Targeting

| Aspect                 | Random Targeting                        | Area Targeting                     |
|------------------------|-----------------------------------------|------------------------------------|
| **Aiming basis**       | Any reference direction + random offset | Predicted movement zone            |
| **Information needed** | Gun heading or enemy bearing            | Enemy position, speed, scan age    |
| **Shot pattern**       | Scattered around a direction            | Clustered around a zone            |
| **Best for**           | Melee chaos, quick fallback             | Direct engagement with uncertainty |
| **Energy cost**        | Low (few shots)                         | Higher (spray pattern)             |
| **Hit probability**    | Low unless enemy is close               | Moderate if zone estimate is good  |

## Platform notes

Both strategies are platform-agnostic and rely only on basic trigonometry (headings and angles).

- **Classic Robocode:** Convert enemy bearing + distance into coordinates, then use heading-to-point helpers.
- **Robocode Tank Royale:** Scans provide coordinates directly; use `calcHeadingTo(x, y)` for angle calculations.

See [Coordinates and Angles](../../physics/coordinates-and-angles.md) for platform-specific conventions.

## Tips & Common Mistakes

> [!TIP] Combine with radar
> If the radar loses the enemy, Random Targeting lets the gun still fire defensively.
> Pair it with a spinning radar to keep the gun cool while maintaining some offense.

> [!WARNING] Don't waste energy
> Random and Area Targeting consume bullets inefficiently. Use them as **fallbacks**, not primary tactics.
> A bot with Head-On or Linear Targeting as the default and Random Targeting only when targeting fails performs better
> than a bot that always uses Random.

> [!WARNING] Melee chaos
> In melee battles, Area Targeting around the enemy's zone can be effective, but prioritize enemies within a close
> distance to avoid spraying wildly.

> [!TIP] Hybrid approach
> A practical bot might:
> 1. Try Linear or Circular Targeting if the enemy seems to have a steady heading.
> 2. Fall back to Random Targeting if the enemy is erratic or radar lock is lost.
> 3. Use Area Targeting if multiple enemies are clustered in a zone.

## Illustration placeholder

<img src="../../images/random-area-targeting-patterns.svg" alt="Random and Area Targeting patterns compared: Random fires scattered shots around a reference direction, while Area Targeting fires a spray across a predicted movement zone." width="1000">
<br>
*Random and Area Targeting patterns compared: Random fires scattered shots around a reference direction, while Area Targeting fires a spray across a predicted movement zone.*

---

## Summary

- **Random Targeting** is a fallback when the enemy is unpredictable; scatter shots around a reference direction.
- **Area Targeting** fires at a zone where the enemy might be based on movement estimates.
- Both are simple to implement and useful in specific scenarios (chaos, lost locks, unpredictable foes).
- Use them as supplements to smarter tactics, not replacements.
- Combine with good radar and energy management for best results.


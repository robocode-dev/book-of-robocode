---
title: "Segmentation & Visit Count Stats"
category: "Targeting Systems"
summary: "Segmentation divides statistical data by enemy behavior patterns, dramatically improving targeting accuracy by recognizing that the same enemy acts differently in different situations."
tags: ["segmentation", "visit-count-stats", "statistical-targeting", "guessfactor", "advanced", "robocode", "tank-royale"]
difficulty: "advanced"
source: [
  "RoboWiki - Visit Count Stats (classic Robocode) https://robowiki.net/wiki/Visit_Count_Stats",
  "RoboWiki - GuessFactor Targeting (traditional) (classic Robocode) https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)",
  "Robocode Tank Royale Docs - API Reference https://robocode.dev/api/"
]
---

# Segmentation & Visit Count Stats

> [!TIP] Origins
> **Visit Count Stats** and **segmentation** techniques were refined by the RoboWiki community, with significant 
> contributions from **Patrick Cupka ("Voidious")** and **Julian Kent ("Skilgannon")** in their optimization of 
> statistical targeting systems.

Basic GuessFactor Targeting treats all enemy movements equally, recording every dodge attempt into a single array. This 
works well against bots with consistent behavior but fails when enemies adapt their movement based on distance, 
bullet power, or wall proximity.

**Segmentation** solves this by splitting statistical data into separate buffers based on battlefield conditions. 
Instead of one array tracking "how the enemy dodges," you maintain multiple arrays tracking "how the enemy dodges when 
close," "how the enemy dodges when far," "how the enemy dodges near walls," and so on.

This technique transforms mediocre statistical guns into top-tier targeting systems.

## Why Segmentation Matters

Imagine an enemy that:

- Moves randomly at close range (unpredictable)
- Uses Stop-and-Go at medium range (predictable timing)
- Oscillates predictably at long range (pattern-based)

Without segmentation, your stats mix all three behaviors. The close-range randomness pollutes your long-range
predictions, and vice versa. Your targeting accuracy suffers everywhere.

With distance segmentation, you maintain separate statistics for each range band. At long range, you see the clean 
oscillation pattern. At close range, you see the randomness and aim accordingly. Your hit rate improves dramatically.

## The Core Concept

> [!IMPORTANT] Track Per Enemy
> **Always maintain separate statistics for each enemy.** Store segmented data in a map keyed by enemy name:
> ```pseudocode
> enemyStats[enemyName][segment][guessfactor] += 1
> ```
> Mixing data from different enemies will severely degrade targeting accuracy. Each bot has unique movement patterns 
> that must be learned independently.

Instead of:

```pseudocode
allShots[guessfactor] += 1
```

You do:

```pseudocode
segment = calculateSegment(distance, lateralVelocity, advancingVelocity, bulletPower, ...)
segmentedStats[enemyName][segment][guessfactor] += 1
```

When firing, you query the specific segment for that enemy:

```pseudocode
currentSegment = calculateSegment(currentConditions)
bestGuessFactor = findPeak(segmentedStats[enemyName][currentSegment])
```

## Common Segmentation Axes

The most effective segmentation dimensions, roughly ordered by importance:

### 1. Distance

The single most impactful segmentation. Many bots behave differently at various ranges.

**Implementation:**
```pseudocode
distanceSegment = floor(distance / 200)  // Segments: 0-200, 200-400, 400-600, etc.
```

Typical range: 4–8 segments.

### 2. Lateral Velocity

How fast the enemy moves perpendicular to your line of fire.

**Implementation:**
```pseudocode
lateralVelocity = enemyVelocity * sin(enemyHeading - absoluteBearing)
lateralSegment = floor((lateralVelocity + 8) / 2)  // Maps -8 to +8 into segments
```

Typical range: 5–9 segments.

### 3. Advancing Velocity

How fast the enemy moves toward or away from you.

**Implementation:**
```pseudocode
advancingVelocity = enemyVelocity * cos(enemyHeading - absoluteBearing)
advancingSegment = floor((advancingVelocity + 8) / 2)
```

Typical range: 3–5 segments (often less important than lateral).

### 4. Bullet Power / Bullet Flight Time

Some enemies dodge differently against heavy bullets vs. light bullets.

**Implementation:**
```pseudocode
bulletFlightTime = distance / bulletSpeed
timeSegment = floor(bulletFlightTime / 10)  // Segments by 10-turn intervals
```

Typical range: 3–5 segments.

### 5. Wall Distance

Enemies near walls can't dodge as freely.

**Implementation:**
```pseudocode
wallDistance = min(
  enemy.x, 
  enemy.y, 
  fieldWidth - enemy.x, 
  fieldHeight - enemy.y
)
wallSegment = min(floor(wallDistance / 100), 3)  // Cap at 3 for "far from walls"
```

Typical range: 3–4 segments.

### 6. Time Since Direction Change

Tracks enemy acceleration patterns.

**Implementation:**
```pseudocode
timeSinceDirectionChange = currentTime - lastDirectionChangeTime
accelSegment = min(floor(timeSinceDirectionChange / 5), 4)
```

Typical range: 3–5 segments.

## Multi-Dimensional Segmentation

The real power comes from **combining** multiple axes:

```pseudocode
segmentIndex = 
  (distanceSegment * LATERAL_BINS * ADVANCING_BINS) +
  (lateralSegment * ADVANCING_BINS) +
  (advancingSegment)
```

This creates a multidimensional array. For example, 6 distance × 7 lateral × 3 advancing = 126 total segments.

> [!WARNING] The Curse of Dimensionality
> More segments = more precision, but also = more data sparsity. Each segment needs enough samples to be reliable. 
> Too many segments and you'll have empty buckets. Too few and you lose predictive power.

## Data Sparsity & Rolling Averages

With 100+ segments, some will rarely be visited. Solutions:

### 1. Decay Old Data

Weight recent shots more heavily by decaying **all** data before recording the new hit:

```pseudocode
// Decay all bins for this enemy across all segments
for each seg in allSegments:
  for each gf in allGuessFactors:
    stats[enemyName][seg][gf] *= 0.98

// Then record the new hit
stats[enemyName][currentSegment][hitGF] += 1
```

The decay factor (e.g., 0.98) controls how quickly old data is forgotten. Lower values (0.9–0.95) forget faster; higher 
values (0.98–0.995) retain historical data longer.

> [!TIP] Optimizing Decay
> Decaying every bin on every wave hit can be expensive with large datasets. Some implementations decay only when 
> recording hits or use a timestamp-based approach that calculates effective decay on-demand when reading data.

### 2. Use Fallback Segments

If the current segment has < N samples, fall back to a less-specific segmentation:

```pseudocode
if samples[enemyName][currentSegment] < 10:
  use onlyDistanceSegment  // Ignore lateral/advancing
if samples[enemyName][onlyDistanceSegment] < 5:
  use noSegmentation  // Use all data for this enemy
```

### 3. Kernel Density Estimation

Spread each hit across nearby GuessFactors (smoothing):

```pseudocode
for offset in [-2, -1, 0, 1, 2]:
  if inBounds(gf + offset):
    stats[enemyName][segment][gf + offset] += kernel[offset]  // e.g., [0.1, 0.2, 0.4, 0.2, 0.1]
```

## Finding the Peak

Once you have segmented stats, find the most-visited GuessFactor:

```pseudocode
bestGF = 0
maxVisits = 0
for gf in range(-bins, +bins):
  if stats[enemyName][segment][gf] > maxVisits:
    maxVisits = stats[enemyName][segment][gf]
    bestGF = gf
return bestGF
```

### Smoothing with Rolling Averages

For smoother targeting, instead of aiming at the single highest bin, **sum nearby bins** to reduce noise:

```pseudocode
bestGF = 0
bestSum = 0
for gf in range(-bins + 1, +bins - 1):  // Skip edges
  // Sum this bin and its neighbors
  sum = stats[enemyName][segment][gf - 1] +
        stats[enemyName][segment][gf] +
        stats[enemyName][segment][gf + 1]
  
  if sum > bestSum:
    bestSum = sum
    bestGF = gf

return bestGF
```

This helps when data is sparse—a single bin with 1 lucky hit won't outweigh a cluster of bins with consistent hits. 
The rolling average finds the **center of mass** of your data rather than a single outlier peak.

## Practical Tips

**Start simple:** Begin with distance-only segmentation. Verify it works before adding more dimensions.

**Log everything:** Save segment indices, hit rates per segment, and sample counts. Analyze offline to tune bin counts.

**Test against diverse opponents:** Segmentation helps most against adaptive enemies. If you only test against 
the same bot all the time, you won't achieve the benefits.

**Avoid over-segmentation:** 200+ segments often perform worse than 50–100 well-chosen segments due to data sparsity.

## Common Mistakes

- **Too many segments too soon:** Start with 20–50 total segments, not 500.
- **Forgetting to normalize:** When comparing segments with different sample counts, weight by confidence.
- **Ignoring zero-sample segments:** Always have a fallback strategy (less-specific segmentation or mean targeting).
- **Not decaying old data:** Enemies that change strategy mid-battle will fool static stats.

## Next Steps

Once you have effective segmentation:

- **[Dynamic Clustering](./dynamic-clustering.md)** — Replace fixed segments with adaptive similarity matching
- **[Anti-Surfer Targeting](../advanced-targeting/anti-surfer-targeting.md)** — Counter enemies who use Wave Surfing
- **[Virtual Guns](../simple-targeting/virtual-guns-mean-targeting.md)** — Run multiple segmented guns simultaneously

## Further Reading

- [Visit Count Stats](https://robowiki.net/wiki/Visit_Count_Stats) — RoboWiki (classic Robocode)
- [GuessFactor Targeting (traditional)](https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)) — RoboWiki (classic Robocode)
- [Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering) — RoboWiki (classic Robocode)
- [Symbolic Dynamic Segmentation](https://robowiki.net/wiki/Symbolic_Dynamic_Segmentation) — RoboWiki (classic Robocode)

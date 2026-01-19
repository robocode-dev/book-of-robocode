---
title: "GuessFactor Targeting"
category: "Targeting Systems"
summary: "Learn to build a statistical targeting system that tracks where enemies actually go and aims at their most common positions using wave-based data collection."
tags: [ "guessfactor-targeting", "statistical-targeting", "targeting", "waves", "advanced", "robocode", "tank-royale" ]
difficulty: "advanced"
source: [
  "RoboWiki - GuessFactor Targeting (traditional) (classic Robocode) https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)",
  "RoboWiki - Waves (classic Robocode) https://robowiki.net/wiki/Waves",
  "Robocode Tank Royale Docs - Bullet Physics https://robocode.dev/articles/physics.html"
]
---

# GuessFactor Targeting

> [!TIP] Origins
> **GuessFactor Targeting** was pioneered by **Peter Strömberg ("PEZ")** and revolutionized competitive Robocode.
> Instead of trying to predict exactly where an enemy will be, it tracks where enemies *actually go* and aims at the
> statistically most likely position. This technique remains fundamental to advanced bot development.

GuessFactor Targeting (GFT) is a statistical targeting system that learns from experience. Instead of predicting enemy
movement with mathematical formulas, it records where enemies are when bullets arrive and fires at the positions they
favor most often.

This shift from prediction to probability transformed competitive Robocode. GFT works well against both predictable and
unpredictable movements, adapting automatically to each opponent's behavior.

## Why simple prediction fails

Simple targeting methods ([head-on](../simple-targeting/head-on-targeting.md),
[linear](../simple-targeting/linear-targeting.md), [circular](../simple-targeting/circular-targeting.md)) all share the
same weakness: they assume enemies move in predictable patterns.

Against bots with [random movement](../../movement/simple-evasion/random-movement.md) or adaptive strategies, these
predictions often miss. The enemy could end up anywhere within a wide arc.

**GuessFactor Targeting solves this by:**

- Recording where enemies *actually are* when bullets arrive
- Building a statistical profile over many shots
- Aiming at the most probable position based on past data

This approach works against any movement style because it learns from actual outcomes rather than assumptions.

<img src="/images/guessfactor-targeting-comparison.svg" alt="Simple targeting predicts a single position; GuessFactor Targeting aims at the most statistically likely position" width="800"><br>
*Simple targeting predicts a single position; GuessFactor Targeting aims at the most statistically likely position*

## Prerequisites: Understanding waves

Before building a GuessFactor gun, you should understand **waves** and how they track bullet travel. If you haven't
already, read [Introducing Waves](../the-targeting-problem/introducing-waves.md), which covers:

- What waves are and why they're used
- Wave mechanics and expansion formulas
- The GuessFactor concept and normalization
- Basic wave creation and tracking

This page focuses on **implementing** a complete GuessFactor Targeting system with working code.

## Core concept recap

**GuessFactor Targeting** uses waves to record where enemies actually are when bullets arrive, then builds a statistical
histogram showing which angles (GuessFactors) enemies favor most.

The key steps are:

1. **Fire and create a wave** tracking bullet speed and direction
2. **Track wave expansion** each turn until it reaches the enemy
3. **Record the GuessFactor** (-1.0 to +1.0) where the enemy was hit
4. **Aim at the highest-probability GuessFactor** based on accumulated statistics

## Building your first GuessFactor gun: step-by-step

Let's build a basic GuessFactor Targeting system. This tutorial uses pseudocode that works across all Robocode platforms
(classic and Tank Royale, any language).

### Step 1: Define the wave data structure

```pseudocode
class Wave:
    originX: float          // X position where fired from
    originY: float          // Y position where fired from
    fireTime: int           // Turn number when created
    bulletSpeed: float      // Speed: 20 - 3 × power
    firingAngle: float      // Absolute angle gun was aimed
```

### Step 2: Create a histogram for GuessFactor data

We'll use a simple array (bins) to count hits at different GuessFactors:

```pseudocode
const NUM_BINS = 31  // -15 to +15 representing GF -1.0 to +1.0
guessFactorBins = array of size NUM_BINS, initialized to 0

function gfToBin(guessFactor):
    // Convert GF from -1.0..+1.0 to bin index 0..(NUM_BINS-1)
    index = (guessFactor + 1.0) / 2.0 × (NUM_BINS - 1)
    return clamp(round(index), 0, NUM_BINS - 1)

function binToGF(binIndex):
    // Convert bin index back to GuessFactor
    return (binIndex / (NUM_BINS - 1)) × 2.0 - 1.0
```

Using 31 bins gives good granularity without excessive memory use. Each bin represents about 0.065 GF units.

### Step 3: Track active waves

```pseudocode
waves = empty list

function onFire(power):
    wave = new Wave()
    wave.originX = myX
    wave.originY = myY
    wave.fireTime = currentTurn
    wave.bulletSpeed = 20 - 3 × power
    wave.firingAngle = gunHeading
    
    waves.add(wave)
```

### Step 4: Update waves and record hits

Every turn, check if waves have reached the enemy:

```pseudocode
function onTick():
    for each wave in waves:
        waveRadius = wave.bulletSpeed × (currentTurn - wave.fireTime)
        distToEnemy = distance(wave.originX, wave.originY, enemyX, enemyY)
        
        if (distToEnemy ≤ waveRadius):
            // Wave hit: record GuessFactor
            recordWaveHit(wave)
            waves.remove(wave)

function recordWaveHit(wave):
    // Calculate bearing offset
    enemyBearing = angleTo(wave.originX, wave.originY, enemyX, enemyY)
    bearingOffset = normalizeAngle(enemyBearing - wave.firingAngle)
    
    // Calculate maximum escape angle
    maxEscapeAngle = asin(8.0 / wave.bulletSpeed)
    
    // Calculate GuessFactor
    guessFactor = bearingOffset / maxEscapeAngle
    
    // Record in histogram
    binIndex = gfToBin(guessFactor)
    guessFactorBins[binIndex] += 1
```

**Platform note:** `normalizeAngle()` ensures the bearing offset is in the correct range (-π to +π or -180° to +180°).
Use your platform's angle normalization function.

### Step 5: Aim using GuessFactor statistics

When it's time to fire, find the bin with the most hits:

```pseudocode
function getBestGuessFactor():
    maxHits = 0
    bestBin = NUM_BINS / 2  // Default to center (GF 0)
    
    for i from 0 to NUM_BINS - 1:
        if (guessFactorBins[i] > maxHits):
            maxHits = guessFactorBins[i]
            bestBin = i
    
    return binToGF(bestBin)

function aimGun():
    // Calculate head-on angle to enemy
    headOnAngle = angleTo(myX, myY, enemyX, enemyY)
    
    // Get best GuessFactor from statistics
    bestGF = getBestGuessFactor()
    
    // Calculate escape angle for current bullet speed
    bulletSpeed = 20 - 3 × firepower
    maxEscapeAngle = asin(8.0 / bulletSpeed)
    
    // Calculate final aim angle
    aimAngle = headOnAngle + (bestGF × maxEscapeAngle)
    
    turnGunTo(aimAngle)
```

### Step 6: Putting it all together

Here's the complete system in a simplified bot structure:

```pseudocode
// === Initialization ===
waves = empty list
guessFactorBins = array[31] filled with 0

// === On enemy scanned ===
function onScannedRobot(scannedBot):
    updateEnemyData(scannedBot)
    aimGun()
    
    power = selectFirePower()
    if (gunHeat == 0 and shouldFire()):
        fire(power)
        onFire(power)

// === Each turn ===
function onTick():
    updateWaves()

// === When firing ===
function onFire(power):
    wave = new Wave(myX, myY, currentTurn, 20 - 3 × power, gunHeading)
    waves.add(wave)

// === Update wave tracking ===
function updateWaves():
    for each wave in waves:
        waveRadius = wave.bulletSpeed × (currentTurn - wave.fireTime)
        distToEnemy = distance(wave.originX, wave.originY, enemyX, enemyY)
        
        if (distToEnemy ≤ waveRadius):
            recordWaveHit(wave)
            waves.remove(wave)

// === Record GuessFactor data ===
function recordWaveHit(wave):
    enemyBearing = angleTo(wave.originX, wave.originY, enemyX, enemyY)
    bearingOffset = normalizeAngle(enemyBearing - wave.firingAngle)
    
    maxEscapeAngle = asin(8.0 / wave.bulletSpeed)
    guessFactor = bearingOffset / maxEscapeAngle
    
    binIndex = gfToBin(guessFactor)
    guessFactorBins[binIndex] += 1

// === Aiming ===
function aimGun():
    headOnAngle = angleTo(myX, myY, enemyX, enemyY)
    bestGF = getBestGuessFactor()
    
    bulletSpeed = 20 - 3 × firepower
    maxEscapeAngle = asin(8.0 / bulletSpeed)
    
    aimAngle = headOnAngle + (bestGF × maxEscapeAngle)
    turnGunTo(aimAngle)

function getBestGuessFactor():
    maxHits = 0
    bestBin = 15  // Center bin (GF 0)
    
    for i from 0 to 30:
        if (guessFactorBins[i] > maxHits):
            maxHits = guessFactorBins[i]
            bestBin = i
    
    return binToGF(bestBin)
```

This implementation will learn your opponent's movement patterns over the course of a battle and gradually improve its
accuracy.

## Improvements and variations

Once you have basic GuessFactor Targeting working, consider these enhancements:

### Rolling average window

Instead of accumulating all data forever, weight recent data more heavily:

```pseudocode
function recordWaveHit(wave):
    // ... calculate guessFactor ...
    binIndex = gfToBin(guessFactor)
    
    // Decay all bins slightly
    for i from 0 to NUM_BINS - 1:
        guessFactorBins[i] *= 0.98
    
    // Add new hit
    guessFactorBins[binIndex] += 1
```

This helps adapt to enemies that change their movement strategy mid-battle.

### Visit count stats smoothing

Instead of picking the single highest bin, use a **rolling average** across nearby bins:

```pseudocode
function getBestGuessFactor():
    bestSum = 0
    bestBin = 15
    
    for i from 1 to NUM_BINS - 2:  // Skip edges
        // Sum this bin and neighbors
        sum = guessFactorBins[i-1] + guessFactorBins[i] + guessFactorBins[i+1]
        
        if (sum > bestSum):
            bestSum = sum
            bestBin = i
    
    return binToGF(bestBin)
```

This reduces noise from statistical flukes and creates smoother targeting.

### Per-enemy statistics

Track separate GuessFactor data for each opponent:

```pseudocode
enemyStats = map from enemyName to guessFactorBins

function recordWaveHit(wave, enemyName):
    // ... calculate guessFactor ...
    
    if (enemyStats not contains enemyName):
        enemyStats[enemyName] = new array[31] filled with 0
    
    bins = enemyStats[enemyName]
    bins[gfToBin(guessFactor)] += 1
```

This is essential for melee battles and improves learning in team matches.

## Common mistakes and troubleshooting

### Angle normalization issues

**Problem:** GuessFactor values are wildly incorrect or exceed ±1.0.

**Solution:** Always normalize bearing offsets to the range -180° to +180° (or -π to +π):

```pseudocode
function normalizeAngle(angle):
    while (angle > 180):
        angle -= 360
    while (angle < -180):
        angle += 360
    return angle
```

### Forgetting to create waves

**Problem:** No data is being collected.

**Solution:** Make sure you create a wave *every time you fire*, not just when hitting enemies. GuessFactor Targeting
learns from all shots, hits and misses.

### Starting with zero data

**Problem:** The bot aims poorly in early rounds before accumulating statistics.

**Solution:** When all bins are zero, default to head-on targeting (GF 0.0):

```pseudocode
function getBestGuessFactor():
    maxHits = 0
    bestBin = 15  // Default to center
    
    for i from 0 to NUM_BINS - 1:
        if (guessFactorBins[i] > maxHits):
            maxHits = guessFactorBins[i]
            bestBin = i
    
    // If no data yet, return 0 (head-on)
    if (maxHits == 0):
        return 0.0
    
    return binToGF(bestBin)
```

### Incorrect bullet speed

**Problem:** Waves arrive too early or too late compared to actual bullets.

**Solution:** Double-check your bullet speed calculation:

```text
bulletSpeed = 20 - 3 × power
```

Where `power` is between 0.1 and 3.0.

This gives bullet speeds ranging from:
- **Minimum:** 11 units/turn (at power 3.0)
- **Maximum:** 19.7 units/turn (at power 0.1)

## Next steps

Once your GuessFactor gun is working, explore:

- **[Segmentation & Visit Count Stats](segmentation-visit-count-stats.md)** — Split statistics by enemy behavior
  (distance, velocity, etc.) for more precise targeting
- **[Dynamic Clustering](dynamic-clustering.md)** — Advanced multi-dimensional segmentation
- **[Virtual Guns](../simple-targeting/virtual-guns-mean-targeting.md)** — Run multiple targeting systems and pick the
  best one

GuessFactor Targeting is the foundation for advanced statistical targeting. Mastering it opens the door to competitive
bot development.

## Further Reading

- [GuessFactor Targeting (traditional)](https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)) — RoboWiki
  (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) — RoboWiki (classic Robocode)
- [Visit Count Stats](https://robowiki.net/wiki/Visit_Count_Stats) — RoboWiki (classic Robocode)
- [Bullet Physics](https://robocode.dev/articles/physics.html) — Tank Royale documentation

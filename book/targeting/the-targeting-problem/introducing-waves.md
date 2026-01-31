---
title: "Introducing Waves"
category: "Targeting Systems"
summary: "The foundational concept behind advanced targeting: tracking bullet travel as expanding circles to measure where enemies are when bullets arrive."
tags: [ "waves", "targeting", "the-targeting-problem", "guessfactor", "advanced", "robocode", "tank-royale" ]
difficulty: "advanced"
source: [
  "RoboWiki - Waves (classic Robocode) https://robowiki.net/wiki/Waves",
  "RoboWiki - GuessFactor Targeting (classic Robocode) https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)",
  "Robocode Tank Royale Docs - Bullet Physics https://robocode.dev/articles/physics.html"
]
---

# Introducing Waves

> [!TIP] Origins
> The **wave** concept was developed as the foundation for **GuessFactor Targeting**, co-pioneered by **Paul Evans**, 
> **David Alves**, and **Albert Perez** in the early 2000s, and later adopted for **Wave Surfing**, invented by **ABC**. 
> This innovation revolutionized competitive Robocode by providing a precise way to track bullet travel and enemy 
> positioning.

> [!NOTE] Implementation Guide
> This page explains the **concepts** behind waves and GuessFactors. For a **step-by-step tutorial** with complete 
> code to build a working GuessFactor gun, see 
> [GuessFactor Targeting](../statistical-targeting/guessfactor-targeting.md).

In the [Understanding the Challenge](understanding-the-challenge.md), we saw that effective targeting requires tracking
**where the enemy is when a bullet arrives**, not just where they are when fired. **Waves** are the tool that makes this
possible.

A wave is an imaginary circle that expands outward from the firing position at bullet speed. When the wave reaches the
enemy, that's the exact moment a bullet would have hit them—allowing the bot to record their angle relative to the
firing direction.

Over many battles, these recorded angles form a statistical profile of enemy movement, enabling probabilistic targeting
systems like GuessFactor Targeting and Dynamic Clustering.

## What is a wave?

A **wave** represents the expanding wavefront of a bullet's potential reach. Think of it like ripples spreading across
water when a stone is dropped:

- **Origin:** The bot's position when the bullet was fired (or would have been fired).
- **Expansion:** The wave grows outward at bullet speed: `20 - 3 × firepower` units per turn.
- **Purpose:** When the wave reaches the enemy's position, record their angle relative to the firing direction.

Waves are **imaginary**—they don't exist in the game engine. The bot calculates and tracks them to measure timing and
angles accurately.

<img src="../../images/wave-concept-basic.svg" alt="A wave expands from the firing position at bullet speed, tracking when a bullet would reach each point" style="max-width:100%;height:auto;"><br>
*A wave expands from the firing position at bullet speed, tracking when a bullet would reach each point*

## Why waves matter for targeting

Simple targeting methods (head-on, linear, circular) aim at a **single predicted position**. But enemies with
unpredictable movement can end up anywhere within a wide arc.

Waves solve this by:

1. **Measuring actual outcomes:** Record where the enemy *actually was* when a bullet could have hit them.
2. **Building statistical profiles:** Track which angles the enemy favors over many shots.
3. **Predicting probabilities:** Aim at the angle with the highest hit probability based on past data.

This shifts targeting from "predict where they'll be" to "aim where they're most likely to be."

## Wave mechanics: the math

Each wave needs three pieces of information:

| Property         | Description                                     | Example                   |
|------------------|-------------------------------------------------|---------------------------|
| **Origin**       | Bot's (x, y) position when the wave was created | `(1900, 4900)`            |
| **Fire time**    | The turn number when the wave was created       | `Turn 50`                 |
| **Bullet speed** | Speed the wave expands at: `20 - 3 × firepower` | `14 units/turn` (power 2) |

On each turn, the wave's radius grows:

```text
waveRadius = bulletSpeed × (currentTurn - fireTime)
```

**When the wave reaches the enemy:**

```text
distanceToEnemy = distance((waveOrigin.x, waveOrigin.y), (enemy.x, enemy.y))

if (distanceToEnemy ≤ waveRadius) {
    // Wave has reached or passed the enemy
    // Record the enemy's angle relative to firing direction
    recordHit()
}
```

## Measuring angles: GuessFactor

The key insight of wave-based targeting is recording the **angle** where the enemy is when the wave arrives. This angle
is often normalized to a value called a **GuessFactor** (GF):

- **GF 0.0:** The enemy is exactly where a head-on shot would have aimed.
- **GF +1.0:** The enemy moved as far as possible in one direction (maximum escape angle).
- **GF -1.0:** The enemy moved as far as possible in the opposite direction.

The GuessFactor normalizes different bullet speeds and distances into a consistent scale from -1 to +1.

**Basic calculation:**

```text
// Angle from firing direction to enemy when wave hits
bearingOffset = enemyBearing - firingAngle

// Maximum angle the enemy could have reached (escape angle)
maxEscapeAngle = asin(8 / bulletSpeed)  // 8 = max bot speed

// Normalize to -1.0 to +1.0 range
guessFactor = bearingOffset / maxEscapeAngle
```

Over many shots, the bot accumulates GuessFactor data and aims at the GF with the highest hit count.

<img src="../../images/wave-guessfactor-concept.svg" alt="GuessFactor measures where the enemy is within the maximum escape angle range" style="max-width:100%;height:auto;"><br>
*GuessFactor measures where the enemy is within the maximum escape angle range*

## Wave creation and tracking

In a typical wave-based targeting system, the bot:

1. **Creates a wave when firing** (or considering firing):
   ```text
   wave = {
       origin: (myX, myY),
       fireTime: currentTurn,
       bulletSpeed: 20 - 3 × firepower,
       firingAngle: gunHeading
   }
   waves.add(wave)
   ```

2. **Updates all waves each turn:**
   ```text
   for each wave in waves {
       waveRadius = wave.bulletSpeed × (currentTurn - wave.fireTime)
       
       if (waveRadius >= distanceToEnemy(wave.origin, enemy)) {
           // Wave hit: record enemy's GuessFactor
           recordGuessFactor(wave, enemy)
           waves.remove(wave)
       }
   }
   ```

3. **Records GuessFactor data** when waves reach enemies:
   ```text
   function recordGuessFactor(wave, enemy) {
       bearingOffset = enemy.bearing - wave.firingAngle
       maxEscapeAngle = asin(8 / wave.bulletSpeed)
       guessFactor = bearingOffset / maxEscapeAngle
       
       // Store in histogram or statistics
       guessFactorData[guessFactor] += 1
   }
   ```

4. **Aims at the best GuessFactor** when firing next time:
   ```text
   bestGF = findHighestProbabilityGuessFactor(guessFactorData)
   aimAngle = headOnAngle + (bestGF × maxEscapeAngle)
   ```

### Example: Accumulating GuessFactor hits

Here's a concrete example showing how GuessFactor data accumulates over several shots:

After 8 waves hit an enemy, the bot records these GuessFactor values:

| Wave | GuessFactor | Meaning                            |
|------|-------------|------------------------------------|
| 1    | +0.45       | Enemy moved right (45% max escape) |
| 2    | -0.12       | Enemy moved slightly left          |
| 3    | +0.78       | Enemy moved far right              |
| 4    | +0.45       | Enemy moved right again            |
| 5    | +0.02       | Enemy stayed nearly head-on        |
| 6    | +0.45       | Enemy moved right again            |
| 7    | +0.89       | Enemy moved very far right         |
| 8    | -0.34       | Enemy moved left                   |

The accumulated histogram looks like:

```text
Frequency distribution of GuessFactor hits:
GF -0.34: ■ (1 hit)
GF -0.12: ■ (1 hit)
GF +0.02: ■ (1 hit)
GF +0.45: ███ (3 hits) ← Most common!
GF +0.78: ■ (1 hit)
GF +0.89: ■ (1 hit)

Best GuessFactor: +0.45 (3 hits)
```

The pattern shows this enemy **favors moving right**. When the bot fires next time, it will aim at GF +0.45 because
that's
where the enemy has been most likely to be. This is much smarter than aiming head-on (GF 0.0) or picking a random angle.

Over more battles, the histogram becomes richer:

```text
// After 50 more shots:
GF -0.8 to -0.6: ███ (3 hits)
GF -0.4 to -0.2: ████████ (8 hits)
GF +0.0 to +0.2: ██████ (6 hits)
GF +0.4 to +0.6: ████████████ (12 hits) ← Peak behavior
GF +0.6 to +0.8: ██████ (6 hits)
GF +0.8 to +1.0: ████ (4 hits)
```

This fuller profile reveals the enemy's true movement tendencies, allowing for increasingly accurate predictions.

## Virtual waves vs real bullets

There are two ways to use waves, and they serve different purposes because enemies react differently to each:

**Real bullet waves:**

- Created only when the bot actually fires.
- **Enemies react:** When an enemy determines that a real bullet has been fired due to the energy drop, they dodge,
  speed up, or change a direction to avoid it.
- Tracks actual outcomes where your firing influences enemy movement.
- Data is limited to situations where the gun was ready to fire.
- **Best for:** Learning how enemies dodge *your* attacks in real combat situations.

**Virtual waves (also called shadow waves):**

- Created every turn, regardless of whether the bot fires.
- **Enemies don't react:** Virtual bullets never threaten the enemy, so they don't influence movement decisions.
- Tracks where enemies go naturally, without the pressure of incoming fire.
- Gathers much more data because it's not limited to actual firing moments.
- **Best for:** Measuring underlying movement patterns without the noise of evasive behavior.

### Why use both?

**Virtual waves** provide the bulk of statistical data: they capture enemy movement patterns over many turns without
interference. However, these patterns are measured under "peaceful" conditions—when the enemy has no reason to dodge.

**Real bullet waves** capture the truth of actual combat: how enemies really move when threatened. An enemy's dodging
behavior under fire may differ significantly from their casual movement pattern.

Advanced bots use **both strategically:**

1. **Virtual waves** accumulate baseline statistics on enemy movement tendencies.
2. **Real bullet waves** refine predictions based on how enemies actually dodge.
3. The bot may weight real bullet data more heavily than virtual data, since real combat situations matter more.

Most bots start with **virtual waves for speed** (more data = faster learning), then incorporate **real wave data for
accuracy** (better predictions when it actually matters). The balance between quantity and realism varies by bot design.

## Waves in movement: wave surfing

The wave concept isn't just for targeting—it's also the foundation of advanced movement strategies.

**Wave surfing** reverses the wave concept: the bot tracks *enemy* waves (bullets the enemy has fired or might fire)
and moves to positions with the lowest danger based on where the enemy's gun has hit before.

This creates an ongoing tactical battle:

- The enemy's gun learns which angles you favor.
- Your movement tries to flatten your statistical profile.
- Both systems continuously adapt to each other.

Wave surfing is covered in detail in the *Movement & Evasion* section.

## Implementation tips

**Starting simple:**

- Begin with real bullet waves only—create a wave when firing, track it until it hits.
- Use a simple array or histogram to count hits at different GuessFactor values.
- Don't worry about segmentation initially—just track all data together.

**Common challenges:**

- **Wave cleanup:** Remove waves that pass the enemy or go off-screen.
- **Angle normalization:** Ensure angles wrap correctly at 0°/360° boundaries.
- **Distance calculation:** Use efficient distance formulas (avoid square root if comparing distances).

**Performance considerations:**

- Limit the number of active waves like ~10-20.
- Update only waves that haven't reached enemies yet.
- Precompute bullet speed to avoid repeated calculations.

## Platform notes

Wave mechanics work identically in classic Robocode and Tank Royale, but coordinate systems differ:

| Aspect               | Classic Robocode          | Tank Royale                  |
|----------------------|---------------------------|------------------------------|
| Angle convention     | 0° = North, clockwise     | 0° = East, counter-clockwise |
| Bullet speed formula | `20 - 3 × firepower`      | Same                         |
| Max bot speed        | 8 units/turn              | Same                         |
| Timing precision     | Turn-based, deterministic | Turn-based, deterministic    |

The GuessFactor calculation and wave expansion logic are identical—only angle conversions need adjustment.

## Advantages of wave-based targeting

**Compared to simple targeting:**

- **Adapts to enemy behavior:** Learns which directions enemies favor.
- **Works against unpredictable movement:** Builds probability distributions instead of single predictions.
- **Handles multiple strategies:** Can segment data by situation (distance, velocity, etc.).

**Compared to pattern matching:**

- **Less data needed:** Doesn't require long sequences of enemy positions.
- **Faster real-time updates:** Statistical profiles update immediately.
- **More forgiving of noise:** Random jitter doesn't ruin predictions.

## When waves aren't enough

Waves excel at measuring outcomes, but they don't solve every targeting problem:

- **Cold start:** Need several hits to build useful statistics.
- **Adaptive enemies:** Bots that change behavior mid-battle can invalidate old data.
- **Rare situations:** Unusual scenarios (corners, walls, low energy) may have insufficient data.

Advanced bots address these with:

- **Segmentation:** Split data by situation (distance, wall proximity, velocity).
- **Virtual guns:** Run multiple targeting methods in parallel and use the best performer.
- **Data decay:** Weight recent data more heavily than old data.

## Further Reading

Now that you understand waves, explore how they're used in practice:

- **[GuessFactor Targeting](../statistical-targeting/guessfactor-targeting.md)** — The classic statistical targeting
  method built on waves.
- **[Segmentation & Visit Count Stats](../statistical-targeting/segmentation-visit-count-stats.md)** — Splitting wave
  data by situation for more accurate predictions.
- **[Wave Surfing Introduction](../../movement/advanced-evasion/wave-surfing-introduction.md)** — Using waves for
  advanced movement.
- **[Gun Heat Waves](../../movement/advanced-evasion/gun-heat-waves-bullet-shadows.md)** — Tracking enemy firing
  patterns for movement decisions.

**Next in this section:**

- **[GuessFactor Targeting](../statistical-targeting/guessfactor-targeting.md)** — Build your first wave-based gun.

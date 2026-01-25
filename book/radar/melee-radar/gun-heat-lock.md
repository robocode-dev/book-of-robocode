---
title: "Gun Heat Lock"
category: "Radar & Scanning"
summary: "An advanced melee radar technique that focuses on enemies your bot is about to fire at, combining targeting with radar efficiency."
tags: [ "gun-heat-lock", "melee-radar", "radar", "scanning", "melee", "robocode", "tank-royale", "advanced" ]
difficulty: "advanced"
source: [
  "RoboWiki - Melee Radar (classic Robocode) https://robowiki.net/wiki/Melee_Radar"
]
---

# Gun Heat Lock

> [!TIP] Origins
> **Gun Heat Lock** was developed and documented by the RoboWiki community as an optimization strategy that coordinates
> radar and gun systems in melee battles.

In melee combat, radar time is precious—you need to track multiple opponents while your targeting system requires fresh
data to aim accurately. **Gun heat lock** solves this coordination problem by using **gun heat** as a timing signal to
focus the radar on whichever enemy the gun is about to fire at.

This technique ensures that the most critical scan—the one your targeting system needs right before firing—happens at
exactly the right moment, maximizing the accuracy of each shot.

## The Coordination Problem

Most melee radar strategies treat scanning and targeting as separate concerns:

- **Spinning radar:** Scans all enemies equally, but targeting data may be stale when firing.
- **Oldest scanned:** Prioritizes stale data but might scan low-priority targets when the gun is ready.
- **Random melee guns:** Select targets independently of which enemies were recently scanned.

This creates a mismatch: the radar might scan a distant, low-threat enemy while the targeting system needs fresh data
on a nearby target the gun is about to fire at. The result is reduced accuracy and wasted opportunities.

Gun heat lock bridges this gap by coordinating the two systems: when the gun is about to fire, lock the radar onto the
enemy the targeting system has selected.

## How Gun Heat Lock Works

The strategy uses **gun heat** as a trigger to switch radar behavior:

1. **When gun heat is high:** Use a standard melee radar pattern (spinning, oldest scanned, etc.) to maintain general
   awareness of all enemies.
2. **When gun heat is low:** Lock the radar onto whichever enemy the targeting system has chosen as the next target.
3. **Scan right before firing:** Keep the radar pointed at the target until a fresh scan is obtained, then fire
   immediately.

This ensures that the targeting system receives the freshest possible data about the enemy's position and velocity at
the moment of firing, improving hit rates without sacrificing situational awareness.

<img src="../../images/gun-heat-lock-pattern.svg" alt="Gun heat lock focuses radar on the firing target when gun heat is low" style="max-width:100%;height:auto;">
<br>
*Gun heat lock focuses radar on the firing target when gun heat is low*

## Implementation Strategy

The implementation requires coordination between radar, targeting, and gun systems:

```text
// Track gun heat and targeting state
currentTarget = null
gunHeatThreshold = 1.0  // Lock when heat drops below this

function onTurn() {
    // Targeting system selects next enemy
    currentTarget = selectBestTarget()
    
    if (gunHeat < gunHeatThreshold AND currentTarget != null) {
        // Gun is ready or nearly ready: lock radar on target
        lockRadarOnTarget(currentTarget)
    } else {
        // Gun cooling: use standard melee radar pattern
        standardMeleeRadarPattern()
    }
    
    // Fire when radar lock confirms target and gun is ready
    if (gunHeat == 0 AND targetRecentlyScanned(currentTarget)) {
        fireAtTarget(currentTarget)
    }
}

function lockRadarOnTarget(enemy) {
    // Calculate absolute bearing to enemy
    targetBearing = heading + enemy.bearing
    
    // Calculate required radar turn
    radarTurn = normalizeAngle(targetBearing - radarHeading)
    
    // Add buffer to ensure scan
    radarTurn += sign(radarTurn) * 10
    
    setTurnRadarRight(radarTurn)
}

function standardMeleeRadarPattern() {
    // Use spinning, oldest scanned, or other melee pattern
    // Examples: continuous spin, oldest scanned prioritization
    setTurnRadarRight(360)  // or implement oldest scanned
}
```

The `gunHeatThreshold` value determines when to switch from general scanning to target lock. Higher values (1.5-2.0)
give more time to acquire the lock; lower values (0.5-1.0) maintain broader awareness longer.

## Choosing the Gun Heat Threshold

The threshold value trades off between scan freshness and situational awareness:

**Lower threshold (0.5-1.0 heat):**
- **Pros:** Maintains broad radar coverage longer; better melee awareness.
- **Cons:** Less time to lock on target; may miss scans if target moves unpredictably.
- **Best for:** Chaotic battles with many close-range threats.

**Higher threshold (1.5-2.5 heat):**
- **Pros:** More time to acquire and maintain lock; higher hit rates.
- **Cons:** Reduces radar time spent on other enemies; creates blind spots.
- **Best for:** Battles with fewer remaining enemies or when targeting accuracy is critical.

Adaptive bots adjust this threshold dynamically based on how many enemies remain: use higher thresholds in late-game
1v1 or 2v2 scenarios, lower thresholds in crowded early-game melees.

## Integration with Targeting Systems

Gun heat lock works best with targeting systems that:

1. **Select targets deterministically:** The same enemy should be the target for multiple turns while gun cools.
2. **Prioritize threats:** Target selection considers distance, energy, and danger level.
3. **Use fresh scan data:** The targeting algorithm benefits from up-to-date position and velocity.

**Example target selection criteria:**
```text
function selectBestTarget() {
    bestEnemy = null
    bestScore = -infinity
    
    for each enemy in trackedEnemies {
        // Score based on distance, energy, threat level
        score = calculateThreatScore(enemy)
        
        if (score > bestScore) {
            bestScore = score
            bestEnemy = enemy
        }
    }
    
    return bestEnemy
}

function calculateThreatScore(enemy) {
    // Closer enemies = higher priority
    distanceScore = 1000 / enemy.distance
    
    // Higher energy enemies = more dangerous
    energyScore = enemy.energy / 10
    
    // Recent damage dealt = immediate threat
    aggressionScore = enemy.recentDamageDealt * 2
    
    return distanceScore + energyScore + aggressionScore
}
```

## Advantages and Trade-offs

**Advantages:**
- **Improved accuracy:** Fresh scan data at the moment of firing increases hit rates.
- **Efficient coordination:** Radar focuses on high-priority targets when it matters most.
- **Adaptive coverage:** General scanning continues during gun cool-down periods.

**Trade-offs:**
- **Complexity:** Requires coordination between radar, targeting, and gun systems.
- **Blind spots:** While locked on one enemy, others may move without being scanned.
- **Implementation overhead:** More sophisticated than simple spinning or oldest scanned patterns.

Gun heat lock is most effective when facing 3-5 remaining enemies. In larger melees (8+ bots), the blind spots created
by locking become more dangerous. In late-game 1v1 scenarios, it converges toward standard 1v1 radar locks.

## Tips & Common Mistakes

**Do:**
- Implement fallback to standard melee radar when gun heat is high.
- Track enemy death events to avoid locking onto destroyed enemies.
- Test different gun heat threshold values against various melee opponents.
- Ensure target selection happens before radar decision each turn.

**Don't:**
- Lock on stale enemies—verify the target was scanned recently before firing.
- Use gun heat lock in 1v1 battles—standard 1v1 radar locks are simpler and more effective.
- Forget to handle the case where `currentTarget` is null (all enemies destroyed or none selected).
- Lock too early (high threshold) in crowded melees—situational awareness suffers.

> [!WARNING] Death Event Handling
> Always remove destroyed enemies from target selection immediately. A gun heat lock on a dead enemy wastes precious
> radar time pointing at empty space while live threats go unscanned.

## When to Use Gun Heat Lock

**Ideal situations:**
- Mid-game melee battles with 3-6 remaining enemies.
- Bots with sophisticated threat assessment and target prioritization.
- When targeting accuracy is more valuable than broad situational awareness.

**Better alternatives:**
- **Early game (8+ enemies):** Use spinning or oldest scanned for broader coverage.
- **Late game (2 enemies):** Transition to standard 1v1 radar locks.
- **Simple bots:** Start with spinning or oldest scanned before adding gun heat lock complexity.

Gun heat lock represents the intersection of radar, targeting, and game timing. When implemented well, it squeezes extra
accuracy out of every shot by ensuring the targeting system always has the freshest possible data.

## Further Reading

- **[Radar Basics](../radar-basics.md)** — Fundamental radar mechanics and scanning patterns.
- **[Oldest Scanned](./oldest-scanned.md)** — Alternative melee radar strategy without gun coordination.
- **[Spinning & Corner Arc](./spinning-and-corner-arc.md)** — Simpler melee radar patterns.
- **[Gun Heat and Cooling](../../physics/gun-heat-and-cooling.md)** — Understanding gun heat mechanics and timing.

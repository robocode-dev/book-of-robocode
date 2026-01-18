---
title: "Oldest Scanned"
category: "Radar & Scanning"
summary: "An intelligent melee radar strategy that tracks scan times and prioritizes enemies with the most stale data."
tags: [ "oldest-scanned", "melee-radar", "radar", "scanning", "melee", "robocode", "tank-royale", "advanced" ]
difficulty: "advanced"
source: [
  "RoboWiki - Melee Radar (classic Robocode) https://robowiki.net/wiki/Melee_Radar"
]
---

# Oldest Scanned

> [!TIP] Origins
> **Oldest Scanned** was developed and documented by the RoboWiki community as an intelligent melee radar strategy
> that improves upon simple spinning patterns.

In melee battles with multiple opponents, maintaining up-to-date information on all enemies is critical for accurate
targeting and threat assessment. The **oldest scanned** strategy solves this by tracking when each enemy was last seen
and prioritizing radar time toward the most stale data.

This approach ensures all enemies receive relatively equal attention while naturally spending more time on threats that
have been missed during recent scans. The result is more balanced situational awareness than simple spinning radar
provides.

## The Problem with Spinning Radar

A continuously spinning radar sweeps the battlefield at a constant rate, but this has limitations in melee:

- **Uneven coverage:** Enemies close together get scanned in quick succession; distant enemies wait longer.
- **Wasted effort:** The radar spends time sweeping empty space between widely-separated opponents.
- **No prioritization:** Fast-moving or dangerous enemies receive no special attention.

As battles progress and bots are eliminated, these inefficiencies grow. A spinning radar continues its full 360° sweep
even when only 2-3 opponents remain, scanning empty space where destroyed bots used to be.

## How Oldest Scanned Works

The oldest scanned strategy maintains a **timestamp** for each enemy indicating when it was last detected. On each
turn, the radar identifies which enemy has the oldest timestamp and turns toward it.

The algorithm follows this pattern:

1. **Store scan data:** When a bot is scanned, record the current turn number as its last-seen timestamp.
2. **Remove dead enemies:** When a bot dies, remove it from the tracking data immediately.
3. **Find oldest enemy:** Each turn, iterate through all known enemies and find the one with the oldest timestamp.
4. **Point radar:** Calculate the bearing to the oldest enemy and turn the radar toward it.
5. **Scan width buffer:** Add extra radar turn to account for enemy movement and ensure a hit.

This creates an adaptive scanning pattern that focuses attention where information is most stale, naturally balancing
coverage across all active threats.

<img src="../../images/oldest-scanned-radar-pattern.svg" alt="Oldest scanned radar prioritizes the enemy with the most stale scan data" width="800">
<br>
*Oldest scanned radar prioritizes the enemy with the most stale scan data*

## Implementation Strategy

The implementation requires maintaining enemy tracking data across turns:

```text
// Data structure for each enemy:
enemyData = {
    name: string,
    bearing: angle,
    distance: number,
    lastScanTime: turnNumber
}

// On scan event:
function onScannedRobot(event) {
    enemyData[event.name] = {
        name: event.name,
        bearing: event.bearing,
        distance: event.distance,
        lastScanTime: currentTurn
    }
}

// Main loop radar logic:
function chooseRadarTarget() {
    oldestEnemy = null
    oldestTime = currentTurn
    
    // Find enemy with oldest timestamp
    for each enemy in enemyData {
        if (enemy.lastScanTime < oldestTime) {
            oldestTime = enemy.lastScanTime
            oldestEnemy = enemy
        }
    }
    
    if (oldestEnemy != null) {
        // Calculate absolute bearing to oldest enemy
        targetBearing = heading + oldestEnemy.bearing
        
        // Calculate required radar turn
        radarTurn = normalizeAngle(targetBearing - radarHeading)
        
        // Add buffer for enemy movement (wider beam)
        radarTurn += sign(radarTurn) * scanBuffer
        
        setTurnRadarRight(radarTurn)
    } else {
        // No enemies: spin to discover new threats
        setTurnRadarRight(360)
    }
}
```

The `scanBuffer` value (typically 10-30 degrees) compensates for enemy movement and radar beam width, increasing the
chance of a successful scan.

## Cleaning Up Dead Enemies

A critical implementation detail is removing destroyed enemies from the tracking data. If dead bots remain in the
`enemyData` structure, they will have progressively older timestamps and monopolize radar attention, causing the radar
to waste time trying to scan ghosts.

**Use death event cleanup** as the primary approach:

```text
function onRobotDeath(event) {
    delete enemyData[event.name]
}
```

This immediately removes destroyed enemies from tracking, preventing the radar from targeting them. Both classic
Robocode and Tank Royale provide death event notifications, making this the reliable and recommended solution.

**Optional: Timeout-based backup cleanup**

As a safety measure, implement timeout cleanup to handle edge cases where death events might be missed:

```text
// In chooseRadarTarget(), before the loop:
maxStaleTime = 50  // Assume dead after 50 turns without scan

for each enemy in enemyData {
    if (currentTurn - enemy.lastScanTime > maxStaleTime) {
        delete enemyData[enemy.name]
    }
}
```

This backup ensures that if an enemy somehow remains in the tracking data despite being destroyed, it will eventually
be removed. However, death event cleanup should be the primary mechanism.

## Advantages Over Spinning Radar

Oldest scanned provides several benefits:

- **Adaptive coverage:** Naturally focuses on enemies that have been missed, balancing information freshness.
- **Efficient late-game:** As bots are eliminated, radar time concentrates on remaining threats instead of empty space.
- **Target prioritization foundation:** The tracking infrastructure can be extended to prioritize dangerous enemies.
- **Predictable scan frequency:** Each enemy gets scanned at roughly equal intervals, improving targeting consistency.

The strategy is most effective in larger melees (5+ bots) where spinning radar spends significant time on empty space.

## When to Use It

**Use oldest scanned when:**

- The bot needs balanced awareness of multiple threats.
- Melee battles regularly have 5+ participants.
- The bot has reliable enemy tracking data structures.
- Development has progressed beyond basic spinning radar.

**Stick with spinning radar when:**

- The bot is still in early development and simple patterns work.
- Memory and computation are extremely limited.
- The bot uses corner positioning (corner arc is more efficient).
- Scan frequency is less critical than simplicity.

Many competitive melee bots use oldest scanned as their baseline radar, adding additional logic for threat assessment
or gun heat locking later.

> [!WARNING] Stale Data Risk
> If the radar fails to scan an enemy for many turns (e.g., due to a bug), that enemy's old timestamp will monopolize
> radar attention. Always implement timeout cleanup to handle edge cases.

## Platform Notes

Both classic Robocode and Tank Royale support the oldest scanned strategy identically. The main implementation
difference is event handling syntax:

- **Classic Robocode:** Override `onScannedRobot()` and `onRobotDeath()` methods.
- **Tank Royale:** Register event handlers for `ScannedBotEvent` and `BotDeathEvent`.

The core algorithm—tracking timestamps and calculating radar turns—is identical across platforms.

## Tips & Common Mistakes

**Timestamp management:**

- Use turn numbers (integers) as timestamps for simplicity.
- Store timestamps in the same data structure as enemy bearing/distance.
- Always implement `onRobotDeath()` to remove dead enemies immediately.
- Optionally add timeout cleanup as a backup safety measure.

**Radar turn calculation:**

- Always normalize angles to the range [-180°, 180°] before turning.
- Add a scan buffer (10-30°) in the direction of turn to ensure enemy is hit.
- Test buffer values empirically—too small misses enemies, too large wastes time.

**Initial discovery:**

- On the first turn, no enemies have been scanned yet.
- Start with a full spin until at least one enemy is detected.
- Handle the case where `enemyData` is empty gracefully.

**Integration with targeting:**

- The same enemy tracking data can be used for targeting systems.
- Ensure targeting code uses the most recent scan data, not oldest.
- Consider separate data structures if targeting needs differ from radar needs.

## Further Reading

- [Melee Radar](https://robowiki.net/wiki/Melee_Radar) — RoboWiki (classic Robocode)
- [Radar](https://robowiki.net/wiki/Radar) — RoboWiki (classic Robocode)
- [Robocode Tank Royale - Anatomy](https://robocode.dev/articles/anatomy.html) — Tank Royale documentation

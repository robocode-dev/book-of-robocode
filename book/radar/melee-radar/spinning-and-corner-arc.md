---
title: "Spinning & Corner Arc"
category: "Radar & Scanning"
summary: "Two foundational melee radar strategies: continuous spinning for even coverage and corner arc for strategic corner positioning."
tags: [ "spinning-radar", "corner-arc", "melee-radar", "radar", "scanning", "melee", "robocode", "tank-royale", "advanced" ]
difficulty: "advanced"
source: [
  "RoboWiki - Melee Radar (classic Robocode) https://robowiki.net/wiki/Melee_Radar"
]
---

# Spinning & Corner Arc

> [!TIP] Origins
> **Spinning Radar** and **Corner Arc** patterns were developed and documented by the RoboWiki community as 
> foundational melee radar strategies.

In melee battles with multiple opponents, radar management becomes critical. Two simple but effective strategies form 
the foundation of melee radar: continuous spinning for broad awareness and corner arc for tactical positioning.

These patterns solve different problems: spinning radar provides even coverage of all enemies, while corner arc 
optimizes radar time when positioned strategically in a corner.

## Spinning Radar for Melee

The simplest melee radar strategy is identical to the basic spinning pattern used in 1v1: keep the radar turning 
continuously to sweep the entire battlefield.

In melee, this approach has distinct advantages:

- **Democratic coverage:** Every bot gets scanned with roughly equal frequency.
- **No blind spots:** The radar never stops moving, ensuring no region goes unwatched for long.
- **Simple implementation:** No complex tracking logic or state management required.
- **Reliable discovery:** New threats are detected quickly as they enter radar range.

The downside is efficiency: in a 10-bot melee, the radar spends most of its time sweeping empty space between distant 
opponents. More sophisticated strategies like **oldest scanned** or **gun heat lock** can improve scan frequency on 
high-priority targets.

<img src="../../images/spinning-radar-melee.svg" alt="Spinning radar in melee" width="800"><br>
*Spinning radar in melee provides even coverage but sweeps through empty space*

### Implementation Pattern

The spinning radar pattern uses the same technique as in 1v1:

```text
// Before the main loop:
setTurnRadarRight(INFINITY)

// Main loop:
while (true) {
    // Radar spins continuously
    // Scans arrive as enemies pass through the beam
    commitTurn()
}
```

This pattern works well for beginner and intermediate melee bots. It provides adequate situational awareness without 
complex logic.

## Corner Arc Strategy

**Corner arc** is a specialized radar pattern designed for bots that position themselves in battlefield corners. When 
in a corner, all enemies must be located within a 90-degree arc in front of the bot.

This geometric constraint allows the radar to scan more efficiently:

- **Reduced sweep angle:** Only 90° needs coverage instead of 360°.
- **Higher scan frequency:** Each enemy is scanned roughly 4× more often than with full spinning.
- **Predictable coverage:** The limited arc is easy to optimize and reason about.

Corner arc is most effective when combined with **corner movement** strategies that keep the bot positioned against 
walls. If the bot moves away from corners frequently, the reduced arc becomes a liability, creating large blind spots.

<img src="../../images/corner-arc-radar.svg" alt="Corner arc radar" width="800"><br>
*Corner arc radar covers only the 90° quadrant in front of a corner-positioned bot*

### Implementation Pattern

Corner arc requires knowing the battlefield dimensions and current bot position to determine the appropriate sweep 
range:

```text
// Determine which corner we're in (assumes corners are defined):
isInBottomLeftCorner = (x < threshold AND y < threshold)
isInBottomRightCorner = (x > width - threshold AND y < threshold)
// ... similar for top corners

if (isInCorner) {
    // Calculate the 90° arc boundaries based on corner
    // For bottom-left: sweep from 0° to 90°
    // For bottom-right: sweep from 90° to 180°
    // etc.
    
    arcStart = calculateArcStart()
    arcEnd = calculateArcEnd()
    
    // Oscillate radar between arc boundaries
    if (radarHeading <= arcStart) {
        setTurnRadarRight(arcEnd - arcStart)
    } else if (radarHeading >= arcEnd) {
        setTurnRadarLeft(arcEnd - arcStart)
    }
} else {
    // Not in corner: fall back to spinning radar
    setTurnRadarRight(INFINITY)
}
```

The exact angle calculations depend on the coordinate system convention (classic Robocode vs Tank Royale) and which 
corner the bot occupies.

## Choosing Between Strategies

**Use spinning radar when:**
- The bot moves freely around the battlefield.
- Simplicity and reliability are priorities.
- The bot is still in early development.

**Use corner arc when:**
- The movement strategy keeps the bot in corners consistently.
- Scan frequency on nearby threats is critical.
- The bot has logic to fall back to spinning when leaving corners.

Many successful melee bots start with spinning radar and only adopt corner arc after implementing dedicated corner 
movement patterns. The two strategies work best when matched to the bot's overall tactical approach.

> [!WARNING] Blind Spot Risk
> Corner arc creates large blind spots if the bot is *not* actually in a corner. Always include fallback logic to 
> switch to spinning radar when corner positioning is lost.

## Platform Notes

Both strategies work identically in classic Robocode and Tank Royale. The main difference is angle conventions:
- **Classic Robocode:** 0° is north (up), angles increase clockwise.
- **Tank Royale:** 0° is east (right), angles increase counterclockwise.

Corner arc implementations must account for these when calculating arc boundaries.

## Tips & Common Mistakes

**Spinning radar:**
- Set infinite turn once before the main loop, not every turn.
- Use large numbers (1e9) or language-specific infinity constants.

**Corner arc:**
- Define corner threshold (e.g., within 100 units of walls).
- Test corner detection thoroughly—wrong boundaries create blind spots.
- Always implement fallback to spinning when not cornered.

**General melee radar:**
- Track when each enemy was last scanned to identify stale data.
- Consider **oldest scanned** once spinning radar works reliably.
- Remember scan data is slightly old—enemies move between scan and reaction.

## Further Reading

- [Melee Radar](https://robowiki.net/wiki/Melee_Radar) — RoboWiki (classic Robocode)
- [Radar](https://robowiki.net/wiki/Radar) — RoboWiki (classic Robocode)
- [Corner Movement](https://robowiki.net/wiki/Corner_Movement) — RoboWiki (classic Robocode)
- [Robocode Tank Royale - Anatomy](https://robocode.dev/articles/anatomy.html) — Tank Royale documentation

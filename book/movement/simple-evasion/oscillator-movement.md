---
title: "Oscillator Movement"
category: "Movement & Evasion"
summary: "Oscillator movement creates predictable back-and-forth patterns that can dodge simple targeting while maintaining strategic positioning."
tags: [ "oscillator-movement", "movement", "simple-evasion", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Oscillator Movement (classic Robocode) https://robowiki.net/wiki/Oscillator_Movement",
  "RoboWiki - Oscillator Movement/Period (classic Robocode) https://robowiki.net/wiki/Oscillator_Movement/Period"
]
---

# Oscillator Movement

> [!TIP] Origins
> **Oscillator Movement** was developed and documented by the RoboWiki community as an intermediate evasion technique.

Oscillator movement is a simple evasion technique where the bot moves back and forth in a rhythmic pattern, alternating
the direction at regular intervals or when hitting specific conditions. While predictable to advanced targeting systems,
it effectively dodges head-on and linear targeting while maintaining a consistent distance and battlefield position.

## Why Use Oscillator Movement?

Oscillator movement offers a middle ground between sitting still and random movement. The bot stays active and harder to
hit than a stationary target, while remaining in a predictable area that helps with targeting and wall management. This
makes it particularly effective in the intermediate skill range where opponents use simple targeting but haven't yet
implemented pattern recognition.

The rhythmic nature also provides control — the bot can maintain optimal distance from the enemy without wandering into
corners or poor positions.

## How It Works

The core concept is simple: move forward for a period, then reverse and move backward for a period, repeating
indefinitely. The "period" can be defined by:

- **Time-based**: Switch the direction every N turns (e.g., every 20 turns)
- **Distance-based**: Switch after traveling a certain distance (e.g., 100 units)
- **Event-based**: Switch on wall collisions or when reaching battlefield boundaries

**Basic pseudocode:**

```
oscillator_timer = 0
oscillator_period = 20
direction = 1  // 1 for forward, -1 for backward

every turn:
    oscillator_timer++
    
    if oscillator_timer >= oscillator_period:
        direction = -direction
        oscillator_timer = 0
    
    set_ahead(direction * 100)
```

<!-- TODO: Illustration
**Filename:** oscillator-movement-pattern.svg
**Caption:** "Oscillator movement creates a back-and-forth pattern along a line"
**Viewport:** 8000x2000
**Battlefield:** false
**Bots:**
  - type: friendly, position: (400, 600), body: 0, turret: 45, radar: 45, scale: 0.5
  - type: friendly, position: (2000, 600), body: 0, turret: 45, radar: 45, scale: 0.5
  - type: friendly, position: (3600, 600), body: 180, turret: 225, radar: 225, scale: 0.5
  - type: friendly, position: (5200, 600), body: 180, turret: 225, radar: 225, scale: 0.5
  - type: friendly, position: (6800, 600), body: 0, turret: 45, radar: 45, scale: 0.5
**Lines:**
  - from: (800, 800), to: (1600, 800), color: #4A90E2, arrow: true, dashed: false
  - from: (2400, 800), to: (3200, 800), color: #4A90E2, arrow: true, dashed: false
  - from: (4000, 800), to: (4800, 800), color: #4A90E2, arrow: true, dashed: false
  - from: (5600, 800), to: (6400, 800), color: #4A90E2, arrow: true, dashed: false
**Texts:**
  - text: "forward", position: (1200, 1100), color: #4A90E2
  - text: "reverse", position: (2800, 1100), color: #4A90E2
  - text: "forward", position: (4400, 1100), color: #4A90E2
  - text: "reverse", position: (6000, 1100), color: #4A90E2
  - text: "Time →", position: (3600, 1600), color: chocolate
-->

<img src="../../images/oscillator-movement-pattern.svg" alt="Oscillator movement creates a back-and-forth pattern along a line" style="max-width:100%;height:auto;"><br>
*Oscillator movement creates a back-and-forth pattern along a line*

## Choosing the Period

The oscillation period dramatically affects how predictable the movement is:

**Short periods (10-20 turns):**

- Quick direction changes
- Harder for simple targeting to track
- May appear jerky or erratic
- Better against head-on targeting

**Medium periods (20-40 turns):**

- Smooth, rhythmic motion
- Balanced evasion and positioning
- Vulnerable to pattern recognition
- Good general-purpose choice

**Long periods (40+ turns):**

- Almost like a straight-line movement
- Easier for linear targeting to hit
- Better battlefield coverage
- More vulnerable overall

**Variable periods** can add unpredictability by randomizing the oscillation timing slightly, making the movement harder
to pattern match.

## Wall-Based Oscillation

A practical variant triggers direction changes when approaching walls rather than using a fixed timer:

```
minimum_wall_margin = 100

every turn:
    distance_to_wall_ahead = calculate_distance_to_wall()
    
    if distance_to_wall_ahead < minimum_wall_margin:
        direction = -direction
    
    set_ahead(direction * 150)
```

This approach automatically handles different battlefield sizes and prevents wall collisions while maintaining the
oscillating pattern.

## Combining with Other Techniques

Oscillator movement becomes more effective when combined with:

- **Perpendicular movement**: Oscillate while moving perpendicular to the enemy
- **Distance management**: Adjust speed based on enemy distance (see [Distancing](../basic/distancing))
- **Random variations**: Add small random adjustments to the period or amplitude
- **Turret independence**: Keep the gun and radar tracking while the body oscillates

## Strengths and Weaknesses

**Strengths:**

- Simple to implement and debug
- Effective against head-on and basic linear targeting
- Maintains predictable positioning for your own targeting
- Works well with distance management strategies
- Requires minimal computation

**Weaknesses:**

- Highly predictable to pattern matchers
- Vulnerable to circular targeting when combined with perpendicular movement
- Can be exploited by statistical targeting systems
- Fixed patterns are easy to learn and counter
- Doesn't adapt to enemy behavior

## Tips

- Start with a period of 20-30 turns and adjust based on results
- Add small random variations (±5 turns) to break up the pattern
- Monitor your energy and switch to defensive movement when low
- Consider shortening the period when the enemy fires
- Use wall-based switching for more natural-looking movement
- Combine with stop-and-go for better evasion against intermediate bots

## Next Steps

Oscillator movement is a stepping stone to more sophisticated evasion:

- **[Random Movement](./random-movement)**: Break patterns completely with randomization
- **Stop and Go**: Use timing rather than position changes for evasion
- **Anti-Gravity Movement**: React dynamically to battlefield conditions

Once opponents start using pattern matching or statistical targeting, you'll need to move beyond simple oscillation to
more adaptive strategies.

## Further Reading

- [Oscillator Movement](https://robowiki.net/wiki/Oscillator_Movement) — RoboWiki (classic Robocode)
- [Oscillator Movement/Period](https://robowiki.net/wiki/Oscillator_Movement/Period) — RoboWiki (classic Robocode)


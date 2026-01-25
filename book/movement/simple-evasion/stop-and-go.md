---
title: "Stop and Go"
category: "Movement & Evasion"
summary: "Stop and Go movement alternates between full speed and complete stops to dodge linear and statistical targeting by varying bullet travel time. This tutorial shows how to implement this effecta a ive intermediate evasion strategy."
tags: [ "stop-and-go", "movement", "simple-evasion", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Stop And Go (classic Robocode) https://robowiki.net/wiki/Stop_And_Go",
  "RoboWiki - Stop And Go Tutorial (classic Robocode) https://robowiki.net/wiki/Stop_And_Go_Tutorial",
  "Robocode Tank Royale Docs - API Reference https://robocode.dev/api/"
]
---

# Stop and Go

> [!TIP] Origins
> **Stop and Go** movement was developed and documented by the RoboWiki community as an effective counter to linear and
> simple statistical targeting systems.

Stop and Go is a simple yet effective evasion strategy that alternates between moving at full speed and coming to a
complete stop. By dramatically varying velocity, the bot makes linear targeting predictions fail and confuses
statistical targeting systems that expect consistent movement patterns.

This technique is particularly effective against intermediate-level opponents that use linear or simple statistical
targeting, while remaining simple enough for beginners to implement and understand.

## Why Stop and Go Works

Most targeting systems predict future bot positions based on current velocity and heading. Linear targeting assumes the
target will maintain its current velocity. Statistical targeting builds patterns from historical movement data. Stop and
Go exploit both approaches by making velocity unpredictable.

When a bot alternates between full speed and stopped, the bullet travel time varies significantly. A bullet fired when
the bot is moving at full speed will miss if the bot suddenly stops. Conversely, a bullet aimed at a stopped bot will
miss when the bot speeds up.

**Against linear targeting:** Predictions assume constant velocity, so sudden stops create large position errors by the
time the bullet arrives.

**Against statistical targeting:** The dramatic velocity changes prevent the targeting system from finding reliable
patterns in the movement data.

**Against simple targeting:** Head-on targeting remains unaffected, but most intermediate bots have moved beyond this
basic approach.

## Core Concept

The basic algorithm is straightforward:

```pseudocode
movingForward = true
stopTimer = 0
stopDuration = 0

every turn:
    if movingForward:
        setAhead(100)
        stopTimer++
        
        if stopTimer >= randomStopThreshold():
            movingForward = false
            stopTimer = 0
            stopDuration = randomStopDuration()
    else:
        setAhead(0)
        stopTimer++
        
        if stopTimer >= stopDuration:
            movingForward = true
            stopTimer = 0
```

The key variables are:

- **Stop threshold:** How many turns to move before stopping
- **Stop duration:** How many turns to remain stopped
- **Direction:** Whether moving forward or backward (can vary)

<img src="../../images/stop-and-go-movement.svg" alt="Stop and Go creates velocity spikes that confuse targeting predictions" style="max-width:100%;height:auto;"><br>
*Stop and Go creates velocity spikes that confuse targeting predictions*

## Tutorial: Building Your First Stop and Go Bot

Let's build a complete Stop and Go bot step by step. This tutorial works for both classic Robocode and Tank Royale with
minor API adjustments.

### Step 1: Basic Structure

Start with a simple bot structure that tracks movement state:

```java
public class StopAndGoBot extends AdvancedRobot {
    private boolean moving = true;
    private int moveTimer = 0;
    private int stopDuration = 0;

    public void run() {
        setAdjustGunForRobotTurn(true);
        setAdjustRadarForGunTurn(true);

        while (true) {
            performMovement();
            execute();
        }
    }
}
```

### Step 2: Implement the Movement Logic

Add the core Stop and Go algorithm. The key is maintaining two states: moving and stopped. Each state tracks how long
it has been active using `moveTimer`. When moving, we continue for a random duration (15-30 turns), then switch to
stopped for another random duration (5-15 turns). The randomization prevents enemies from learning our pattern.

```java
private void performMovement() {
    if (moving) {
        // Continue moving forward
        setAhead(100);
        moveTimer++;

        // Stop after 15-30 turns of movement (randomized to prevent pattern matching)
        if (moveTimer >= 15 + Math.random() * 15) {
            moving = false;              // Switch to stopped state
            moveTimer = 0;               // Reset timer to count stop duration
            // Stop for 5-15 turns (shorter stops keep us more mobile)
            stopDuration = (int) (5 + Math.random() * 10);
        }
    } else {
        // Currently stopped - apply brakes
        setAhead(0);
        moveTimer++;

        // Resume movement after stop duration completes
        if (moveTimer >= stopDuration) {
            moving = true;              // Switch back to moving state
            moveTimer = 0;              // Reset timer to count movement duration
        }
    }
}
```

### Step 3: Add Direction Variation

Improve unpredictability by occasionally changing a direction. Moving only forward is predictable - the enemy knows
you'll always travel in your current heading. By randomly reversing the direction (backward movement) when we transition
to a stop, we add another layer of unpredictability. The 30% probability keeps reversals frequent enough to confuse
targeting but rare enough to maintain forward offensive positioning.

```java
private boolean moving = true;
private int moveTimer = 0;
private int stopDuration = 0;
private int direction = 1;  // 1 = forward, -1 = backward

private void performMovement() {
    if (moving) {
        // Move in the current direction (forward or backward)
        setAhead(100 * direction);
        moveTimer++;

        // Check if it's time to stop
        if (moveTimer >= 15 + Math.random() * 15) {
            moving = false;
            moveTimer = 0;
            stopDuration = (int) (5 + Math.random() * 10);

            // 30% chance to reverse a direction when stopping
            // This makes our next movement unpredictable
            if (Math.random() < 0.3) {
                direction = -direction;
            }
        }
    } else {
        // Currently stopped
        setAhead(0);
        moveTimer++;

        // Resume movement after stop completes
        if (moveTimer >= stopDuration) {
            moving = true;
            moveTimer = 0;
        }
    }
}
```

### Step 4: Add Wall Avoidance

Prevent getting stuck against walls. When a bot stops near a wall, it becomes extremely vulnerable – it has limited
escape routes, and the enemy knows it can't move through the wall. The wall avoidance logic ensures the bot never stops
in this dangerous position.

The algorithm calculates the minimum distance to any wall edge, then forces continued movement if too close. This
guarantees the bot moves away from the wall before considering another stop. By resetting `moveTimer = 0`, we ensure
at least 15 more turns of movement (the minimum threshold), giving the bot time to reach a safer position.

```java
private void performMovement() {
    // Calculate the closest distance to any wall edge
    // Compare: left edge (X), right edge (width-X), bottom (Y), top (height-Y)
    double distanceToWall = Math.min(
            Math.min(getX(), getBattleFieldWidth() - getX()),
            Math.min(getY(), getBattleFieldHeight() - getY())
    );

    // If within 100 pixels of any wall, override stop behavior
    if (distanceToWall < 100) {
        moving = true;           // Force movement state
        moveTimer = 0;           // Reset timer to guarantee at least ~15 more turns of movement
        // This prevents immediately stopping again next turn

        // Turn perpendicular to escape the wall quickly
        if (getX() < 100 || getX() > getBattleFieldWidth() - 100) {
            setTurnRight(90);    // Turn away from left/right walls
        }
        if (getY() < 100 || getY() > getBattleFieldHeight() - 100) {
            setTurnRight(90);    // Turn away from top/bottom walls
        }
    }

    // Normal stop and go logic (only runs if not overridden by wall avoidance)
    if (moving) {
        // Continue moving in the current direction
        setAhead(100 * direction);
        moveTimer++;

        // Check if it's time to stop (random threshold: 15-30 turns)
        if (moveTimer >= 15 + Math.random() * 15) {
            moving = false;              // Switch to stopped state
            moveTimer = 0;               // Reset timer to count stop duration
            stopDuration = (int) (5 + Math.random() * 10);  // Stop for 5-15 turns

            // 30% chance to change a direction when stopping
            // This adds unpredictability to our movement pattern
            if (Math.random() < 0.3) {
                direction = -direction;
            }
        }
    } else {
        // Currently stopped - apply brakes
        setAhead(0);
        moveTimer++;

        // Check if the stop duration is complete
        if (moveTimer >= stopDuration) {
            moving = true;              // Resume movement
            moveTimer = 0;              // Reset timer to count movement duration
        }
    }
}
```

### Step 5: Respond to Events

Make the movement reactive to combat events. Getting hit by a bullet or colliding with a wall means our current
movement pattern failed or was interrupted. By immediately changing states and direction when these events occur, we
create an adaptive response that breaks predictable patterns and recovers from mistakes.

```java
public void onBulletHit(BulletHitEvent event) {
    // Enemy got hit - movement is working, stay course
    // No action needed, current strategy is effective
}

public void onHitByBullet(HitByBulletEvent event) {
    // Got hit - immediately change state to break enemy's targeting pattern
    if (moving) {
        // Was moving - stop immediately (unexpected state change)
        moving = false;
        moveTimer = 0;
        stopDuration = (int) (5 + Math.random() * 10);
    } else {
        // Was stopped - start moving immediately (get out of predicted position)
        moving = true;
        moveTimer = 0;
    }

    // Also reverse a direction to move away from the current trajectory 
    // Enemy has successfully predicted our path, so change it
    direction = -direction;
}

public void onHitWall(HitWallEvent event) {
    // Hit the wall-reverse the direction to move away from the obstacle 
    // Continuing forward would keep us stuck or predictable
    direction = -direction;
    moving = true;  // Ensure we're moving away from the wall
}
```

## Advanced Variations

### Enemy Distance-Based Stops

Adjust stop timing based on enemy distance:

```pseudocode
stopThreshold = enemyDistance / 20
// Closer enemies = more frequent stops
```

When the enemy is close, more frequent stops make targeting harder. At longer distances, less frequent stops maintain
offensive positioning while still providing evasion.

### Gun Heat Awareness

Coordinate stops with enemy gun heat:

```pseudocode
if enemy.gunHeat > 0.5:
    allowStop = true  // Enemy can't fire yet
else:
    allowStop = false // Enemy can fire - keep moving
```

This ensures the bot isn't stopped when the enemy's gun is ready to fire, reducing vulnerability.

### Predictive Stopping

Stop when you predict the enemy will fire:

```pseudocode
if enemy.gunHeat < 0.1 and isFacingUs:
    forceStop = true
```

## Platform Differences

**Classic Robocode:**

- Uses `setAhead(distance)` for movement control
- Velocity changes take multiple turns due to acceleration
- `getVelocity()` returns current speed

**Robocode Tank Royale:**

- Uses `setForward(distance)` for movement control
- Similar acceleration mechanics
- `getSpeed()` returns current speed
- Methods may be in different packages based on language (Java/C#/Python)

Both platforms support the same core Stop and Go logic with minor API naming differences.

## Tips and Common Mistakes

**✅ Do:**

- Randomize stop timing to prevent pattern recognition
- Check wall distances before stopping
- Vary direction changes to add unpredictability
- Use longer movement periods than stop periods
- Test against different targeting systems

**❌ Avoid:**

- Fixed, predictable stop intervals (easily learned by statistical targeting)
- Stopping too close to walls (makes you an easy target)
- Very long stops (reduces your offensive capability)
- Stopping more than moving (decreases battlefield control)
- Ignoring enemy distance (context matters)

## When to Use Stop and Go

**Effective against:**

- Linear targeting (excellent results)
- Simple circular targeting
- Basic statistical targeting
- Pattern matchers with limited history

**Less effective against:**

- Head-on targeting (no benefit)
- Advanced wave surfing (needs better movement)
- Sophisticated statistical targeting with long memory
- Multiple simultaneous opponents (melee)

Stop and Go works best in one-on-one battles against intermediate opponents. It provides a solid foundation before
advancing to more complex movement strategies like wave surfing.

## Next Steps

After mastering Stop and Go, consider:

- **Oscillator movement:** Adds lateral movement to Stop and Go
- **Random movement:** Combines unpredictability with Stop and Go timing
- **Wave surfing:** Advanced evasion for expert-level play
- **Multiple Choice:** Combines several movement strategies with virtual guns

Stop and Go remain a valuable component even in advanced bots, often used as one option in a multiple-choice movement
system.

## Further Reading

- [Stop And Go](https://robowiki.net/wiki/Stop_And_Go) — RoboWiki (classic Robocode)
- [Stop And Go Tutorial](https://robowiki.net/wiki/Stop_And_Go_Tutorial) — RoboWiki (classic Robocode)


---
title: "Understanding the Challenge"
category: "Targeting Systems"
summary: "Why hitting a moving target in Robocode is fundamentally harder than it looks, and the key insights that lead to advanced targeting methods."
tags: [ "targeting", "the-targeting-problem", "prediction", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - The Targeting Problem (classic Robocode) https://robowiki.net/wiki/The_Targeting_Problem",
  "RoboWiki - Waves (classic Robocode) https://robowiki.net/wiki/Waves",
  "Robocode Tank Royale Docs - Bullet Physics https://robocode.dev/articles/physics.html"
]
---

# Understanding the Challenge

> [!TIP] Origins
> **GuessFactor Targeting** was co-pioneered by **Paul Evans** (who discovered "bins") and **David Alves** (who 
> invented the Wave concept). **Wave Surfing** was invented by **Alexandros (ABC)** in his bot **Shadow**. These
> techniques revolutionized competitive Robocode.

The simple targeting methods—head-on, linear, and circular—work great against predictable bots.
But as soon as enemies start changing their direction, speeding up unpredictably, or deliberately dodging, hit rates
drop.
The core problem is that **the enemy has time to react** before the bullet arrives.

This page explores why targeting is inherently challenging and introduces the mindset shift that leads to advanced
targeting strategies.

## The fundamental problem: travel time

When a bot fires a bullet, the bullet takes time to reach its target. During that time, the enemy keeps moving—and can
even **observe and react** to the shot.

Consider a typical scenario:

- Enemy is 400 units away.
- Bullet speed is 11 units/turn (firepower 2.0).
- Bullet travel time is approximately 36 turns.

In those 36 turns, the enemy can:

- Move up to 288 units (at a max speed of 8 units/turn).
- Change direction multiple times.
- Detect the bullet was fired (via an energy drop or direct scan).
- Deliberately move to minimize danger.

**Simple targeting assumes the enemy follows a pattern:** head-on assumes the enemy doesn't move, linear assumes
straight-line motion, and circular assumes constant turn rate. But smart enemies break these assumptions intentionally.

<img src="../../images/targeting-problem-travel-time.svg" alt="During the 36 turns a bullet travels 400 units, the enemy can move up to 288 units in any direction" style="max-width:100%;height:auto;"><br>
*During the 36 turns a bullet travels 400 units, the enemy can move up to 288 units in any direction*

## Why prediction alone isn't enough

Even perfect prediction has limits. If the enemy uses **random movement** or **stop-and-go** tactics, there's no
deterministic pattern to predict.

The enemy's actual movement depends on:

- What the enemy *wants* to do (strategy).
- What the enemy *can* do (physics constraints).
- Whether the enemy is reacting to bullets.

Simple targeting tries to **predict one future position**. But there's often no single "correct" answer—the enemy has
a whole range of possible positions.

Advanced targeting shifts to a different question: **"Which direction has the highest probability of hitting?"**

<img src="../../images/targeting-problem-prediction-cone.svg" alt="Instead of predicting one point, advanced targeting considers a probability distribution across all possible enemy positions" style="max-width:100%;height:auto;"><br>
*Instead of predicting one point, advanced targeting considers a probability distribution across all possible enemy
positions*

## Key insight: treat targeting as a search problem

Since perfect prediction is impossible, the best approach is to:

1. **Consider all possible enemy positions** the bullet might reach.
2. **Assign probabilities** to each position based on past behavior.
3. **Aim at the highest-probability direction**.

This is the foundation of **statistical targeting**:

- Track where the enemy actually went in past situations.
- Use that data to predict where they're *likely* to go next.d
- Continuously update probabilities as more data is collected.

Methods like **GuessFactor Targeting** and **Dynamic Clustering** implement this idea in different ways.

## The role of waves

To implement statistical targeting, bots need a way to measure "where the enemy was when my bullet could have hit."

**Waves** are the tool for this. A wave is an imaginary circle that expands from the firing position at bullet speed.
When the wave reaches the enemy, that's the moment the bullet would have arrived—so the bot records the enemy's
*angle relative to the firing direction* at that moment.

Over many rounds, these recorded angles form a probability distribution. The bot aims at the angle with the highest
hit probability.

Waves are covered in detail in the next page: [Introducing Waves](introducing-waves.md).

## What makes an enemy "hard to hit"?

Understanding what makes targeting difficult helps in both building better guns and better movement:

**Easy to hit:**

- Moves in straight lines or smooth circles.
- Maintains constant speed and turn rate.
- Stays far from walls.
- Doesn't react to bullets.

**Hard to hit:**

- Changes direction and speed unpredictably.
- Uses randomness to break pattern matching.
- Deliberately moves perpendicular to predicted bullet paths.
- Reacts to bullet waves (wave surfing).
- Moves close to walls (limits available data).

The best bots combine:

- **Adaptive guns** that switch strategies based on what works.
- **Flattened movement** that randomizes behavior when the enemy's gun is too accurate.

## Platform notes

The fundamental targeting problem is the same in both classic Robocode and Tank Royale: bullets take time to travel,
and enemies can move during that time.

**Key differences:**

| Aspect                 | Classic Robocode                   | Tank Royale                  |
|------------------------|------------------------------------|------------------------------|
| Coordinate system      | 0° = North, clockwise              | 0° = East, counter-clockwise |
| Max bullet travel time | ~91 turns (firepower 0.1, 800×600) | Varies with arena size       |
| Scan data timing       | Previous turn                      | Current turn                 |

> Note: The bullet speed formula is the same on both platforms (`20 - 3 × firepower`)

The core strategies—waves, GuessFactor, statistical targeting—translate directly between platforms, but coordinate
conversions and scan timing need careful handling.

## Next steps

Now that the core challenge is clear, the next page introduces the tool that makes advanced targeting possible:

- **[Introducing Waves](introducing-waves.md):** How to track bullet travel and measure enemy positions.

After understanding waves, explore the major targeting approaches:

- **Statistical Targeting:** GuessFactor, segmentation, and dynamic clustering.
- **Predictive Targeting:** Pattern matching and precise prediction.
- **Adaptive Systems:** Virtual guns and multiple-choice strategies.

## Tips

- **Start simple, iterate:** Even top bots began with head-on or linear targeting. Build up complexity gradually.
- **Log data:** Save enemy positions, bullet outcomes, and wave data to files. Analyze patterns offline.
- **Test against diverse opponents:** A gun that crushes linear movers might fail against random movement.
- **Balance offense and defense:** A perfect gun is useless if the bot gets hit constantly. Movement and targeting
  improve together.

> [!TIP] Mindset shift
> The key to advanced targeting is accepting that **you can't predict the future perfectly**
> Instead, aim at the *most likely* future based on past data.

## Further Reading

- [The Targeting Problem](https://robowiki.net/wiki/The_Targeting_Problem) — RoboWiki (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) — RoboWiki (classic Robocode)

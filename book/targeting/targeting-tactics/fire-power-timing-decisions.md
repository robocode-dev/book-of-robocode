---
title: "Fire Power & Timing Decisions"
category: "Targeting Systems"
summary: "Strategic considerations for choosing bullet power and when to fire — balancing damage, accuracy, energy, and gun heat."
tags: ["fire-power", "bullet-power", "timing", "targeting-tactics", "strategy", "robocode", "tank-royale", "intermediate"]
difficulty: "intermediate"
source: [
  "RoboWiki - Bullet (classic Robocode) https://robowiki.net/wiki/Bullet",
  "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html#bullets"
]
---

# Fire Power & Timing Decisions

Choosing when to fire and how much power to use is a strategic balancing act. Fire too weak and you waste shots; fire too strong and you miss more often while draining your energy. This page explores the factors that influence bullet power selection and timing decisions in competitive play.

<!-- TODO: Illustration
Filename: fire-power-tradeoffs.svg
Caption: Comparing low-power (fast, weak) vs high-power (slow, strong) bullets traveling toward a moving target
Viewport: 0 0 1000 600
Bots:
- name: FireBot
  x: 200
  y: 300
  bodyAngle: 0
  gunAngle: 0
  radarAngle: 0
  color: blue
- name: Target
  x: 800
  y: 250
  bodyAngle: 180
  gunAngle: 180
  radarAngle: 180
  color: red
Lines:
- x1: 200, y1: 300, x2: 800, y2: 250, color: orange, width: 2, label: "Low power (fast)"
- x1: 200, y1: 300, x2: 750, y2: 280, color: red, width: 3, label: "High power (slow, misses)"
Texts:
- x: 500, y: 50, text: "Fire Power Tradeoffs", size: 24, weight: bold, color: white
- x: 500, y: 100, text: "Speed vs Damage vs Accuracy", size: 16, color: lightgray
-->

<img src="/images/fire-power-tradeoffs.svg" alt="Comparing low-power (fast, weak) vs high-power (slow, strong) bullets traveling toward a moving target" width="1000">
<br>
*Comparing low-power (fast, weak) vs high-power (slow, strong) bullets traveling toward a moving target*

## Why bullet power matters

Bullet power affects three critical aspects of combat:

1. **Damage dealt** — Higher power means more damage per hit (4× power, plus bonus above 1.0).
2. **Bullet speed** — Lower power bullets travel faster (20 - 3× power units/turn), reaching the target sooner.
3. **Gun heat generated** — Higher power adds more heat (1 + power/5), delaying your next shot.
4. **Energy cost** — Firing consumes energy equal to the bullet power, risking disablement if you run low.

These tradeoffs mean there's rarely a "best" power for all situations — the right choice depends on range, enemy behavior, your energy level, and your targeting confidence.

## The core tradeoffs

### Speed vs damage

Lower power bullets are faster and harder to dodge, but deal less damage. Against agile opponents with unpredictable movement, a faster bullet that hits is better than a slow, powerful bullet that misses.

**Rule of thumb:**
- **Power 0.1 to 1.5** — Fast bullets for distant or erratic targets.
- **Power 1.5 to 3.0** — Strong bullets for close range or predictable movement.

### Accuracy vs power

High-power bullets travel slower, giving the enemy more time to move out of the predicted impact zone. This amplifies any error in your targeting algorithm.

For statistical or adaptive targeting systems, accuracy often matters more than raw power:
- If your hit rate drops significantly with high power, you'll score more total damage with moderate power at higher accuracy.

### Energy management

Every shot costs energy. Firing a 3.0 power bullet drains 3.0 energy immediately, but you only gain back energy (3× power) if it hits.

**Dangerous scenario:**
- Your energy is low (< 10).
- Enemy fires back with high power.
- You fire a 3.0 bullet and miss → you're now at 7 energy and vulnerable.
- Enemy hits you → you drop below 0 and die.

**Safer strategy:** Use lower power when your energy is critical, preserving enough buffer to survive a hit.

## Common fire power strategies

### Fixed power

The simplest approach: always fire the same power (e.g., 2.0 or 1.9). This works well for bots that prioritize consistent gun heat cycles and predictable energy drain.

**Pros:**
- Predictable cooldown timing.
- Simpler code and debugging.

**Cons:**
- Ignores situational advantages (close range, high confidence, energy imbalances).

### Distance-based power

Adjust power based on enemy distance:

```pseudocode
if distance < 150:
    power = 3.0
else if distance < 400:
    power = 2.0
else:
    power = 1.2
```

**Rationale:** Close targets are easier to hit and slower bullets don't matter as much. Distant targets require speed over power.

### Confidence-based power

If your targeting system tracks hit rate or prediction confidence, scale power accordingly:

```pseudocode
hitRate = hits / (hits + misses)
if hitRate > 0.7:
    power = 3.0  # High confidence
else if hitRate > 0.4:
    power = 2.0
else:
    power = 1.0  # Low confidence, prefer speed
```

This approach is common with virtual guns or statistical targeting: fire strong when you're landing shots, and fire light when you're struggling.

### Energy-based power

When your energy is low, reduce power to preserve a survival buffer:

```pseudocode
myEnergy = getEnergy()
enemyEnergy = getEnemyEnergy()

if myEnergy < 10:
    power = 0.5  # Conserve energy
else if myEnergy > enemyEnergy + 20:
    power = 3.0  # Dominate with firepower
else:
    power = 2.0  # Balanced
```

**Insight:** If you have a large energy advantage, you can afford to fire heavy bullets and pressure the enemy. If you're behind, lighter shots keep you in the fight longer.

### Hybrid strategies

Many competitive bots combine multiple factors:

```pseudocode
power = 2.0  # Start with default

# Reduce for distance
if distance > 400:
    power = min(power, 1.5)

# Reduce for low energy
if myEnergy < 15:
    power = min(power, 1.0)

# Increase for close range and high confidence
if distance < 150 and hitRate > 0.6:
    power = 3.0
```

## Timing decisions: when to fire

### Fire every turn?

You **cannot** fire every turn due to gun heat. After firing, your gun must cool down (typically 0.1 heat/turn) before the next shot.

Attempting to fire while gun heat > 0 results in no shot.

### Predictive firing

For advanced bots using wave-based targeting, fire when:
- A bullet wave reaches the enemy's predicted position.
- Your gun is aimed at the highest-probability angle.
- Gun heat is 0 (gun is cool).

This often means firing every *N* turns (depending on bullet power and cooling rate), not every single turn.

### Opportunistic firing

Some situations favor delaying a shot:
- **Wait for a better angle:** If the enemy is about to move into a more predictable position (e.g., heading toward a wall), delay firing.
- **Conserve energy:** If you're low on energy and the shot isn't critical, skip it.
- **Gun heat alignment:** If your gun will be cool in 1 turn and the enemy will be in a better position, wait.

> [!TIP] Fire when ready
> Most competitive bots fire whenever gun heat is 0 and the gun is aimed. Delaying too much can mean missed opportunities, especially in fast-paced 1v1 battles.

## Bullet power and cooldown timing

Gun heat added per shot:

$h = 1 + \frac{p}{5}$

Where $p$ is bullet power.

**Cooldown time** (turns to fire again):

$t = \frac{h}{c} = \frac{1 + p/5}{0.1} = 10 + 2p$

For power 3.0:
$t = 10 + 2(3.0) = 16 \text{ turns}$

For power 1.0:
$t = 10 + 2(1.0) = 12 \text{ turns}$

**Implication:** Higher power means fewer shots per round. If you fire 3.0 power every time, you might only get 5–10 shots in a 100-turn match. Lighter bullets mean more shots and more chances to hit.

## Platform notes

### Classic Robocode

- Gun heat formula: $h = 1 + p/5$
- Cooling rate: 0.1 per turn (standard)
- Bullet speed: $20 - 3p$

### Tank Royale

- Gun heat formula: $h = 1 + p/5$ (same)
- Cooling rate: 0.1 per turn (standard)
- Bullet speed: $20 - 3p$ (same)

The mechanics are consistent across both platforms, so strategies developed for classic Robocode apply directly to Tank Royale.

## Tips and common mistakes

### ✅ Good practices

- **Scale power with confidence:** Fire strong when you're landing hits, light when you're missing.
- **Watch your energy:** Always keep a buffer (10–15 energy) to survive return fire.
- **Adjust for distance:** Distant targets need speed more than power.
- **Consider enemy energy:** If they're low, even weak shots can finish them off.

### ❌ Common mistakes

- **Always firing max power:** Wastes energy, slows bullets, and reduces hit rate against nimble enemies.
- **Always firing min power:** Deals chip damage and prolongs battles, giving enemies time to adapt.
- **Ignoring gun heat:** Trying to fire before cooldown completes results in wasted turns.
- **Firing when critically low on energy:** Risking disablement (0 energy) or death (< 0 energy) for a single shot.

## Summary

Fire power and timing decisions are strategic choices that balance speed, damage, energy, and gun heat. The best approach depends on:

- **Range to target** — Closer = stronger, farther = faster.
- **Your targeting accuracy** — High confidence = more power, low confidence = lighter shots.
- **Energy levels** — Yours and the enemy's.
- **Gun heat cycle** — Fire when cool, not before.

Experiment with different strategies, track your hit rates, and adapt to each opponent's movement style. Mastering fire power selection is a key step from intermediate to advanced play.


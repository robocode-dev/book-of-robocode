---
title: "Energy as a Resource"
category: "Energy & Scoring"
summary: "Understanding energy as a strategic resource in Robocode — managing life, firepower, and tactical positioning through careful energy decisions."
tags: [ "energy", "energy-management", "strategy", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Energy (classic Robocode) https://robowiki.net/wiki/Energy",
  "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
]
---

# Energy as a Resource

> [!TIP] Origins
> Energy management strategies were developed and documented by the RoboWiki community, with significant contributions
> from **Patrick Cupka ("Voidious")** and other competitive bot developers.

In Robocode, energy is more than a health bar — it's the currency of battle. Every shot fired, every hit taken, and
every hit landed creates an energy transaction that can swing the battle. Understanding how to manage, conserve, and
exploit energy gives bots a critical strategic edge.

<img src="/images/energy-flow-diagram.svg" alt="Energy flows between bots through bullets — draining the attacker, damaging the defender, and rewarding successful hits" width="1000"><br>
*Energy flows between bots through bullets — draining the attacker, damaging the defender, and rewarding successful
hits*

## Why energy matters

Energy serves three critical roles in combat:

1. **Life total** — When energy reaches 0, the bot is disabled. Below 0, the bot is destroyed.
2. **Firing cost** — Every bullet fired costs energy equal to its power (0.1 to 3.0).
3. **Hit reward** — Landing a hit returns 3× the bullet power as energy.

This creates a fundamental strategic loop: successful offense generates energy, while poor offense drains it. A bot
that hits consistently gains an energy advantage, while a bot that misses falls behind.

> [!TIP] Energy advantage = strategic control
> When you have more energy than your opponent, you can afford to take risks: fire heavier bullets, move aggressively,
> or absorb hits to secure a better position. When you're low on energy, you must prioritize survival and efficiency.

## Starting energy and constraints

Every bot starts with **100 energy** at the beginning of a round. Bots that implement the **Droid** interface start with
**120 energy** instead.

**Energy constraints:**

- **Minimum firing power:** 0.1 (costs 0.1 energy).
- **Maximum firing power:** 3.0 (costs 3.0 energy).
- **Disabled state:** When energy reaches exactly 0, the bot is disabled (cannot move, turn, or fire).
- **Death:** When energy drops below 0, the bot is destroyed and removed from the battle.

## Energy flow: costs and rewards

Energy transactions happen at specific moments in the battle:

- **Firing costs** are deducted **immediately** when you call `fire()` or `setFire()`.
- **Damage** is dealt to the target when the bullet **impacts**.
- **Hit rewards** are credited to the attacker when the bullet **connects with the target**.

This timing matters: you pay upfront for every shot but only recover energy if the bullet lands. So make every bullet
count.

### Firing costs

When a bot fires a bullet, it immediately pays the energy cost:

$\text{energyCost} = \text{bulletPower}$

**Example:**

- Fire a 2.0 power bullet → lose 2.0 energy instantly.
- Fire a 3.0 power bullet → lose 3.0 energy instantly.

This cost is paid even if the bullet misses, making accuracy essential for energy efficiency.

### Damage dealt

When a bullet hits, the target takes damage according to the formula:

$\text{damage} = 4 \times \text{bulletPower} + \max(0, 2 \times (\text{bulletPower} - 1))$

This means bullets with power ≤ 1.0 deal simple damage (4× power), while bullets above 1.0 get a bonus.

**Examples:**

- 0.1 power bullet → 4×0.1 + max(0, 2×(0.1-1)) = 0.4 + 0 = 0.4 damage
- 1.0 power bullet → 4×1.0 + max(0, 2×(1.0-1)) = 4.0 + 0 = 4.0 damage
- 2.0 power bullet → 4×2.0 + max(0, 2×(2.0-1)) = 8.0 + 2.0 = 10.0 damage
- 3.0 power bullet → 4×3.0 + max(0, 2×(3.0-1)) = 12.0 + 4.0 = 16.0 damage

The target's energy drops by the damage amount.

### Hit rewards

When a bullet hits, the **attacker** gains energy as a reward:

$\text{energyReward} = 3 \times \text{bulletPower}$

**Example:**

- Fire 2.0 power → costs 2.0 energy.
- Bullet hits → gain 3×2.0 = 6.0 energy.
- **Net gain:** 6.0 - 2.0 = 4.0 energy (if the hit lands).
- **Net loss:** -2.0 energy (if the bullet misses).

This creates a powerful incentive to fire accurately: every hit is a net energy gain, while every miss is a pure loss.

## Energy advantage and disadvantage in 1v1

The **energy differential** between you and your opponent is one of the most important tactical indicators in 1v1
battles. Your strategy should adapt based on whether you have more, less, or similar energy.

### Dominant position (large energy advantage)

When you have significantly more energy than your opponent (e.g., 80 vs. 30):

- **Fire heavier bullets** (2.5–3.0 power) to pressure and finish them quickly.<
- **Accept hits for positioning** — you can afford the energy loss to secure a corner or better angle.
- **Move aggressively** — close distance or push them into corners.
- **Force trades** — even if you both land hits, you win the exchange because you can sustain more damage.

**Rationale:** Your energy buffer lets you survive multiple hits while maintaining offensive pressure. The opponent
cannot afford to trade shots and must play defensively, giving you control of the battle.

### Defensive position (low energy)

When your energy is critically low (< 15):

- **Fire lighter bullets** (0.5–1.5 power) to conserve energy and stay in the fight longer.
- **Avoid risky shots** — missing a 3.0 power bullet when you have 10 energy could disable you.
- **Focus on evasion** — survival becomes more important than offense.
- **Play for accuracy** — one or two good hits can swing momentum back in your favor.

**Rationale:** A single hit could disable or destroy you. Every point of energy matters, so prioritize staying alive and
landing efficient shots over dealing maximum damage.

### Balanced engagement (similar energy)

When both bots have similar energy (e.g., 60 vs. 55):

- **Accuracy matters most** — the bot that lands more hits gains the energy advantage.
- **Use moderate power** (1.8–2.2) to balance damage and bullet speed.
- **Positioning is critical** — better angles and distances improve hit rates.
- **Track momentum** — small energy swings accumulate and shift the balance over time.

**Rationale:** Efficiency decides the battle. Consistent hits build momentum and create an energy advantage, while
missed shots drain your position. Neither bot can afford to be wasteful.

## Energy tactics in melee battles

Melee battles (3+ bots) require fundamentally different energy management than 1v1. The presence of multiple opponents
changes everything.

### High energy in melee

When you have high energy relative to other bots:

- **Stay defensive** — avoid drawing attention from multiple opponents.
- **Pick shots carefully** — fire at opportune moments, not continuously.
- **Avoid the center** — move along walls and edges to limit exposure.
- **Let others fight** — allow weaker bots to weaken each other while you conserve energy.
- **Don't accept hits** — even with high energy, taking fire from multiple bots drains you quickly.

**Rationale:** Aggressive movement makes you a priority target. Multiple opponents can focus fire and even overwhelm a
high-energy bot. Patience and positioning matter more than raw aggression.

### Low energy in melee

When your energy is low in a melee battle:

- **Become opportunistic** — fire only when you have high-probability shots.
- **Stay on the periphery** — avoid being caught between multiple opponents.
- **Fire light bullets** (0.5–1.5 power) to maximize shots before being eliminated.
- **Pick your target** — focus on other low-energy bots you can eliminate for survival points.

**Rationale:** You're unlikely to win through aggression. Your goal is to survive as long as possible, score
opportunistic hits, and outlast at least one other bot.

### Target selection in melee

Energy levels influence who you should target:

- **Target low-energy bots** — easier to eliminate, reducing the number of threats.
- **Avoid high-energy bots** — engaging them invites retaliation you can't afford.
- **Watch for 1v1 duels** — let two bots fight each other, then engage the weakened survivor.
- **Position defensively** — maintain distance from multiple threats.

**Rationale:** In melee, killing a bot is worth survival points and reduces incoming fire. Energy management is about
patience, positioning, and picking the right moments to engage.

## Energy management strategies

### Conservative firing

When energy is low or the target is challenging to hit, reduce bullet power:

```pseudocode
myEnergy = getEnergy()

if myEnergy < 15:
    power = 0.5  # Survival mode
else if myEnergy < 30:
    power = 1.2  # Cautious
else:
    power = 2.0  # Normal
```

**Rationale:** Firing a heavy bullet and missing can leave you vulnerable. Light bullets keep you in the fight longer.

### Aggressive firing

When you have a large energy lead, capitalize with heavier bullets:

```pseudocode
myEnergy = getEnergy()
enemyEnergy = getEnemyEnergy()

if myEnergy > enemyEnergy + 30:
    power = 3.0  # Finish them
else if myEnergy > enemyEnergy + 15:
    power = 2.5  # Press the advantage
else:
    power = 2.0  # Balanced
```

**Rationale:** Heavy bullets deal more damage and score more points. When you can afford the cost, use them to close
out the round.

### Energy tracking

Advanced bots monitor enemy energy to detect bullet fires and predict behavior:

```pseudocode
previousEnemyEnergy = 100
currentEnemyEnergy = getEnemyEnergy()

energyDrop = previousEnemyEnergy - currentEnemyEnergy

if energyDrop >= 0.1 and energyDrop <= 3.0:
    # The enemy likely fired a bullet (not taking damage from us).
    # If the drop matches a bullet power (0.1-3.0), assume they fired.
    bulletPower = energyDrop
    bulletSpeed = 20 - 3 * bulletPower
    # Use this to predict bullet arrival or dodge
```

**Rationale:** Knowing when and how hard the enemy fired helps with dodging, positioning, and timing your own shots.

## Energy and endgame scenarios

### Finishing a low-energy opponent

When the enemy is nearly out of energy (< 10), even a weak bullet can finish them:

```pseudocode
enemyEnergy = getEnemyEnergy()

if enemyEnergy < 4:
    power = 0.1  # Minimal power to finish
else if enemyEnergy < 10:
    power = 1.0  # Moderate power
else:
    power = 2.0  # Normal
```

**Why:** A 0.1-power bullet is fast (speed 19.7), and just a single hit is enough to eliminate a disabled opponent. No
need to waste energy on overkill shots.

### Disabled bot scenarios

When a bot's energy reaches exactly 0, it becomes **disabled**:

- It cannot move, turn, or fire.
- It remains on the battlefield as a stationary target.
- Opponents can score points by destroying it (hitting it until energy < 0).

**Tactical priority:** A disabled bot should be your **highest priority target**. Finish them off immediately with light
bullets before your remaining opponents do. Missing the opportunity to destroy a disabled bot means giving those
survival points to someone else — points you could have claimed.

**In 1v1:** If you disabled the opponent, finish them quickly. The round is yours to win.

**In melee:** If any bot becomes disabled, shift your focus to destroy it. The points matter more than continuing your
current engagement, and a disabled bot is guaranteed damage with zero risk.

## Tips and common mistakes

### ✅ Good practices

- **Track your energy and the enemy's energy** — use it to inform firing decisions and to detect when the enemy fires a
  bullet at you.
- **Conserve energy when low** — firing heavy bullets when you have low energy is often fatal.
- **Capitalize on energy advantages** — press harder when you're ahead.
- **Aim for net-positive energy trades** — every hit should gain you more than you spent.

### ❌ Common mistakes

- **Ignoring energy levels** — firing max power bullets when critically low on energy.
- **Missing frequently** — every miss is a pure energy loss with no reward.
- **Not tracking enemy energy** — missing opportunities to dodge, predict behavior, or finishing off a disabled
  opponent.
- **Overfiring when ahead** — wasting energy on overkill shots when lighter bullets would suffice.

## Summary

Energy is the lifeblood of every Robocode battle. It determines how much damage you can deal, how much damage you can
absorb, and how long you can stay in the fight. Managing energy means balancing offense and defense: firing accurately
to gain energy through hits, conserving energy when low, and exploiting energy advantages when ahead.

The best bots treat energy as a tactical resource, not just a health bar — making every shot count, tracking the
enemy's energy, and adjusting their strategy based on the energy differential.

> "In Robocode, the bot with the most energy isn't necessarily winning — but the bot that manages energy best usually
> is."

## Further Reading

- [Energy](https://robowiki.net/wiki/Energy) — RoboWiki (classic Robocode)
- [Robocode Tank Royale - Physics](https://robocode.dev/articles/physics.html) — Tank Royale documentation

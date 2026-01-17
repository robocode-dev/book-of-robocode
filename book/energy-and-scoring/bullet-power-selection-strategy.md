---
title: "Bullet Power Selection Strategy"
category: "Energy & Scoring"
summary: "A strategic framework for choosing bullet power based on distance, energy levels, confidence, and battle context — maximizing scoring efficiency across 1v1 and melee scenarios."
tags: [ "bullet-power", "fire-power", "strategy", "energy-management", "scoring", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Bullet (classic Robocode) https://robowiki.net/wiki/Bullet",
  "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html#bullets"
]
---

# Bullet Power Selection Strategy

Choosing the right bullet power is one of the most consequential tactical decisions in Robocode. Fire is too weak, and
you leave damage on the table; fire is too strong, and you waste energy on slow bullets that miss. This page presents a
strategic framework for bullet power selection that adapts to distance, energy levels, targeting confidence, and battle
context.

### Bullet Power Decision Factors

The table below provides quick-reference guidelines for choosing bullet power based on four key factors. **Colors
indicate the recommended power level:**

- 🟢 **Green** = High power (2.5–3.0) — Favorable conditions for heavy bullets
- 🟡 **Yellow/Orange** = Moderate power (1.0–2.5) — Balanced situations
- 🔴 **Red** = Low power (0.5–1.5) — Conservative fire required
- 🔵 **Blue** = Calculated power — Tactical situations requiring precise calculation
- ⚫ **Gray** = Context-dependent — Adjust based on the situation

<style>
.power-table { border-collapse: collapse; }
.power-table th, .power-table td { border: 3px solid #555; padding: 12px; }
</style>

<table class="power-table">
<thead>
<tr>
<th>Factor</th>
<th>Condition</th>
<th>Recommended Power</th>
<th>Rationale</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="3"><strong>Distance</strong></td>
<td style="background-color: #0d4429;">Close (&lt; 150 units)</td>
<td style="background-color: #0d4429;"><strong>2.5–3.0</strong></td>
<td>Bullets arrive quickly; maximize damage</td>
</tr>
<tr>
<td style="background-color: #4d3d00;">Medium (150–400 units)</td>
<td style="background-color: #4d3d00;"><strong>1.8–2.2</strong></td>
<td>Balance damage with bullet speed</td>
</tr>
<tr>
<td style="background-color: #4d1919;">Long (&gt; 400 units)</td>
<td style="background-color: #4d1919;"><strong>0.8–1.5</strong></td>
<td>Prioritize speed to reduce travel time</td>
</tr>
<tr>
<td rowspan="4"><strong>Your Energy</strong></td>
<td style="background-color: #4d1919;">Critical (&lt; 15)</td>
<td style="background-color: #4d1919;"><strong>0.5–1.0</strong></td>
<td>Preserve energy; avoid disablement</td>
</tr>
<tr>
<td style="background-color: #664400;">Low (15–35)</td>
<td style="background-color: #664400;"><strong>1.0–1.8</strong></td>
<td>Balance offense with survival</td>
</tr>
<tr>
<td style="background-color: #4d3d00;">Healthy (35–70)</td>
<td style="background-color: #4d3d00;"><strong>1.8–2.5</strong></td>
<td>Standard combat flexibility</td>
</tr>
<tr>
<td style="background-color: #0d4429;">Dominant (&gt; 70)</td>
<td style="background-color: #0d4429;"><strong>2.5–3.0</strong></td>
<td>Can afford heavy shots and pressure</td>
</tr>
<tr>
<td rowspan="3"><strong>Confidence</strong></td>
<td style="background-color: #0d4429;">High (hit rate &gt; 70%)</td>
<td style="background-color: #0d4429;"><strong>2.5–3.0</strong></td>
<td>Landing shots; maximize damage</td>
</tr>
<tr>
<td style="background-color: #4d3d00;">Moderate (hit rate 40–70%)</td>
<td style="background-color: #4d3d00;"><strong>1.8–2.2</strong></td>
<td>Competitive performance</td>
</tr>
<tr>
<td style="background-color: #4d1919;">Low (hit rate &lt; 40%)</td>
<td style="background-color: #4d1919;"><strong>0.8–1.5</strong></td>
<td>Prioritize speed over damage</td>
</tr>
<tr>
<td rowspan="4"><strong>Context</strong></td>
<td style="background-color: #333;">1v1 balanced</td>
<td style="background-color: #333;"><strong>1.8–2.2</strong></td>
<td>Accuracy matters most</td>
</tr>
<tr>
<td style="background-color: #333;">Melee standard</td>
<td style="background-color: #333;"><strong>1.5–2.0</strong></td>
<td>Energy efficiency priority</td>
</tr>
<tr>
<td style="background-color: #2a2a4d;">Finishing shot</td>
<td style="background-color: #2a2a4d;"><strong>Calculate minimum</strong></td>
<td>Don't waste power on overkill</td>
</tr>
<tr>
<td style="background-color: #0d4429;">Enemy cornered</td>
<td style="background-color: #0d4429;"><strong>+0.3–0.5</strong></td>
<td>Limited evasion options</td>
</tr>
</tbody>
</table>

## Why bullet power is strategic

Bullet power selection directly impacts four combat dimensions:

1. **Damage output** — Higher power delivers more
   damage: $\text{damage} = 4 \times \text{power} + \max(0, 2 \times (\text{power} - 1))$
2. **Bullet speed** — Lower power travels faster: $\text{speed} = 20 - 3 \times \text{power}$ units/turn
3. **Energy cost** — Each shot costs energy equal to its power (0.1 to 3.0)
4. **Gun cooldown** — Higher power adds more heat: $\text{heat} = 1 + \frac{\text{power}}{5}$

These tradeoffs create a fundamental tension: high damage comes at the cost of speed, energy, and firing rate. The
optimal choice depends on the tactical situation.

> [!TIP] Scoring efficiency matters more than raw damage
> A 1.5 power bullet that hits scores more points than a 3.0 power bullet that misses. Your goal is to maximize expected
> damage per shot, not theoretical maximum damage.

## The strategic framework

Effective bullet power selection considers four primary factors:

### Distance to target

Distance determines bullet travel time, which directly affects hit probability. Longer travel times amplify targeting
errors and give opponents more time to evade.

**Strategic guidelines:**

- **Close range (< 150 units):** Use high power (2.5–3.0). Bullets arrive quickly regardless of speed, so maximize
  damage.
- **Medium range (150–400 units):** Use moderate power (1.8–2.2). Balance damage with reasonable bullet speed.
- **Long range (> 400 units):** Use low power (0.8–1.5). Prioritize speed to minimize prediction error and evasion time.

**Rationale:** At close range, the enemy cannot evade effectively, so slow bullets don't matter. At long range, even a
perfect prediction can be missed if the bullet is too slow — the target has more time to change course or respond to
battlefield events.

### Energy levels

Your energy level determines how much risk you can afford. Low energy demands conservative play; high energy enables
aggressive power selection.

**Your energy state:**

- **Critical (< 15):** Fire 0.5–1.0 power. Preserve energy to avoid disablement. One heavy bullet that misses could end
  the round.
- **Low (15–35):** Fire 1.0–1.8 power. Balance offense with survival. You can still fight, but you can't afford waste.
- **Healthy (35–70):** Fire 1.8–2.5 power. Standard combat power levels with flexibility.
- **Dominant (> 70):** Fire 2.5–3.0 power when justified. You can absorb the energy cost and sustain pressure.

**Enemy energy state:**

- **Enemy critical (< 15):** Use just enough power to finish them. Don't waste 3.0 when 1.5 will kill.
- **Enemy low (15–35):** Increase power to pressure them. Force defensive behavior.
- **Energy advantage (you > enemy + 30):** Use heavy bullets to press your advantage and force trades.

**Rationale:** Energy is survival. When low, every shot could be your last, so maximize shot count over per-shot damage.
When high, you can afford to trade misses for knockout power.

### Targeting confidence

If your bot tracks hit rates or prediction confidence, use that data to adjust power. High confidence justifies high
power; low confidence demands speed over damage.

**Confidence-based scaling:**

- **High confidence (hit rate > 70%):** Fire 2.5–3.0 power. You're landing shots — maximize damage.
- **Moderate confidence (hit rate 40–70%):** Fire 1.8–2.2 power. You're competitive but not dominant.
- **Low confidence (hit rate < 40%):** Fire 0.8–1.5 power. Prioritize bullet speed to increase hit probability.

**Implementation note:** Many advanced bots use virtual guns or statistical targeting systems that provide confidence
metrics. If you don't track confidence, fall back to distance and energy-based decisions.

**Rationale:** A 3.0 power bullet that hits is worth more than a 1.0 power bullet, but a 1.0 power bullet that hits is
worth infinitely more than a 3.0 power bullet that misses. If you're struggling to hit, faster bullets improve your
odds.

## Battle context adjustments

Beyond distance, energy, and confidence, certain tactical situations call for specific power choices:

### Finishing shots

When the enemy is low on energy and one shot can win the round, calculate the minimum power needed. Recall the damage
formula: $\text{damage} = 4 \times \text{power} + \max(0, 2 \times (\text{power} - 1))$

Work backwards: if you know the enemy's remaining energy, find the minimum power to exceed it:

$\text{power} \approx \frac{\text{enemyEnergy}}{6}$ (for power > 1.0, accounting for the bonus term)

For lower powers (0.1–1.0), use the simpler formula:

$\text{power} \approx \frac{\text{enemyEnergy}}{4}$

**Example:** Enemy has 8 energy remaining.
- Using the general formula: $\text{power} \approx \frac{8}{6} \approx 1.33$
- A 1.5 power bullet deals $4 \times 1.5 + 2 \times (1.5 - 1) = 6 + 1 = 7$ damage (not quite enough)
- A 2.0 power bullet deals $4 \times 2.0 + 2 \times (2.0 - 1) = 8 + 2 = 10$ damage (kills them)
- Fire 2.0 power.

**Key principle:** Always round up and add a small buffer to account for floating-point rounding. Firing 3.0 when 1.5
will do is wasteful — aim for the minimum that guarantees the kill, no more.

### Melee combat

In melee battles (3+ bots), bullet power selection requires different priorities:

- **Conservative by default:** Fire 1.5–2.0 power to balance damage with energy efficiency. You're fighting multiple
  opponents, so energy conservation matters more than 1v1.
- **Opportunistic heavy shots:** Use 2.5–3.0 power only when you have a high-confidence shot at a low-energy bot you can
  eliminate.
- **Light shots when crowded:** If multiple bots are clustered or moving unpredictably, fire 0.8–1.2 power to increase
  hit probability.

**Rationale:** Melee rewards consistent scoring over knockout power. Eliminating bots earns survival points, but wasting
energy on missed heavy bullets leaves you vulnerable to focused fire.

### Wall proximity

When the enemy is near a wall, their evasion options are limited. This is an opportunity for higher power:

- If they're cornered (< 100 units from wall), consider 2.5–3.0 power even at longer distances.
- If they're approaching a wall predictably, fire heavier than distance alone would suggest.

**Rationale:** Walls constrain movement, reducing the enemy's ability to dodge. This effectively increases your
confidence, justifying higher power.

## Common strategies in practice

### Fixed power approach

Some competitive bots use a single fixed power (e.g., 1.95 or 2.0) for simplicity and consistency. This works well when:

- Your targeting system is highly accurate across distances.
- You want predictable gun heat cycles.
- You're optimizing for specific opponent types or battle conditions.

**Pros:** Simple, debuggable, consistent cooldown timing.  
**Cons:** Ignores situational advantages (close range, energy imbalances, finishing shots).

### Hybrid formula

Many advanced bots combine multiple factors into a single calculation:

```pseudocode
basePower = 2.0

# Adjust for distance
if distance < 150:
    distanceFactor = 1.5
else if distance < 400:
    distanceFactor = 1.0
else:
    distanceFactor = 0.6

# Adjust for energy
myEnergy = getEnergy()
if myEnergy < 15:
    energyFactor = 0.3
else if myEnergy < 35:
    energyFactor = 0.7
else:
    energyFactor = 1.0

# Adjust for confidence (if tracked)
if hitRate > 0.7:
    confidenceFactor = 1.2
else if hitRate < 0.4:
    confidenceFactor = 0.6
else:
    confidenceFactor = 1.0

# Calculate final power
power = basePower * distanceFactor * energyFactor * confidenceFactor
power = clamp(power, 0.1, 3.0)
```

This approach dynamically scales power based on real-time conditions, adapting to each shot.

## Tips and common mistakes

> [!WARNING] Don't waste energy on impossible shots
> If your targeting system is struggling (hit rate < 30%) at long range, firing 3.0 power bullets is a guaranteed path
> to defeat. Drop to 1.0 or lower and focus on improving your aim before scaling up power.

> [!TIP] Minimum viable power for finishing shots
> When the enemy is low on energy, calculate the exact power needed to finish them. Firing 3.0 when 1.5 will do wastes
> energy and cooling time for your next target.

**Common mistakes to avoid:**

- **Always firing maximum power:** Slow bullets miss more often at long range. You score more damage with moderate power
  and higher hit rates.
- **Ignoring your own energy level:** Firing 3.0 power bullets when you have 12 energy is dangerous. One miss and you're
  disabled.
- **Not adapting to melee:** 1v1 strategies don't work in melee. Energy efficiency and survival matter more than
  knockout power.
- **Forgetting gun heat:** High power adds more heat. If you need to fire again quickly (e.g., finishing a wounded bot),
  moderate power reduces cooldown.

## Summary

Bullet power selection is a multi-dimensional strategic problem. The optimal choice depends on:

- **Distance:** Closer targets justify higher power.
- **Energy:** Low energy demands conservative power.
- **Confidence:** High hit rates justify heavy bullets.
- **Context:** Finishing shots, melee battles, and wall proximity all influence decisions.

Competitive bots often use hybrid formulas that weigh these factors dynamically, adapting to each shot. Start with
distance and energy-based rules, then add confidence tracking as your targeting system matures. Over time, you'll
develop intuition for power selection that matches your bot's strengths and your opponents' weaknesses.

**Next steps:**

- Read [Energy as a Resource](./energy-as-a-resource.md) for deeper energy management principles.
- See [Fire Power & Timing Decisions](../targeting/targeting-tactics/fire-power-timing-decisions.md) for
  targeting-focused power considerations.
- Explore [Bullet Travel & Bullet Physics](../physics/bullet-physics.md) for the underlying mechanics.

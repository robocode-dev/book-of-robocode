---
title: "Energy Management in 1v1 and Melee"
category: "Energy & Scoring"
summary: "Advanced strategies for managing energy across different battle formats — prioritizing survival in 1v1 duels, adapting to chaos in melee, and timing aggressive and defensive phases based on energy advantages."
tags: [ "energy", "energy-management", "strategy", "1v1", "melee", "advanced", "robocode", "tank-royale" ]
difficulty: "advanced"
source: [
  "RoboWiki - One on One (classic Robocode) https://robowiki.net/wiki/One_on_One",
  "RoboWiki - Melee (classic Robocode) https://robowiki.net/wiki/Melee",
  "RoboWiki - Energy (classic Robocode) https://robowiki.net/wiki/Energy",
  "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
]
---

# Energy Management in 1v1 and Melee

> [!TIP] Origins
> Energy management strategies across battle formats were developed and refined by the RoboWiki community,
> with contributions from competitive bot developers including **Voidious**, **Skilgannon**, and **Chase**.

Energy management looks different depending on the battle format. A 1v1 duel is a focused contest between two bots where 
energy decisions are locked into a predictable opponent's cycle. Melee is a chaotic multi-bot environment where energy 
must be budgeted across unknown threats and rapidly shifting alliances. Understanding these distinctions transforms 
energy management from a general principle into a battle-specific weapon.

## 1v1 Energy Strategy

In 1v1, energy management is a **head-to-head resource race**. Both bots begin with equal energy; the bot that converts 
energy into damage more efficiently wins. The key strategic insight is that energy flow is **visible and predictable** — 
you know exactly how much energy your opponent has, when they fire, and how much damage they deal.

### The Energy Cycle in 1v1

A typical 1v1 battle progresses through distinct **energy phases**:

1. **Opening (Ticks 1–50)**
   - Both bots start with 100 energy (or 120 if using the Droid interface).
   - Aggressive early fire builds momentum and damages the opponent before they can establish defensive positioning.
   - **Strategy:** Fire moderate power (1.5–2.0) to inflict consistent damage while conserving energy for mid-game.

2. **Mid-Game (Ticks 51–300)**
   - Energy levels diverge based on hit accuracy and bullet efficiency.
   - The bot with an energy lead dictates engagement distance and firing tempo.
   - **Strategy:** If ahead, fire heavier bullets (2.5–3.0) to maximize damage output. If behind, reduce fire power 
     (0.5–1.0) and focus on movement to escape until energy recovers.

3. **End-Game (Final 100 Ticks)**
   - Energy becomes critical for survival; disabled bots cannot move or fire.
   - The bot that carefully managed energy reserves typically wins.
   - **Strategy:** At low energy (<20), fire only when high-confidence shots are available. Prioritize survival over 
     offense.

### Aggressive vs. Defensive Positioning

Energy level determines your positioning strategy:

**High Energy (>70):**
- Move aggressively toward your opponent to reduce bullet travel time and time-to-target.
- Fire heavier bullets (2.5–3.0) to maximize burst damage.
- Take calculated risks on movement to secure positioning advantage.

**Moderate Energy (35–70):**
- Maintain balanced positioning — not too close, not too far.
- Fire moderate power (1.5–2.5) and vary distance to avoid predictable patterns.
- Respond defensively to opponent aggression.

**Low Energy (<35):**
- Move conservatively to preserve energy for firing.
- Increase distance from an opponent to maximize bullet travel time (giving more time to dodge).
- Fire low power (0.5–1.5) and only when confident of a hit.
- Focus on movement evasion rather than aggressive offense.

### Energy Advantage Exploitation

When you detect an energy advantage:

- **Fire rate:** Increase firing frequency to apply pressure while the opponent is resource-constrained.
- **Bullet power:** Shift toward heavier bullets to punish their defensive positioning.
- **Movement:** Push forward to control distance and reduce their escape options.

When behind in energy:

- **Fire rate:** Reduce frequency; make each shot count (high confidence only).
- **Bullet power:** Use lighter bullets (0.8–1.5) to conserve energy.
- **Movement:** Increase evasion complexity to reduce opponent hit rate, allowing your energy to recover.

### Timing Aggressive Phases

A common 1v1 pattern is the **energy-dip counter-attack**: when your opponent fires a heavy bullet, their energy temporarily 
dips below yours. Experienced players respond by:

1. Detecting opponent energy drop via damage intake timing.
2. Immediately shifting to aggressive fire (heavier bullets, closer approach).
3. Exploiting the 2–3 tick window before the opponent can recover and re-engage.

This requires real-time energy tracking and fast decision-making, but it separates competitive bots from beginners.

---

## Melee Energy Strategy

Melee adds complexity: **multiple opponents, unpredictable alliances, and rapid environmental changes**. Energy management 
must account for:

- Threats from multiple directions.
- Interference from other bots' bullets and bodies.
- Rapid changes in opponent proximity and engagement status.
- Survival scoring (staying alive longer than opponents) rather than pure damage output.

### Survival-First Energy Budgeting

In melee, **survival energy** is distinct from **offensive energy**:

- **Survival Energy Budget:** Reserve 20–30 energy at all times. This ensures you can always fire a low-power bullet 
  (0.1 energy) to move away from threats without risking disablement.
- **Offensive Energy:** Use remaining energy for damage output, but always leave the survival buffer.

Example:
- Current energy: 60
- Survival buffer: 25
- Offensive energy available: 35

This conservative approach prevents disablement during chaotic moments when multiple bots converge.

### Threat Prioritization by Energy Cost

In melee, not all opponents are equally valuable targets. Prioritize fire based on:

1. **Distance-adjusted threat level:**
   - Closest opponent = highest threat (most likely to hit you).
   - Weakest opponent (low health) = highest reward for finishing.

2. **Energy-efficient kills:**
   - A weakened opponent (15 energy) is a better target than a full-health bot.
   - Use low-power bullets (0.5–1.5) on distant weak opponents to secure kills without energy waste.
   - Reserve heavy bullets (2.5–3.0) for close, high-confidence shots on strong opponents.

### Position-Based Energy Decisions

**In Open Field:**
- Energy abundance allows moderate offense (1.5–2.5 power).
- Maintain distance to avoid converging threats.
- Fire at the closest major threat.

**Near Walls:**
- Walls create choke points where multiple bots cluster.
- Reduce firepower (0.5–1.2) to avoid wasting energy when escape routes are limited.
- Prioritize movement over offense to break free from the cluster.

**After Eliminations:**
- When an opponent is eliminated, reassess energy reserves.
- If low on energy, recover by reducing the fire rate and moving defensively.
- If high on energy, shift to aggressive offense against remaining opponents.

### Energy Recovery Windows

Melee presents unpredictable moments where threats momentarily disappear (opponents battling each other far away). Use 
these **recovery windows** to:

1. Reduce the fire rate significantly (fire only 1–2 bullets per tick instead of constant fire).
2. Move defensively to maximize distance from remaining threats.
3. Allow energy to rebuild toward 70–100, re-establishing offensive capability.

A bot that recognizes recovery windows and exploits them effectively can shift from survival mode (low energy, low fire) 
to dominance mode (high energy, heavy fire) multiple times in a single melee round.

---

## Format Comparison Table

The table below summarizes energy management differences between formats:

| Aspect | 1v1 | Melee |
|--------|-----|-------|
| **Primary Goal** | Maximize damage output | Stay alive longer than opponents |
| **Opponent Knowledge** | Exact energy visible | Only direct opponents' energy visible |
| **Threat Predictability** | High (one opponent) | Low (3+ unpredictable threats) |
| **Survival Buffer** | Optional; aggressive dominance is acceptable | Essential; maintain 20–30 energy reserve |
| **Firing Strategy** | Continuous aggression or calculated conservation | Intermittent, threat-dependent fire |
| **Distance Control** | Critical; dictates battle tempo | Secondary; evasion from clusters matters more |
| **Energy Recovery** | Passive (wait for opponent to miss) | Active (exploit quiet moments) |
| **Optimal Bullet Power** | 1.5–3.0 depending on energy lead | 0.5–2.0; reserve heavy bullets for finishers |

---

## Tips & Common Mistakes

**✅ Do:**
- Track energy deltas (yours vs. opponent's) to identify moments to shift aggression or defense.
- In 1v1, exploit energy-dip windows by matching opponent fire patterns.
- In melee, maintain a survival buffer to avoid disablement in surprise engagements.
- Adjust bullet power per engagement; don't fire the same power at all distances.
- Use movement to control distance; energy is cheaper than bullets in the long run.

**❌ Don't:**
- Assume energy leads persist; focus on decisions now, not past advantages.
- In melee, fire constantly without a target; wasted bullets drain energy without a reward.
- Drop below survival buffer in melee without an immediate, high-confidence threat nearby.
- Fire the maximum power at long distances where bullets move slowly and miss frequently.
- Forget that every bullet you fire returns **3× the power as energy** when it hits — this is your primary income.

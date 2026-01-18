---
title: "Scoring Systems & Battle Types"
category: "Energy & Scoring"
summary: "Understanding how Robocode's scoring system works across different battle types (1v1, melee, teams) and how to optimize your bot strategy for each format."
tags: [ "scoring-systems", "battle-types", "1v1", "melee", "teams", "intermediate", "robocode", "tank-royale" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Robocode/Scoring (classic Robocode) https://robowiki.net/wiki/Robocode/Scoring",
  "RoboWiki - Melee (classic Robocode) https://robowiki.net/wiki/Melee",
  "Robocode Tank Royale Docs - Scoring https://robocode.dev/articles/scoring.html"
]
---

# Scoring Systems & Battle Types

Robocode battles come in three main formats: **[1v1 duels](#1v1-strategy-maximize-damage-efficiency)**,
**[melee battles](#melee-strategy-survive-and-opportunize)**, and
**[team battles](#team-strategy-coordinate-for-collective-score)**. Each format uses the same basic scoring system but
emphasizes different strategies. Understanding how points are awarded — and which actions matter most in each format —
is essential for building competitive bots.

> [!NOTE] Competition standards
> This page covers scoring mechanics across battle types. For standardized competition formats (battlefield sizes, round
> counts, number of bots) used in community rankings, see
**[Competition Formats & Rankings](./competition-formats-rankings.md)**.

## Battle types overview

Robocode supports three primary battle formats. Understanding these formats is essential for bot development, as each
rewards different strategies and behaviors. For details on standard battlefield dimensions and round counts used in
competitions, see
**[Competition Formats & Rankings](./competition-formats-rankings.md#community-competition-categories)**.

| Battle Type    | Participants        | Win Condition                      | Key Strategy                                        |
|----------------|---------------------|------------------------------------|-----------------------------------------------------|
| **1v1 (Duel)** | 2 bots              | Highest score after rounds         | Maximize damage output and accuracy                 |
| **Melee**      | 3+ bots             | Last bot standing or highest score | Survival, target selection, opportunistic damage    |
| **Team**       | 2+ teams of 1+ bots | Highest team score                 | Coordination, shared targeting, role specialization |

Each format uses the same scoring categories but rewards different behaviors. A bot optimized for 1v1 might struggle in
melee, and vice versa.

> [!TIP] Choose your battles
> When designing a bot, decide early which format to target. A "do everything" bot rarely excels at anything.
> Specialist bots dominate their chosen format.

## Scoring categories: what earns points

All Robocode scoring systems award points across these categories:

### 1. Bullet damage points

The primary source of points. Every time a bullet hits an opponent, the attacker earns **1 point for each point of
damage** dealt:

$\text{bulletDamageScore} = \text{damage}$

Damage is calculated using the bullet damage formula:

$\text{damage} = 4 \times \text{bulletPower} + \max(0, 2 \times (\text{bulletPower} – 1))$

**Examples:**

- 1.0 power bullet hits → 4 damage → **4 points**
- 2.0 power bullet hits → 10 damage → **10 points**
- 3.0 power bullet hits → 14 damage → **14 points**

In most battles, bullet damage accounts for 60-80% of the final score. The remaining 20-40% comes from kill bonuses
(bullet and ram damage bonuses), survival points, and last survivor bonuses—with the exact breakdown varying by battle
type and bot strategy.

### 2. Ram damage points

When bots collide, both take damage. The bot earns **2 points for each point of ram damage** dealt to the opponent:

$\text{ramDamageScore} = 2 \times \text{ramDamage}$

The ram damage itself is:

$\text{ramDamage} = 0.6 \times \text{relativeVelocity}$

**Ram damage bonus:** When a bot kills an enemy by ramming, it scores an additional **30% of all the ram damage** it did
to that enemy.

**Example calculation:** If a bot dealt 30 points of ram damage to an enemy across multiple collisions before delivering a fatal ram:
- **Regular ram scoring:** $2 \times 30 = 60$ points (earned throughout the fight)
- **Ram kill bonus:** $0.30 \times 30 = 9$ points (earned when the enemy dies)
- **Total ram score:** $60 + 9 = $ **69 points**

Ramming is rarely the primary strategy but can be decisive in endgame situations or against disabled bots. For details
on implementing ramming tactics, see **Ramming & Mirror Movement**.

### 3. Bullet damage bonus (kill bonus)

When a bot kills an enemy with a bullet, it scores an additional bonus:

$\text{bulletDamageBonus} = 0.20 \times \text{total bullet damage dealt to that enemy}$

This means the bot earns **20% of all the bullet damage** it did to that specific enemy as a bonus.

**Example:** If a bot dealt 100 damage in total to an enemy before killing it, the bonus is $0.20 \times 100 = 20$
points.

**Why kill bonuses matter:** Robocode matches consist of multiple rounds (typically 10-35), and the winner is determined
by **total cumulative score across all rounds**. Kill bonuses increase your score margin in each round you win and help
you win rounds that would otherwise be close.

**Concrete example (1v1, 3 rounds):**

Without kill bonus:
- Round 1: Bot A deals 100 damage (wins) → 100 + 50 survival + 10 last survivor = **160 points**
- Round 2: Bot B deals 100 damage (wins) → **160 points**
- Round 3: Bot A deals 100 damage (wins) → **160 points**
- **Final: Bot A 320, Bot B 160 → Bot A wins by 160**

With kill bonus:
- Round 1: Bot A deals 100 damage + 20 bonus (wins) → 120 + 50 + 10 = **180 points**
- Round 2: Bot B deals 100 damage + 20 bonus (wins) → **180 points**
- Round 3: Bot A deals 100 damage + 20 bonus (wins) → **180 points**
- **Final: Bot A 360, Bot B 180 → Bot A wins by 180**

The kill bonus amplifies your winning margin. In 1v1, securing the kill bonus in most rounds often determines match
victory. In melee, stealing kills from other bots becomes a major tactic for accumulating points.

### 4. Survival score

Each bot that survives a round scores **50 points every time another bot dies**.

$\text{survivalScore} = 50 \times \text{number of bots that died}$

**Example (5-bot melee):**

- **1st place (last survivor):** Bot alive when all 4 others die = $50 \times 4 = $ **200 points**
- **2nd place:** Bot alive when 3 others die = $50 \times 3 = $ **150 points**
- **3rd place:** Bot alive when 2 others die = $50 \times 2 = $ **100 points**
- **4th place:** Bot alive when 1 other dies = $50 \times 1 = $ **50 points**
- **5th place (first eliminated):** Bot dies first = $50 \times 0 = $ **0 points**

**In 1v1:** The survivor gets 50 points (1 opponent died).

In melee, survival points often exceed damage points, making defensive positioning critical.

### 5. Last survivor bonus

The last bot standing in a round earns an additional bonus:

$\text{lastSurvivorBonus} = 10 \times \text{number of opponents}$

**Examples:**

- **1v1 duel:** Last survivor gets $10 \times 1 = $ **10 points**
- **5-bot melee:** Last survivor gets $10 \times 4 = $ **40 points**

This bonus rewards finishing fights decisively and being the sole survivor.

## How battle types change strategy

### 1v1 strategy: maximize damage efficiency

In duels, there are no third-party interruptions. The bot that lands more high-value hits wins.

**Key priorities:**

1. **Accuracy over volume** — Missing shots wastes energy and gun heat. High hit rates (>30%) are essential.
2. **Energy management** — Maintain energy advantage to outlast the opponent.
3. **Kill bonus capture** — Delivering the final blow adds 20% of all damage dealt as a bonus.
4. **Positioning** — Control distance and angles to maximize hit probability.

**Scoring breakdown (typical 1v1):**

- Bullet damage: 70-85%
- Kill bonus: 10-20%
- Survival: 5-10%

**Strategy takeaway:** Focus on targeting accuracy and energy efficiency. Survival is secondary to damage output.

### Melee strategy: survive and opportunize

With 3+ bots, chaos reigns. Bots can steal kills, hit each other simultaneously, and form temporary alliances.

**Key priorities:**

1. **Survival first** — Placement points dominate scoring. Staying alive longer than half the field guarantees
   significant points (like royale games).
2. **Target selection** — Attack the weakest or most vulnerable bots. Avoid prolonged duels with strong opponents.
3. **Kill stealing** — Watch for bots near death and deliver finishing blows to collect bonuses.
4. **Avoid attention** — Being targeted by multiple bots simultaneously is fatal. Stay mobile and unpredictable.
5. **Position intelligently** — Use corners and walls to limit exposure. Avoid the center of the battlefield.

**Scoring breakdown (typical melee):**

- Survival points: 40-60%
- Bullet damage: 30-50%
- Kill bonuses: 10-20%

**Strategy takeaway:** Outlast half the field, then hunt weakened targets. Damage is secondary to survival.

> [!TIP] Adaptive strategy in final phase
> Smart melee bots switch to 1v1 tactics when only one or two opponents remain. Once the field thins to 2-3 bots total,
> survival points become less valuable than damage efficiency. At this point, treat it like a duel: maximize accuracy,
> maintain energy advantage, and secure the kill bonus. A bot that survives to the top 3 but loses the final duel often
> places second instead of first.

### Team strategy: coordinate for collective score

In team battles, all team members' points combine into a single team score. This enables role specialization.

**Key priorities:**

1. **Communication** — Share enemy positions, energy levels, and targeting data.
2. **Role assignment** — Designate attackers, scouts, and support bots based on strengths.
3. **Focus fire** — Concentrate attacks on single targets to secure kills quickly.
4. **Sacrifice plays** — A bot can sacrifice itself if it secures a high-value kill for the team.

**Common team roles:**

- **Scout:** Wide radar sweeps, shares enemy locations, stays alive to maintain intel.
- **Attacker:** High damage output, aggressive targeting, spends energy liberally.
- **Support:** Defensive positioning, helps weak teammates, denies enemy kills.

**Strategy takeaway:** Maximize team score, not individual glory. Coordination multiplies effectiveness.

## How rounds and matches work

Robocode battles consist of multiple rounds. The winner is determined by total score across all rounds.

### Match structure

- **Match:** A series of rounds (typically 10-35 rounds).
- **Round:** A single battle instance. Ends when one bot remains or time expires.
- **Winner:** Participant (bot or team) with the highest cumulative score across all rounds.

### Round scoring

Each round awards points based on damage dealt, kills secured, and survival. These points accumulate across rounds.

**Example (1v1, 10 rounds):**

- Round 1: Bot A scores 120, Bot B scores 90
- Round 2: Bot A scores 100, Bot B scores 110
- ...
- Total after 10 rounds: Bot A 1050, Bot B 980 → **Bot A wins**

Consistency matters. A bot that performs well in most rounds beats a bot that dominates a few but collapses in others.

## Tips and common mistakes

**✅ Do:**

- **Optimize for your format** — A 1v1 bot needs different priorities than a melee bot.
- **Track cumulative score** — Winning one round decisively doesn't guarantee match victory.
- **Value kill bonuses** — Finishing weak opponents adds significant points.
- **Prioritize high-probability shots** — Accuracy beats volume in almost every format.

**❌ Don't:**

- **Ignore survival in melee** — Even dominant damage output loses to early elimination.
- **Fire indiscriminately** — Wasted shots reduce energy and scoring potential.
- **Assume survival = winning** — In 1v1, damage points usually exceed survival bonuses.
- **Neglect energy management** — Running out of energy forfeits all future scoring opportunities.

> [!WARNING] Time limits matter
> Rounds have a turn limit (1000 turns in standard competition format). If the limit is reached with multiple bots
> still alive, remaining bots are ranked by current energy level. Avoiding stalemates requires aggressive play when
> time is running short. See **[Competition Formats & Rankings](./competition-formats-rankings.md)** for details on
> standard timeout configurations.

## Next steps

Now that you understand how scoring works across battle types, explore format-specific strategies:

- **Competition Formats & Rankings** — Learn about standardized battlefield dimensions and community competition
  standards.
- **Energy Management in 1v1 and Melee** — Optimize energy spending for your chosen format.
- **Targeting Tactics** — Learn when to fire and which bullet power to use.
- **Team Strategies** — Coordinate with teammates for maximum team score.
- **Melee Combat** — Master survival tactics and target selection in chaotic battles.

Understanding scoring is the foundation. Winning requires applying that knowledge to strategic decision-making in
real-time combat.

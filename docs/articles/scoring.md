# Scoring

Understanding the scoring system is essential for optimizing your bot's strategy. Robocode awards points for various actions, encouraging aggressive and skillful play.

## Battle Types

### 1v1 (One-on-One)
Two bots face off in a duel. The winner is determined by the total score across all rounds.

### Melee
Multiple bots (3 or more) compete in a free-for-all battle. Every bot for themselves!

## Scoring System

Points are awarded for different achievements during battle:

### Survival Points

**50 points** for being one of the last bots alive at the end of a round.

**Formula**:
$$
\text{survival score} = 50
$$

This bonus is split among surviving bots if multiple bots are alive when the round ends.

### Last Survivor Bonus

**Additional 10 points** for being the sole survivor (winner) of a round.

**Formula**:
$$
\text{last survivor bonus} = 10
$$

### Bullet Damage Points

**1 point per point of damage** your bullets inflict on enemies.

**Formula**:
$$
\text{bullet damage score} = \sum \text{damage dealt}
$$

This is the primary way to score during combat. Remember from the [Physics](/articles/physics) page:
- Damage = $4 \times \text{firepower}$ (base)
- Additional damage if firepower > 1: $2 \times (\text{firepower} - 1)$

### Bullet Kill Bonus

**Additional bonus** for destroying an enemy (reducing their energy to 0 with your bullet).

**Formula**:
$$
\text{bullet kill bonus} = 2 \times \text{damage dealt by killing shot}
$$

If your bullet destroys an enemy, you get:
1. Normal damage points (1:1 ratio)
2. Double those points as a bonus

**Example**: Killing shot with firepower 2.0 deals 10 damage
- Damage points: 10
- Kill bonus: $2 \times 10 = 20$
- Total from that shot: 30 points

### Ram Damage Points

**2 points per point of damage** caused by ramming into enemy bots.

**Formula**:
$$
\text{ram damage score} = 2 \times \text{ram damage dealt}
$$

Ramming is risky as you also take damage, but it awards double points!

### Ram Kill Bonus

**Additional bonus** for destroying an enemy by ramming.

**Formula**:
$$
\text{ram kill bonus} = 2 \times \text{ram damage dealt by killing ram}
$$

Similar to bullet kills, but this applies to rams.

## Total Score

Your total score for a round is the sum of all scoring components:

$$
\begin{align}
\text{Total Score} = &\text{ survival score} \\
                    + &\text{ last survivor bonus} \\
                    + &\text{ bullet damage score} \\
                    + &\text{ bullet kill bonuses} \\
                    + &\text{ ram damage score} \\
                    + &\text{ ram kill bonuses}
\end{align}
$$

## Rankings

At the end of a battle (multiple rounds), bots are ranked by:
1. **Total score** across all rounds
2. **Total survival** score (tiebreaker)
3. **Alphabetical order** of bot name (final tiebreaker)

## Strategy Implications

### Aggressive Play is Rewarded
- Bullet damage is your main source of points
- Kill bonuses provide significant rewards
- Passive bots will score poorly even if they survive

### Survival Matters
- 60 points total for winning a round (50 survival + 10 winner bonus)
- This is substantial but not dominant
- Sometimes sacrificing survival for more damage is worth it

### Efficient Damage
From the physics formulas:
- **Firepower 3**: Deals 16 damage = 16 points + possible 32 kill bonus
- **Firepower 1**: Deals 4 damage = 4 points + possible 8 kill bonus

Higher firepower is more efficient for scoring, but:
- Slower bullets (easier to dodge)
- More energy consumption
- Longer reload time

### Ramming Strategy
Ramming awards 2× points for damage, making it potentially valuable in close combat scenarios. However:
- You take damage too (mutual destruction possible)
- Requires good positioning
- Works best as a finishing move on low-energy opponents

## Pseudocode Example

```python
# Decision making based on scoring
def choose_strategy(my_energy, enemy_energy, distance):
    # If enemy is low on energy, go for the kill bonus
    if enemy_energy < 16:
        if distance < 100:
            # Close range - ram for 2x points and kill bonus
            return "ram_attack"
        else:
            # Use max firepower for kill bonus
            return "power_shot"
    
    # Normal combat - balance damage and efficiency
    elif distance < 200:
        return "medium_power"  # firepower 2.0
    else:
        return "low_power"     # firepower 1.0

# Calculate expected score from a shot
def expected_score(firepower, hit_probability, will_kill):
    damage = calculate_damage(firepower)
    expected_damage_score = damage * hit_probability
    
    if will_kill:
        kill_bonus = 2 * damage
        expected_kill_score = kill_bonus * hit_probability
        return expected_damage_score + expected_kill_score
    
    return expected_damage_score

def calculate_damage(firepower):
    base = 4 * firepower
    extra = 2 * (firepower - 1) if firepower > 1 else 0
    return base + extra
```

## Battle Score Display

During and after battle, you'll typically see:
- **Current round score** for each bot
- **Total score** across all rounds
- **Rankings** based on total scores
- Individual statistics (shots fired, hits, kills, etc.)

::: tip Pro Tip
Focus on hit percentage and damage per shot. A bot that lands 40% of high-power shots will outscore one that lands 60% of low-power shots.
:::

## Tournament Scoring

In tournaments, battles consist of multiple rounds:
- Standard: 10 rounds
- Each round is scored independently
- Final ranking based on **cumulative score**

Some tournaments use:
- **Percentage score**: Your score as a percentage of total possible
- **ELO rating systems**: For competitive rankings
- **Challenge formats**: Best of 35 rounds, etc.

---

*Scoring information compiled from [RoboWiki](http://robowiki.net/) and official Robocode documentation.*

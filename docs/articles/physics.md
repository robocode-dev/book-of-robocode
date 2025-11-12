# Physics

Understanding the physics of Robocode is crucial for writing effective bots. This page explains the mathematical formulas and rules that govern movement, rotation, and bullets.

## Measurements

### Time Measurement

Robocode is **turn-based**, meaning time is measured in turns. Each turn:
- The bot receives new information and events
- The bot can send commands to the server
- The game state updates

A battle consists of one or more rounds (e.g., 10 rounds). Both rounds and turns start counting from 1.

### Distance Measurement

Distance in Robocode is measured in **units** as floating-point numbers (double precision).

## Movement

### Acceleration (a)

Bots have asymmetric acceleration:
- **Acceleration rate**: 1 unit/turn² (speeding up)
- **Deceleration rate**: 2 units/turn² (slowing down)

This means your bot can brake twice as fast as it can accelerate. The game automatically determines acceleration based on your target speed or distance.

### Speed / Velocity (v)

The basic speed equation is:

$$
v = a \times t
$$

Where:
- $v$ = velocity (units/turn)
- $a$ = acceleration (units/turn²)
- $t$ = time (turns)

#### Maximum Speed

The maximum speed is **8 units/turn**. 

::: warning Important
Velocity is technically a vector, but in Robocode we assume the direction is the bot's heading.
:::

### Distance (d)

The distance formula is:

$$
d = v \times t
$$

Where:
- $d$ = distance (units)
- $v$ = velocity (units/turn)
- $t$ = time (turns)

## Rotation

Rotation in Robocode is measured in **degrees**.

### Bot Base Rotation

The maximum turn rate depends on your current speed. When standing still (0 units/turn), you can turn up to **10° per turn**.

The maximum rotation rate is given by:

$$
\text{max turn rate} = 10 - \frac{3}{4}|v|
$$

Where $|v|$ is the absolute value of velocity.

**Key insight**: The faster you move, the slower you turn.

**Example**: At maximum speed (8 units/turn), your maximum turn rate is only 4° per turn:

$$
10 - \frac{3}{4} \times 8 = 10 - 6 = 4°
$$

### Gun Rotation

The gun can rotate up to **20° per turn**. This rotation is added to the current rotation of the bot's base.

### Radar Rotation

The radar can rotate up to **45° per turn**. This rotation is added to the current rotation of the gun.

## Bullets

### Firepower

- **Minimum firepower**: 0.1
- **Maximum firepower**: 3.0

The firepower amount is subtracted from your bot's energy when you fire.

### Bullet Damage

When a bullet hits an enemy bot, the damage depends on firepower:

**Base damage**:
$$
\text{damage} = 4 \times \text{firepower}
$$

**Additional damage** (if firepower > 1):
$$
\text{extra damage} = 2 \times (\text{firepower} - 1)
$$

**Total damage formula**:
$$
\text{damage} = 
\begin{cases}
4 \times \text{firepower} & \text{if firepower} \leq 1 \\
4 \times \text{firepower} + 2 \times (\text{firepower} - 1) & \text{if firepower} > 1
\end{cases}
$$

**Example**: With firepower = 3:
- Base damage: $4 \times 3 = 12$
- Extra damage: $2 \times (3 - 1) = 4$
- Total damage: $12 + 4 = 16$

### Bullet Speed

Bullet speed is **constant** and depends on firepower:

$$
v_{\text{bullet}} = 20 - 3 \times \text{firepower}
$$

This creates a strategic trade-off:
- **Low firepower** (e.g., 0.1): Faster bullets (19.7 units/turn), less damage
- **High firepower** (e.g., 3.0): Slower bullets (11 units/turn), more damage

### Gun Heat

After firing, the gun must cool down before it can fire again. The gun heat generated is:

$$
\text{gun heat} = \frac{1 + \text{firepower}}{5}
$$

The gun cools at a rate of **0.1 heat per turn**.

**Example**: Firing with maximum firepower (3):
- Gun heat: $\frac{1 + 3}{5} = 0.8$
- Cool down time: $0.8 \div 0.1 = 8$ turns

## Pseudocode Example

Here's how you might use these physics formulas in your bot:

```python
# Calculate optimal firepower based on distance
def calculate_firepower(distance):
    if distance < 100:
        return 3.0  # High damage at close range
    elif distance < 300:
        return 2.0  # Medium damage at medium range
    else:
        return 1.0  # Low damage but faster bullet at long range

# Predict bullet travel time
def bullet_travel_time(distance, firepower):
    bullet_speed = 20 - 3 * firepower
    return distance / bullet_speed

# Check if gun has cooled down
def can_fire(gun_heat):
    return gun_heat == 0

# Calculate turn rate at current speed
def max_turn_rate(speed):
    return 10 - (3/4) * abs(speed)
```

## Energy Management

Firing consumes energy equal to the firepower. When your energy reaches 0, you are disabled and will lose the round.

::: tip Strategy Tip
Balance your firepower based on:
- Distance to target (affects hit probability)
- Your current energy level
- Tactical situation (desperate times may require high power)
:::

---

*This article is based on physics documentation from [RoboWiki](http://robowiki.net/) and the Robocode community.*

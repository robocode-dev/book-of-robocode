# Retroactive Hit Analysis Targeting

Inventor: Flemming N. Larsen, Jan 2026

Fun fact. Got this idea when writing about virtual bullets, waves and guess factor targeting.

Disclaimer: Has not been battle tested in a bot yet.

## Core Concept

Instead of using forward-predictive waves, track firing events and analyze them retroactively against enemy historical
positions.

**Key Principle:** When you fire bullets at multiple speeds, you already know the enemy's actual path. Analyze which
bullet speeds would have connected by testing against recorded positions.

## How It Works

### 1. Fire and Record

- When firing, store: your position, bullet speed(s), fire tick, and mark as "actual" or "virtual"
- No prediction involved—just metadata capturing the firing event

### 2. Scan and Analyze

- When you scan the enemy, you have YOUR OWN historical positions (last ~50-100 ticks)
- For each of your past positions, test which bullet speeds would have hit the enemy's current scanned position
- Extract the exact angle and speed that would have connected if you had fired from those past positions

### 3. Data Structure

```typescript
interface MyHistoricalPosition {
    tick: number;
    position: { x: number; y: number };
    heading: number;
    gunHeading: number;
}

// Maintain buffer of your own positions
const myPositionHistory: MyHistoricalPosition[] = [];  // Keep last 50-100 ticks

// When scanning enemy:
function analyzeRetroactiveHits(enemyPosition: { x: number; y: number }, currentTick: number) {
    const bulletSpeeds = [0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

    myPositionHistory.forEach(myPastPos => {
        const ticksAgo = currentTick - myPastPos.tick;

        bulletSpeeds.forEach(speed => {
            const bulletTravelDistance = speed * ticksAgo;
            const actualDistance = calculateDistance(myPastPos.position, enemyPosition);

            // Would this bullet speed from my past position have hit the enemy now?
            if (Math.abs(bulletTravelDistance - actualDistance) < BOT_RADIUS) {
                const hitAngle = calculateAngle(myPastPos.position, enemyPosition);
                recordHitPattern(hitAngle, speed, myPastPos.tick);
            }
        });
    });
}
```

## Advantages Over Wave Paradigm

| Aspect               | Retroactive Analysis       | Wave Model                |
|----------------------|----------------------------|---------------------------|
| **Accuracy**         | Tests against ground truth | Relies on prediction      |
| **Simplicity**       | Single data structure      | Multiple wave objects     |
| **Angle Extraction** | Direct from analysis       | Derived from wave state   |
| **Real vs. Virtual** | Single flag                | Separate tracking systems |
| **Mental Model**     | "What would have worked?"  | "Where might they go?"    |

## Limitations

- **Backward-Looking** — Tells you what *would have* worked, not what *will* work next
- **Local Behavior Assumption** — Assumes enemy behavior persists short-term (usually valid for 1-2 ticks)
- **Computation** — O(shots × historical_positions) per scan
    - Example: 10 shots × 50 positions = 500 checks per scan (negligible on modern hardware)
- **Lag Compensation** — Requires careful handling of round-trip latency between firing and scanning

## Real vs. Virtual Distinction

**Real shots:**

- Bullets you actually fired
- Enemy *reacted* (dodging, evasion, behavior changed)
- Limited data (only when gun was ready)
- High confidence when hit—reflects actual combat response

**Virtual shots:**

- Hypothetical speeds tested at every turn
- Enemy *did not react* to these (no incoming threat)
- Abundant data (every tick)
- Reveals baseline movement patterns without evasion pressure

**Weighting Strategy:**

- Real shot hits are often weighted more heavily (actual combat behavior)
- Virtual shot hits provide volume and baseline patterns
- Some bots use weighted histograms: `real_hits * 2 + virtual_hits * 1`

## Comparison: When to Use Each Approach

### Use Retroactive Analysis When:

- You want empirical, ground-truth targeting
- You prefer direct angle/speed extraction
- Enemy behavior is locally consistent
- You're optimizing for code simplicity

### Use Wave Model When:

- You need forward prediction (where will enemy be in 5 ticks?)
- You want separation of prediction logic from evaluation
- You're building complex multi-system targeting (waves + surfing)
- You need elegant pattern accumulation over many battles

## Implementation Notes

1. **Your Own Position Buffer**
    - Maintain a circular buffer of YOUR last 50-100 positions (not enemy positions)
    - Store: tick, position (x, y), heading, gun heading for each turn
    - Update every turn in your `run()` loop

2. **Bullet Travel Time Calculation**
   ```
   travelTicks = currentTick - pastPositionTick
   expectedDistance = bulletSpeed × travelTicks
   actualDistance = distance(pastPosition, currentEnemyPosition)
   hit = |expectedDistance - actualDistance| < botRadius
   ```

3. **Hit Detection**
    - For each past position and each bullet speed, check if the bullet had traveled exactly the right distance
    - Account for bot radius (18 pixels) in collision detection
    - Consider rounding error tolerance

4. **Pattern Recording**
    - Bin angles into histogram (GuessFactor-style buckets)
    - Track which speeds work best at which angles
    - Weight recent hits more heavily than old data

5. **Real-Time Aiming**
    - Query highest-probability angle from histogram
    - Consider bullet speed for current distance
    - Default to head-on if no data collected yet

## Example Scenario

```
Your position history (last 10 ticks):
Tick 100: You were at (400, 400)
Tick 101: You were at (402, 401)
Tick 102: You were at (404, 402)
Tick 103: You were at (406, 403)
... [continuing to tick 110]

Tick 110: You scan enemy at position (450, 430)
  - Current tick: 110
  - Enemy is NOW at (450, 430)

Retroactive Analysis:
  For your position at tick 100 (10 ticks ago):
    - Distance from (400,400) to (450,430) = ~58.3 pixels
    - Test bullet speed 3.0: 3.0 × 10 ticks = 30 pixels ✗ (too short)
    - Test bullet speed 2.0: 2.0 × 10 ticks = 20 pixels ✗ (too short)
    - Test bullet speed 1.5: 1.5 × 10 ticks = 15 pixels ✗ (too short)
    
  For your position at tick 103 (7 ticks ago):
    - Distance from (406,403) to (450,430) = ~51.8 pixels
    - Test bullet speed 3.0: 3.0 × 7 ticks = 21 pixels ✗ (too short)
    - Test bullet speed 2.0: 2.0 × 7 ticks = 14 pixels ✗ (too short)
    
  For your position at tick 105 (5 ticks ago):
    - Distance from (410,405) to (450,430) = ~47.4 pixels
    - Test bullet speed 2.5: 2.5 × 5 ticks = 12.5 pixels ✗ (too short)
    - Test bullet speed 3.0: 3.0 × 5 ticks = 15 pixels ✗ (too short)
    
  For your position at tick 108 (2 ticks ago):
    - Distance from (416,408) to (450,430) = ~40.8 pixels
    - Test bullet speed 3.0: 3.0 × 2 ticks = 6 pixels ✗ (too short)

Wait, let me recalculate with correct scenario:

Tick 90: You were at (400, 400)
Tick 110: You scan enemy at position (450, 430)
  - 20 ticks have passed
  - Distance: ~58.3 pixels
  - Test bullet speed 3.0: 3.0 × 20 = 60 pixels ✓ HIT! (within bot radius)
  - Angle from (400,400) to (450,430) = atan2(430-400, 450-400) = ~30.96°
  
Record: "If I had fired speed 3.0 bullet at angle ~31° from position (400,400), 
         I would have hit the enemy at their current position"

Next time you're in a similar position and distance, aim at ~31° with speed 3.0!
```

## Hybrid Approach

Many advanced bots might use both:

1. **Retroactive analysis** for immediate, empirical aiming adjustments
2. **Wave model** for longer-term pattern learning and prediction
3. Real vs. virtual weighting for confidence levels

## Can This Be Used for Movement/Dodging?

**Short answer:** Yes, but it requires tracking the **opposite data**: enemy positions instead of your own positions.

### The Core Problem

**For Targeting (what this document describes):**

- Track YOUR historical positions
- When you scan enemy, check: "Which of my past positions would have resulted in a hit?"
- Learns: "From position X, firing at angle Y with speed Z hits this enemy"

**For Movement/Dodging (inverse problem):**

- Track ENEMY historical positions (where they were when they might have fired)
- When enemy bullet hits/misses, check: "Which of their past positions did this bullet come from?"
- Learns: "When enemy was at position X, they fired at angle Y and hit/missed me"

### Wave Surfing vs Retroactive Danger Analysis

**Wave surfing is forward-looking:**

- Detects enemy firing event → predicts bullet arrival time/location → moves to safety **before** bullet arrives
- Requires knowing where the bullet **will be** to dodge it in real-time

**Retroactive danger analysis is backward-looking:**

- After bullet hits/misses, analyze: "Where was the enemy when they fired this?"
- Build danger map: "When enemy is at position/angle X, they tend to hit me at angle Y"
- Use this to **avoid dangerous patterns** in future movement

### Implementing Retroactive Danger Profiling

Instead of tracking your positions, track **enemy positions**:

```typescript
interface EnemyHistoricalPosition {
    tick: number;
    position: { x: number; y: number };
    heading: number;
    gunHeading: number;
    energy: number;  // To detect firing events (energy drops)
}

const enemyPositionHistory: EnemyHistoricalPosition[] = [];  // Last 50-100 ticks

// When you get hit or see a bullet miss:
function analyzeDanger(bulletHitInfo: { position: { x, y }, tick: number, wasHit: boolean }) {
    const bulletSpeeds = [0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

    enemyPositionHistory.forEach(enemyPastPos => {
        const ticksAgo = bulletHitInfo.tick - enemyPastPos.tick;

        bulletSpeeds.forEach(speed => {
            const bulletTravelDistance = speed * ticksAgo;
            const actualDistance = calculateDistance(enemyPastPos.position, bulletHitInfo.position);

            // Did this bullet originate from this enemy position?
            if (Math.abs(bulletTravelDistance - actualDistance) < 5) {  // Tolerance
                const fireAngle = calculateAngle(enemyPastPos.position, bulletHitInfo.position);

                // Record: "When enemy was at X with gun at angle Y, they hit/missed me"
                dangerMap.record(enemyPastPos, fireAngle, bulletHitInfo.wasHit);
            }
        });
    });
}
```

### Potential Hybrid Movement Strategy

You could adapt retroactive analysis for movement by building a **historical danger map**:

1. **Track enemy historical positions**
    - Record enemy position, gun heading, energy every turn (last 50-100 ticks)
    - Detect firing events by energy drops

2. **Analyze hits/misses retroactively**
    - When bullet hits/misses you, work backwards: which enemy position did it come from?
    - Test different bullet speeds to find which travel time matches

3. **Build danger histogram**
    - Map: "When enemy was at position X with gun at angle Y, they hit me Z% of the time"
    - Similar to GuessFactor targeting, but inverted (enemy's perspective)

4. **Avoid dangerous patterns**
    - Before moving, check: "If enemy were to fire from their current position, where am I most likely to get hit?"
    - Prefer movements toward low-danger angles
    - Essentially: "Don't be where the enemy's gun historically succeeds"

### Key Difference from Targeting

| Aspect       | Retroactive Targeting        | Retroactive Movement           |
|--------------|------------------------------|--------------------------------|
| **Track**    | YOUR positions               | ENEMY positions                |
| **Question** | "Where should I fire from?"  | "Where did enemy fire from?"   |
| **Analysis** | Your past → enemy current    | Enemy past → your hit/miss     |
| **Goal**     | Find good shooting positions | Find dangerous enemy positions |

### Example: Danger Profiling

```typescript
interface DangerProfile {
    myPosition: { x: number; y: number };
    myVelocity: number;
    myHeading: number;
    enemyFirePosition: { x: number; y: number };
    hitAngle: number;  // Angle where enemy successfully hit me
    wasHit: boolean;   // Did bullet actually hit or miss?
}

// When enemy bullet hits or misses:
function recordDanger(enemyShot, myHistoricalPositions) {
    myHistoricalPositions.forEach(myPos => {
        if (bulletPassedThrough(enemyShot, myPos)) {
            const dangerAngle = calculateAngle(enemyShot.firePosition, myPos);
            dangerMap.record(myPos, dangerAngle, enemyShot.wasHit);
        }
    });
}

// When deciding next move:
function chooseSafeMove(currentPosition, possibleMoves) {
    return possibleMoves.sort((a, b) => {
        const dangerA = dangerMap.query(a.futurePosition, a.velocity, enemyPosition);
        const dangerB = dangerMap.query(b.futurePosition, b.velocity, enemyPosition);
        return dangerA - dangerB;  // Prefer lower danger
    })[0];
}
```

### Limitations as Movement Strategy

1. **Reactive, not predictive** — You learn from hits but can't expect new shots in time to dodge them
2. **Requires getting hit first** — Unlike wave surfing which can dodge from the start
3. **Pattern assumption** — Assumes enemy targeting is consistent enough that past hits predict future danger
4. **No real-time dodge** — Can't actively dodge bullets in flight, only avoid patterns that led to hits

### When This Could Work

- **Against pattern-based targeting** — If an enemy uses statistical targeting, your danger profile reveals their
  patterns
- **Long-term adaptation** — Over many rounds, you gradually learn safer movement zones
- **Complementary to wave surfing** — Use waves for immediate dodging, retroactive analysis for long-term pattern
  flattening
- **Simpler implementation** — Easier than full wave surfing for intermediate bots

### Verdict

Retroactive hit analysis **cannot replace wave surfing** for real-time bullet dodging, but it could serve as a
**movement improvement system** that learns which movement patterns are dangerous and adapts over time. Think of it as 
"movement pattern learning" rather than "active dodging."

The best approach might be:

- **Offense:** Retroactive analysis for targeting
- **Defense:** Traditional wave surfing for dodging + retroactive danger profiling for pattern adaptation

---

## Status

This represents an alternative or complementary optimization to the classical wave paradigm. It has not been extensively
documented in public Robocode literature, making it a potential novel contribution to targeting theory documentation.

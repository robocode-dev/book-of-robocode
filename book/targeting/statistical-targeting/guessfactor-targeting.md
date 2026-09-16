---
title: "GuessFactor Targeting"
category: "Targeting Systems"
summary: >-
  Learn to build a statistical targeting system that tracks where enemies go and aims at their most common positions
  using wave-based data collection.
tags: [ "guessfactor-targeting", "statistical-targeting", "targeting", "waves", "advanced", "robocode", "tank-royale" ]
difficulty: "advanced"
source:
  - >-
    RoboWiki - GuessFactor Targeting (traditional) (classic Robocode)
    https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)
  - "RoboWiki - Waves (classic Robocode) https://robowiki.net/wiki/Waves"
  - "RoboWiki - SandboxDT (classic Robocode) https://robowiki.net/wiki/SandboxDT"
  - "Robocode Tank Royale Docs - Bullet Physics https://robocode.dev/articles/physics.html"
---

# GuessFactor Targeting

> [!TIP] Origins
> **GuessFactor Targeting** was introduced by **Paul Evans** in 2002 with his bots SandboxLump and SandboxDT. It was
> the first targeting designed to beat random movement. **Iiley** later introduced the **Wave**, which became the
> standard way to collect its data. Early adopters such as **David Alves** (Duelist, Phoenix) built guns on the same
> idea, and **Kyle Huntington (Kawigi)** spread it widely through his GuessFactor Targeting Tutorial and the
> **FloodMini** bot.

GuessFactor Targeting (GFT) is a statistical targeting system that learns from experience. Instead of predicting enemy
movement with mathematical formulas, it records where enemies are when bullets arrive and fires at the positions they
favor most often.

This shift from prediction to probability transformed competitive Robocode. GFT emerged from the collaborative 
experimentation of multiple community members and works well against both predictable and unpredictable movements, 
adapting automatically to each opponent's behavior.

## Why simple prediction fails

Simple targeting methods ([head-on](../simple-targeting/head-on-targeting.md),
[linear](../simple-targeting/linear-targeting.md), [circular](../simple-targeting/circular-targeting.md)) all share the
same weakness: they assume enemies move in predictable patterns.

Against bots with [random movement](../../movement/simple-evasion/random-movement.md) or adaptive strategies, these
predictions often miss. The enemy could end up anywhere within a wide arc.

**GuessFactor Targeting solves this by:**

- Recording where enemies *actually are* when bullets arrive
- Building a statistical profile over many shots
- Aiming at the most probable position based on past data

This approach works against any movement style because it learns from actual outcomes rather than assumptions.

<img src="/images/guessfactor-targeting-comparison.svg"
alt="Simple targeting predicts a single position; GuessFactor Targeting aims at the most statistically likely position"
style="max-width:100%;height:auto;"><br>
*Simple targeting predicts a single position; GuessFactor Targeting aims at the most statistically likely position*

## Prerequisites: Understanding waves

Before building a GuessFactor gun, you should understand **waves** and how they track bullet travel. If you haven't
already, read [Introducing Waves](../the-targeting-problem/introducing-waves.md), which covers:

- What waves are and why they're used
- Wave mechanics and expansion formulas
- The GuessFactor concept and normalization
- Basic wave creation and tracking

This page focuses on **implementing** a complete GuessFactor Targeting system with working code.

## Core concept recap

**GuessFactor Targeting** uses waves to record where enemies actually are when bullets arrive, then builds a statistical
histogram showing which angles (GuessFactors) enemies favor most.

The key steps are:

1. **Fire and create a wave** tracking bullet speed and direction
2. **Track wave expansion** each turn until it reaches the enemy
3. **Record the GuessFactor** (-1.0 to +1.0) where the enemy was hit
4. **Aim at the highest-probability GuessFactor** based on accumulated statistics

## Building your first GuessFactor gun: step-by-step

The helper below implements the core loop in each supported language. Call `onFire(...)` after a shot, call
`update(...)` once per turn with the latest enemy position, and use `aimAngle(...)` when choosing the next gun
direction.
The helper uses one active-wave list for one tracked enemy. A melee gun can add an enemy ID to `Wave` or keep one
tracker per enemy.

The Classic tab uses compass-style angles. The Tank Royale tabs use mathematical angles, so the angle-to-point
calculation is the only meaningful difference in the algorithm.

::: code-group

```java [Classic · Java]
import java.util.ArrayList;
import java.util.List;

public class GuessFactorGun {
    private static final int NUM_BINS = 31;
    private final List<Wave> waves = new ArrayList<>();
    private final int[] guessFactorBins = new int[NUM_BINS];

    public void onFire(
            double originX, double originY, long fireTurn,
            double firepower, double firingAngle) {
        waves.add(new Wave(
                originX, originY, fireTurn,
                20 - 3 * firepower, firingAngle));
    }

    public void update(long currentTurn, double enemyX, double enemyY) {
        for (int i = waves.size() - 1; i >= 0; i--) {
            Wave wave = waves.get(i);
            double radius = wave.bulletSpeed * (currentTurn - wave.fireTurn);
            double distance = Math.hypot(enemyX - wave.originX, enemyY - wave.originY);
            if (radius >= distance) {
                recordWaveHit(wave, enemyX, enemyY);
                waves.remove(i);
            }
        }
    }

    public double aimAngle(
            double myX, double myY, double enemyX, double enemyY,
            double firepower) {
        double headOnAngle = Math.atan2(enemyX - myX, enemyY - myY);
        double bulletSpeed = 20 - 3 * firepower;
        double escapeAngle = Math.asin(8.0 / bulletSpeed);
        return headOnAngle + bestGuessFactor() * escapeAngle;
    }

    public double bestGuessFactor() {
        int bestBin = NUM_BINS / 2;
        for (int i = 0; i < guessFactorBins.length; i++) {
            if (guessFactorBins[i] > guessFactorBins[bestBin]) {
                bestBin = i;
            }
        }
        return binToGuessFactor(bestBin);
    }

    private void recordWaveHit(Wave wave, double enemyX, double enemyY) {
        double enemyAngle = Math.atan2(enemyX - wave.originX, enemyY - wave.originY);
        double bearingOffset = normalizeRelativeAngle(enemyAngle - wave.firingAngle);
        double escapeAngle = Math.asin(8.0 / wave.bulletSpeed);
        double guessFactor = clamp(bearingOffset / escapeAngle, -1.0, 1.0);
        guessFactorBins[guessFactorToBin(guessFactor)]++;
    }

    private static int guessFactorToBin(double guessFactor) {
        double index = (guessFactor + 1.0) * 0.5 * (NUM_BINS - 1);
        return (int) Math.max(0, Math.min(NUM_BINS - 1, Math.round(index)));
    }

    private static double binToGuessFactor(int bin) {
        return bin * 2.0 / (NUM_BINS - 1) - 1.0;
    }

    private static double normalizeRelativeAngle(double angle) {
        while (angle <= -Math.PI) {
            angle += 2 * Math.PI;
        }
        while (angle > Math.PI) {
            angle -= 2 * Math.PI;
        }
        return angle;
    }

    private static double clamp(double value, double minimum, double maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static class Wave {
        final double originX;
        final double originY;
        final long fireTurn;
        final double bulletSpeed;
        final double firingAngle;

        Wave(double originX, double originY, long fireTurn,
                double bulletSpeed, double firingAngle) {
            this.originX = originX;
            this.originY = originY;
            this.fireTurn = fireTurn;
            this.bulletSpeed = bulletSpeed;
            this.firingAngle = firingAngle;
        }
    }
}
```

```python [Tank Royale · Python]
import math
from dataclasses import dataclass


@dataclass
class Wave:
    origin_x: float
    origin_y: float
    fire_turn: int
    bullet_speed: float
    firing_angle: float


class GuessFactorGun:
    NUM_BINS = 31

    def __init__(self) -> None:
        self.waves: list[Wave] = []
        self.guess_factor_bins = [0] * self.NUM_BINS

    def on_fire(
        self,
        origin_x: float,
        origin_y: float,
        fire_turn: int,
        firepower: float,
        firing_angle: float,
    ) -> None:
        self.waves.append(Wave(
            origin_x,
            origin_y,
            fire_turn,
            20 - 3 * firepower,
            firing_angle,
        ))

    def update(self, current_turn: int, enemy_x: float, enemy_y: float) -> None:
        remaining: list[Wave] = []
        for wave in self.waves:
            radius = wave.bullet_speed * (current_turn - wave.fire_turn)
            distance = math.hypot(enemy_x - wave.origin_x, enemy_y - wave.origin_y)
            if radius >= distance:
                self._record_wave_hit(wave, enemy_x, enemy_y)
            else:
                remaining.append(wave)
        self.waves = remaining

    def aim_angle(
        self,
        my_x: float,
        my_y: float,
        enemy_x: float,
        enemy_y: float,
        firepower: float,
    ) -> float:
        head_on_angle = math.atan2(enemy_x - my_x, enemy_y - my_y)
        bullet_speed = 20 - 3 * firepower
        escape_angle = math.asin(8 / bullet_speed)
        return head_on_angle + self.best_guess_factor() * escape_angle

    def best_guess_factor(self) -> float:
        best_bin = self.NUM_BINS // 2
        for index, hits in enumerate(self.guess_factor_bins):
            if hits > self.guess_factor_bins[best_bin]:
                best_bin = index
        return self._bin_to_guess_factor(best_bin)

    def _record_wave_hit(self, wave: Wave, enemy_x: float, enemy_y: float) -> None:
        enemy_angle = math.atan2(enemy_x - wave.origin_x, enemy_y - wave.origin_y)
        bearing_offset = normalize_relative_angle(enemy_angle - wave.firing_angle)
        escape_angle = math.asin(8 / wave.bullet_speed)
        guess_factor = clamp(bearing_offset / escape_angle, -1, 1)
        self.guess_factor_bins[self._guess_factor_to_bin(guess_factor)] += 1

    def _guess_factor_to_bin(self, guess_factor: float) -> int:
        index = round((guess_factor + 1) * 0.5 * (self.NUM_BINS - 1))
        return max(0, min(self.NUM_BINS - 1, index))

    def _bin_to_guess_factor(self, bin_index: int) -> float:
        return bin_index * 2 / (self.NUM_BINS - 1) - 1


def normalize_relative_angle(angle: float) -> float:
    while angle <= -math.pi:
        angle += 2 * math.pi
    while angle > math.pi:
        angle -= 2 * math.pi
    return angle


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))
```

```java [Tank Royale · Java]
import java.util.ArrayList;
import java.util.List;

public class GuessFactorGun {
    private static final int NUM_BINS = 31;
    private final List<Wave> waves = new ArrayList<>();
    private final int[] guessFactorBins = new int[NUM_BINS];

    public void onFire(
            double originX, double originY, long fireTurn,
            double firepower, double firingAngle) {
        waves.add(new Wave(
                originX, originY, fireTurn,
                20 - 3 * firepower, firingAngle));
    }

    public void update(long currentTurn, double enemyX, double enemyY) {
        for (int i = waves.size() - 1; i >= 0; i--) {
            Wave wave = waves.get(i);
            double radius = wave.bulletSpeed * (currentTurn - wave.fireTurn);
            double distance = Math.hypot(enemyX - wave.originX, enemyY - wave.originY);
            if (radius >= distance) {
                recordWaveHit(wave, enemyX, enemyY);
                waves.remove(i);
            }
        }
    }

    public double aimAngle(
            double myX, double myY, double enemyX, double enemyY,
            double firepower) {
        double headOnAngle = Math.atan2(enemyY - myY, enemyX - myX);
        double bulletSpeed = 20 - 3 * firepower;
        double escapeAngle = Math.asin(8.0 / bulletSpeed);
        return headOnAngle + bestGuessFactor() * escapeAngle;
    }

    public double bestGuessFactor() {
        int bestBin = NUM_BINS / 2;
        for (int i = 0; i < guessFactorBins.length; i++) {
            if (guessFactorBins[i] > guessFactorBins[bestBin]) {
                bestBin = i;
            }
        }
        return binToGuessFactor(bestBin);
    }

    private void recordWaveHit(Wave wave, double enemyX, double enemyY) {
        double enemyAngle = Math.atan2(enemyY - wave.originY, enemyX - wave.originX);
        double bearingOffset = normalizeRelativeAngle(enemyAngle - wave.firingAngle);
        double escapeAngle = Math.asin(8.0 / wave.bulletSpeed);
        double guessFactor = clamp(bearingOffset / escapeAngle, -1.0, 1.0);
        guessFactorBins[guessFactorToBin(guessFactor)]++;
    }

    private static int guessFactorToBin(double guessFactor) {
        double index = (guessFactor + 1.0) * 0.5 * (NUM_BINS - 1);
        return (int) Math.max(0, Math.min(NUM_BINS - 1, Math.round(index)));
    }

    private static double binToGuessFactor(int bin) {
        return bin * 2.0 / (NUM_BINS - 1) - 1.0;
    }

    private static double normalizeRelativeAngle(double angle) {
        while (angle <= -Math.PI) {
            angle += 2 * Math.PI;
        }
        while (angle > Math.PI) {
            angle -= 2 * Math.PI;
        }
        return angle;
    }

    private static double clamp(double value, double minimum, double maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static class Wave {
        final double originX;
        final double originY;
        final long fireTurn;
        final double bulletSpeed;
        final double firingAngle;

        Wave(double originX, double originY, long fireTurn,
                double bulletSpeed, double firingAngle) {
            this.originX = originX;
            this.originY = originY;
            this.fireTurn = fireTurn;
            this.bulletSpeed = bulletSpeed;
            this.firingAngle = firingAngle;
        }
    }
}
```

```csharp [Tank Royale · C#]
using System;
using System.Collections.Generic;

public class GuessFactorGun
{
    private const int NumBins = 31;
    private readonly List<Wave> waves = new();
    private readonly int[] guessFactorBins = new int[NumBins];

    public void OnFire(
        double originX, double originY, long fireTurn,
        double firePower, double firingAngle)
    {
        waves.Add(new Wave(
            originX, originY, fireTurn,
            20 - 3 * firePower, firingAngle));
    }

    public void Update(long currentTurn, double enemyX, double enemyY)
    {
        for (int i = waves.Count - 1; i >= 0; i--)
        {
            Wave wave = waves[i];
            double radius = wave.BulletSpeed * (currentTurn - wave.FireTurn);
            double distance = Math.Sqrt(
                Math.Pow(enemyX - wave.OriginX, 2) + Math.Pow(enemyY - wave.OriginY, 2));
            if (radius >= distance)
            {
                RecordWaveHit(wave, enemyX, enemyY);
                waves.RemoveAt(i);
            }
        }
    }

    public double AimAngle(
        double myX, double myY, double enemyX, double enemyY,
        double firePower)
    {
        double headOnAngle = Math.Atan2(enemyY - myY, enemyX - myX);
        double bulletSpeed = 20 - 3 * firePower;
        double escapeAngle = Math.Asin(8.0 / bulletSpeed);
        return headOnAngle + BestGuessFactor() * escapeAngle;
    }

    public double BestGuessFactor()
    {
        int bestBin = NumBins / 2;
        for (int i = 0; i < guessFactorBins.Length; i++)
        {
            if (guessFactorBins[i] > guessFactorBins[bestBin])
            {
                bestBin = i;
            }
        }
        return BinToGuessFactor(bestBin);
    }

    private void RecordWaveHit(Wave wave, double enemyX, double enemyY)
    {
        double enemyAngle = Math.Atan2(enemyY - wave.OriginY, enemyX - wave.OriginX);
        double bearingOffset = NormalizeRelativeAngle(enemyAngle - wave.FiringAngle);
        double escapeAngle = Math.Asin(8.0 / wave.BulletSpeed);
        double guessFactor = Clamp(bearingOffset / escapeAngle, -1.0, 1.0);
        guessFactorBins[GuessFactorToBin(guessFactor)]++;
    }

    private static int GuessFactorToBin(double guessFactor)
    {
        double index = (guessFactor + 1.0) * 0.5 * (NumBins - 1);
        return (int)Math.Max(0, Math.Min(NumBins - 1, Math.Round(index)));
    }

    private static double BinToGuessFactor(int bin)
    {
        return bin * 2.0 / (NumBins - 1) - 1.0;
    }

    private static double NormalizeRelativeAngle(double angle)
    {
        while (angle <= -Math.PI)
        {
            angle += 2 * Math.PI;
        }
        while (angle > Math.PI)
        {
            angle -= 2 * Math.PI;
        }
        return angle;
    }

    private static double Clamp(double value, double minimum, double maximum)
    {
        return Math.Max(minimum, Math.Min(maximum, value));
    }

    private sealed class Wave
    {
        public Wave(double originX, double originY, long fireTurn,
            double bulletSpeed, double firingAngle)
        {
            OriginX = originX;
            OriginY = originY;
            FireTurn = fireTurn;
            BulletSpeed = bulletSpeed;
            FiringAngle = firingAngle;
        }

        public double OriginX { get; }
        public double OriginY { get; }
        public long FireTurn { get; }
        public double BulletSpeed { get; }
        public double FiringAngle { get; }
    }
}
```

```typescript [Tank Royale · TypeScript]
type Wave = {
    originX: number;
    originY: number;
    fireTurn: number;
    bulletSpeed: number;
    firingAngle: number;
};

class GuessFactorGun {
    private static readonly numBins = 31;
    private readonly waves: Wave[] = [];
    private readonly guessFactorBins = new Array<number>(GuessFactorGun.numBins).fill(0);

    onFire(
        originX: number,
        originY: number,
        fireTurn: number,
        firePower: number,
        firingAngle: number,
    ) {
        this.waves.push({
            originX,
            originY,
            fireTurn,
            bulletSpeed: 20 - 3 * firePower,
            firingAngle,
        });
    }

    update(currentTurn: number, enemyX: number, enemyY: number) {
        for (let i = this.waves.length - 1; i >= 0; i -= 1) {
            const wave = this.waves[i];
            const radius = wave.bulletSpeed * (currentTurn - wave.fireTurn);
            const distance = Math.hypot(enemyX - wave.originX, enemyY - wave.originY);
            if (radius >= distance) {
                this.recordWaveHit(wave, enemyX, enemyY);
                this.waves.splice(i, 1);
            }
        }
    }

    aimAngle(
        myX: number,
        myY: number,
        enemyX: number,
        enemyY: number,
        firePower: number,
    ) {
        const headOnAngle = Math.atan2(enemyY - myY, enemyX - myX);
        const bulletSpeed = 20 - 3 * firePower;
        const escapeAngle = Math.asin(8 / bulletSpeed);
        return headOnAngle + this.bestGuessFactor() * escapeAngle;
    }

    bestGuessFactor() {
        let bestBin = Math.floor(GuessFactorGun.numBins / 2);
        for (let i = 0; i < this.guessFactorBins.length; i += 1) {
            if (this.guessFactorBins[i] > this.guessFactorBins[bestBin]) {
                bestBin = i;
            }
        }
        return this.binToGuessFactor(bestBin);
    }

    private recordWaveHit(wave: Wave, enemyX: number, enemyY: number) {
        const enemyAngle = Math.atan2(enemyY - wave.originY, enemyX - wave.originX);
        const bearingOffset = normalizeRelativeAngle(enemyAngle - wave.firingAngle);
        const escapeAngle = Math.asin(8 / wave.bulletSpeed);
        const guessFactor = clamp(bearingOffset / escapeAngle, -1, 1);
        this.guessFactorBins[this.guessFactorToBin(guessFactor)] += 1;
    }

    private guessFactorToBin(guessFactor: number) {
        const index = Math.round((guessFactor + 1) * 0.5 * (GuessFactorGun.numBins - 1));
        return Math.max(0, Math.min(GuessFactorGun.numBins - 1, index));
    }

    private binToGuessFactor(bin: number) {
        return bin * 2 / (GuessFactorGun.numBins - 1) - 1;
    }
}

function normalizeRelativeAngle(angle: number) {
    while (angle <= -Math.PI) {
        angle += 2 * Math.PI;
    }
    while (angle > Math.PI) {
        angle -= 2 * Math.PI;
    }
    return angle;
}

function clamp(value: number, minimum: number, maximum: number) {
    return Math.max(minimum, Math.min(maximum, value));
}
```

:::

### Why 31 bins?

`NUM_BINS` is odd on purpose. The histogram covers GuessFactors from `-1.0` to `+1.0`, so 31 bins have indexes 0–30
and index 15 maps exactly to `0.0`, the head-on direction. With 32 bins, `0.0` would fall between indexes 15 and 16,
making the neutral starting point less natural. The exact odd number is a design choice: more bins add angular detail,
while fewer bins collect stronger statistics from each observation.

When integrating the helper, update the enemy state from `onScannedRobot` or `onScannedBot`, aim the gun at
`aimAngle(...)`, and call `onFire(...)` only after the platform confirms that the shot was accepted. This keeps wave
timing tied to real shots rather than to failed fire requests.

This implementation will learn your opponent's movement patterns over the course of a battle and gradually improve its
accuracy.

## Improvements and variations

Once you have basic GuessFactor Targeting working, consider these enhancements:

### Rolling average window

Instead of accumulating all data forever, weight recent data more heavily:

Before adding a new hit, multiply every histogram bin by `0.98`, then increment the bin for the new GuessFactor. This
decay gives recent behavior more influence and helps the gun adapt when an enemy changes movement strategy mid-battle.

This helps adapt to enemies that change their movement strategy mid-battle.

### Visit count stats smoothing

Instead of picking the single highest bin, use a **rolling average** across nearby bins:

For each non-edge bin, score the three-bin window centered on it. Choose the center with the largest sum, then convert
that bin back to a GuessFactor. Smoothing reduces noise from a single lucky hit and produces steadier aim.

This reduces noise from statistical flukes and creates smoother targeting.

### Per-enemy statistics

Track separate GuessFactor data for each opponent:

Use a map keyed by the platform’s enemy identifier, such as a name in Classic Robocode or an ID in Tank Royale. Each
entry owns its own 31-bin histogram. This prevents data from one opponent’s movement style from diluting another’s.

This is essential for melee battles and improves learning in team matches.

## Common mistakes and troubleshooting

### Angle normalization issues

**Problem:** GuessFactor values are wildly incorrect or exceed ±1.0.

**Solution:** Always normalize bearing offsets to the range −180° to +180° (or −π to +π) before dividing by the escape
angle. The helper’s `normalizeRelativeAngle` function performs this wrap in radians.

### Forgetting to create waves

**Problem:** No data is being collected.

**Solution:** Make sure you create a wave *every time you fire*, not just when hitting enemies. GuessFactor Targeting
learns from all shots, hits and misses.

### Starting with zero data

**Problem:** The bot aims poorly in early rounds before accumulating statistics.

**Solution:** When all bins are zero, default to the center bin, which represents head-on targeting at GF 0.0. The
helper initializes its best bin to the center, so this cold-start behavior is built in.

### Incorrect bullet speed

**Problem:** Waves arrive too early or too late compared to actual bullets.

**Solution:** Double-check the bullet speed calculation: `bulletSpeed = 20 − 3 × power`.

Where `power` is between 0.1 and 3.0.

This gives bullet speeds ranging from:
- **Minimum:** 11 units/turn (at power 3.0)
- **Maximum:** 19.7 units/turn (at power 0.1)

## Next steps

Once your GuessFactor gun is working, explore:

- **[Segmentation & Visit Count Stats](segmentation-visit-count-stats.md)**: Split statistics by enemy behavior
  (distance, velocity, etc.) for more precise targeting
- **[Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering)**: Advanced multi-dimensional segmentation
- **[Virtual Guns](../simple-targeting/virtual-guns-mean-targeting.md)**: Run multiple targeting systems and pick the
  best one

GuessFactor Targeting is the foundation for advanced statistical targeting. Mastering it opens the door to competitive
bot development.

## Further Reading

- [GuessFactor Targeting (traditional)](https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)): RoboWiki
  (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) - RoboWiki (classic Robocode)
- [Visit Count Stats](https://robowiki.net/wiki/Visit_Count_Stats) - RoboWiki (classic Robocode)
- [Bullet Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation


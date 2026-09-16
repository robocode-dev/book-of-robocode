---
title: "Segmentation & Visit Count Stats"
category: "Targeting Systems"
summary: >-
  Segmentation divides statistical data by enemy behavior patterns, improving targeting accuracy by recognizing that the
  same enemy acts differently in different situations.
tags:
  - segmentation
  - visit-count-stats
  - statistical-targeting
  - guessfactor
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Visit Count Stats (classic Robocode) https://robowiki.net/wiki/Visit_Count_Stats"
  - >-
    RoboWiki - GuessFactor Targeting (traditional) (classic Robocode)
    https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)
  - "Robocode Tank Royale Docs - API Reference https://robocode.dev/api/"
---

# Segmentation & Visit Count Stats

> [!TIP] Origins
> **Visit Count Stats** and **segmentation** techniques were refined by the RoboWiki community. **Paul Evans**
> popularized segmentation with **SandboxDT**, demonstrating that different stats for "close range," "long range," and
> "near walls" dramatically improved targeting accuracy. **Patrick Cupka ("Voidious")** and **Julian Kent
> ("Skilgannon")** further optimized these systems. Voidious's duelist **Dookious**, for example, combined
> segmentation and Visit Count Stats with Wave Surfing.

Basic GuessFactor Targeting treats all enemy movements equally, recording every dodge attempt into a single array. This
works well against bots with consistent behavior but fails when enemies adapt their movement based on distance,
bullet power, or wall proximity.

**Segmentation** solves this by splitting statistical data into separate buffers based on battlefield conditions.
Instead of one array tracking "how the enemy dodges," you maintain multiple arrays tracking "how the enemy dodges when
close," "how the enemy dodges when far," "how the enemy dodges near walls," and so on.

This technique transforms mediocre statistical guns into top-tier targeting systems.

## Why Segmentation Matters

Imagine an enemy that:

- Moves randomly at close range (unpredictable)
- Uses Stop-and-Go at medium range (predictable timing)
- Oscillates predictably at long range (pattern-based)

Without segmentation, your stats mix all three behaviors. The close-range randomness pollutes your long-range
predictions, and vice versa. Your targeting accuracy suffers everywhere.

With distance segmentation, you maintain separate statistics for each range band. At long range, you see the clean
oscillation pattern. At close range, you see the randomness and aim accordingly. Your hit rate improves dramatically.

## The Core Concept

> [!IMPORTANT] Track Per Enemy
> **Always maintain separate statistics for each enemy.** Store segmented data in a map keyed by the enemy's name or
> platform identifier. Each enemy gets its own set of GuessFactor histograms.
> Mixing data from different enemies will severely degrade targeting accuracy. Each bot has unique movement patterns
> that must be learned independently.

When a wave reaches an enemy, calculate a segment from the conditions at fire time and add the observed GuessFactor to
that enemy's histogram. When firing again, calculate the current segment and aim at its most visited GuessFactor.

## Common Segmentation Axes

The most effective segmentation dimensions, roughly ordered by importance:

| Axis | Example segmentation | Why it helps |
| --- | --- | --- |
| Distance | `floor(distance / 200)` | Bots often dodge differently at close and long range. |
| Lateral velocity | `floor((lateralVelocity + 8) / 2)` | Captures movement perpendicular to the firing line. |
| Advancing velocity | `floor((advancingVelocity + 8) / 2)` | Separates approach, retreat, and stillness. |
| Bullet flight time | `floor((distance / bulletSpeed) / 10)` | Different powers can cause different reactions. |
| Wall distance | `min(floor(wallDistance / 100), 3)` | A bot near a wall has fewer safe escape directions. |
| Direction-change time | `min(floor(turnsSinceChange / 5), 4)` | Captures acceleration and stop-and-go timing. |

The example implementation starts with distance, lateral velocity, and advancing velocity. The other axes can be
added to the segment key after the smaller system has enough data to evaluate.

## Multi-Dimensional Segmentation

The real power comes from **combining** multiple axes. A numeric implementation can flatten the dimensions with
`distanceSegment × lateralBins × advancingBins + lateralSegment × advancingBins + advancingSegment`. A map keyed by a
short string such as `2:5:4` is easier to inspect and stores only segments that have actually been visited.

> [!WARNING] The Curse of Dimensionality
> More segments = more precision, but also = more data sparsity. Each segment needs enough samples to be reliable.
> Too many segments and you'll have empty buckets. Too few and you lose predictive power.

## A working segmented stats helper

The helper below records each hit in three buckets: the full segment, its distance-only fallback, and an all-distance
fallback for that enemy. It selects a specific bucket only after it has enough samples, then smooths the peak by adding
each bin to its two neighbors.

Call `recordHit(...)` when a wave reaches the enemy. Call `bestGuessFactor(...)` before firing with the current movement
conditions. The helper is API-neutral, so the surrounding bot supplies the wave tracking and scan data.

::: code-group

```java [Classic · Java]
import java.util.HashMap;
import java.util.Map;

public final class SegmentedVisitStats {
    private static final int BIN_COUNT = 31;
    private static final int MIN_EXACT_SAMPLES = 10;
    private static final int MIN_DISTANCE_SAMPLES = 5;
    private static final String GLOBAL_KEY = "*:*:*";

    private final Map<String, EnemyStats> enemies = new HashMap<>();

    public void recordHit(
            String enemyName, double distance, double lateralVelocity,
            double advancingVelocity, double guessFactor) {
        EnemyStats stats = enemies.computeIfAbsent(enemyName, ignored -> new EnemyStats());
        stats.bucket(exactKey(distance, lateralVelocity, advancingVelocity)).record(guessFactor);
        stats.bucket(distanceKey(distance)).record(guessFactor);
        stats.bucket(GLOBAL_KEY).record(guessFactor);
    }

    public double bestGuessFactor(
            String enemyName, double distance, double lateralVelocity,
            double advancingVelocity) {
        EnemyStats stats = enemies.get(enemyName);
        if (stats == null) {
            return 0.0;
        }

        Bucket exact = stats.buckets.get(exactKey(distance, lateralVelocity, advancingVelocity));
        if (exact != null && exact.samples >= MIN_EXACT_SAMPLES) {
            return exact.peakGuessFactor();
        }

        Bucket byDistance = stats.buckets.get(distanceKey(distance));
        if (byDistance != null && byDistance.samples >= MIN_DISTANCE_SAMPLES) {
            return byDistance.peakGuessFactor();
        }

        Bucket global = stats.buckets.get(GLOBAL_KEY);
        return global == null ? 0.0 : global.peakGuessFactor();
    }

    private static String exactKey(double distance, double lateral, double advancing) {
        return distanceSegment(distance) + ":" + velocitySegment(lateral) + ":" + velocitySegment(advancing);
    }

    private static String distanceKey(double distance) {
        return distanceSegment(distance) + ":*:*";
    }

    private static int distanceSegment(double distance) {
        return clamp((int) Math.floor(distance / 200.0), 0, 5);
    }

    private static int velocitySegment(double velocity) {
        return clamp((int) Math.floor((velocity + 8.0) / 2.0), 0, 8);
    }

    private static int guessFactorToBin(double guessFactor) {
        int index = (int) Math.round((clamp(guessFactor, -1.0, 1.0) + 1.0) * 0.5 * (BIN_COUNT - 1));
        return clamp(index, 0, BIN_COUNT - 1);
    }

    private static double binToGuessFactor(int bin) {
        return bin * 2.0 / (BIN_COUNT - 1) - 1.0;
    }

    private static int clamp(int value, int minimum, int maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static double clamp(double value, double minimum, double maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static final class EnemyStats {
        private final Map<String, Bucket> buckets = new HashMap<>();

        private Bucket bucket(String key) {
            return buckets.computeIfAbsent(key, ignored -> new Bucket());
        }
    }

    private static final class Bucket {
        private final int[] bins = new int[BIN_COUNT];
        private int samples;

        private void record(double guessFactor) {
            bins[guessFactorToBin(guessFactor)]++;
            samples++;
        }

        private double peakGuessFactor() {
            int bestBin = BIN_COUNT / 2;
            int bestScore = score(bestBin);
            for (int bin = 1; bin < BIN_COUNT - 1; bin++) {
                int score = score(bin);
                if (score > bestScore) {
                    bestScore = score;
                    bestBin = bin;
                }
            }
            return binToGuessFactor(bestBin);
        }

        private int score(int center) {
            return bins[center - 1] + bins[center] + bins[center + 1];
        }
    }
}
```

```python [Tank Royale · Python]
from dataclasses import dataclass


BIN_COUNT = 31
MIN_EXACT_SAMPLES = 10
MIN_DISTANCE_SAMPLES = 5
GLOBAL_KEY = "*:*:*"


@dataclass
class Bucket:
    bins: list[int]
    samples: int = 0

    def record(self, guess_factor: float) -> None:
        self.bins[guess_factor_to_bin(guess_factor)] += 1
        self.samples += 1

    def peak_guess_factor(self) -> float:
        best_bin = BIN_COUNT // 2
        best_score = self.score(best_bin)
        for center in range(1, BIN_COUNT - 1):
            score = self.score(center)
            if score > best_score:
                best_score = score
                best_bin = center
        return bin_to_guess_factor(best_bin)

    def score(self, center: int) -> int:
        return self.bins[center - 1] + self.bins[center] + self.bins[center + 1]


class SegmentedVisitStats:
    def __init__(self) -> None:
        self.enemies: dict[str, dict[str, Bucket]] = {}

    def record_hit(
        self,
        enemy_id: str,
        distance: float,
        lateral_velocity: float,
        advancing_velocity: float,
        guess_factor: float,
    ) -> None:
        buckets = self.enemies.setdefault(enemy_id, {})
        exact = self._bucket(buckets, self._exact_key(distance, lateral_velocity, advancing_velocity))
        exact.record(guess_factor)
        self._bucket(buckets, self._distance_key(distance)).record(guess_factor)
        self._bucket(buckets, GLOBAL_KEY).record(guess_factor)

    def best_guess_factor(
        self,
        enemy_id: str,
        distance: float,
        lateral_velocity: float,
        advancing_velocity: float,
    ) -> float:
        buckets = self.enemies.get(enemy_id)
        if buckets is None:
            return 0.0

        exact = buckets.get(self._exact_key(distance, lateral_velocity, advancing_velocity))
        if exact is not None and exact.samples >= MIN_EXACT_SAMPLES:
            return exact.peak_guess_factor()

        by_distance = buckets.get(self._distance_key(distance))
        if by_distance is not None and by_distance.samples >= MIN_DISTANCE_SAMPLES:
            return by_distance.peak_guess_factor()

        global_bucket = buckets.get(GLOBAL_KEY)
        return global_bucket.peak_guess_factor() if global_bucket else 0.0

    @staticmethod
    def _bucket(buckets: dict[str, Bucket], key: str) -> Bucket:
        if key not in buckets:
            buckets[key] = Bucket([0] * BIN_COUNT)
        return buckets[key]

    @staticmethod
    def _exact_key(distance: float, lateral: float, advancing: float) -> str:
        return f"{distance_segment(distance)}:{velocity_segment(lateral)}:{velocity_segment(advancing)}"

    @staticmethod
    def _distance_key(distance: float) -> str:
        return f"{distance_segment(distance)}:*:*"


def distance_segment(distance: float) -> int:
    return clamp_int(int(distance // 200), 0, 5)


def velocity_segment(velocity: float) -> int:
    return clamp_int(int((velocity + 8) // 2), 0, 8)


def guess_factor_to_bin(guess_factor: float) -> int:
    index = int((clamp(guess_factor, -1.0, 1.0) + 1) * 0.5 * (BIN_COUNT - 1) + 0.5)
    return clamp_int(index, 0, BIN_COUNT - 1)


def bin_to_guess_factor(bin_index: int) -> float:
    return bin_index * 2 / (BIN_COUNT - 1) - 1


def clamp_int(value: int, minimum: int, maximum: int) -> int:
    return max(minimum, min(maximum, value))


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))
```

```java [Tank Royale · Java]
import java.util.HashMap;
import java.util.Map;

public final class SegmentedVisitStats {
    private static final int BIN_COUNT = 31;
    private static final int MIN_EXACT_SAMPLES = 10;
    private static final int MIN_DISTANCE_SAMPLES = 5;
    private static final String GLOBAL_KEY = "*:*:*";

    private final Map<String, EnemyStats> enemies = new HashMap<>();

    public void recordHit(
            String enemyId, double distance, double lateralVelocity,
            double advancingVelocity, double guessFactor) {
        EnemyStats stats = enemies.computeIfAbsent(enemyId, ignored -> new EnemyStats());
        stats.bucket(exactKey(distance, lateralVelocity, advancingVelocity)).record(guessFactor);
        stats.bucket(distanceKey(distance)).record(guessFactor);
        stats.bucket(GLOBAL_KEY).record(guessFactor);
    }

    public double bestGuessFactor(
            String enemyId, double distance, double lateralVelocity,
            double advancingVelocity) {
        EnemyStats stats = enemies.get(enemyId);
        if (stats == null) {
            return 0.0;
        }

        Bucket exact = stats.buckets.get(exactKey(distance, lateralVelocity, advancingVelocity));
        if (exact != null && exact.samples >= MIN_EXACT_SAMPLES) {
            return exact.peakGuessFactor();
        }

        Bucket byDistance = stats.buckets.get(distanceKey(distance));
        if (byDistance != null && byDistance.samples >= MIN_DISTANCE_SAMPLES) {
            return byDistance.peakGuessFactor();
        }

        Bucket global = stats.buckets.get(GLOBAL_KEY);
        return global == null ? 0.0 : global.peakGuessFactor();
    }

    private static String exactKey(double distance, double lateral, double advancing) {
        return distanceSegment(distance) + ":" + velocitySegment(lateral) + ":" + velocitySegment(advancing);
    }

    private static String distanceKey(double distance) {
        return distanceSegment(distance) + ":*:*";
    }

    private static int distanceSegment(double distance) {
        return clamp((int) Math.floor(distance / 200.0), 0, 5);
    }

    private static int velocitySegment(double velocity) {
        return clamp((int) Math.floor((velocity + 8.0) / 2.0), 0, 8);
    }

    private static int guessFactorToBin(double guessFactor) {
        int index = (int) Math.round((clamp(guessFactor, -1.0, 1.0) + 1.0) * 0.5 * (BIN_COUNT - 1));
        return clamp(index, 0, BIN_COUNT - 1);
    }

    private static double binToGuessFactor(int bin) {
        return bin * 2.0 / (BIN_COUNT - 1) - 1.0;
    }

    private static int clamp(int value, int minimum, int maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static double clamp(double value, double minimum, double maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static final class EnemyStats {
        private final Map<String, Bucket> buckets = new HashMap<>();

        private Bucket bucket(String key) {
            return buckets.computeIfAbsent(key, ignored -> new Bucket());
        }
    }

    private static final class Bucket {
        private final int[] bins = new int[BIN_COUNT];
        private int samples;

        private void record(double guessFactor) {
            bins[guessFactorToBin(guessFactor)]++;
            samples++;
        }

        private double peakGuessFactor() {
            int bestBin = BIN_COUNT / 2;
            int bestScore = score(bestBin);
            for (int bin = 1; bin < BIN_COUNT - 1; bin++) {
                int score = score(bin);
                if (score > bestScore) {
                    bestScore = score;
                    bestBin = bin;
                }
            }
            return binToGuessFactor(bestBin);
        }

        private int score(int center) {
            return bins[center - 1] + bins[center] + bins[center + 1];
        }
    }
}
```

```csharp [Tank Royale · C#]
using System;
using System.Collections.Generic;

public sealed class SegmentedVisitStats
{
    private const int BinCount = 31;
    private const int MinExactSamples = 10;
    private const int MinDistanceSamples = 5;
    private const string GlobalKey = "*:*:*";
    private readonly Dictionary<string, EnemyStats> enemies = new();

    public void RecordHit(
        string enemyId, double distance, double lateralVelocity,
        double advancingVelocity, double guessFactor)
    {
        EnemyStats stats = GetEnemy(enemyId);
        stats.GetBucket(ExactKey(distance, lateralVelocity, advancingVelocity)).Record(guessFactor);
        stats.GetBucket(DistanceKey(distance)).Record(guessFactor);
        stats.GetBucket(GlobalKey).Record(guessFactor);
    }

    public double BestGuessFactor(
        string enemyId, double distance, double lateralVelocity,
        double advancingVelocity)
    {
        if (!enemies.TryGetValue(enemyId, out EnemyStats? stats))
        {
            return 0.0;
        }

        Bucket? exact = stats.Buckets.GetValueOrDefault(ExactKey(distance, lateralVelocity, advancingVelocity));
        if (exact is not null && exact.Samples >= MinExactSamples)
        {
            return exact.PeakGuessFactor();
        }

        Bucket? byDistance = stats.Buckets.GetValueOrDefault(DistanceKey(distance));
        if (byDistance is not null && byDistance.Samples >= MinDistanceSamples)
        {
            return byDistance.PeakGuessFactor();
        }

        return stats.Buckets.TryGetValue(GlobalKey, out Bucket? global)
            ? global.PeakGuessFactor()
            : 0.0;
    }

    private EnemyStats GetEnemy(string enemyId)
    {
        if (!enemies.TryGetValue(enemyId, out EnemyStats? stats))
        {
            stats = new EnemyStats();
            enemies[enemyId] = stats;
        }
        return stats;
    }

    private static string ExactKey(double distance, double lateral, double advancing) =>
        $"{DistanceSegment(distance)}:{VelocitySegment(lateral)}:{VelocitySegment(advancing)}";

    private static string DistanceKey(double distance) => $"{DistanceSegment(distance)}:*:*";

    private static int DistanceSegment(double distance) => Clamp((int)Math.Floor(distance / 200.0), 0, 5);

    private static int VelocitySegment(double velocity) => Clamp((int)Math.Floor((velocity + 8.0) / 2.0), 0, 8);

    private static int GuessFactorToBin(double guessFactor)
    {
        int index = (int)Math.Round((Clamp(guessFactor, -1.0, 1.0) + 1.0) * 0.5 * (BinCount - 1));
        return Clamp(index, 0, BinCount - 1);
    }

    private static double BinToGuessFactor(int bin) => bin * 2.0 / (BinCount - 1) - 1.0;

    private static int Clamp(int value, int minimum, int maximum) => Math.Max(minimum, Math.Min(maximum, value));

    private sealed class EnemyStats
    {
        public Dictionary<string, Bucket> Buckets { get; } = new();

        public Bucket GetBucket(string key)
        {
            if (!Buckets.TryGetValue(key, out Bucket? bucket))
            {
                bucket = new Bucket();
                Buckets[key] = bucket;
            }
            return bucket;
        }
    }

    private sealed class Bucket
    {
        private readonly int[] bins = new int[BinCount];
        public int Samples { get; private set; }

        public void Record(double guessFactor)
        {
            bins[GuessFactorToBin(guessFactor)]++;
            Samples++;
        }

        public double PeakGuessFactor()
        {
            int bestBin = BinCount / 2;
            int bestScore = Score(bestBin);
            for (int bin = 1; bin < BinCount - 1; bin++)
            {
                int score = Score(bin);
                if (score > bestScore)
                {
                    bestScore = score;
                    bestBin = bin;
                }
            }
            return BinToGuessFactor(bestBin);
        }

        private int Score(int center) => bins[center - 1] + bins[center] + bins[center + 1];
    }
}
```

```typescript [Tank Royale · TypeScript]
type Bucket = {
    bins: number[];
    samples: number;
};

class SegmentedVisitStats {
    private static readonly binCount = 31;
    private static readonly minExactSamples = 10;
    private static readonly minDistanceSamples = 5;
    private static readonly globalKey = "*:*:*";
    private readonly enemies = new Map<string, Map<string, Bucket>>();

    recordHit(
        enemyId: string,
        distance: number,
        lateralVelocity: number,
        advancingVelocity: number,
        guessFactor: number,
    ) {
        const buckets = this.getEnemy(enemyId);
        this.record(this.getBucket(buckets, this.exactKey(distance, lateralVelocity, advancingVelocity)), guessFactor);
        this.record(this.getBucket(buckets, this.distanceKey(distance)), guessFactor);
        this.record(this.getBucket(buckets, SegmentedVisitStats.globalKey), guessFactor);
    }

    bestGuessFactor(
        enemyId: string,
        distance: number,
        lateralVelocity: number,
        advancingVelocity: number,
    ) {
        const buckets = this.enemies.get(enemyId);
        if (!buckets) {
            return 0;
        }

        const exact = buckets.get(this.exactKey(distance, lateralVelocity, advancingVelocity));
        if (exact && exact.samples >= SegmentedVisitStats.minExactSamples) {
            return this.peakGuessFactor(exact);
        }

        const byDistance = buckets.get(this.distanceKey(distance));
        if (byDistance && byDistance.samples >= SegmentedVisitStats.minDistanceSamples) {
            return this.peakGuessFactor(byDistance);
        }

        const global = buckets.get(SegmentedVisitStats.globalKey);
        return global ? this.peakGuessFactor(global) : 0;
    }

    private getEnemy(enemyId: string) {
        let buckets = this.enemies.get(enemyId);
        if (!buckets) {
            buckets = new Map<string, Bucket>();
            this.enemies.set(enemyId, buckets);
        }
        return buckets;
    }

    private record(bucket: Bucket, guessFactor: number) {
        bucket.bins[this.guessFactorToBin(guessFactor)] += 1;
        bucket.samples += 1;
    }

    private getBucket(buckets: Map<string, Bucket>, key: string): Bucket {
        let bucket = buckets.get(key);
        if (!bucket) {
            bucket = { bins: new Array<number>(SegmentedVisitStats.binCount).fill(0), samples: 0 };
            buckets.set(key, bucket);
        }
        return bucket;
    }

    private exactKey(distance: number, lateral: number, advancing: number) {
        return `${distanceSegment(distance)}:${velocitySegment(lateral)}:${velocitySegment(advancing)}`;
    }

    private distanceKey(distance: number) {
        return `${distanceSegment(distance)}:*:*`;
    }

    private peakGuessFactor(bucket: Bucket) {
        let bestBin = Math.floor(SegmentedVisitStats.binCount / 2);
        let bestScore = this.score(bucket, bestBin);
        for (let center = 1; center < SegmentedVisitStats.binCount - 1; center += 1) {
            const score = this.score(bucket, center);
            if (score > bestScore) {
                bestScore = score;
                bestBin = center;
            }
        }
        return bestBin * 2 / (SegmentedVisitStats.binCount - 1) - 1;
    }

    private score(bucket: Bucket, center: number) {
        return bucket.bins[center - 1] + bucket.bins[center] + bucket.bins[center + 1];
    }

    private guessFactorToBin(guessFactor: number) {
        const value = clamp(guessFactor, -1, 1);
        const index = Math.round((value + 1) * 0.5 * (SegmentedVisitStats.binCount - 1));
        return clampInt(index, 0, SegmentedVisitStats.binCount - 1);
    }
}

function distanceSegment(distance: number) {
    return clampInt(Math.floor(distance / 200), 0, 5);
}

function velocitySegment(velocity: number) {
    return clampInt(Math.floor((velocity + 8) / 2), 0, 8);
}

function clampInt(value: number, minimum: number, maximum: number) {
    return Math.max(minimum, Math.min(maximum, value));
}

function clamp(value: number, minimum: number, maximum: number) {
    return Math.max(minimum, Math.min(maximum, value));
}
```

:::

## Data sparsity and rolling averages

Combining 6 distance bands, 9 lateral-velocity bands, and 9 advancing-velocity bands creates 486 possible exact
segments. Early in a battle, many of those buckets are empty. The helper therefore falls back from the exact segment
to distance-only data, then to all data for that enemy.

Start with distance-only segmentation when testing a new gun. Add lateral velocity or other axes only when logs show
that the extra distinction improves hit rate without leaving most buckets nearly empty.

### Decay old data

To make the gun adapt when an enemy changes strategy, multiply stored counts by a decay factor such as `0.98` before
recording a new hit. Lower values such as `0.90–0.95` forget faster; higher values such as `0.98–0.995` retain more
history. A timestamp-based implementation can apply decay when reading instead of visiting every bin on every hit.

### Smooth nearby GuessFactors

The helper scores each bin together with its immediate neighbors. Kernel smoothing is another option: distribute one
hit across offsets `-2` through `+2` with weights such as `[0.1, 0.2, 0.4, 0.2, 0.1]`. Both techniques reduce the effect
of one lucky observation and favor a stable cluster of visits.

## Practical Tips

**Start simple:** Begin with distance-only segmentation. Verify it works before adding more dimensions.

**Log everything:** Save segment indices, hit rates per segment, and sample counts. Analyze offline to tune bin counts.

**Test against diverse opponents:** Segmentation helps most against adaptive enemies. If you only test against
the same bot all the time, you won't achieve the benefits.

**Avoid over-segmentation:** 200+ segments often perform worse than 50–100 well-chosen segments due to data sparsity.

## Common Mistakes

- **Too many segments too soon:** Start with 20–50 total segments, not 500.
- **Forgetting to normalize:** When comparing segments with different sample counts, weight by confidence.
- **Ignoring zero-sample segments:** Always have a fallback strategy (less-specific segmentation or mean targeting).
- **Not decaying old data:** Enemies that change strategy mid-battle will fool static stats.

## Next Steps

Once you have effective segmentation:

- **[Dynamic Clustering](../statistical-targeting/dynamic-clustering.md)**: Replace fixed segments with adaptive
  similarity matching (pioneered by ABC, perfected by Julian Kent (Skilgannon)). See
  also: [RoboWiki - Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering)
- **[Anti-Surfer Targeting](../targeting-tactics/anti-surfer-targeting.md)**: Counter enemies who use Wave Surfing. See
  also: [RoboWiki - Anti-Surfer Targeting](https://robowiki.net/wiki/Anti-Surfer_Targeting)

## Further Reading

- [Visit Count Stats](https://robowiki.net/wiki/Visit_Count_Stats) - RoboWiki (classic Robocode)
- [GuessFactor Targeting (traditional)](https://robowiki.net/wiki/GuessFactor_Targeting_(traditional)): RoboWiki (
  classic Robocode)
- [Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering) - RoboWiki (classic Robocode)
- [Symbolic Dynamic Segmentation](https://robowiki.net/wiki/Symbolic_Dynamic_Segmentation) - RoboWiki (classic Robocode)

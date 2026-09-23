---
title: "Flattener"
category: "Movement & Evasion"
summary: >-
  A flattener makes a wave surfer track its own visits the way a learning gun does, then avoid its favorite spots,
  so that guns which learn from movement instead of from hits find nothing to aim at.
tags:
  - flattener
  - movement
  - advanced-evasion
  - wave-surfing
  - movement-profile
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Flattener (classic Robocode) https://robowiki.net/wiki/Flattener"
  - "RoboWiki - Talk:Flattener (classic Robocode) https://robowiki.net/wiki/Talk:Flattener"
  - "RoboWiki - Movement Profile (classic Robocode) https://robowiki.net/wiki/Movement_Profile"
  - "RoboWiki - Wave Surfing Tutorial (classic Robocode) https://robowiki.net/wiki/Wave_Surfing_Tutorial"
---

# Flattener

> [!TIP] Origins
> The **flattener** was developed by the RoboWiki wave-surfing community. **Patrick Cupka (Voidious)** described
> enabling it only above a certain enemy hit percentage in his bot Diamond, and bots such as YersiniaPestis use
> several activation levels instead of an on/off switch.

A wave surfer learns from being hit. Every bullet that lands raises the danger at that
[GuessFactor](/appendices/glossary#guessfactor), and the surfer
steers elsewhere next time. That works well against a gun that aims where bullets used to connect. But some guns,
including many [anti-surfer guns](../../targeting/advanced-targeting/anti-surfer-targeting.md), learn from where the
bot *went*, whether or not a bullet was there. Voidious noted that his anti-surfer gun decays its data by visits,
because it knows nothing about its own hits. To such a gun, the surfer's favorite escape spots are a target.

## Flat means unpredictable

RoboWiki defines a **movement profile** as a graph of how much time a bot spent at each GuessFactor. A perfectly
flat profile is the classic goal of random movement, because it gives a learning gun no angle worth preferring.

Plain surfing does not aim for flatness. It aims for low danger, and the safest spots against one gun can become
well-worn paths. A **flattener** is RoboWiki's name for any technique where a bot tracks its own movement, the way an
enemy gun would, and avoids moving the same way too often.

<!-- TODO: Illustration
**Filename:** flattener-movement-profile.svg
**Caption:** "Schematic profiles: plain surfing leaves peaks a visit-counting gun can find, a flattener spreads them."
**Viewport:** 8000x4000
**Battlefield:** false
**Description:** Two panels on dark backgrounds, each a 15-bar histogram of time spent per GuessFactor from -1 to +1.
The left panel, "surfing only", has two tall red peaks, near GF -0.4 and GF +0.5, among gray bars. The right panel,
"with flattener", has green bars of nearly equal height. The bar heights are illustrative, not measured. A rotated
"time spent" axis label sits left of the first panel.
**Texts:**
  - text: "surfing only", position: (2000, 560), color: chocolate
  - text: "with flattener", position: (6000, 560), color: chocolate
  - text: "a visit-counting gun aims at the peaks", position: (2000, 3620), color: #EF4444
  - text: "no angle stands out", position: (6000, 3620), color: #10B981
-->

<img src="/images/flattener-movement-profile.svg"
alt="Schematic profiles: plain surfing leaves peaks a visit-counting gun can find, a flattener spreads them."
style="max-width:100%;height:auto;"/><br>
*Schematic profiles: plain surfing leaves peaks a visit-counting gun can find, a flattener spreads them.*

## How a flattener works

A flattener needs no new machinery. It uses the same GuessFactor statistics the surfer already keeps for enemy hits,
but it records the bot's position on *every* wave that reaches it, hit or not. The surfer then adds that visit danger
to the hit danger when it picks where to go.

The class below keeps both tables, normalizes each by its own count so neither swamps the other, and spreads every
entry over nearby bins with BasicSurfer's $1 / ((i - b)^2 + 1)$ smoothing. The `bin` values come from the same
GuessFactor conversion the surfer already uses.

::: code-group

```java [Classic · Java]
public final class FlatteningDanger {
    private static final int BINS = 47;
    private final double[] hitStats = new double[BINS];
    private final double[] visitStats = new double[BINS];
    private final double startRate;
    private final double fullRate;
    private int waves;
    private int hits;

    public FlatteningDanger(double startRate, double fullRate) {
        this.startRate = startRate;
        this.fullRate = fullRate;
    }

    public void onWaveReached(int bin, boolean hitMe) {
        waves++;
        smoothAdd(visitStats, bin);
        if (hitMe) {
            hits++;
            smoothAdd(hitStats, bin);
        }
    }

    public double danger(int bin) {
        double hitDanger = hitStats[bin] / Math.max(1, hits);
        double visitDanger = visitStats[bin] / Math.max(1, waves);
        return hitDanger + flattenerWeight() * visitDanger;
    }

    public double flattenerWeight() {
        double hitRate = waves == 0 ? 0 : (double) hits / waves;
        return Math.max(0, Math.min(1, (hitRate - startRate) / (fullRate - startRate)));
    }

    private static void smoothAdd(double[] stats, int bin) {
        for (int i = 0; i < BINS; i++) {
            stats[i] += 1.0 / ((i - bin) * (i - bin) + 1);
        }
    }
}
```

```python [Tank Royale · Python]
BINS = 47


class FlatteningDanger:
    def __init__(self, start_rate: float, full_rate: float) -> None:
        self.start_rate = start_rate
        self.full_rate = full_rate
        self.hit_stats = [0.0] * BINS
        self.visit_stats = [0.0] * BINS
        self.waves = 0
        self.hits = 0

    def on_wave_reached(self, bin_index: int, hit_me: bool) -> None:
        self.waves += 1
        smooth_add(self.visit_stats, bin_index)
        if hit_me:
            self.hits += 1
            smooth_add(self.hit_stats, bin_index)

    def danger(self, bin_index: int) -> float:
        hit_danger = self.hit_stats[bin_index] / max(1, self.hits)
        visit_danger = self.visit_stats[bin_index] / max(1, self.waves)
        return hit_danger + self.flattener_weight() * visit_danger

    def flattener_weight(self) -> float:
        hit_rate = self.hits / self.waves if self.waves else 0.0
        return max(0.0, min(1.0, (hit_rate - self.start_rate) / (self.full_rate - self.start_rate)))


def smooth_add(stats: list[float], bin_index: int) -> None:
    for i in range(BINS):
        stats[i] += 1 / ((i - bin_index) ** 2 + 1)
```

```java [Tank Royale · Java]
public final class FlatteningDanger {
    private static final int BINS = 47;
    private final double[] hitStats = new double[BINS];
    private final double[] visitStats = new double[BINS];
    private final double startRate;
    private final double fullRate;
    private int waves;
    private int hits;

    public FlatteningDanger(double startRate, double fullRate) {
        this.startRate = startRate;
        this.fullRate = fullRate;
    }

    public void onWaveReached(int bin, boolean hitMe) {
        waves++;
        smoothAdd(visitStats, bin);
        if (hitMe) {
            hits++;
            smoothAdd(hitStats, bin);
        }
    }

    public double danger(int bin) {
        double hitDanger = hitStats[bin] / Math.max(1, hits);
        double visitDanger = visitStats[bin] / Math.max(1, waves);
        return hitDanger + flattenerWeight() * visitDanger;
    }

    public double flattenerWeight() {
        double hitRate = waves == 0 ? 0 : (double) hits / waves;
        return Math.max(0, Math.min(1, (hitRate - startRate) / (fullRate - startRate)));
    }

    private static void smoothAdd(double[] stats, int bin) {
        for (int i = 0; i < BINS; i++) {
            stats[i] += 1.0 / ((i - bin) * (i - bin) + 1);
        }
    }
}
```

```csharp [Tank Royale · C#]
using System;

public sealed class FlatteningDanger
{
    private const int Bins = 47;
    private readonly double[] hitStats = new double[Bins];
    private readonly double[] visitStats = new double[Bins];
    private readonly double startRate;
    private readonly double fullRate;
    private int waves;
    private int hits;

    public FlatteningDanger(double startRate, double fullRate)
    {
        this.startRate = startRate;
        this.fullRate = fullRate;
    }

    public void OnWaveReached(int bin, bool hitMe)
    {
        waves++;
        SmoothAdd(visitStats, bin);
        if (hitMe)
        {
            hits++;
            SmoothAdd(hitStats, bin);
        }
    }

    public double Danger(int bin)
    {
        double hitDanger = hitStats[bin] / Math.Max(1, hits);
        double visitDanger = visitStats[bin] / Math.Max(1, waves);
        return hitDanger + FlattenerWeight() * visitDanger;
    }

    public double FlattenerWeight()
    {
        double hitRate = waves == 0 ? 0 : (double)hits / waves;
        return Math.Clamp((hitRate - startRate) / (fullRate - startRate), 0, 1);
    }

    private static void SmoothAdd(double[] stats, int bin)
    {
        for (int i = 0; i < Bins; i++)
        {
            stats[i] += 1.0 / ((i - bin) * (i - bin) + 1);
        }
    }
}
```

```typescript [Tank Royale · TypeScript]
class FlatteningDanger {
    private static readonly bins = 47;
    private readonly hitStats = new Array<number>(FlatteningDanger.bins).fill(0);
    private readonly visitStats = new Array<number>(FlatteningDanger.bins).fill(0);
    private waves = 0;
    private hits = 0;

    constructor(private readonly startRate: number, private readonly fullRate: number) {}

    onWaveReached(bin: number, hitMe: boolean) {
        this.waves += 1;
        smoothAdd(this.visitStats, bin);
        if (hitMe) {
            this.hits += 1;
            smoothAdd(this.hitStats, bin);
        }
    }

    danger(bin: number) {
        const hitDanger = this.hitStats[bin] / Math.max(1, this.hits);
        const visitDanger = this.visitStats[bin] / Math.max(1, this.waves);
        return hitDanger + this.flattenerWeight() * visitDanger;
    }

    flattenerWeight() {
        const hitRate = this.waves === 0 ? 0 : this.hits / this.waves;
        return Math.max(0, Math.min(1, (hitRate - this.startRate) / (this.fullRate - this.startRate)));
    }
}

function smoothAdd(stats: number[], bin: number) {
    for (let i = 0; i < stats.length; i += 1) {
        stats[i] += 1 / ((i - bin) * (i - bin) + 1);
    }
}
```

:::

Call `onWaveReached` when a tracked enemy wave passes the bot, then use `danger` wherever the surfer scored a spot
before, for example in the predictor from [Wave Surfing Implementations](./wave-surfing-implementations.md). A
variant discussed on the talk page, the tick flattener, logs a visit on every turn instead of once per wave, which
collects far more samples per round.

## When to switch it on

Flattening is not free. Every unit of visit danger pulls the surfer away from spots that its hit data calls safe, so
against a gun that rarely hits, a flattener mostly adds noise. Diamond, for example, enables its flattener only above
a certain enemy hit percentage. YersiniaPestis uses a non-binary flattener with several activation levels.

`flattenerWeight` follows that gradual idea. Below `startRate` the flattener is off, above `fullRate` it counts fully,
and in between it blends. RoboWiki does not publish the thresholds that Diamond uses, so treat both values as tuning
parameters and test them against both simple and learning guns.

The same rules apply in classic Robocode and Tank Royale, since only GuessFactor data is involved.

## An arms race, not an ending

A flattener answers one kind of gun, and the other side adapts too. On the talk page, Straw points out that a gun
tuned for surfers, with fast decay that fires where they have been, differs from a gun tuned for flattened movement.
MN suggests firing more often at the angles a surfer visits *least*. Each counter invites another, so a flattened
surfer is never finished. The gun side of this contest continues in
[Anti-Surfer Targeting](../../targeting/advanced-targeting/anti-surfer-targeting.md).

## Further Reading

- [Flattener](https://robowiki.net/wiki/Flattener) - RoboWiki (classic Robocode)
- [Talk:Flattener](https://robowiki.net/wiki/Talk:Flattener) - RoboWiki (classic Robocode)
- [Movement Profile](https://robowiki.net/wiki/Movement_Profile) - RoboWiki (classic Robocode)
- [Wave Surfing Tutorial](https://robowiki.net/wiki/Wave_Surfing_Tutorial) - RoboWiki (classic Robocode)
- [Anti-Surfer Targeting](https://robowiki.net/wiki/Anti-Surfer_Targeting) - RoboWiki (classic Robocode)

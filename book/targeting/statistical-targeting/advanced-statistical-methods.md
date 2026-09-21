---
title: "Advanced Statistical Methods"
category: "Targeting Systems"
summary: >-
  A segmentation tree grows its own bucket boundaries by splitting only where enough wave observations justify a
  finer cut, keeping GuessFactor stats dense without an author guessing axes in advance.
tags: ["advanced-statistical-methods", "targeting", "statistical-targeting", "advanced", "robocode", "tank-royale"]
difficulty: "advanced"
source:
  - >-
    RoboWiki - Symbolic Dynamic Segmentation (classic Robocode)
    https://robowiki.net/wiki/Symbolic_Dynamic_Segmentation
  - >-
    RoboWiki - Wiki Targeting/Dynamic Segmentation (classic Robocode)
    https://robowiki.net/wiki/Wiki_Targeting/Dynamic_Segmentation
  - "RoboWiki - Zoom Targeting (classic Robocode) https://robowiki.net/wiki/Zoom_Targeting"
  - "RoboWiki - Visit Count Stats (classic Robocode) https://robowiki.net/wiki/Visit_Count_Stats"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Advanced Statistical Methods

> [!TIP] Origins
> **Symbolic Dynamic Segmentation**, the decision-tree approach to bucket boundaries, was developed by
> **Vic Stewart** as an improvement on the earlier Zoom Targeting concept, and refined by the RoboWiki community.

Fixed segmentation forces a choice before the first shot: how many distance bands, how many velocity bins, which axes
matter. Six distance bands times nine lateral-velocity bins times nine advancing-velocity bins already gives
6 × 9 × 9 = 486 cells in the grid, most of them empty for the first several rounds. A tree that grows its own
boundaries sidesteps the guess. It starts as one bucket for the whole enemy and splits only where enough recorded
waves justify a finer cut.

## A leaf that earns its split

Each leaf in the tree starts as a single GuessFactor histogram, exactly like the segments from
[Segmentation & Visit Count Stats](segmentation-visit-count-stats.md). Every wave that lands in a leaf adds one
observation, and the leaf checks its sample count. Vic Stewart's original implementation waits for 40 observations
before a leaf becomes eligible to split, and settled leaves average close to 30 observations once the tree stabilizes.

When a leaf crosses that threshold, the tree tests every candidate axis, such as lateral velocity, distance, or wall
proximity, and keeps whichever split separates the recorded GuessFactors most cleanly. The leaf becomes a splitter
node with two smaller leaves beneath it, and later waves route to whichever child matches their state.

<!-- TODO: Illustration
**Filename:** adaptive-segmentation-tree.svg
**Caption:** "A segmentation tree splits only where wave data supports it, leaving a few well-stocked leaves instead
of many nearly empty grid cells."
**Viewport:** 8000x5000
**Battlefield:** false
**Description:** Two side-by-side dark panels sharing a distance (horizontal) and lateral-velocity (vertical) axis
pair, no battlefield. Left panel: a rigid 4x3 grid of equal rectangular cells, each numbered with its sample count.
Eight of the twelve cells are hollow with a dashed gray outline and hold 1-4 samples. Four cells, scattered unevenly,
are filled solid green and hold 22-35 samples, showing sparse and uneven data. Right panel: the same kind of state
space, partitioned by three boundary lines from a two-level binary split into four irregular rectangles. A vertical
line splits the whole panel on distance first. The left side then splits again on lateral velocity, and the right
side splits again, at a different height, on wall distance. All four leaf rectangles are filled the same solid green
and each holds close to 30 samples (28, 32, 29, 31), showing every leaf ends up similarly well-stocked no matter its
size. A short arrow points from each split line to a text label naming the axis it split on.
**Texts:**
  - text: "fixed grid: many empty cells", position: (1950, 640), color: chocolate
  - text: "distance", position: (1950, 4300), color: chocolate
  - text: "lateral velocity", position: (180, 2300), color: chocolate, rotate: -90
  - text: "adaptive tree: every leaf ~30 samples", position: (5950, 640), color: "#10B981"
  - text: "distance", position: (5950, 4300), color: chocolate
  - text: "lateral velocity", position: (4180, 2300), color: chocolate, rotate: -90
  - text: "split on distance", position: (6180, 820), color: chocolate
  - text: "split on lateral velocity", position: (4520, 1970), color: chocolate
  - text: "split on wall distance", position: (6560, 1400), color: chocolate
-->

<img src="/images/adaptive-segmentation-tree.svg"
alt="A segmentation tree splits only where wave data supports it, leaving a few well-stocked leaves instead of many
nearly empty grid cells."
style="max-width:100%;height:auto;"/><br>
*A segmentation tree splits only where wave data supports it, leaving a few well-stocked leaves instead of many
nearly empty grid cells.*

## What one battle grows

A 35-round match can generate roughly 30,000 waves, and against a bot with enough behavioral variety, the tree grows
to about 1,000 leaves and 999 splitter nodes by the time the match ends. Each splitter node needs only 4 bits to
record its chosen axis, which supports up to 16 candidate dimensions and compresses the whole topology for 999
splitters to about 3.6 kB.

The tree's shape, not its GuessFactor data, is what's worth keeping between matches. A gun can serialize the splitter
structure and reuse it as a starting skeleton against a new opponent, refilling the leaves with fresh histograms
instead of rebuilding the whole partition from zero.

```txt
on wave break at state s:
    leaf = walk tree from root, following the split test at each node until a leaf is reached
    leaf.record(observedGuessFactor)
    if leaf.sampleCount >= SPLIT_THRESHOLD:
        axis = axis that best separates leaf.samples by guessFactor
        replace leaf with a splitter on axis, and two new leaves holding the divided samples

when aiming from state s:
    leaf = walk tree from root, following the split test at each node until a leaf is reached
    aim at leaf.peakGuessFactor()
```

## Name the cost

A tree earns density at the price of commitment. A split made on 40 early samples can lock in a boundary that later
data would have drawn elsewhere, and most implementations never revisit a splitter once it exists. Testing every
candidate axis at every eligible leaf also costs more CPU than updating one fixed bucket, though that cost only
appears once every 30 or so observations rather than every turn.

Early rounds still start at the tree's single root leaf, so a fresh match behaves like unsegmented stats until enough
waves accumulate to justify the first split. The tree buys structure over time, not a shortcut around the cold start
every statistical gun faces.

## Platform notes

Wave capture, splitting, and GuessFactor storage are bot-side data structures, so the technique carries over between
classic Robocode and Tank Royale without change. Convert headings and bearings into one consistent angle convention
before building a state key, since classic Robocode measures compass-style while Tank Royale measures mathematically.

## Further Reading

- [Symbolic Dynamic Segmentation](https://robowiki.net/wiki/Symbolic_Dynamic_Segmentation) - RoboWiki
  (classic Robocode)
- [Wiki Targeting/Dynamic Segmentation](https://robowiki.net/wiki/Wiki_Targeting/Dynamic_Segmentation) - RoboWiki
  (classic Robocode)
- [Zoom Targeting](https://robowiki.net/wiki/Zoom_Targeting) - RoboWiki (classic Robocode)
- [Visit Count Stats](https://robowiki.net/wiki/Visit_Count_Stats) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation

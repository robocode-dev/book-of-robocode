---
title: "Dynamic Clustering"
category: "Targeting Systems"
summary: >-
  Dynamic Clustering retrieves the past battle situations most like the current one, then aims from their outcomes.
tags: ["dynamic-clustering", "targeting", "statistical-targeting", "advanced", "robocode", "tank-royale"]
difficulty: "advanced"
source:
  - "RoboWiki - Dynamic Clustering (classic Robocode) https://robowiki.net/wiki/Dynamic_Clustering"
  - "RoboWiki - Dynamic Clustering Tutorial (classic Robocode) https://robowiki.net/wiki/Dynamic_Clustering_Tutorial"
  - "RoboWiki - kd-tree (classic Robocode) https://robowiki.net/wiki/Kd-tree"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Dynamic Clustering

> [!TIP] Origins
> **Dynamic Clustering** was coined and pioneered by **ABC**. It was refined by the RoboWiki community,
> including the authors of Chalk, Diamond, and other k-nearest-neighbor bots.

Fixed segmentation asks a bot author to choose every bucket boundary before the battle starts. Dynamic Clustering keeps
the original situations instead. When the gun needs an answer, it finds the recorded situations that most resemble the
one in front of it.

The name is historical. In Robocode, Dynamic Clustering is usually a **k-nearest-neighbor** search with density
estimation, not k-means clustering.

## A situation becomes a point

At fire time, record a state vector alongside the eventual outcome of its wave. A small first vector might contain
normalized distance, lateral velocity, advancing velocity, and distance to the nearest wall. When the wave reaches the
enemy, attach its observed [GuessFactor](/appendices/glossary#guessfactor) to that same record.

For a current state $q$ and a recorded state $p$, a common squared similarity distance is
$d^2(p,q) = \sum_i w_i(p_i-q_i)^2$. Here $p_i$ and $q_i$ are values on axis $i$, and $w_i$ is that axis's weight.
Normalize axes first, or a value measured in hundreds of units will drown out velocity.

<!-- TODO: Illustration
**Filename:** dynamic-clustering-neighbors.svg
**Caption:** "The current battle state selects nearby recorded states in a multi-dimensional data space."
**Viewport:** 8000x5000
**Battlefield:** false
**Description:** Left: a two-dimensional projection labeled distance and lateral velocity. A blue star marks the
current state. Seven filled green nearest neighbors sit inside a dashed green circle, and hollow red records outside it
are ignored. A green "vote" arrow leads right to a chart of the neighbors' GuessFactors: green ticks on a -1 to +1 axis,
a smooth green density curve, and an orange dot at the peak used for aiming.
**Texts:**
  - text: "distance", position: (2950, 4500), color: chocolate
  - text: "lateral velocity", position: (900, 2350), color: chocolate, rotate: -90
  - text: "current state", position: (3135, 1455), color: #60A5FA
  - text: "k = 7 nearest neighbors", position: (3135, 2955), color: #10B981
  - text: "GuessFactor", position: (6650, 4180), color: chocolate
  - text: "aim at peak", position: (6973, 1420), color: #F59E0B
-->

<img src="/images/dynamic-clustering-neighbors.svg"
alt="The current battle state selects nearby recorded states in a multi-dimensional data space."
style="max-width:100%;height:auto;"/><br>
*The current battle state selects nearby recorded states in a multi-dimensional data space.*

## From neighbors to an aiming angle

Choose the $k$ closest records, then let their outcomes vote for a GuessFactor. A kernel gives close neighbors more
weight than merely similar ones. The resulting peak becomes the firing angle in the same way as a GuessFactor gun.

```txt
on wave break:
    log.add(state captured when the wave was fired, observedGuessFactor)

when aiming:
    current = makeState(scan)
    neighbors = k records with the smallest weightedDistance(current, record.state)
    bestFactor = densityPeak(neighbors, record.guessFactor, record.distance)
    aim at directBearing + bestFactor * maximumEscapeAngle
```

Keeping the complete records is the advantage. A new axis or a different weight changes the comparison without
discarding old wave outcomes. It is also the cost: a poor state representation still produces poor neighbors.

## Data, speed, and fallbacks

Early in a round there may be too few records to make a useful neighborhood. Fall back to a broad GuessFactor buffer
or a simpler gun until the log grows. Keep data per enemy, and consider decaying or capping old samples when an opponent
changes behavior.

A direct scan through every record is clear and often good enough for a small log. Long battles make that search
expensive. A k-d tree organizes the state points so nearest-neighbor queries can avoid much of the log, but it is an
optimization to add after the brute-force version has been tested.

> [!WARNING] More axes are not automatically better
> Each added axis makes an exact match rarer. Add only measurements that separate real movement choices, then test the
> change across enough rounds to distinguish an improvement from luck.

## Platform notes

The state search, wave timing, and bullet speed are the same idea in classic Robocode and Tank Royale. Store headings
and bearings in one internal convention before building a state or converting the final firing angle: classic Robocode
uses compass-style angles, while Tank Royale uses mathematical angles. Tank Royale's published physics also confirms
the shared maximum speed of 8 units per turn and bullet-speed rule.

## Further Reading

- [Dynamic Clustering](https://robowiki.net/wiki/Dynamic_Clustering) - RoboWiki (classic Robocode)
- [Dynamic Clustering Tutorial](https://robowiki.net/wiki/Dynamic_Clustering_Tutorial) - RoboWiki (classic Robocode)
- [kd-tree](https://robowiki.net/wiki/Kd-tree) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation

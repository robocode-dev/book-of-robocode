---
title: "A Short History of Robocode"
category: "Introduction"
summary: "Trace how Robocode grew from a Java programming game into a family of platforms, including Robocode Tank Royale."
tags: ["history", "robocode", "tank-royale", "community"]
difficulty: "beginner"
source: [
  "RoboWiki - History of Robocode (classic Robocode only)",
  "Robocode Tank Royale Docs - robocode-dev.github.io/tank-royale"
]
---

# A Short History of Robocode

Robocode began in the early 2000s as a side project by Mathew A. Nelson. The idea was simple: learn programming by coding a robot tank that fights in a 2D arena. The mix of learning and competition made it popular with students, hobbyists, and teachers.

## The Classic Robocode Era

The first public versions were released as a Java application. Robots extended base classes and reacted to events like `onScannedRobot` and `onHitByBullet`.

Highlights:
- A vibrant community formed around the game.
- Players created hundreds of robots, from simple examples to world‑class competitive bots.
- The community started RoboWiki (classic Robocode only), collecting strategies, formulas, and tutorials.

RoboWiki became the reference for advanced topics such as wave surfing, GuessFactor targeting, detailed battlefield physics, and much more.

## Handover and Community Maintenance

Robocode was open‑sourced and community maintenance grew. Flemming N. Larsen became a key maintainer and continued to develop and support classic Robocode. The project evolved to newer Java versions while keeping its core API and spirit. Many courses and clubs adopted it for teaching.

## The Need for a Modern Platform

As tools and languages evolved, the community wanted:
- Multi‑language support (not just Java)
- Easier integration with modern editors and CI
- Headless servers and automated tournaments

These needs led to a modern platform: Robocode Tank Royale.

## Robocode Tank Royale: The New Generation

Robocode Tank Royale, created by Flemming N. Larsen, keeps the core idea but updates the architecture.

Key features:
- Server‑based engine; bots connect over a network protocol
- Multiple languages (Java, TypeScript/JavaScript, C#, Python, Kotlin, and more)
- Cleaner separation of engine and bots, making automation and deployment easier
- Open documentation and starter kits at robocode-dev.github.io/tank-royale

In this book, “Robocode” usually means both classic Robocode and Robocode Tank Royale unless stated otherwise.

## Timeline Snapshot

- Early 2000s — Mathew A. Nelson creates classic Robocode.
- Mid 2000s and onward — Open source; community growth; Flemming N. Larsen maintains classic Robocode; RoboWiki expands.
- 2010s — Widely used for teaching and competitions; strategies refined.
- Late 2010s / 2020s — Robocode Tank Royale introduced as a modern, multi‑language platform.

## Why History Matters for Strategy

Understanding the history explains why strategies look the way they do:
- Many techniques were invented for classic Robocode and adapted to Tank Royale.
- Terms like wave surfing, pattern matching, and GuessFactors come directly from RoboWiki and years of play.
- Some APIs differ between platforms, but the physics and ideas are closely related.

## A Quick Historical Pseudocode

```pseudo
start_with(robocode_classic_java_only)
add_community(RoboWiki, competitions, advanced_strategies)
open_source_project()
if need_modern_platform:
  build(robocode_tank_royale_multi_language)
end if
```

---

*Based on RoboWiki content (classic Robocode only, CC BY-SA 3.0) and the official Robocode Tank Royale documentation. Rewritten and structured for The Book of Robocoding.*

---
title: "A Short History of Robocode"
category: "Introduction"
summary: "Trace how Robocode grew from a Java programming game into a family of platforms, including Robocode Tank Royale."
tags: [ "history", "robocode", "tank-royale", "community" ]
difficulty: "beginner"
source: [
  "RoboWiki - History of Robocode (classic Robocode only)",
  "Robocode Tank Royale Docs - robocode-dev.github.io/tank-royale"
]
---

# A Short History of Robocode

Robocode began in the early 2000s as a side project by Mathew A. Nelson. The idea was simple: learn programming by
coding a robot tank that fights in a 2D arena. The mix of learning and competition made it popular with students,
hobbyists, and teachers.

<img src="../images/i-can-code-that.png" alt="Early 2000 Robocode" width="600" style="max-width:100%;height:auto;" /><br>
*Early 2000 Robocode*

## The Classic Robocode Era

The first public versions were released as a Java application. Robots extended base classes and reacted to events like
`onScannedRobot` and `onHitByBullet`.

Highlights:

- A vibrant community formed around the game.
- Players created hundreds of robots, from simple examples to world-class competitive bots.
- The community started [RoboWiki](https://robowiki.net) (classic Robocode only), collecting strategies, formulas, and
  tutorials.

RoboWiki became the reference for advanced topics such as wave surfing, GuessFactor targeting, detailed battlefield
physics, and much more.

<img src="../images/community-sharing.png" alt="Community sharing robots and ideas" width="600" style="max-width:100%;height:auto;" /><br>
*Community Sharing Robots and Ideas via the RoboWiki*

## Handover and Community Maintenance

Robocode was open-sourced and community maintenance grew. Flemming N. Larsen became a key maintainer and continued to
develop and support classic Robocode. The project evolved to newer Java versions while keeping its core API and spirit.
Many courses and clubs adopted it for teaching.

## The Need for a Modern Platform

As tools and languages evolved, the community wanted:

- Multi-language support (not just Java)
- Easier integration with modern editors and CI
- Headless servers and automated tournaments

These needs led to a modern platform: Robocode Tank Royale.

## Robocode Tank Royale: The New Generation

Robocode Tank Royale, created by Flemming N. Larsen, keeps the core idea but updates the architecture.

Key features:

- Server-based engine; bots connect over a network protocol
- Support for multiple languages (Java, C#, Python, Kotlin, Scala, and others)
- Cleaner separation of engine and bots, making automation and deployment easier
- Open documentation and starter kits
  at [robocode-dev.github.io/tank-royale](https://robocode-dev.github.io/tank-royale)

<img src="../images/classic-vs-tank-royale.png" alt="Classic vs Tank Royale" width="600" style="max-width:100%;height:auto;" /><br>
*Classic (UI only) vs. Tank Royale (server-based engine)*

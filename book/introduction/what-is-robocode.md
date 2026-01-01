---
title: "What is Robocode & How to Use This Book"
category: "Introduction"
summary: "Learn what Robocode is, how the two platforms relate, and how to use this book to become a better bot programmer."
tags: [ "introduction", "robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "RoboWiki - Robocode (classic Robocode only)",
  "Robocode Tank Royale Docs - robocode-dev.github.io/tank-royale"
]
---

# What is Robocode & How to Use This Book

Robocode is a programming game where your code drives a battle bot. Instead of using a controller, you write the brain
of the bot and let it fight on a 2D battlefield. This book explains the ideas behind winning bots with short,
teen-friendly pages, light math, and practical intuition.

## What "Robocode" Means

In this book, the word Robocode is used in two closely related ways:

1. [Robocode (classic)](https://robocode.sourceforge.io/) — the original Java-based programming game created by Mathew
   A. Nelson and later maintained by Flemming N. Larsen. Battles run on a 2D battlefield where bot tanks fight using
   Java code.
2. [Robocode Tank Royale](https://robocode.dev/) — a newer, modern Robocode platform created by Flemming N. Larsen. It
   keeps the same core idea (code a battling bot) but supports multiple programming languages and a more flexible
   architecture.

Unless stated otherwise, Robocode should be read as Robocode and Robocode Tank Royale together. When a concept only
applies to one platform, the page will say Classic Robocode or Robocode Tank Royale explicitly.

## The Core Idea

Your bot must:

- Move around the battlefield
- Scan for enemies with a radar
- Aim its gun
- Decide when and how hard to fire
- React to events such as being hit or colliding with walls

During a battle, you cannot control the bot directly. The only way to win is to write smarter code.

Bullets themselves follow simple physics: they cost energy to fire, travel in straight lines along the gun heading, and
reduce an opponent’s energy when they hit.

## Classic Robocode vs. Tank Royale

### Classic Robocode

- Runs on the Java platform.
- You write Java bots that extend specific base classes from the Robocode API.
- Battles run inside a desktop GUI application.
- Many classic strategies, tutorials, and bots live on [RoboWiki](https://robowiki.net) (classic Robocode only).

### Robocode Tank Royale

- Runs on a server + bot architecture.
- Bots connect to a game server using network protocols.
- You can write bots in multiple languages (for example, Java, C#, Python, Kotlin, Scala, and more).

---

## Terminology Note

- Throughout this book, we use the term **"units"** for all measurements of distance, size, and movement in Robocode and
  Robocode Tank Royale. This replaces the older term "pixels" and ensures clarity across both platforms.
- We also use the term **"bot"** instead of "robot" or "tank" to describe the agent you develop and control.
  This keeps the language consistent and focused on programming your own intelligent agent.
- The word **"intent"** refers to the set of commands (move, turn, fire, etc.) your bot issues for the current turn.
  When you commit the turn (using `execute()` or `go()`), your bot sends this intent to the game engine or server to be
  carried out.

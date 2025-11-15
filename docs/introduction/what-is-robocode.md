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

Robocode is a programming game where your code drives a battle tank. Instead of using a controller, you write the brain
of the bot and let it fight on a 2D battlefield. This book explains the ideas behind winning bots with short,
teen-friendly pages, light math, and practical intuition.

## What "Robocode" Means

In this book, the word Robocode is used in two closely related ways:

1. **Robocode (classic)** — the original Java-based programming game created by Mathew A. Nelson and later maintained
   by Flemming N. Larsen. Battles run on a 2D battlefield where robot tanks fight using Java code.
2. **Robocode Tank Royale** — a newer, modern Robocode platform created by Flemming N. Larsen. It keeps the same core
   idea (code a battling tank) but supports multiple programming languages and a more flexible architecture.

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

## Classic Robocode vs. Tank Royale

### Classic Robocode

- Runs on the Java platform.
- You write Java robots that extend specific base classes from the Robocode API.
- Battles run inside a desktop GUI application.
- Many classic strategies, tutorials, and bots live on RoboWiki (classic Robocode only).

### Robocode Tank Royale

- Runs on a server + bot architecture.
- Bots connect to a game server using network protocols.
- You can write bots in multiple languages (for example, Java, TypeScript/JavaScript, C#, Python, Kotlin, and more).

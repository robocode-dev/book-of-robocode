---
title: "What is Robocode & How to Use This Book"
category: "Introduction"
summary: "Learn what Robocode is, how the two platforms relate, and how to use this book to become a better bot programmer."
tags: ["introduction", "robocode", "tank-royale", "beginner"]
difficulty: "beginner"
source: [
  "RoboWiki - Robocode (classic Robocode only)",
  "Robocode Tank Royale Docs - robocode-dev.github.io/tank-royale"
]
---

# What is Robocode & How to Use This Book

Robocode is a programming game where your code drives a battle tank. Instead of using a controller, you write the brain of the bot and let it fight on a 2D battlefield. This book explains the ideas behind winning bots with short, teen-friendly pages, light math, and practical intuition.

## What "Robocode" Means

In this book, the word Robocode is used in two closely related ways:

1. **Robocode (classic)** – the original Java-based programming game created by Mathew A. Nelson and later maintained by Flemming N. Larsen. Battles run on a 2D battlefield where robot tanks fight using Java code.
2. **Robocode Tank Royale** – a newer, modern Robocode platform created by Flemming N. Larsen. It keeps the same core idea (code a battling tank), but supports multiple programming languages and a more flexible architecture.

Unless stated otherwise, “Robocode” should be read as “Robocode and Robocode Tank Royale” together. When a concept only applies to one platform, the page will say Classic Robocode or Robocode Tank Royale explicitly.

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
- You can write bots in multiple languages (for example Java, TypeScript/JavaScript, C#, Python, Kotlin, and more).
- Documentation and tools are hosted at robocode-dev.github.io/tank-royale.

Most strategy concepts in this book (movement, targeting, energy management) apply to both platforms, even though the APIs and technical details are different.

## How a Battle Loop Feels

In both platforms, your bot follows a loop of sense → decide → act. A simplified pseudocode version looks like this:

```pseudo
loop forever:
  scan_for_enemies()
  if enemy_seen:
    aim_gun_at(enemy)
    if should_fire(enemy):
      fire_bullet(chosen_power)
  choose_movement()
  move_tank()
end loop
```

- Sense: read radar data, enemy positions, bullet events, and wall collisions.
- Decide: pick a movement direction, a target, and a firepower.
- Act: turn the radar, turn the gun, move the tank, and fire.

## A Simple Physics Fact

Many Robocode concepts rely on distance, speed, and time. One basic relation that appears often is:

\[
\text{time} = \frac{\text{distance}}{\text{bullet speed}}
\]

This helps estimate when a bullet will arrive after you fire. Exact speeds depend on firepower; details appear in later chapters.

## Classic Robocode vs. Tank Royale Labels

To keep the content clear, many pages include notes like:

- Applies to: Classic Robocode
- Applies to: Robocode Tank Royale
- Applies to: Both

When code or APIs differ, examples are shown side by side or in separate tabs, while the core ideas remain shared.

## Example Battle

In a typical Robocode battle, you'll see:
- Tanks moving around the arena
- Radars spinning to detect enemies
- Bullets flying across the battlefield
- Energy levels changing as tanks take damage
- Scoring updating in real time

:::: tip Note
Robocode contains no gore, no blood, no people, and no politics. The battles are simply for the excitement of competition and learning.
::::

## Next Steps

- If you have never coded a bot before, continue with the [Getting Started](/tutorial/getting-started) tutorial to create your first bot.
- If you already have a simple bot, you can jump directly to Battlefield Physics or Simple Targeting.

---

*Based on RoboWiki content (classic Robocode only, CC BY-SA 3.0) and the official Robocode Tank Royale documentation. Rewritten and structured for The Book of Robocoding.*

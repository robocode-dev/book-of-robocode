---
title: "Your First Bot"
category: "Getting Started"
summary: "A guided overview for new players to create and understand their first Robocode or Tank Royale bot."
tags: [ "tutorial", "first bot", "robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "RoboWiki - My First Robot (classic Robocode)",
  "Robocode Tank Royale Docs - My First Bot"
]
---

# Your First Bot (Guided Tutorial)

New to Robocode or Robocode Tank Royale? This overview gives you the mental model for getting a simple, working bot into
the arena. It’s platform- and language-neutral. For concrete, step-by-step instructions and code, use the official
tutorials below.

## Start here: the original tutorials

- Classic Robocode: https://robowiki.net/wiki/Robocode/My_First_Robot
- Robocode Tank Royale: https://robocode.dev/tutorial/my-first-bot.html

Those guides show exact setup steps, APIs, and project/configuration details. This page complements them by explaining
the shared lifecycle every bot follows.

## The bot lifecycle at a glance

```
Initialization
    ↓
Enter run() loop
    ↓
    ├→ Scan for enemies
    ├→ Calculate movement
    ├→ Aim gun
    ├→ Fire if ready
    └→ Repeat each turn
```

<img src="../images/bot-lifecycle.png" alt="Bot lifecycle diagram" width="200" style="max-width:100%;height:auto;" /><br>
*Bot Lifecycle Diagram*

Think of your bot as a real-time agent. Each turn it senses the world, decides what to do, and acts. The exact API calls
differ between Classic and Tank Royale, but the rhythm—sense → plan → act → repeat—stays the same.

## Initialization: one-time setup

Initialization runs once before the main loop. Keep it lightweight and focused on stable settings:

- Visual identity: Set body, gun, radar, and bullet colors so you can spot your bot during a match.
- Defaults and parameters: Choose initial movement speed/turn rates, radar sweep strategy, and default firepower.
- Event hooks (if applicable): Register listeners for events such as enemy scanned, hit by bullet, or collision.

Avoid heavy computation in initialization. If you need data processing, compute lazily or spread it across early turns.

## Entering the run loop

After initialization, your bot enters its main `run()` loop. Conceptually, each turn:

1. Scans for enemies
2. Updates targeting
3. Chooses movement
4. Fires if the gun is cool and conditions are right

Events that occur during the turn (e.g., you were scanned or hit) can adjust your next decisions or trigger immediate
responses.

## Per-turn actions (the heartbeat)

- Scan for enemies
    - Keep the radar moving to maintain situational awareness. A stationary radar loses track quickly.
    - Choose between continuous sweeping (good for discovery) and locking onto a single target (good for 1v1 tracking).

- Calculate movement
    - For your first bot, a simple movement is enough—move forward, turn occasionally, and avoid getting stuck.
    - Later, add wall avoidance, distancing, or evasive patterns.

- Aim the gun
    - Point the gun at the detected enemy. Initially, aim directly at the current bearing.
    - Advanced bots predict future positions (leading shots).

- Fire if ready
    - Fire only when the gun is ready (both platforms expose gun heat/cooldown).
    - Start with modest, consistent firepower; tune it as you learn.

- Repeat
    - Issue movement, radar, and gun commands, then proceed to the next turn.

<!-- TODO illustration: Visualize one heartbeat turn with sense-plan-act steps. -->
<!-- - Show a sequence of small panels labeled Scan, Move, Aim, Fire. -->
<!-- - In each panel, draw the same bot doing that action on a simple arena. -->
<!-- - Use arrows between panels to show the order within a single turn. -->
<!-- - Include tiny icons (radar waves, wheels, crosshair, bullet) over each panel. -->
<!-- - Choose a comic-strip style layout that feels light and fun. -->

## Event-driven reactions

Most APIs surface events like:

- Enemy scanned: Often triggers aiming and firing.
- Hit by a bullet: Consider altering movement to be less predictable.
- Collisions (walls or other bots): Correct heading, move back, or adjust speed.

Keep reactions small and focused. They should either trigger an immediate response (e.g., dodge) or update the state for
the next turn (e.g., last known enemy position).

## Minimal platform notes

- Classic Robocode typically uses a properties (`.properties`) file to define the bot. The filename usually must match
  your bot’s class name. See the classic tutorial for exact fields and
  placement: [Robot properties](../appendices/robot-properties.md)
- Robocode Tank Royale uses a JSON configuration file for bot metadata/settings. See the Tank Royale tutorial for the
  current schema and placement: https://robocode.dev/tutorial/my-first-bot.html

If you’re unsure whether something belongs in config or code, rely on the tutorial for your platform—the formats and
best practices can evolve.

### Bot configuration: Classic (.properties) vs. Tank Royale JSON

<img src="../images/my-first-bot-config.png" alt="Side-by-side comparison: Classic Robocode `MyFirstRobot.properties` (left) and Tank Royale `my-first-bot.json` (right). The image shows a file icon for each format with a small bot illustration above, and a short key/value snippet under each file." width="400" style="max-width:100%;height:auto;" /><br>
*Figure: Classic properties file (left) vs Tank Royale JSON file (right) — both describe the same bot.*

## What success looks like for your first bot

Your initial milestone is simple and achievable:

- Colors are set so the bot is recognizable on the field.
- Radar is continuously scanning to keep awareness up.
- Movement follows a basic pattern (not stationary!).
- The gun turns toward detected enemies and fires when ready.

<!-- TODO illustration: Show a simple "first match" scene that meets the success checklist. -->
<!-- - Draw a small arena with the player’s colorful bot clearly visible. -->
<!-- - Show the bot moving, with motion lines, and the radar sweeping in a visible arc. -->
<!-- - Indicate the gun turning toward an enemy with a bullet in flight. -->
<!-- - Add small checkmark icons near labels for Color, Radar, Movement, and Firing. -->
<!-- - Keep the enemy bot simple so the focus stays on the player’s bot. -->

## Next steps

- Learn battlefield geometry and angles to improve navigation and aiming.
- Explore radar strategies (sweeping vs. locking) for better tracking.
- Study energy and scoring to make smarter firepower decisions.

When you’re ready for platform-specific details and code, return to:

- Classic Robocode: https://robowiki.net/wiki/Robocode/My_First_Robot
- Robocode Tank Royale: https://robocode.dev/tutorial/my-first-bot.html
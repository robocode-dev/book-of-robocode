# Coordinate Systems & Angles

Understanding how coordinates and angles work is essential for programming bots in both classic Robocode and Robocode
Tank Royale. This page explains the battlefield coordinate system, how angles are measured, and highlights key
differences between the two platforms.

## Battlefield Coordinate System

Both classic Robocode and Tank Royale use a Cartesian coordinate system for the battlefield. On both platforms:

- The origin (0, 0) is in the **bottom left corner** of the battlefield—not the top left as in most computer graphics.
- All positions and movements are measured in **units** (not pixels).
- Example: A bot's size is 40x40 units, and the scan length is 1200 units.

> **Illustration suggestion:** Show a battlefield grid with (0, 0) at the bottom left, axes labeled, and a bot
> positioned somewhere on the field. Indicate the direction of increasing X (right) and Y (up).

## Angle Conventions

### Classic Robocode

- Angles are measured **clockwise** from North (upwards):
    - 0° = North
    - 90° = East
    - 180° = South
    - 270° = West
- Headings and turns can be specified in **degrees (deg)** or **radians (rad)**.
- This system is similar to a compass.

> **Illustration suggestion:** Compass rose overlay on the battlefield, showing 0° at North, 90° at East, etc.

### Robocode Tank Royale

- Angles are measured **counterclockwise** from East (right):
    - 0° = East
    - 90° = North
    - 180° = West
    - 270° = South
- Only **degrees (deg)** are used for headings and turns (0–360).
- This matches the standard mathematical convention for angles.

> **Illustration suggestion:** Math-style angle diagram, with 0° at East and angles increasing counterclockwise.

## Platform Differences

- **Classic Robocode:** Headings increase clockwise from North; supports both degrees and radians.
- **Tank Royale:** Headings increase counterclockwise from East; uses only degrees.
- Both use the same coordinate system, but angle conventions differ.

## Why This Matters

Getting coordinates and angles right is crucial for:

- Moving your bot to specific locations
- Aiming guns and radar
- Calculating enemy positions

Mistakes in understanding the system can lead to bots moving or firing in unexpected directions.

## Further Reading & References

- [Robocode Game Physics (RoboWiki)](https://robowiki.net/wiki/Robocode/Game_Physics)
- [Robocode Robot API](https://robocode.sourceforge.io/docs/robocode/robocode/Robot.html)
- [Robocode AdvancedRobot API](https://robocode.sourceforge.io/docs/robocode/robocode/AdvancedRobot.html)
- [IBM DeveloperWorks: Robocode](https://web.archive.org/web/20170217094456/http://www.ibm.com/developerworks/java/library/j-robocode2/)
- [Tank Royale: Coordinates and Angles](https://robocode.dev/articles/coordinates-and-angles.html)

## Linking Forward

This page is foundational for understanding movement, targeting, and bullet physics. For more on how angles and
coordinates are used in bot movement and targeting, see the upcoming pages on Bullet Physics and Targeting Systems.

---

**Audience:** New players with basic programming knowledge
**Emphasis:** Conceptual understanding, historical context
**Applies to:** Classic Robocode, Robocode Tank Royale

*Always use "bot" and "units" for consistency. See Terminology Consistency guidelines.*


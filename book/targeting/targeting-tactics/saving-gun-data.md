---
title: "Saving Gun Data"
category: "Targeting Systems"
summary: "Persisting targeting data between rounds and battles to improve hit rates through learning and adaptation."
tags: [ "saving-gun-data", "data-persistence", "targeting-tactics", "learning", "robocode", "tank-royale",
        "intermediate" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Data Files (classic Robocode) https://robowiki.net/wiki/Data_Files",
  "Robocode Tank Royale Docs https://robocode-dev.github.io/tank-royale/"
]
---

# Saving Gun Data

> [!TIP] Origins
> **Data persistence** techniques for targeting were developed and documented by the RoboWiki community to enable
> learning across battles.

Advanced targeting systems improve by learning from past encounters. Saving gun data between rounds and battles allows
a bot to remember enemy movement patterns, hit rates, and statistical profiles. This transforms a bot from reactive to
adaptive — recognizing opponents and applying learned strategies instantly.

## Why save gun data?

Most statistical and pattern-based targeting systems collect data during battle:

- **GuessFactors** record where enemies are when bullets arrive.
- **Visit count statistics** track enemy behavior patterns segmented by distance, velocity, or lateral direction.
- **Pattern matching** logs sequences of enemy movements to predict future positions.
- **Virtual gun performance** tracks which aiming method works best against specific opponents.

Without data persistence, all this learning vanishes at the end of each round or battle. The bot must start from
scratch every time, wasting valuable ticks relearning what it already discovered.

**With data persistence:**

- Round 2+ starts with accumulated knowledge from round 1.
- Rematches against known opponents begin with full profiles already loaded.
- Hit rates improve faster because the bot "remembers" effective strategies.

## What data should be saved?

The specific data depends on the targeting system:

### Statistical targeting (GuessFactor, visit count stats)

Store aggregated statistics:

- GuessFactors or angle offsets binned by segment (distance, velocity, lateral direction).
- Visit counts for each segment/bin combination.
- Total shots fired and hits landed per segment.

**Storage format:** Arrays or maps keyed by segment + bin index. Can be serialized as JSON, binary, or custom formats.

### Pattern matching

Store historical movement sequences:

- Log of enemy positions, velocities, and headings over time.
- Pattern length and match threshold parameters.
- Weights or scores for successful pattern matches.

**Storage format:** Sequential data (arrays, lists) with timestamps or turn numbers. Compress if sequences are long.

### Virtual guns

Store performance metrics for each gun:

- Hit rate, score contribution, or weighted success per virtual gun.
- Per-enemy profiles tracking which gun works best against specific opponents.

**Storage format:** Simple key-value pairs: `gunName -> hitRate` or `enemyName -> bestGunName`.

### Dynamic clustering

Store feature vectors and outcomes:

- Past enemy states (velocity, distance, lateral direction, etc.) paired with actual angles hit.
- Cluster centroids if using k-means or similar algorithms.

**Storage format:** Arrays of feature vectors + outcomes. Can be large, so consider compression or sampling.

## How data persistence works

Both classic Robocode and Tank Royale allow bots to persist data to files. The specific implementation details and
security restrictions vary between platforms.

### Classic Robocode

Classic Robocode provides restricted file system access. Bots have access to a dedicated data directory via:

```pseudocode
File dataDir = getDataDirectory()
```

This directory is specific to the bot and persists between battles. Files are typic:

- Plain text (CSV, JSON).
- Binary serialized objects (Java serialization, custom binary formats).

**Security restrictions:**

- Cannot write outside the data directory.
- File size and count limits may apply (depends on Robocode version and configuration).

**Typical workflow:**

1. At battle start, check if a data file exists. If yes, load it.
2. During battle, accumulate targeting data in memory.
3. Between rounds or at battle end, serialize data to file.

### Robocode Tank Royale

Tank Royale bots run as separate processes and communicate with the game server. Currently, **Tank Royale does not
enforce file system restrictions**. Bots have full file system access according to their runtime environment's
permissions.

**Important:** While there are no restrictions today, future versions of Tank Royale may implement file system
protection mechanisms. Additionally, the host system may run in a containerized environment (such as Docker) to
isolate bots and protect against bad behavior. In such environments, file system access may be limited to the
container's filesystem, and data may not persist between container instances unless explicitly configured.

Bot developers should be responsible and avoid writing excessive data that could fill up the host system's storage,
especially since containerized environments may have limited disk space allocated.

**Typical workflow:**

1. On bot initialization, attempt to load saved data from a known file path.
2. If file exists, deserialize and populate internal data structures.
3. During battle, update data structures as scans and shots occur.
4. At round end or battle end, serialize updated data back to file.

**Platform differences:**

- Tank Royale uses modern JSON or binary formats depending on the language (Java, .NET, Python).
- Python bots might use `pickle`, Java bots might use JSON or custom serialization.
- File paths and storage locations follow the conventions of each language and operating system.
- No dedicated data directory is provided — bots must manage their own file locations responsibly.

## When to save and load data

### Loading data

**Best practice:** Load data as early as possible, typically in the bot's constructor or initialization phase (before
the first `run()` tick).

**Why:** Ensures data is available from turn 1 of round 1. If loading fails (file missing, corrupted, or first battle
against opponent), initialize empty data structures and start fresh.

### Saving data

**Options:**

1. **Between rounds:** Save at the end of each round (e.g., in `onRoundEnded()` or equivalent). This ensures data is
   preserved even if the battle is interrupted.
2. **At battle end:** Save once when the battle ends (e.g., in `onBattleEnded()` or destructor). Simpler but risks
   losing data if the bot crashes or the battle is stopped early.
3. **Periodic saves:** Save every N turns during the round. Provides resilience against crashes but adds I/O overhead.

**Recommendation:** Save between rounds (option 1) for competitive bots. It balances data safety with performance.

## File naming strategies

Use descriptive, opponent-specific filenames to organize data:

- `enemy_<enemyName>.dat` — Per-enemy profiles (e.g., `enemy_sample.SittingDuck.dat`).
- `global_stats.json` — Aggregated data across all opponents.
- `virtualGuns_<enemyName>.csv` — Virtual gun performance per enemy.

**Why per-enemy files?**

- Different opponents have different movement patterns. Mixing data from multiple opponents dilutes the signal.
- Per-enemy files allow the bot to quickly load relevant data when facing a known opponent.

**When to use global files?**

- For general-purpose targeting that doesn't segment by opponent.
- For metadata like total battles fought, overall hit rate, or configuration settings.

## Example workflow (pseudocode)

```pseudocode
class MyBot:
    targetingData = {}
    dataFile = "gundata_<enemyName>.json"

    function initialize():
        if fileExists(dataFile):
            targetingData = loadFromFile(dataFile)
        else:
            targetingData = createEmptyDataStructure()

    function onScannedRobot(enemy):
        // Use targetingData to aim
        angle = computeAngleFromData(targetingData, enemy)
        aimGunAt(angle)
        fireBullet(bulletPower)

        // Update data based on scan
        updateTargetingData(targetingData, enemy)

    function onBulletHit(event):
        // Record successful hit in data
        recordHit(targetingData, event)

    function onRoundEnded():
        // Save accumulated data
        saveToFile(dataFile, targetingData)

    function onBattleEnded():
        // Final save (backup in case onRoundEnded missed something)
        saveToFile(dataFile, targetingData)
```

**Key points:**

- Load data once at startup.
- Update data incrementally as events occur.
- Save data at safe checkpoints (round end, battle end).

## Tips and best practices

### Start simple

Don't try to save everything at once. Begin with a small, critical dataset (e.g., GuessFactors for one enemy) and
expand as the targeting system matures.

### Validate loaded data

Always check for corruption or version mismatches when loading data:

- Verify file format (JSON structure, binary magic number, etc.).
- Check that data dimensions match the current algorithm (e.g., number of bins, segment definitions).
- If validation fails, discard old data and start fresh rather than risking crashes.

### Handle missing or corrupt files gracefully

File I/O can fail for many reasons:

- File doesn't exist (first encounter with opponent).
- File is corrupted (disk error, bot crash mid-write).
- File format changed (bot code updated but old data remains).

**Best practice:** Wrap load operations in error handling. If the load fails, initialize empty data structures and log a
warning (if debugging). The bot should never crash due to file errors.

### Compress large datasets

Pattern matching and dynamic clustering can generate large data files (megabytes for long battles or extensive logs).

**Options:**

- Use efficient serialization (binary formats like MessagePack, Protobuf).
- Compress files (gzip, zlib) if the platform allows.
- Sample or prune old data (e.g., keep only the last N patterns or most relevant clusters).

### Test with and without data

During development, test the bot both:

1. **Cold start:** No saved data, all opponents are new.
2. **Warm start:** Pre-loaded data from past battles.

This ensures the bot performs reasonably in both scenarios. A bot that relies too heavily on saved data may struggle
against new opponents or in tournaments with no prior data.

### Respect file system limits

**Classic Robocode** imposes strict restrictions on file size, file count, and I/O frequency for security reasons.
Bots can only write to their designated data directory.

**Tank Royale** currently does not enforce file system restrictions, since bots run in separate processes. However,
future versions may implement protection mechanisms to prevent bots from filling up host storage or accessing
sensitive files. Additionally, many Tank Royale deployments run in containerized environments (such as Docker), which
provide isolation and may limit available disk space. In containerized setups, saved data may not persist between
container restarts unless volumes are explicitly configured.

**Best practice for both platforms:** Keep files small and focused. Limit data file sizes to what's truly necessary
for competitive performance. If data grows too large, consider:

- Aggregation or sampling of old data.
- Pruning least-useful entries (e.g., drop patterns from weak opponents).
- Using multiple smaller files instead of one giant file.
- Compressing data with gzip or similar formats.

Bot developers should be responsible stewards of the host system's resources, even when restrictions are not enforced.
In containerized environments, excessive file I/O or large files may impact performance or cause container storage
limits to be exceeded.

## Common pitfalls

### Forgetting to save

Loading data is useless if the bot never saves it. Always implement both load and save logic, and test that save
actually writes the file.

### Saving too frequently

Saving every turn adds significant I/O overhead and can slow the bot down (skipped turns, lower reaction speed). Save
at round boundaries or less frequently.

### Mixing data from different opponents

Unless the targeting system is explicitly designed for generalized learning, mixing data from multiple opponents
usually hurts performance. Each opponent has unique patterns; blending them creates noise.

### Not handling version changes

If the bot's targeting algorithm evolves (e.g., changing segment definitions, adding new features), old saved data may
be incompatible.

**Solution:** Include a version number or format identifier in saved files. If versions don't match, discard old data
and start fresh.

## Platform notes

### Classic Robocode

- Use `getDataDirectory()` to get the bot's data folder.
- File access is restricted to this directory for security.
- Serialize with Java's `ObjectOutputStream`, JSON libraries (Gson, Jackson), or custom formats.
- File paths are relative to the data directory.

### Robocode Tank Royale

- File system API varies by language (Java: `java.io`, .NET: `System.IO`, Python: `open()`).
- File storage location depends on how the bot is deployed and the operating system.
- JSON is the most portable format across languages.
- Consider using relative paths or a designated data folder to keep bot data organized.

## Summary

Saving gun data transforms a bot from a one-round learner to a persistent strategist. By loading past data at battle
start and saving updated data at the round end, advanced targeting systems accumulate knowledge across battles,
improving hit rates and adapting to specific opponents. Implement load/save logic carefully, validate data integrity,
and test both cold and warm start scenarios to ensure robust performance.

## Further Reading

- [Saving Gun Data](https://robowiki.net/wiki/Saving_Gun_Data) — RoboWiki (classic Robocode)
- [Data Files](https://robowiki.net/wiki/Data_Files) — RoboWiki (classic Robocode)

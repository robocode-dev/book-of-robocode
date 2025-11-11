# My First Bot

Let's create your first Robocode bot! This tutorial will walk you through creating a simple but functional battle tank.

## What We'll Build

A bot that:
- Moves forward continuously
- Spins its radar to scan for enemies
- Fires when it detects an enemy
- Turns toward enemies to pursue them

## Choose Your Language

Select your preferred programming language:

[[toc]]

## Python Bot (Tank Royale)

### Create the Bot

Create a file named `MyFirstBot.py`:

```python
from robocode_tankroyale import *

class MyFirstBot(Bot):
    def run(self):
        """Main bot loop - called every turn"""
        # Set colors
        self.set_body_color("#0000FF")    # Blue body
        self.set_gun_color("#FF0000")      # Red gun
        self.set_radar_color("#00FF00")    # Green radar
        self.set_bullet_color("#FFFF00")   # Yellow bullets
        
        # Main loop
        while self.is_running():
            # Move forward
            self.forward(100)
            
            # Spin radar to scan
            self.turn_radar_right(360)
    
    def on_scanned_bot(self, event):
        """Called when radar detects an enemy"""
        # Turn toward enemy
        self.turn_right(event.bearing)
        
        # Fire at enemy
        if self.gun_heat == 0:
            self.fire(2)
        
        # Scan again
        self.scan()
    
    def on_hit_by_bullet(self, event):
        """Called when hit by bullet"""
        # Turn perpendicular to bullet
        self.turn_right(90 - event.bearing)

# Create and start the bot
if __name__ == "__main__":
    bot = MyFirstBot()
    bot.start()
```

### Bot Configuration

Create a file named `MyFirstBot.json`:

```json
{
  "name": "MyFirstBot",
  "version": "1.0",
  "authors": ["Your Name"],
  "description": "My first Robocode bot",
  "gameTypes": ["melee", "1v1"],
  "programmingLang": "Python"
}
```

### Understanding the Code

**Initialization**:
- Inherit from `Bot` base class
- Set bot colors for visual identification

**Main Loop** (`run()` method):
```python
while self.is_running():
    self.forward(100)         # Move forward 100 units
    self.turn_radar_right(360) # Spin radar full circle
```

**Event Handling**:
- `on_scanned_bot()`: Responds when radar detects enemy
- `on_hit_by_bullet()`: Responds when taking damage

**Commands**:
- `forward(distance)`: Move forward
- `turn_right(degrees)`: Turn body right
- `turn_radar_right(degrees)`: Turn radar right
- `fire(power)`: Fire bullet

## Java Bot (Tank Royale)

### Create the Bot

```java
import dev.robocode.tankroyale.botapi.*;
import dev.robocode.tankroyale.botapi.events.*;

public class MyFirstBot extends Bot {
    
    public static void main(String[] args) {
        new MyFirstBot().start();
    }
    
    MyFirstBot() {
        super(BotInfo.fromFile("MyFirstBot.json"));
    }
    
    @Override
    public void run() {
        // Set colors
        setBodyColor("#0000FF");
        setGunColor("#FF0000");
        setRadarColor("#00FF00");
        setBulletColor("#FFFF00");
        
        // Main loop
        while (isRunning()) {
            forward(100);
            turnRadarRight(360);
        }
    }
    
    @Override
    public void onScannedBot(ScannedBotEvent event) {
        // Turn toward enemy
        turnRight(event.getBearing());
        
        // Fire if gun is ready
        if (getGunHeat() == 0) {
            fire(2);
        }
        
        // Scan again
        scan();
    }
    
    @Override
    public void onHitByBullet(HitByBulletEvent event) {
        // Turn perpendicular to bullet
        turnRight(90 - event.getBearing());
    }
}
```

With the same `MyFirstBot.json` configuration file.

## C# Bot (Tank Royale)

### Create the Bot

```csharp
using Robocode.TankRoyale.BotApi;
using Robocode.TankRoyale.BotApi.Events;

namespace MyRobots
{
    public class MyFirstBot : Bot
    {
        static void Main(string[] args)
        {
            new MyFirstBot().Start();
        }
        
        public MyFirstBot() : base(BotInfo.FromFile("MyFirstBot.json"))
        {
        }
        
        public override void Run()
        {
            // Set colors
            SetBodyColor("#0000FF");
            SetGunColor("#FF0000");
            SetRadarColor("#00FF00");
            SetBulletColor("#FFFF00");
            
            // Main loop
            while (IsRunning())
            {
                Forward(100);
                TurnRadarRight(360);
            }
        }
        
        public override void OnScannedBot(ScannedBotEvent evt)
        {
            // Turn toward enemy
            TurnRight(evt.Bearing);
            
            // Fire if gun is ready
            if (GunHeat == 0)
            {
                Fire(2);
            }
            
            // Scan again
            Scan();
        }
        
        public override void OnHitByBullet(HitByBulletEvent evt)
        {
            // Turn perpendicular to bullet
            TurnRight(90 - evt.Bearing);
        }
    }
}
```

## JavaScript Bot (Tank Royale)

### Create the Bot

```javascript
const { Bot } = require('robocode-tankroyale');

class MyFirstBot extends Bot {
    run() {
        // Set colors
        this.setBodyColor("#0000FF");
        this.setGunColor("#FF0000");
        this.setRadarColor("#00FF00");
        this.setBulletColor("#FFFF00");
        
        // Main loop
        while (this.isRunning()) {
            this.forward(100);
            this.turnRadarRight(360);
        }
    }
    
    onScannedBot(event) {
        // Turn toward enemy
        this.turnRight(event.bearing);
        
        // Fire if gun is ready
        if (this.gunHeat === 0) {
            this.fire(2);
        }
        
        // Scan again
        this.scan();
    }
    
    onHitByBullet(event) {
        // Turn perpendicular to bullet
        this.turnRight(90 - event.bearing);
    }
}

// Start the bot
const bot = new MyFirstBot();
bot.start();
```

## Running Your Bot

### Tank Royale

1. **Start the GUI application**
2. **Add your bot**:
   - Click "Add Bot"
   - Navigate to your bot directory
   - Select your bot
3. **Start a battle**:
   - Choose battle settings (arena size, rounds)
   - Add opponent bots
   - Click "Start Battle"

### Classic Robocode (Java)

1. **Compile your bot**:
   ```bash
   javac -cp robocode.jar MyFirstBot.java
   ```

2. **Start Robocode GUI**
3. **Your bot should appear** in the robot list
4. **Create a battle**:
   - Battle → New
   - Add your bot and opponents
   - Start

## Watch Your Bot Fight!

You should see your bot:
- Moving forward across the arena
- Radar spinning continuously (green arc)
- Turning toward enemies when detected
- Firing red bullets

## How It Works

### Pseudocode Flow

```
START bot
    SET colors
    
    WHILE bot is running:
        MOVE forward 100 units
        TURN radar 360 degrees (scan for enemies)
    END WHILE
    
    ON enemy detected:
        CALCULATE bearing to enemy
        TURN body toward enemy
        IF gun is ready THEN
            FIRE with power 2
        END IF
    END ON
    
    ON hit by bullet:
        TURN perpendicular to dodge
    END ON
END bot
```

### Key Concepts

**Turn-based execution**:
- Commands are queued and executed each turn
- `forward(100)` doesn't complete immediately
- Bot continues to next command while moving

**Events**:
- Events interrupt the main loop
- Handle events in event methods
- Return to main loop after event handling

**Radar scanning**:
- Radar must be pointing at enemy to detect
- Continuous spinning ensures detection
- Returns bearing (angle) to enemy

## Improving Your Bot

### Simple Enhancements

**Better movement**:
```python
# Zigzag pattern
self.forward(100)
self.turn_right(30)
self.forward(100)
self.turn_left(30)
```

**Smart firing**:
```python
def on_scanned_bot(self, event):
    # Fire harder at close range
    distance = event.distance
    if distance < 100:
        power = 3
    elif distance < 300:
        power = 2
    else:
        power = 1
    
    self.fire(power)
```

**Wall avoidance**:
```python
def run(self):
    while self.is_running():
        # Check distance to walls
        if self.x < 100 or self.x > self.arena_width - 100:
            self.turn_right(90)
        if self.y < 100 or self.y > self.arena_height - 100:
            self.turn_right(90)
        
        self.forward(100)
        self.turn_radar_right(360)
```

## Common Issues

**Bot doesn't move**:
- Check main loop is running
- Verify commands are being called
- Check for errors in console

**Bot doesn't fire**:
- Gun may be too hot (cooling down)
- Check gun_heat == 0 before firing
- Verify firepower is valid (0.1 to 3.0)

**Bot doesn't see enemies**:
- Radar must be spinning
- Check radar isn't locked in one direction
- Verify on_scanned_bot() is implemented

## Next Steps

Congratulations! You've created your first Robocode bot. Now you can:

1. **Experiment** with different behaviors
2. **Learn advanced techniques** in [Beyond the Basics](/tutorial/beyond-basics)
3. **Study the physics** in [Physics](/articles/physics)
4. **Join the community** and compete!

Continue to [Beyond the Basics](/tutorial/beyond-basics) →

---

*This tutorial is based on teaching methods developed by the [RoboWiki](http://robowiki.net/) community and Tank Royale documentation.*

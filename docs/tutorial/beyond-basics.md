# Beyond the Basics

Now that you've created your first bot, let's explore advanced techniques to make it more competitive.

## Advanced Movement

### Circular Movement

Moving in circles makes you harder to hit:

```python
def run(self):
    while self.is_running():
        # Move in a circle
        self.forward(100)
        self.turn_right(10)  # Adjust for circle size
```

### Wall Smoothing

Avoid hitting walls by maintaining distance:

```python
def smooth_wall_avoidance(self):
    """Keep away from walls smoothly"""
    margin = 100
    arena_width = self.arena_width
    arena_height = self.arena_height
    
    # Calculate distances to walls
    dist_left = self.x
    dist_right = arena_width - self.x
    dist_bottom = self.y
    dist_top = arena_height - self.y
    
    # Find closest wall
    min_dist = min(dist_left, dist_right, dist_bottom, dist_top)
    
    # If too close, turn away
    if min_dist < margin:
        if min_dist == dist_left:
            self.turn_right(90 - self.heading)
        elif min_dist == dist_right:
            self.turn_right(270 - self.heading)
        elif min_dist == dist_bottom:
            self.turn_right(0 - self.heading)
        else:  # dist_top
            self.turn_right(180 - self.heading)
```

### Perpendicular Movement

Move perpendicular to enemy (harder target):

```python
def on_scanned_bot(self, event):
    """Move perpendicular to enemy"""
    # Calculate perpendicular angle
    perpendicular = event.bearing + 90
    
    # Turn and move
    self.turn_right(perpendicular)
    self.forward(100)
```

## Advanced Targeting

### Linear Targeting

Predict where enemy will be:

```python
import math

def linear_targeting(self, event):
    """Aim where enemy will be"""
    # Get enemy data
    enemy_distance = event.distance
    enemy_bearing = event.bearing
    enemy_velocity = event.velocity
    enemy_heading = event.heading
    
    # Calculate bullet travel time
    bullet_power = 2
    bullet_speed = 20 - 3 * bullet_power
    bullet_travel_time = enemy_distance / bullet_speed
    
    # Predict enemy position
    # Enemy moves along their heading
    future_x = enemy_distance * math.sin(math.radians(enemy_bearing))
    future_y = enemy_distance * math.cos(math.radians(enemy_bearing))
    
    # Add enemy's movement
    future_x += enemy_velocity * bullet_travel_time * \
                math.sin(math.radians(enemy_heading))
    future_y += enemy_velocity * bullet_travel_time * \
                math.cos(math.radians(enemy_heading))
    
    # Calculate angle to future position
    target_angle = math.degrees(math.atan2(future_x, future_y))
    
    # Aim gun
    gun_turn = target_angle - self.gun_heading
    self.turn_gun_right(gun_turn)
    
    # Fire
    self.fire(bullet_power)
```

### Head-On Targeting

Simple but effective at close range:

```python
def head_on_targeting(self, event):
    """Aim directly at enemy (good for close range)"""
    # Turn gun to face enemy
    gun_turn = event.bearing - self.gun_heading
    self.turn_gun_right(gun_turn)
    
    # Fire with power based on distance
    distance = event.distance
    if distance < 100:
        power = 3
    elif distance < 300:
        power = 2
    else:
        power = 1
    
    if self.gun_heat == 0:
        self.fire(power)
```

## Energy Management

Track your energy and make smart decisions:

```python
class SmartBot(Bot):
    def __init__(self):
        super().__init__()
        self.last_energy = 100
    
    def on_scanned_bot(self, event):
        """Fire based on our energy level"""
        my_energy = self.energy
        enemy_energy = event.energy
        
        # Conservative when low on energy
        if my_energy < 20:
            power = 0.5
        # Aggressive when we have advantage
        elif my_energy > enemy_energy + 30:
            power = 3
        # Normal combat
        else:
            power = 2
        
        # Fire
        if self.gun_heat == 0:
            self.fire(power)
        
        # Track energy for detecting enemy fire
        self.last_energy = my_energy
    
    def detect_enemy_fire(self):
        """Check if we lost energy (might be enemy fire)"""
        energy_drop = self.last_energy - self.energy
        
        # Energy drop between 0.1 and 3 means enemy fired
        if 0.1 <= energy_drop <= 3:
            # Enemy bullet power
            enemy_power = energy_drop
            # React to incoming bullet
            self.dodge()
```

## Radar Management

### Radar Lock

Keep radar pointed at one enemy:

```python
class RadarLockBot(Bot):
    def __init__(self):
        super().__init__()
        self.last_enemy_bearing = 0
    
    def run(self):
        while self.is_running():
            # Move
            self.forward(100)
            
            # Spin radar to find enemy
            self.turn_radar_right(360)
    
    def on_scanned_bot(self, event):
        """Lock radar on scanned enemy"""
        # Calculate radar turn to keep locked
        radar_turn = event.bearing - self.radar_heading
        
        # Add small oscillation to avoid losing lock
        if radar_turn < 0:
            radar_turn -= 5
        else:
            radar_turn += 5
        
        self.turn_radar_right(radar_turn)
        
        # Now aim and fire
        self.aim_and_fire(event)
```

### Wide Radar Sweep

Scan wide area efficiently:

```python
def wide_sweep(self):
    """Sweep radar back and forth"""
    self.turn_radar_right(60)  # Sweep right
    self.turn_radar_left(60)   # Sweep left
```

## Pattern Recognition

Track enemy behavior:

```python
class PatternBot(Bot):
    def __init__(self):
        super().__init__()
        self.enemy_positions = []
        self.max_history = 20
    
    def on_scanned_bot(self, event):
        """Record enemy position"""
        # Store position data
        position = {
            'bearing': event.bearing,
            'distance': event.distance,
            'velocity': event.velocity,
            'heading': event.heading
        }
        
        self.enemy_positions.append(position)
        
        # Keep only recent history
        if len(self.enemy_positions) > self.max_history:
            self.enemy_positions.pop(0)
        
        # Analyze pattern
        if len(self.enemy_positions) >= 5:
            self.predict_and_fire()
    
    def predict_and_fire(self):
        """Use pattern to predict future position"""
        # Simple average of recent velocities
        recent = self.enemy_positions[-5:]
        avg_velocity = sum(p['velocity'] for p in recent) / 5
        avg_heading = sum(p['heading'] for p in recent) / 5
        
        # Use for targeting
        # ... implementation ...
```

## Strategy Patterns

### State Machine

Different behaviors for different situations:

```python
class StateMachineBot(Bot):
    def __init__(self):
        super().__init__()
        self.state = "SEEK"  # SEEK, ATTACK, EVADE, CORNER
    
    def run(self):
        while self.is_running():
            if self.state == "SEEK":
                self.seek_enemy()
            elif self.state == "ATTACK":
                self.attack_enemy()
            elif self.state == "EVADE":
                self.evade_fire()
            elif self.state == "CORNER":
                self.corner_strategy()
    
    def seek_enemy(self):
        """Search for enemies"""
        self.forward(50)
        self.turn_radar_right(360)
    
    def attack_enemy(self):
        """Aggressive attack"""
        # Implementation
        pass
    
    def change_state(self, new_state):
        """Change bot behavior"""
        self.state = new_state
```

### Melee Strategy

Fighting multiple opponents:

```python
def melee_strategy(self):
    """Strategy for multi-bot battles"""
    # Stay near center
    center_x = self.arena_width / 2
    center_y = self.arena_height / 2
    
    # Calculate direction to center
    dx = center_x - self.x
    dy = center_y - self.y
    
    angle_to_center = math.degrees(math.atan2(dx, dy))
    turn = angle_to_center - self.heading
    
    self.turn_right(turn)
    self.forward(50)
    
    # Keep radar spinning to track all enemies
    self.turn_radar_right(45)
```

## Optimization Tips

### Minimize Turn Time

Combine turning movements:

```python
# Instead of:
self.turn_right(30)
self.turn_gun_right(20)
self.turn_radar_right(45)

# Do:
self.set_turn_right(30)
self.set_turn_gun_right(20 + 30)  # Relative to body
self.set_turn_radar_right(45 + 30 + 20)  # Relative to gun
self.execute()  # Execute all at once
```

### Bullet Power Selection

Choose optimal firepower:

```python
def optimal_firepower(self, distance, my_energy):
    """Calculate best firepower for situation"""
    if my_energy < 15:
        return 0.1  # Conserve energy
    
    if distance < 100:
        return 3.0  # Maximum damage up close
    elif distance < 200:
        # Balance damage and bullet speed
        return 2.5
    elif distance < 400:
        return 2.0
    else:
        # Fast bullets for long range
        return 1.0
```

## Advanced Pseudocode Example

Complete bot with advanced features:

```
CLASS AdvancedBot EXTENDS Bot:
    INITIALIZE:
        enemy_tracker = EnemyTracker()
        movement_controller = MovementController()
        targeting_system = TargetingSystem()
        energy_manager = EnergyManager()
    
    METHOD run():
        WHILE is_running():
            // Update state
            my_state = analyze_situation()
            
            // Execute movement
            next_position = movement_controller.calculate_move(my_state)
            move_to(next_position)
            
            // Scan for enemies
            radar_angle = enemy_tracker.next_scan_direction()
            turn_radar(radar_angle)
        END WHILE
    END METHOD
    
    METHOD on_scanned_bot(event):
        // Update enemy tracking
        enemy_tracker.update(event)
        
        // Calculate target
        target_angle = targeting_system.calculate_aim(event)
        turn_gun(target_angle)
        
        // Decide firepower
        power = energy_manager.calculate_firepower(event, my_energy)
        
        // Fire if ready
        IF gun_heat == 0 THEN
            fire(power)
        END IF
    END METHOD
    
    METHOD on_hit_by_bullet(event):
        // Evasive action
        movement_controller.evade(event.bearing)
    END METHOD
    
    METHOD analyze_situation():
        RETURN {
            'my_energy': energy,
            'position': (x, y),
            'enemy_count': enemy_tracker.count(),
            'threat_level': calculate_threat(),
            'arena_position': get_arena_position()
        }
    END METHOD
END CLASS
```

## Testing Your Bot

### Test Against Different Opponents

- **Sitting Duck**: Test your targeting
- **Spinner**: Tests tracking moving targets
- **Walls**: Tests corner situations
- **Aggressive bots**: Tests defense

### Measure Performance

Track statistics:
- Hit percentage
- Damage dealt vs. taken
- Survival rate
- Score per round

### Iterative Improvement

```
1. Test bot → 2. Identify weakness → 3. Improve code → 4. Repeat
```

## Resources for Advanced Robocoders

- **RoboWiki**: [robowiki.net](http://robowiki.net/) - Advanced strategies
- **Movement**: Wave Surfing, Minimum Risk
- **Targeting**: GuessFactor, Pattern Matching, Neural Networks
- **Competition**: Join tournaments and learn from top bots

## Next Steps

1. Study [Physics](/articles/physics) formulas
2. Analyze [Scoring](/articles/scoring) system
3. Experiment with [Coordinates](/articles/coordinates-and-angles)
4. Join the community and compete!

## Conclusion

You now have the tools to create sophisticated bots:
- Advanced movement and targeting
- Energy and radar management
- Strategic decision making
- Optimization techniques

Keep experimenting and learning. The best way to improve is to compete against other bots and study what works!

---

*Advanced techniques compiled from [RoboWiki](http://robowiki.net/) research and the competitive Robocode community.*

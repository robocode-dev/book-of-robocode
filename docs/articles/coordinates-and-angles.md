# Coordinates and Angles

Understanding the coordinate system and how angles work in Robocode is fundamental for navigation and targeting.

## Coordinate System

### Arena Layout

The Robocode arena uses a standard Cartesian coordinate system:

- **Origin (0, 0)**: Bottom-left corner
- **X-axis**: Increases from left to right
- **Y-axis**: Increases from bottom to top
- **Units**: Floating-point numbers (double precision)

### Arena Size

Arena dimensions vary but commonly:
- **Width**: 800 units (X: 0 to 800)
- **Height**: 600 units (Y: 0 to 600)

Your bot's position is given as coordinates (x, y):
```python
# Example bot positions
(100, 150)   # Near bottom-left
(400, 300)   # Center
(750, 550)   # Near top-right
```

### Walls

The arena is bounded by walls. Hitting a wall causes damage:
- Collision damage is calculated based on speed
- Bots cannot move through walls

::: warning Wall Collision
Avoid getting too close to walls, especially at high speed!
:::

## Angle System

Robocode uses degrees for all angles, with a specific convention:

### Heading (Direction)

The heading represents which direction your bot's body is facing:

- **0°**: North (straight up, positive Y direction)
- **90°**: East (right, positive X direction)
- **180°**: South (down, negative Y direction)
- **270°**: West (left, negative X direction)

Angles increase **clockwise**:

```
        0° (North)
           ↑
           |
270° ←-----+----- → 90° (East)
(West)     |
           ↓
       180° (South)
```

### Angle Range

Angles in Robocode are typically:
- **0° to 360°**: Standard range
- **-180° to 180°**: Sometimes used for relative angles

### Normalized Angles

You often need to normalize angles to a standard range:

```python
def normalize_angle(angle):
    """Normalize angle to 0-360 range"""
    while angle < 0:
        angle += 360
    while angle >= 360:
        angle -= 360
    return angle

def normalize_relative_angle(angle):
    """Normalize angle to -180 to 180 range"""
    while angle < -180:
        angle += 360
    while angle > 180:
        angle -= 360
    return angle
```

## Calculating Angles

### Absolute Bearing

The absolute bearing is the angle from your position to another position:

$$
\text{bearing} = \arctan2(\Delta y, \Delta x) \times \frac{180}{\pi}
$$

Where:
- $\Delta x = \text{target}_x - \text{your}_x$
- $\Delta y = \text{target}_y - \text{your}_y$

**Important**: Most programming languages' `atan2(y, x)` function uses mathematical conventions (counterclockwise from East). You need to convert to Robocode conventions (clockwise from North):

```python
import math

def absolute_bearing(my_x, my_y, target_x, target_y):
    """Calculate absolute bearing from my position to target"""
    dx = target_x - my_x
    dy = target_y - my_y
    
    # atan2 gives angle from East, counterclockwise
    # Convert to North, clockwise
    bearing = math.degrees(math.atan2(dx, dy))
    
    return bearing
```

### Relative Bearing

The relative bearing is the angle relative to your current heading:

$$
\text{relative bearing} = \text{absolute bearing} - \text{your heading}
$$

Normalize this to -180° to 180° to get the shortest turn direction:

```python
def relative_bearing(my_heading, absolute_bearing):
    """Calculate relative bearing (angle to turn)"""
    relative = absolute_bearing - my_heading
    # Normalize to -180 to 180
    while relative < -180:
        relative += 360
    while relative > 180:
        relative -= 360
    return relative
```

### Turn Direction

The sign of the relative bearing tells you which way to turn:
- **Positive**: Turn clockwise (right)
- **Negative**: Turn counterclockwise (left)

## Distance Calculation

Use the Pythagorean theorem to calculate distance between two points:

$$
d = \sqrt{(\Delta x)^2 + (\Delta y)^2}
$$

```python
import math

def distance(x1, y1, x2, y2):
    """Calculate distance between two points"""
    dx = x2 - x1
    dy = y2 - y1
    return math.sqrt(dx * dx + dy * dy)
```

## Practical Examples

### Moving Toward a Point

```python
def move_toward_point(my_x, my_y, my_heading, target_x, target_y):
    """Calculate heading adjustment to move toward target"""
    # Calculate absolute bearing to target
    bearing = absolute_bearing(my_x, my_y, target_x, target_y)
    
    # Calculate relative bearing (how much to turn)
    turn = relative_bearing(my_heading, bearing)
    
    # Calculate distance
    dist = distance(my_x, my_y, target_x, target_y)
    
    return {
        'turn': turn,      # Degrees to turn
        'distance': dist   # Units to move
    }
```

### Aiming at Target

```python
def aim_gun_at_target(my_x, my_y, gun_heading, target_x, target_y):
    """Calculate gun turn needed to aim at target"""
    # Absolute bearing to target
    bearing = absolute_bearing(my_x, my_y, target_x, target_y)
    
    # How much to turn gun (relative to current gun heading)
    gun_turn = relative_bearing(gun_heading, bearing)
    
    return gun_turn
```

### Perpendicular Movement

Move perpendicular to an enemy (circular strafing):

```python
def perpendicular_heading(my_x, my_y, enemy_x, enemy_y, my_heading):
    """Calculate heading perpendicular to enemy"""
    # Bearing to enemy
    bearing = absolute_bearing(my_x, my_y, enemy_x, enemy_y)
    
    # Add 90 degrees for perpendicular
    perpendicular = bearing + 90
    
    # Relative turn needed
    turn = relative_bearing(my_heading, perpendicular)
    
    return turn
```

## Wall Avoidance

Check distance to walls and adjust movement:

```python
def check_wall_distance(x, y, heading, arena_width, arena_height):
    """Calculate distance to nearest wall in heading direction"""
    # Using simple projection
    if 0 <= heading < 90:
        # Moving toward top-right
        dist_to_right = arena_width - x
        dist_to_top = arena_height - y
        # Calculate actual distance based on heading
    elif 90 <= heading < 180:
        # Moving toward bottom-right
        dist_to_right = arena_width - x
        dist_to_bottom = y
    # ... and so on
    
    return min_wall_distance

def should_avoid_wall(x, y, heading, arena_width, arena_height, threshold=100):
    """Check if bot should avoid wall"""
    # Simplified - check distance to edges
    margin = threshold
    
    if x < margin or x > arena_width - margin:
        return True
    if y < margin or y > arena_height - margin:
        return True
    
    return False
```

## Trigonometry Quick Reference

Common trigonometric functions you'll use:

$$
\begin{align}
\sin(\theta) &= \frac{\text{opposite}}{\text{hypotenuse}} \\
\cos(\theta) &= \frac{\text{adjacent}}{\text{hypotenuse}} \\
\tan(\theta) &= \frac{\text{opposite}}{\text{adjacent}} \\
\end{align}
$$

For velocity components:
```python
velocity_x = speed * math.sin(math.radians(heading))
velocity_y = speed * math.cos(math.radians(heading))
```

::: tip Remember
Most programming languages use **radians** for trigonometric functions, but Robocode uses **degrees**. Always convert between them:
- Radians to degrees: `degrees = radians × 180 / π`
- Degrees to radians: `radians = degrees × π / 180`
:::

---

*This article incorporates knowledge from [RoboWiki](http://robowiki.net/) and the broader Robocode community.*

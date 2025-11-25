# Camera controls

## Version 1 - Position vectors 
The initial approach was naive and assumed the camera would never rotate away from its default orientation (facing down the Z-axis). It worked directly with the camera's world position coordinates:
- Moving vertically = changing Y position
- Moving horizontally = changing X position  
- Zooming = changing Z position

### Problem
This broke when camera rotation was introduced. For example, if we rotate the camera 90° to the right:
- The zoom axis becomes the X-axis (not Z)
- The horizontal pan axis becomes the Z-axis (not X)
- The vertical pan axis remains Y

With this approach, trying to pan horizontally would instead zoom the camera, making controls unintuitive and broken.

Working directly with world-space position vectors doesn't account for the camera's orientation. The axes are fixed to the world, not relative to where the camera is looking.

## Version 2 - Direction vectors
We need manipualte the camera relative to where it is looking, so, instead of directly manipulating the position vectors, we now:
1. Get there direction the camera is facing 
2. Apply the desired transformation along that direction
3. Add the resulting displacement to the camera's position

Direction vectors are expressed in world space but represent the direction relative to the camera's orientation, meaning:
- Forward/backward movement always follow where the camera is looking
- Pan movements use perpendicular directions

By detaching camera controls from fixed world axes, transformations become relative to the camera's current orientation, making controls work consistently at any rotation angle.

### Understanding Direction Vectors
Direction vectors are expressed in world space but represent the direction **relative to the camera's orientation**. They are **normalized** (magnitude = 1), making them unit vectors that only indicate direction, not distance.

**Common direction vectors:**
- `(0, 0, -1)`: Facing into the negative Z-axis
- `(0, 0, 1)`: Facing out of the positive Z-axis
- `(1, 0, 0)`: Facing right (positive X-axis)
- `(-1, 0, 0)`: Facing left (negative X-axis)
- `(0, 1, 0)`: Facing up (positive Y-axis)
- `(0, -1, 0)`: Facing down (negative Y-axis)


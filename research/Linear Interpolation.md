# Linear Interpolation (Lerp)

A curve fitting method that creates a straight line between two points.

## Basic Concept

Given two points, linear interpolation finds intermediate points along the straight line connecting them.

**Formula:** 
    `lerp(start, end, t) = start + (end - start) * t`

Where `t` is a fraction between 0 and 1.

## Smooth Camera Zoom Application

When zooming, we have two points:
1. **Camera starting position** (current Z)
2. **Camera target position** (desired Z after zoom)

Instead of jumping directly to the target position, we:
1. Calculate the next point along the line between start and target
2. Move a fixed fraction toward the target each frame
3. Repeat until we reach (or get close to) the target

## Key Characteristics
With each frame, our `start` value inches closer to the `end`, however this means that we will actually never reach the destination because we only ever move at a fraction of the distance between `start` and `end` as we get closer, this distance exponentially shrinks until it becomes neglible, and because it exponentially shrinks, the zoom towards the target will of course slow down as we will be moving smaller distances the closer we get towards the target.


## Issues
- No control over the duration.
    - E.g.: User can't speed up how fast they zoom in or out
- Doesn't actually reach the target
    - This can be a problem if we have a animation loop or condition that relies on the camera reaching a specific value, it can be hard to trigger said thing accurately. It can be circumvented by rounding though but that might make the animation choppy.


## Alternative
- [Easing]() //TODO: research this when needed, not required at the moment

## Resources
- [LERP vs Easing](https://zuncreative.com/en/blog/lerp_vs_easing)
- [Linear Interpolation](https://en.wikipedia.org/wiki/Linear_interpolation)




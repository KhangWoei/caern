import { describe, expect, test } from "vitest"
import { Camera } from "three"
import { Zoom, ZoomOptions } from "../app/Canvas/Camera/Zoom"

describe("zoom", () => {
    test("should zoom in", () => {
        const camera = new Camera();
        const zoomOptions = {
            scale: 1,
            min: -100,
            max: 100,
            snap: 0.1
        }
        const initial = camera.position.z;
        const zoom = new Zoom(initial, zoomOptions);

        zoom.onZoom(-10);
        zoom.update(camera);
        expect(camera.position.z).toBe(initial - 10);
    });

    test("should zoom out", () => {
        const camera = new Camera();
        const zoomOptions = {
            scale: 1,
            min: -100,
            max: 100,
            snap: 0.1
        }
        const initial = camera.position.z;
        const zoom = new Zoom(initial, zoomOptions);

        zoom.onZoom(10);
        zoom.update(camera);
        expect(camera.position.z).toBe(initial + 10);
    });

    test("should be clamped at maximum", () => {
        const camera = new Camera();
        const zoomOptions = {
            scale: 1,
            min: -100,
            max: 100,
            snap: 0.1
        }
        const zoom = new Zoom(camera.position.z, zoomOptions);

        zoom.onZoom(Number.MAX_SAFE_INTEGER);
        zoom.update(camera);
        expect(camera.position.z).toBe(zoomOptions.max);
    });

    test("should be clamped at a minimum", () => {
        const camera = new Camera();
        const zoomOptions = {
            scale: 1,
            min: -100,
            max: 100,
            snap: 0.1
        }
        const zoom = new Zoom(camera.position.z, zoomOptions);

        zoom.onZoom(Number.MIN_SAFE_INTEGER);
        zoom.update(camera);
        expect(camera.position.z).toBe(zoomOptions.min);
    });

    test("should zoom proprotional to scale", () => {
        const camera = new Camera();
        const zoomOptions = {
            scale: 1,
            min: -100,
            max: 100,
            snap: 0.1
        }
        const initial = camera.position.z;
        const zoom = new Zoom(camera.position.z, zoomOptions);

        const delta = 10;
        const expected = initial + (delta * zoomOptions.scale);
        zoom.onZoom(delta);
        for (let i = 0; i < 100; i++) {
            zoom.update(camera);
        }
        expect(camera.position.z).toBeCloseTo(expected);
    });
})

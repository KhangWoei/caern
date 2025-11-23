import { describe, expect, test } from "vitest"
import { CameraController } from "../app/Canvas/Camera/CameraController";
import { EventBus } from "../app/EventBus";
import { Camera } from "three";
import { CameraEvents } from "../app/Canvas/Camera/CameraEvents";
import { Direction } from "../app/Canvas/Camera/CameraController";

describe("ZoomEvent", () => {
    test("should zoom in", () => {
        const eventBus: EventBus = new EventBus();
        const camera: Camera = new Camera();
        const controller = new CameraController(eventBus, camera, { minZ: -100, scale: 1 });

        const initialZ = camera.position.z;
        eventBus.publish(CameraEvents.Zoom, -10);
        controller.update();
        expect(camera.position.z).toBe(initialZ - 10);
    });

    test("should zoom out", () => {
        const eventBus: EventBus = new EventBus();
        const camera: Camera = new Camera();
        const controller = new CameraController(eventBus, camera, { scale: 1 });

        const initialZ = camera.position.z;
        eventBus.publish(CameraEvents.Zoom, 10);
        controller.update();
        expect(camera.position.z).toBe(initialZ + 10);
    });

    test("should be clamped at maximum", () => {
        const eventBus: EventBus = new EventBus();
        const camera: Camera = new Camera();
        const controller = new CameraController(eventBus, camera, { maxZ: 100, scale: 1 });

        eventBus.publish(CameraEvents.Zoom, Number.MAX_SAFE_INTEGER);
        controller.update();

        expect(camera.position.z).toBe(100);
    });

    test("should be clamped at a minimum", () => {
        const eventBus: EventBus = new EventBus();
        const camera: Camera = new Camera();
        const controller = new CameraController(eventBus, camera, { minZ: -100, scale: 1 });

        eventBus.publish(CameraEvents.Zoom, Number.MIN_SAFE_INTEGER);
        controller.update();
        expect(camera.position.z).toBe(-100);
    });

    test("should zoom proprotional to scale", () => {
        const eventBus: EventBus = new EventBus();
        const camera: Camera = new Camera();
        const scale = 1;
        const controller = new CameraController(eventBus, camera, { minZ: -100, maxZ: 100, scale });

        const initialZ = camera.position.z;
        const zoom = 10;
        const expected = initialZ + (zoom * scale);
        eventBus.publish(CameraEvents.Zoom, zoom);

        for (let i = 0; i < 100; i++) {
            controller.update();
        }
        expect(camera.position.z).toBeCloseTo(expected);
    });
});

describe("EdgePanEvent", () => {
    // TODO: this needs a better test
    test("should pan camera to degree of acceleration", () => {
        const eventBus: EventBus = new EventBus();
        const camera: Camera = new Camera();
        const acceleration: number = 100;
        const controller = new CameraController(eventBus, camera, { acceleration, deceleration: 0, maxSpeed: acceleration });

        const initialX = camera.position.x;
        eventBus.publish(CameraEvents.EdgePan, Direction.East);
        controller.update();

        expect(camera.position.x).toBeCloseTo(initialX + acceleration);
    });
});

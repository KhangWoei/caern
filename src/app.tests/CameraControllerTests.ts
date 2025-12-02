import { describe, expect, test } from "vitest"
import { CameraController } from "../app/Canvas/Camera/CameraController";
import { EventBus } from "../app/EventBus";
import { Camera } from "three";
import { CameraEvents } from "../app/Canvas/Camera/CameraEvents";
import { Direction } from "../app/Canvas/Camera/CameraController";

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

import { describe, expect, test } from "vitest"
import { Camera } from "three";
import { Pan, PanOptions } from "../app/Canvas/Camera/Pan"

describe("Pan", () => {
    test.each([
        {
            horizontal: 1, vertical: 0
        },
        {
            horizontal: 0, vertical: 1
        },
        {
            horizontal: 1, vertical: 1
        }
    ])("should pan horizontally: $horizontal, vertically: $vertical", ({ horizontal, vertical }) => {
        const camera = new Camera();
        const options = {
            maxSpeed: Number.MAX_SAFE_INTEGER,
            acceleration: 1,
            deceleration: 0,
            snap: 0.1
        }
        const pan = new Pan(options);

        const initialX = camera.position.x;
        const initialY = camera.position.y;
        pan.pan(horizontal, vertical);
        pan.update(camera);

        expect(camera.position.x).toEqual(initialX + horizontal);
        expect(camera.position.y).toEqual(initialY + vertical);
    });

    test.each([
        {
            horizontal: 100, vertical: 100, speed: 0
        },
        {
            horizontal: 100, vertical: 100, speed: 100
        },
        {
            horizontal: 100, vertical: 100, speed: 1
        }
    ])("should pan with respect to max speed $speed", ({ horizontal, vertical, speed }) => {
        const camera = new Camera();
        const options = {
            maxSpeed: speed,
            acceleration: 1,
            deceleration: 0,
            snap: 0.1
        }
        const pan = new Pan(options);

        const initialX = camera.position.x;
        const initialY = camera.position.y;
        pan.pan(horizontal, vertical);
        pan.update(camera);

        expect(camera.position.x).toEqual(initialX + options.maxSpeed);
        expect(camera.position.y).toEqual(initialY + options.maxSpeed);
    });

    test("should decelerate velocity over multiple updates", () => {
        const camera = new Camera();
        const options = {
            maxSpeed: 100,
            acceleration: 1,
            deceleration: 0,
            snap: 0
        }
        const pan = new Pan(options);

        pan.pan(10, 0);
        const initialX = camera.position.x;

        pan.update(camera);
        const firstX = camera.position.x;

        pan.update(camera);
        const secondX = camera.position.x;

        expect(firstX).not.toEqual(initialX);
        expect(secondX).toEqual(firstX);
    });

    test("should snap velocity to zero when below snap threshold", () => {
        const camera = new Camera();
        const options = {
            maxSpeed: 100,
            acceleration: 1,
            deceleration: 0.5,
            snap: 1.0
        }
        const pan = new Pan(options);

        pan.pan(2, 0);
        const initialX = camera.position.x;

        pan.update(camera);
        const firstX = camera.position.x;

        pan.update(camera);
        const secondX = camera.position.x;

        expect(firstX).not.toEqual(initialX);
        expect(secondX).toEqual(firstX);
    });
});

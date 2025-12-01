import { EventBus } from "../EventBus";
import { InputController } from "../InputController";
import { CameraEvents } from "./Camera/CameraEvents";
import { Direction } from "./Camera/CameraController";
import { Vector2 } from "three";
import VelocityNode from "three/src/nodes/accessors/VelocityNode.js";

// TODO: Revisit this type, it belongs in the wrong place
export class CanvasInputController extends InputController {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _eventBus: EventBus;

    private readonly _keysPressed: Set<string> = new Set();

    private _currentPointer: Vector2 | null = null;
    private _previousPointer: Vector2 | null = null;

    constructor(element: HTMLCanvasElement, eventBus: EventBus) {
        super();

        this._canvas = element;
        this._eventBus = eventBus;
        this.attachListeners();
    }

    public update(): void {
        this._keysPressed.forEach(key => {
            switch (key) {
                case "w":
                    this._eventBus.publish(CameraEvents.EdgePan, Direction.North);
                    break;
                case "a":
                    this._eventBus.publish(CameraEvents.EdgePan, Direction.West);
                    break;
                case "s":
                    this._eventBus.publish(CameraEvents.EdgePan, Direction.South);
                    break;
                case "d":
                    this._eventBus.publish(CameraEvents.EdgePan, Direction.East);
                    break;
                case "mouse:wheel":
                    if (this._currentPointer !== null && this._previousPointer !== null) {
                        const threshold = 8;

                        let deltaX = this._currentPointer.x - this._previousPointer.x;
                        deltaX = deltaX > threshold || deltaX < threshold ? deltaX : 0;

                        let deltaY = this._currentPointer.y - this._previousPointer.y;
                        deltaY = deltaY > threshold || deltaY < threshold ? deltaY : 0;
                        this._eventBus.publish(CameraEvents.Rotate, deltaX, deltaY);

                        this._previousPointer.copy(this._currentPointer);
                    }
                    break;
                default:
                    break;
            }
        });
    }

    protected override attachListeners(): void {
        this._canvas.addEventListener("pointerdown", this.onPointerDown.bind(this));
        this._canvas.addEventListener("pointerup", this.onPointerUp.bind(this));

        this._canvas.addEventListener("pointermove", this.onPointerMove.bind(this));
        this._canvas.addEventListener("wheel", this.onWheel.bind(this));

        this._canvas.addEventListener("keydown", this.onKeyDown.bind(this));
        this._canvas.addEventListener("keyup", this.onKeyUp.bind(this));

        this._canvas.addEventListener("pointerenter", () => {
            this._canvas.focus();
        });
    }

    private onPointerDown(event: PointerEvent): void {
        if (event.button == 1) {
            this._keysPressed.add("mouse:wheel");
            this._currentPointer = new Vector2(event.x, event.y);
            this._previousPointer = new Vector2().copy(this._currentPointer);
        }
    }

    private onPointerUp(event: PointerEvent): void {
        if (event.button == 1) {
            this._keysPressed.delete("mouse:wheel");
            this._currentPointer = null;
            this._previousPointer = null;
        }
    }

    private onPointerMove(event: PointerEvent): void {
        this._currentPointer = new Vector2(event.x, event.y);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === ' ' || event.key.startsWith('Arrow')) {
            event.preventDefault();
        }

        this._keysPressed.add(event.key.toLowerCase());
    }

    private onKeyUp(event: KeyboardEvent): void {
        this._keysPressed.delete(event.key.toLowerCase());
    }

    // Browser wheel events only know about 2D scroll (deltaX/deltaY).
    // We map deltaY (vertical scroll) to deltaZ (camera depth in 3D space).
    private onWheel(event: WheelEvent): void {
        event.preventDefault();
        this._eventBus.publish(CameraEvents.Zoom, event.deltaY);
    }
}


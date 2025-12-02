import { EventBus } from "../EventBus";
import { CameraEvents } from "./Camera/CameraEvents";

export class Inputs {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _eventBus: EventBus;

    private readonly _keysPressed: Set<string> = new Set();

    constructor(element: HTMLCanvasElement, eventBus: EventBus) {
        this._canvas = element;
        this._eventBus = eventBus;
        this.attachListeners();
    }

    public update(): void {
        this._keysPressed.forEach(key => {
            switch (key) {
                case "w":
                    this._eventBus.publish(CameraEvents.EdgePan, 0, 1);
                    break;
                case "a":
                    this._eventBus.publish(CameraEvents.EdgePan, -1, 0);
                    break;
                case "s":
                    this._eventBus.publish(CameraEvents.EdgePan, 0, -1);
                    break;
                case "d":
                    this._eventBus.publish(CameraEvents.EdgePan, 1, 0);
                    break;
                default:
                    break;
            }
        });
    }

    private attachListeners(): void {
        this._canvas.addEventListener("wheel", this.onWheel.bind(this));

        this._canvas.addEventListener("keydown", this.onKeyDown.bind(this));
        this._canvas.addEventListener("keyup", this.onKeyUp.bind(this));

        this._canvas.addEventListener("pointerenter", () => {
            this._canvas.focus();
        });
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


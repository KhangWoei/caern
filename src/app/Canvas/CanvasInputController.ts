import { EventBus } from "../EventBus";
import { InputController } from "../InputController";
import { CameraEvents } from "./Camera/CameraEvents";
import { Direction } from "./Camera/CameraController";

// TODO: Revisit this type, it belongs in the wrong place
export class CanvasInputController extends InputController {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _eventBus: EventBus;

    private readonly _keysPressed: Set<string> = new Set();

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
                default:
                    break;
            }
        });
    }

    protected override attachListeners(): void {
        this._canvas.addEventListener("pointermove", this.onPointerMove.bind(this));
        this._canvas.addEventListener("wheel", this.onWheel.bind(this));

        this._canvas.addEventListener("keydown", this.onKeyDown.bind(this));
        this._canvas.addEventListener("keyup", this.onKeyUp.bind(this));

        this._canvas.addEventListener("pointerenter", () => {
            this._canvas.focus();
        });
    }

    private onPointerMove(event: PointerEvent): void {
        console.log(event);
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

    private onWheel(event: WheelEvent): void {
        event.preventDefault();
        this._eventBus.publish(CameraEvents.Zoom, event.deltaY);
    }
}


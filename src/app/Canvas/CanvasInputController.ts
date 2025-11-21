import { EventBus } from "../EventBus";
import { InputController } from "../InputController";
import { CameraEvents } from "./Camera/CameraEvents";

// TODO: Revisit this type, it belongs in the wrong place
export class CanvasInputController extends InputController {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _eventBus: EventBus;

    constructor(element: HTMLCanvasElement, eventBus: EventBus) {
        super();

        this._canvas = element;
        this._eventBus = eventBus;
        this.attachListeners();
    }

    protected override attachListeners(): void {
        this._canvas.addEventListener("pointermove", this.onPointerMove.bind(this));
        this._canvas.addEventListener("wheel", this.onWheel.bind(this));

        this._canvas.addEventListener("keydown", this.onKeyDown.bind(this));

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

        console.log(event);
        this._eventBus.publish(CameraEvents.EdgePan);
    }

    private onWheel(event: WheelEvent): void {
        event.preventDefault();

        console.log(event);
        this._eventBus.publish(CameraEvents.Zoom);
    }
}

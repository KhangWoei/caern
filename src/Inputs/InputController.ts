import { EventBus } from "../EventBus";

export abstract class InputController {
    protected abstract attachListeners(): void;
}

export class CanvasInputController extends InputController {
    private readonly element: HTMLCanvasElement;
    private readonly bus: EventBus;

    constructor(element: HTMLCanvasElement, eventBus: EventBus) {
        super();

        this.element = element;
        this.bus = eventBus;
        this.attachListeners();
    }

    protected override attachListeners(): void {
        this.element.addEventListener("pointermove", this.onPointerMove.bind(this));
        this.element.addEventListener("wheel", this.onWheel.bind(this));

        this.element.addEventListener("keydown", this.onKeyDown.bind(this));

        this.element.addEventListener("pointerenter", () => {
            this.element.focus();
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
    }

    private onWheel(event: WheelEvent): void {
        event.preventDefault();

        console.log(event);
    }
}

import { EventBus } from "../EventBus";
import { CameraEvents } from "./CameraEvents";

export class CameraController {
    constructor(eventBus: EventBus) {
        this.subscribe(eventBus);
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Rotate, () => { this.onRotate() });
        eventBus.subscribe(CameraEvents.Zoom, () => { this.onZoom() });
        eventBus.subscribe(CameraEvents.EdgePan, () => { this.onEdgePan() });
    }

    private onRotate(): void {
        console.log("rotating")
    }

    private onZoom(): void {
        console.log("zoomies")
    }

    private onEdgePan(): void {
        console.log("panning")
    }
}

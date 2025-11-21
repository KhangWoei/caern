import * as THREE from "three"
import { EventBus } from "../../EventBus";
import { CameraEvents } from "./CameraEvents";

export class CameraController {
    private readonly _camera: THREE.Camera;

    constructor(camera: THREE.Camera, eventBus: EventBus) {
        this._camera = camera;
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

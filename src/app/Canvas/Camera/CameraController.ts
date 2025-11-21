import * as THREE from "three"
import { EventBus } from "../../EventBus";
import { CameraEvents } from "./CameraEvents";

export type CameraControllerOptions = {
    minZ: number,
    maxZ: number,
    scale: number
};

const DEFAULT_OPTIONS: CameraControllerOptions = {
    minZ: 10,
    maxZ: 100,
    scale: 0.1
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    constructor(eventBus: EventBus, camera: THREE.Camera, options: Partial<CameraControllerOptions> = {}) {
        this._camera = camera;
        this._options = { ...DEFAULT_OPTIONS, ...options };

        this.subscribe(eventBus);
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Rotate, () => { this.onRotate() });
        eventBus.subscribe(CameraEvents.Zoom, (deltaY: number) => { this.onZoom(deltaY) });
        eventBus.subscribe(CameraEvents.EdgePan, () => { this.onEdgePan() });
    }

    private onRotate(): void {
        console.log("rotating")
    }
    // Browser wheel events only know about 2D scroll (deltaX/deltaY).
    // We map deltaY (vertical scroll) to deltaZ (camera depth in 3D space).
    // TODO: Smooth zoom
    private onZoom(deltaY: number): void {
        const zoom: number = deltaY * this._options.scale;

        const newZoom: number = Math.max(this._options.minZ, Math.min(this._options.maxZ, this._camera.position.z + zoom));
        this._camera.position.setZ(newZoom);
    }

    private onEdgePan(): void {
        console.log("panning")
    }
}


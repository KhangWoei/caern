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

type ZoomInfo = {
    currentZ: number,
    targetZ: number
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    private _zoomInfo: ZoomInfo;

    constructor(eventBus: EventBus, camera: THREE.Camera, options: Partial<CameraControllerOptions> = {}) {
        this._camera = camera;
        this._options = { ...DEFAULT_OPTIONS, ...options };
        this._zoomInfo = {
            currentZ: camera.position.z,
            targetZ: camera.position.z
        }

        this.subscribe(eventBus);
    }

    public update(): void {
        this._zoomInfo.currentZ += (this._zoomInfo.targetZ - this._zoomInfo.currentZ) * this._options.scale;
        this._camera.position.setZ(this._zoomInfo.currentZ);
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
    private onZoom(deltaY: number): void {
        const zoom: number = deltaY * this._options.scale;

        const newZoom: number = Math.max(this._options.minZ, Math.min(this._options.maxZ, this._camera.position.z + zoom));

        this._zoomInfo.targetZ = newZoom;
    }

    private onEdgePan(): void {
        console.log("panning")
    }
}


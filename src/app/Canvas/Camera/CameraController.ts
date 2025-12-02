import * as THREE from "three"
import { EventBus } from "../../EventBus";
import { CameraEvents } from "./CameraEvents";
import { Zoom, ZoomOptions } from "./Zoom";
import { Pan, PanOptions } from "./Pan";

export type CameraControllerOptions = {
    zoom: ZoomOptions,
    pan: PanOptions
};

const DEFAULT_OPTIONS: CameraControllerOptions = {
    zoom: {
        scale: 0.1,
        min: 10,
        max: 100,
        snap: 0.1
    },
    pan: {
        snap: 0.1,
        acceleration: 0.25,
        deceleration: 0.75,
        maxSpeed: 2
    }
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    private _pan: Pan;
    private _zoom: Zoom;

    constructor(eventBus: EventBus, camera: THREE.Camera, options: Partial<CameraControllerOptions> = {}) {
        this._camera = camera;
        this._options = { ...DEFAULT_OPTIONS, ...options };

        this._pan = new Pan(this._options.pan);
        this._zoom = new Zoom(camera.position.z, this._options.zoom);
        this.subscribe(eventBus);
    }

    public update(): void {
        this._zoom.update(this._camera);
        this._pan.update(this._camera);
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Zoom, (zoom: number) => { this._zoom.onZoom(zoom) });
        eventBus.subscribe(CameraEvents.EdgePan, (deltaX: number, deltaY: number) => { this._pan.pan(deltaX, deltaY) });
    }
}


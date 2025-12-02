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

type Rotation = {
    thetaVelocity: number,
    phiVelocity: number
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    private _rotation: Rotation = {
        thetaVelocity: 0,
        phiVelocity: 0
    }

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
        this.rotate();
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Rotate, (deltaX: number, deltaY: number) => { this.onRotate(deltaX, deltaY) });
        eventBus.subscribe(CameraEvents.Zoom, (zoom: number) => { this._zoom.onZoom(zoom) });
        eventBus.subscribe(CameraEvents.EdgePan, (deltaX: number, deltaY: number) => { this._pan.pan(deltaX, deltaY) });
    }

    private onRotate(deltaX: number, deltaY: number): void {
        this._rotation.thetaVelocity = deltaX * 0.01;
        this._rotation.phiVelocity = -deltaY * 0.01;
    }

    private rotate(): void {
        if (this._rotation.thetaVelocity === 0 && this._rotation.phiVelocity === 0) {
            return;
        }

        const cameraPosition = new THREE.Vector3();
        this._camera.getWorldPosition(cameraPosition);

        const sphericalPosition = new THREE.Spherical().setFromCartesianCoords(
            cameraPosition.x,
            cameraPosition.z,
            cameraPosition.y
        );

        sphericalPosition.phi += this._rotation.phiVelocity;
        sphericalPosition.theta += this._rotation.thetaVelocity;

        const minPhi = 0.01;
        const maxPhi = Math.PI / 2 - 0.01;
        sphericalPosition.phi = Math.max(minPhi, Math.min(maxPhi, sphericalPosition.phi));

        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(sphericalPosition);

        this._camera.position.set(newPosition.x, newPosition.z, newPosition.y);

        this._rotation.thetaVelocity = this.decelerate(this._rotation.thetaVelocity, this._options.pan.deceleration, this._options.pan.snap);
        this._rotation.phiVelocity = this.decelerate(this._rotation.phiVelocity, this._options.pan.deceleration, this._options.pan.snap);

        this._camera.lookAt(0, 0, 0);
    }

    private decelerate(velocity: number, deceleration: number, snap: number): number {
        const newVelocity = velocity * deceleration;

        return Math.abs(newVelocity) <= snap ? 0 : newVelocity;
    }
}


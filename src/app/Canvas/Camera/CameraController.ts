import * as THREE from "three"
import { EventBus } from "../../EventBus";
import { CameraEvents } from "./CameraEvents";
import { Zoom, ZoomOptions } from "./Zoom";

export type CameraControllerOptions = {
    zoom: ZoomOptions,
    scale: number,
    snap: number,
    acceleration: number,
    deceleration: number,
    maxSpeed: number
};

export enum Direction {
    North = "camera:direction:north",
    South = "camera:direction:south",
    East = "camera:direction:east",
    West = "camera:direction:west"
}

const DEFAULT_OPTIONS: CameraControllerOptions = {
    zoom: {
        scale: 0.1,
        min: 10,
        max: 100,
        snap: 0.1
    },
    scale: 0.1,
    snap: 0.1,
    acceleration: 0.25,
    deceleration: 0.75,
    maxSpeed: 2
}

type PanInfo = {
    horizontalVelocity: number,
    verticalVelocity: number
}

type Rotation = {
    thetaVelocity: number,
    phiVelocity: number
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    private _panInfo: PanInfo = {
        horizontalVelocity: 0,
        verticalVelocity: 0
    };

    private _rotation: Rotation = {
        thetaVelocity: 0,
        phiVelocity: 0
    }

    private _zoom: Zoom;

    constructor(eventBus: EventBus, camera: THREE.Camera, options: Partial<CameraControllerOptions> = {}) {
        this._camera = camera;
        this._options = { ...DEFAULT_OPTIONS, ...options };
        this._zoom = new Zoom(camera.position.z, this._options.zoom);
        this.subscribe(eventBus);
    }

    public update(): void {
        this._zoom.update(this._camera);
        this.pan();
        this.rotate();
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Rotate, (deltaX: number, deltaY: number) => { this.onRotate(deltaX, deltaY) });
        eventBus.subscribe(CameraEvents.Zoom, (zoom: number) => { this._zoom.onZoom(zoom) });
        eventBus.subscribe(CameraEvents.EdgePan, (direction: Direction) => { this.onEdgePan(direction) });
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

        this._rotation.thetaVelocity = this.decelerate(this._rotation.thetaVelocity, this._options.deceleration, this._options.snap);
        this._rotation.phiVelocity = this.decelerate(this._rotation.phiVelocity, this._options.deceleration, this._options.snap);

        this._camera.lookAt(0, 0, 0);
    }

    // TODO: Scale panning speed to current zoom
    private onEdgePan(direction: Direction): void {
        switch (direction) {
            case Direction.North:
                this._panInfo.verticalVelocity += this._options.acceleration;
                break;
            case Direction.South:
                this._panInfo.verticalVelocity -= this._options.acceleration;
                break;
            case Direction.East:
                this._panInfo.horizontalVelocity += this._options.acceleration;
                break;
            case Direction.West:
                this._panInfo.horizontalVelocity -= this._options.acceleration;
                break;
            default:
                break;

        }

        this._panInfo.horizontalVelocity = clampVelocity(this._panInfo.horizontalVelocity, this._options.maxSpeed);
        this._panInfo.verticalVelocity = clampVelocity(this._panInfo.verticalVelocity, this._options.maxSpeed);

        function clampVelocity(velocity: number, max: number): number {
            return Math.max(-max, Math.min(max, velocity));
        }
    }

    private pan(): void {
        const forward = new THREE.Vector3();
        this._camera.getWorldDirection(forward);
        forward.normalize();

        const vertical = new THREE.Vector3();
        vertical.crossVectors(forward, new THREE.Vector3(-1, 0, 0));

        const horizontal = new THREE.Vector3();
        horizontal.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        this._camera.position.add(horizontal.multiplyScalar(this._panInfo.horizontalVelocity));
        this._panInfo.horizontalVelocity = this.decelerate(this._panInfo.horizontalVelocity, this._options.deceleration, this._options.snap);

        this._camera.position.add(vertical.multiplyScalar(this._panInfo.verticalVelocity));
        this._panInfo.verticalVelocity = this.decelerate(this._panInfo.verticalVelocity, this._options.deceleration, this._options.snap);
    }

    private decelerate(velocity: number, deceleration: number, snap: number): number {
        const newVelocity = velocity * deceleration;

        return Math.abs(newVelocity) <= snap ? 0 : newVelocity;
    }
}


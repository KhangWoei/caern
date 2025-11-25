import * as THREE from "three"
import { EventBus } from "../../EventBus";
import { CameraEvents } from "./CameraEvents";

export type CameraControllerOptions = {
    minZ: number,
    maxZ: number,
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
    minZ: 10,
    maxZ: 100,
    scale: 0.1,
    snap: 0.1,
    acceleration: 0.25,
    deceleration: 0.75,
    maxSpeed: 2
}

type ZoomInfo = {
    current: number,
    target: number
}

type PanInfo = {
    horizontalVelocity: number,
    verticalVelocity: number
}

type Rotation = {
    azimuthVelocity: number,
    tiltVelocity: number
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    private _zoomInfo: ZoomInfo;
    private _panInfo: PanInfo = {
        horizontalVelocity: 0,
        verticalVelocity: 0
    };

    private _rotation: Rotation = {
        azimuthVelocity: 0,
        tiltVelocity: 0
    }
    private _spherical: THREE.Spherical;

    constructor(eventBus: EventBus, camera: THREE.Camera, options: Partial<CameraControllerOptions> = {}) {
        this._camera = camera;
        this._options = { ...DEFAULT_OPTIONS, ...options };
        this._zoomInfo = {
            current: camera.position.z,
            target: camera.position.z
        }
        this._spherical = new THREE.Spherical().setFromVector3(this._camera.position);

        this.subscribe(eventBus);
    }

    public update(): void {
        this.zoom();
        this.pan();
        this.rotate();
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Rotate, (direction: Direction) => { this.onRotate(direction) });
        eventBus.subscribe(CameraEvents.Zoom, (deltaY: number) => { this.onZoom(deltaY) });
        eventBus.subscribe(CameraEvents.EdgePan, (direction: Direction) => { this.onEdgePan(direction) });
    }

    private onRotate(direction: Direction): void {
        switch (direction) {
            case Direction.North:
                this._rotation.tiltVelocity += this._options.acceleration;
                break;
            case Direction.South:
                this._rotation.tiltVelocity -= this._options.acceleration;
                break;
            case Direction.East:
                this._rotation.azimuthVelocity += this._options.acceleration;
                break;
            case Direction.West:
                this._rotation.azimuthVelocity -= this._options.acceleration;
                break;
            default:
                break;
        }
    }

    private rotate(): void {
        this._spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this._spherical.phi + this._rotation.tiltVelocity));
        this._rotation.tiltVelocity = 0;

        this._spherical.theta += this._rotation.azimuthVelocity;
        this._rotation.azimuthVelocity = 0;

        this._spherical.makeSafe();

        console.log(this._spherical);

        const cartesian = new THREE.Vector3().setFromSpherical(this._spherical);
        console.log(cartesian);
    }

    // Browser wheel events only know about 2D scroll (deltaX/deltaY).
    // We map deltaY (vertical scroll) to deltaZ (camera depth in 3D space).
    private onZoom(deltaY: number): void {
        const zoomDelta = deltaY * this._options.scale;

        this._zoomInfo.target = Math.max(this._options.minZ, Math.min(this._options.maxZ, this._zoomInfo.target + zoomDelta));
    }

    private zoom(): void {
        if (Math.abs(this._zoomInfo.target - this._zoomInfo.current) <= this._options.snap) {
            this._zoomInfo.current = this._zoomInfo.target;
            return;
        }

        const forward = new THREE.Vector3();
        this._camera.getWorldDirection(forward);
        forward.normalize();

        const previous = this._zoomInfo.current;
        this._zoomInfo.current += (this._zoomInfo.target - this._zoomInfo.current) * this._options.scale;
        const delta = previous - this._zoomInfo.current;
        this._camera.position.add(forward.multiplyScalar(delta));

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
        this._panInfo.horizontalVelocity = decelerate(this._panInfo.horizontalVelocity, this._options.deceleration, this._options.snap);

        this._camera.position.add(vertical.multiplyScalar(this._panInfo.verticalVelocity));
        this._panInfo.verticalVelocity = decelerate(this._panInfo.verticalVelocity, this._options.deceleration, this._options.snap);

        function decelerate(velocity: number, deceleration: number, snap: number): number {
            const newVelocity = velocity * deceleration;

            return Math.abs(newVelocity) <= snap ? 0 : newVelocity;
        }
    }
}


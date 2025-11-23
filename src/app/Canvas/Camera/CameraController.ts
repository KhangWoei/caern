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
    currentZ: number,
    targetZ: number
}

type PanInfo = {
    vx: number,
    vy: number
}

export class CameraController {
    private readonly _camera: THREE.Camera;
    private readonly _options: CameraControllerOptions;

    private _zoomInfo: ZoomInfo;
    private _panInfo: PanInfo = {
        vx: 0,
        vy: 0
    };

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
        this.zoom();
        this.pan();
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(CameraEvents.Rotate, () => { this.onRotate() });
        eventBus.subscribe(CameraEvents.Zoom, (deltaY: number) => { this.onZoom(deltaY) });
        eventBus.subscribe(CameraEvents.EdgePan, (direction: Direction) => { this.onEdgePan(direction) });
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

    private zoom(): void {
        this._zoomInfo.currentZ += (this._zoomInfo.targetZ - this._zoomInfo.currentZ) * this._options.scale;
        this._camera.position.setZ(this._zoomInfo.currentZ);

        if (Math.abs(this._zoomInfo.targetZ - this._zoomInfo.currentZ) <= this._options.snap) {
            this._zoomInfo.currentZ = this._zoomInfo.targetZ;
        }
    }

    // TODO: Scale panning speed to current zoom
    private onEdgePan(direction: Direction): void {
        switch (direction) {
            case Direction.North:
                this._panInfo.vy += this._options.acceleration;
                break;
            case Direction.South:
                this._panInfo.vy -= this._options.acceleration;
                break;
            case Direction.East:
                this._panInfo.vx += this._options.acceleration;
                break;
            case Direction.West:
                this._panInfo.vx -= this._options.acceleration;
                break;
            default:
                break;

        }

        this._panInfo.vx = clampVelocity(this._panInfo.vx, this._options.maxSpeed);
        this._panInfo.vy = clampVelocity(this._panInfo.vy, this._options.maxSpeed);

        function clampVelocity(velocity: number, max: number): number {
            return Math.max(-max, Math.min(max, velocity));
        }
    }

    private pan(): void {
        this._camera.position.x += this._panInfo.vx;
        this._panInfo.vx = decelerate(this._panInfo.vx, this._options.deceleration, this._options.snap);

        this._camera.position.y += this._panInfo.vy;
        this._panInfo.vy = decelerate(this._panInfo.vy, this._options.deceleration, this._options.snap);

        function decelerate(velocity: number, deceleration: number, snap: number): number {
            const newVelocity = velocity * deceleration;

            return Math.abs(newVelocity) <= snap ? 0 : newVelocity;
        }
    }
}


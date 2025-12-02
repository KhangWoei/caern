import { Camera, Vector3 } from "three";

export type PanOptions = {
    maxSpeed: number
    acceleration: number,
    deceleration: number,
    snap: number
}

export class Pan {
    private readonly _options: PanOptions;

    private _horizontalVelocity: number;
    private _verticalVelocity: number;

    constructor(options: PanOptions) {
        this._options = options;

        this._horizontalVelocity = 0;
        this._verticalVelocity = 0;
    }

    public update(camera: Camera): void {
        const forward = new Vector3();
        camera.getWorldDirection(forward);
        forward.normalize();

        const horizontal = new Vector3();
        horizontal.crossVectors(forward, new Vector3(0, 1, 0));
        camera.position.add(horizontal.multiplyScalar(this._horizontalVelocity));
        this._horizontalVelocity = decelerate(this._horizontalVelocity, this._options.deceleration, this._options.snap);

        const vertical = new Vector3();
        vertical.crossVectors(forward, new Vector3(-1, 0, 0));
        camera.position.add(vertical.multiplyScalar(this._verticalVelocity));
        this._verticalVelocity = decelerate(this._verticalVelocity, this._options.deceleration, this._options.snap);

        function decelerate(velocity: number, deceleration: number, snap: number): number {
            const newVelocity = velocity * deceleration;

            return Math.abs(newVelocity) <= snap ? 0 : newVelocity;
        }
    }

    public pan(horizontal: number, vertical: number): void {
        this._horizontalVelocity += horizontal * this._options.acceleration;
        this._horizontalVelocity = clamp(this._horizontalVelocity, this._options.maxSpeed);

        this._verticalVelocity += vertical * this._options.acceleration;
        this._verticalVelocity = clamp(this._verticalVelocity, this._options.maxSpeed);

        function clamp(velocity: number, max: number): number {
            return Math.max(-max, Math.min(max, velocity));
        }
    }
}

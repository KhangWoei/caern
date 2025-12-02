import { Camera, Vector3 } from "three";

export type ZoomOptions = {
    scale: number,
    min: number,
    max: number,
    snap: number
}

export class Zoom {
    private _options: ZoomOptions;

    private _current: number;
    private _target: number;

    constructor(init: number, options: ZoomOptions) {
        this._options = options;
        this._current = init;
        this._target = init;
    }

    public update(camera: Camera): void {
        if (Math.abs(this._target - this._current) <= this._options.snap) {
            this._current = this._target;
            return;
        }

        const forward = new Vector3();
        camera.getWorldDirection(forward);
        forward.normalize();

        const previous = this._current;
        this._current += (this._target - this._current) * this._options.scale;

        const delta = previous - this._current;
        camera.position.add(forward.multiplyScalar(delta));
    }

    public onZoom(zoom: number): void {
        const delta = zoom * this._options.scale;

        this._target = Math.max(this._options.min, Math.min(this._options.max, this._target + delta));
    }
}

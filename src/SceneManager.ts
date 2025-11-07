import * as THREE from "three";

export class SceneManager {
    private readonly _renderer: THREE.WebGLRenderer;
    private readonly _scene: THREE.Scene;
    private readonly _camera: THREE.Camera;

    constructor(canvas: HTMLCanvasElement) {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.set(0, 0, 20);
        this._renderer = new THREE.WebGLRenderer({ canvas })
    }

    public render(): void {


        const color: number = 0xFFFFFF;
        const intensity: number = 3;
        const light: THREE.Light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setAnimationLoop(() => this._animate());
        document.body.appendChild(this._renderer.domElement);
    }

    private _animate(...params: Array<() => void>): void {
        params.forEach(animation => {
            animation()
        });

        this._renderer.render(this._scene, this._camera);
    }
}


import * as THREE from "three";

export class SceneManager {
    private readonly _renderer: THREE.WebGLRenderer;
    private readonly _scene: THREE.Scene;
    private readonly _camera: THREE.Camera;

    constructor(canvas: HTMLCanvasElement) {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._renderer = new THREE.WebGLRenderer({ canvas })
    }

    public render(): void {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
        this._scene.add(cube);

        this._camera.position.z = 5;

        const color: number = 0xFFFFFF;
        const intensity: number = 3;
        const light: THREE.Light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setAnimationLoop(() => this._animate(animateCube));
        document.body.appendChild(this._renderer.domElement);

        function animateCube() {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

    }

    private _animate(...params: Array<() => void>): void {
        params.forEach(animation => {
            animation()
        });

        this._renderer.render(this._scene, this._camera);
    }
}


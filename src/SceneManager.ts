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
        const planeSize: number = 40;
        const loader: THREE.TextureLoader = new THREE.TextureLoader();
        const texture = loader.load("textures/concrete_floor/rough.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        this._scene.add(mesh);

        const color: number = 0xFFFFFF;
        const intensity: number = 5;
        const light: THREE.Light = new THREE.AmbientLight(color, intensity);
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


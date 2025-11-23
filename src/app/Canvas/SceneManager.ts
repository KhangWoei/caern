import * as THREE from "three";
import { EventBus } from "../EventBus";
import { SceneEvents } from "./SceneEvents";
import { CameraController } from "./Camera/CameraController";
import { CanvasInputController } from "./CanvasInputController";

export class SceneManager {
    private readonly _renderer: THREE.WebGLRenderer;
    private readonly _scene: THREE.Scene;
    private readonly _camera: THREE.Camera;
    private readonly _cameraControls: CameraController;
    private readonly _inputController: CanvasInputController;

    constructor(canvas: HTMLCanvasElement, eventBus: EventBus) {
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.set(0, 0, 50);
        this._renderer = new THREE.WebGLRenderer({ canvas })
        this._inputController = new CanvasInputController(canvas, eventBus);

        this._cameraControls = new CameraController(eventBus, this._camera);
        this.subscribe(eventBus);
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
    }

    private _animate(...params: Array<() => void>): void {
        this._inputController.update();
        this._cameraControls.update();
        params.forEach(animation => {
            animation()
        });

        this._renderer.render(this._scene, this._camera);
    }

    private subscribe(eventBus: EventBus): void {
        eventBus.subscribe(SceneEvents.Add, (...objects: THREE.Object3D[]) => { this._scene.add(...objects) });
        eventBus.subscribe(SceneEvents.Remove, (...objects: THREE.Object3D[]) => { this._scene.remove(...objects) });
    }

}


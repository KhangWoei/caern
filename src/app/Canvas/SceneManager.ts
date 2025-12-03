import { WebGLRenderer, Scene, Camera, DirectionalLight, TextureLoader, PerspectiveCamera, RepeatWrapping, Object3D, Mesh, DoubleSide, MeshPhongMaterial, PlaneGeometry, NearestFilter, SRGBColorSpace, AmbientLight } from "three";
import { EventBus } from "../EventBus";
import { SceneEvents } from "./SceneEvents";
import { CameraController } from "./Camera/CameraController";
import { Inputs } from "./Inputs";
import { Lighting } from "./Lights/Lighting";

export class SceneManager {
    private readonly _renderer: WebGLRenderer;
    private readonly _scene: Scene;
    private readonly _camera: Camera;
    private readonly _cameraControls: CameraController;
    private readonly _inputs: Inputs;
    private readonly _lights: Lighting;

    constructor(canvas: HTMLCanvasElement, eventBus: EventBus) {
        this._renderer = new WebGLRenderer({ canvas })
        this._scene = new Scene();

        this._camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._camera.position.set(0, 0, 50);
        this._cameraControls = new CameraController(eventBus, this._camera);

        this._inputs = new Inputs(canvas, eventBus);
        this._lights = new Lighting(new AmbientLight(), new DirectionalLight(), new DirectionalLight(), eventBus);
        this.subscribe(eventBus);
    }

    public render(): void {
        const planeSize = 40;
        const loader = new TextureLoader();
        const texture = loader.load("textures/concrete_floor/rough.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.magFilter = NearestFilter;
        texture.colorSpace = SRGBColorSpace;

        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new PlaneGeometry(planeSize, planeSize);
        const planeMat = new MeshPhongMaterial({
            map: texture,
            side: DoubleSide,
        });
        const mesh = new Mesh(planeGeo, planeMat);
        this._scene.add(mesh);

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setAnimationLoop(() => this._animate());
    }

    private _animate(...params: Array<() => void>): void {
        this._inputs.update();
        this._cameraControls.update();
        this._lights.update();
        params.forEach(animation => {
            animation()
        });

        this._renderer.render(this._scene, this._camera);
    }

    private subscribe(eventBus: EventBus): void {
        eventBus.subscribe(SceneEvents.Add, (...objects: Object3D[]) => { this._scene.add(...objects) });
        eventBus.subscribe(SceneEvents.Remove, (...objects: Object3D[]) => { this._scene.remove(...objects) });
    }

}


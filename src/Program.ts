import { SceneManager } from "./SceneManager";

export class Program {
    private _container: HTMLElement;
    private _sceneManager: SceneManager;

    constructor() {
        const container: HTMLElement | null = document.getElementById("root")!;
        this._container = container;

        const map: HTMLCanvasElement | null = this._container.querySelector("#map")!;
        this._sceneManager = new SceneManager(map);
    }

    public run(): void {
        this._sceneManager.render()
    }
}

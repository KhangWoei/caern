import { SceneManager } from "./SceneManager";
import { DebugUI } from "./DebugUI";

export class Program {
    private readonly _container: HTMLElement;
    private readonly _sceneManager: SceneManager;
    private readonly _debugUI?: DebugUI;

    constructor() {
        const container: HTMLElement | null = document.getElementById("root")!;
        this._container = container;

        const map: HTMLCanvasElement | null = this._container.querySelector("#map")!;
        this._sceneManager = new SceneManager(map);

        if (import.meta.env.DEV) {
            this._debugUI = new DebugUI(this._sceneManager);
        }
    }

    public run(): void {
        this._sceneManager.render();
    }
}

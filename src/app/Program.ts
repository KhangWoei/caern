import { SceneManager } from "./Canvas/SceneManager";
import { DebugUI } from "./DebugUI";
import { EventBus } from "./EventBus";

export class Program {
    private readonly _container: HTMLElement;
    private readonly _sceneManager: SceneManager;
    private readonly _debugUI?: DebugUI;

    constructor() {
        const container: HTMLElement | null = document.getElementById("root")!;
        this._container = container;

        const eventBus: EventBus = new EventBus();

        const map: HTMLCanvasElement | null = this._container.querySelector("#map")!;
        this._sceneManager = new SceneManager(map, eventBus);

        if (import.meta.env.DEV) {
            this._debugUI = new DebugUI(eventBus);
        }
    }

    public run(): void {
        this._sceneManager.render();
    }
}

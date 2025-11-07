import * as THREE from 'three';
import { SceneManager } from "./SceneManager";

export class DebugUI implements Disposable {
    private readonly _sceneManager: SceneManager;
    private readonly _axesHelper: THREE.AxesHelper;
    private readonly _gridHelper: THREE.GridHelper;

    constructor(sceneManager: SceneManager) {
        this._sceneManager = sceneManager;
        this._axesHelper = new THREE.AxesHelper(500);
        this._gridHelper = new THREE.GridHelper(50, 10);

        this._sceneManager.getScene().add(this._axesHelper);

        // Making a map viewer, feels more intuitive for the co-ordinates to be x,y bound rather than x,z bound.
        this._gridHelper.rotation.x = Math.PI * 0.5;
        this._sceneManager.getScene().add(this._gridHelper);
    }

    [Symbol.dispose](): void {
        this._sceneManager.getScene().remove(this._axesHelper);
        this._axesHelper.dispose();

        this._sceneManager.getScene().remove(this._gridHelper);
        this._gridHelper.dispose();
    }
}

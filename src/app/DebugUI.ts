import * as THREE from 'three';
import { EventBus } from './EventBus';
import { SceneEvents } from './Canvas/SceneEvents';

export class DebugUI implements Disposable {
    private readonly _eventBus: EventBus;

    private readonly _axesHelper: THREE.AxesHelper;
    private readonly _gridHelper: THREE.GridHelper;

    constructor(eventBus: EventBus) {
        this._axesHelper = new THREE.AxesHelper(500);

        // Making a map viewer, feels more intuitive for the co-ordinates to be x,y bound rather than x,z bound.
        this._gridHelper = new THREE.GridHelper(50, 10);
        this._gridHelper.rotation.x = Math.PI * 0.5;

        this._eventBus = eventBus;

        this._eventBus.publish(SceneEvents.Add, this._gridHelper, this._axesHelper);
    }

    [Symbol.dispose](): void {
        this._eventBus.publish(SceneEvents.Remove, this._gridHelper, this._axesHelper);
    }
}

import { Object3D } from "three";
import { SceneEvents } from "./Canvas/SceneEvents"
import { CameraEvents } from "./Canvas/Camera/CameraEvents";

type Events = SceneEvents | CameraEvents;

/*
 * Need to do K in Events to assure the compiler that all enum values are addressed.
 */
type EventCallbackMap = {
    [K in Events]: K extends SceneEvents.Add ? (...object: Object3D[]) => void
    : K extends SceneEvents.Remove ? (...object: Object3D[]) => void
    : K extends CameraEvents.Rotate ? () => void
    : K extends CameraEvents.Zoom ? (deltaZ: number) => void
    : K extends CameraEvents.EdgePan ? () => void
    : never;
}

export class EventBus {
    private readonly _eventMap: Map<Events, Set<(...args: any[]) => void>>;

    constructor() {
        this._eventMap = new Map<Events, Set<(...args: any[]) => void>>();
    }

    public subscribe<E extends Events>(event: E, callback: EventCallbackMap[E]): void {
        let callbacks: Set<EventCallbackMap[E]> | undefined = this._eventMap.get(event);

        if (callbacks === undefined) {
            callbacks = new Set<EventCallbackMap[E]>();
            this._eventMap.set(event, callbacks);
        }

        callbacks.add(callback);
    }

    public unsubscribe<E extends Events>(event: E, callback: EventCallbackMap[E]): void {
        const callbacks: Set<EventCallbackMap[E]> | undefined = this._eventMap.get(event);

        if (callbacks === undefined) {
            return;
        }

        callbacks.delete(callback);

        if (callbacks.size === 0) {
            this._eventMap.delete(event);
        }
    }

    public publish<E extends Events>(event: E, ...args: Parameters<EventCallbackMap[E]>): void {
        const callbacks: Set<EventCallbackMap[E]> | undefined = this._eventMap.get(event);

        if (!!callbacks) {
            callbacks.forEach(callback => {
                callback(...args);
            });
        }
    }
}

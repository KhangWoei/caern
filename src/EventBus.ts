import { Object3D } from "three";
import { SceneEvents } from "./Scenes/SceneEvents"

type Events = SceneEvents;

type EventCallbackMap = {
    [SceneEvents.Add]: (...object: Object3D[]) => void;
    [SceneEvents.Remove]: (...object: Object3D[]) => void;
}

export class EventBus {
    private readonly _eventMap: Map<Events, Set<(...args: any[]) => void>>;

    constructor() {
        this._eventMap = new Map<Events, Set<(...args: any[]) => void>>();
    }

    public subscribe<E extends Events>(event: E, callback: EventCallbackMap[E]): void {
        let callbacks: Set<EventCallbackMap[E]> | undefined = this._eventMap.get(event);

        if (callbacks === undefined) {
            callbacks = new Set<() => void>();
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

        if (callbacks.size == 0) {
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

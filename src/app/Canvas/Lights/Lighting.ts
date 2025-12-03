import { AmbientLight, DirectionalLight, Vector3 } from "three";
import { LightingEvents } from "./LightingEvents";
import { EventBus } from "../../EventBus";
import { SceneEvents } from "../SceneEvents";

export class Lighting {
    private readonly _sun: DirectionalLight;
    private readonly _moon: DirectionalLight;
    private readonly _ambient: AmbientLight;

    constructor(ambience: AmbientLight, sun: DirectionalLight, moon: DirectionalLight, eventBus: EventBus) {
        this._ambient = ambience;
        this._sun = sun;
        this._moon = moon;

        this.subscribe(eventBus);
        eventBus.publish(SceneEvents.Add, ambience, sun, moon);
    }

    public update(): void {
    }

    private subscribe(eventBus: EventBus) {
        eventBus.subscribe(LightingEvents.UpdateTime, (time: number) => { this.updateCelestialPositions(time) });
    }

    private updateCelestialPositions(time: number): void {
    }
}

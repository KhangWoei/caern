import { AmbientLight, Color, DirectionalLight, Vector3 } from "three";
import { LightingEvents } from "./LightingEvents";
import { EventBus } from "../../EventBus";
import { SceneEvents } from "../SceneEvents";

// TODO: there's got to be a better way to create a testable lighting manager
export class Lighting {
    private readonly _sun: DirectionalLight;
    private readonly _moon: DirectionalLight;
    private readonly _ambient: AmbientLight;

    constructor(ambience: AmbientLight, sun: DirectionalLight, moon: DirectionalLight, eventBus: EventBus) {
        this._ambient = ambience;
        this._ambient.color = new Color("dimgrey");
        this._ambient.intensity = 5;

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

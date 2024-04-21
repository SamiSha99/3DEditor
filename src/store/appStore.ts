import { makeObservable, observable, action } from "mobx";
import { ReactNode } from "react";
import { Object3D, Scene } from "three";
import * as TYPE from "./type";
import { EditorObject } from "../editor/Source/EditorObject";
import { Pane } from "tweakpane";

export class AppStore {

    static _instance: AppStore;

    // All objects in the scene including their react node renderer
    @observable objects: Array<EditorObject> = []

    // Object3D ID
    @observable controlsTarget: number | number[] | -1
    
    @observable scene : Scene = new Scene();
    // Currently selected Objects
    @observable controlsObject3D: Object3D | Object3D[] | null
    @observable pane: Pane | null = null;

    @observable controlsMode: TYPE.TransformModes = TYPE.transformModes[0];
    @observable controlsSpace: TYPE.TransformSpaces = TYPE.transformSpaces[0];
    @observable environment: TYPE.Environments = TYPE.environments[0];

    constructor(){
        makeObservable(this)
        AppStore._instance = this;
        this.controlsTarget = -1
        this.controlsObject3D = null;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    @action.bound setControlsTarget = (object: Object3D) => {
        
        // Selects the highest in the hierachy regardless of which one clicked for now
        // to-do add ungrouped selection?
        // while(object.parent && !(object.parent instanceof Scene)) {
            // object = object.parent;
        // }
        console.log(object);
        this.controlsObject3D = object;
        this.controlsTarget = object.id
        console.log(this.controlsTarget);
        (document.getElementById("requestUpdateEditor") as HTMLButtonElement).click();
    }

    // 0 = translate | 1 = rotate | 2 = scale
    @action.bound setControlsMode = (mode: number) => {this.controlsMode = TYPE.transformModes[mode] as TYPE.TransformModes}
    @action.bound setControlsModeByName = (mode: string) => {this.controlsMode = mode as TYPE.TransformModes}
    // 0 = world | 1 = local
    @action.bound setControlSpace = (mode: number) => {this.controlsSpace = TYPE.transformSpaces[mode] as TYPE.TransformSpaces}
    @action.bound setControlSpaceByName = (mode: string) => {this.controlsSpace = mode as TYPE.TransformSpaces}
    // all default environment types
    @action.bound setEnvironment = (index: number) => {this.environment = TYPE.environments[index]}
    @action.bound setEnvironmentByName = (environment: string) => {this.environment = environment as TYPE.Environments}
    // When a new component is made, push it to the scene
    @action.bound pushComponentToScene = (object: EditorObject) => {this.objects.push(object)}
}
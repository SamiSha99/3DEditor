import { makeObservable, observable, action } from "mobx";
import { Object3D, Scene } from "three";
import * as TYPE from "./type";
import { Pane } from "tweakpane";
import { buildPane, disposePane } from "../editor/Source/PaneBuilder";

export class AppStore {

    static _instance: AppStore;

    @observable intersectedObjects: Object3D[] | null = null;
    // Object3D ID
    @observable controlsTarget: number | number[] = -1;
    
    @observable sceneObjects : Object3D[] | null = [] as Object3D[];
    @observable scene : Scene = new Scene();
    // Currently selected Objects
    @observable controlsObject3D: Object3D | Object3D[] | null = null;
    @observable paneObject: Pane | null = null; // right side
    @observable paneHierarchy: Pane | null = null; // left side 

    @observable controlsMode: TYPE.TransformModes = TYPE.transformModes[0];
    @observable controlsSpace: TYPE.TransformSpaces = TYPE.transformSpaces[0];
    @observable environment: TYPE.Environments = TYPE.environments[0];

    @observable useRootSelection: boolean = true;
    constructor(){
        makeObservable(this)
        AppStore._instance = this;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    @action.bound setIntersectedTargets = (result: Object3D[] | null) => {
        this.intersectedObjects = result;
    }

    @action.bound setControlsTarget = (object: Object3D | null) => {
        
        // Selects the highest in the hierachy regardless of which one clicked for now
        while(object && this.useRootSelection && object.parent && !(object.parent instanceof Scene)) {
            object = object.parent;
        }
        console.log(object);

        this.controlsObject3D = object;
        if(object)
            this.controlsTarget = object.id
        else
            this.controlsTarget = -1;
        console.log(this.controlsTarget);
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
    @action.bound pushComponentToScene = (object: Object3D) => {
        this.sceneObjects?.push(object);
    }

    @action.bound setScene(objects: Object3D[] = []) {
        this.setControlsTarget(null);
        this.disposePaneObject();
        this.sceneObjects = objects;
    }

    @action.bound buildPaneObject(object: Object3D) {
        if(this.paneObject) {
            disposePane(this.paneObject);
            this.paneObject = null;
        }
        if(!this.paneObject) 
            this.paneObject = new Pane({title:"Object Settings"});
        
        this.paneObject = buildPane(this.paneObject, object);
    }
    
    @action.bound setRootSelection(b: boolean) {
        this.useRootSelection = b;
    }

    @action.bound disposePaneObject() {
        disposePane(this.paneObject);
    }
}
import { makeObservable, observable, action } from "mobx";
import { Object3D, Scene } from "three";
import * as TYPE from "./type";

export class AppStore {

    static _instance: AppStore;

    @observable intersectedObjects: Object3D[] | null = null;
    // Object3D ID
    @observable controlsTarget: number | number[] = -1;
    // All instatiated Objects in the scene
    @observable scene: Scene = new Scene();
    @observable sceneObjects: Object3D[] = [] as Object3D[];
    // These need to be a child of the scene!
    @observable sceneHelpers: Object3D[] = [] as Object3D[];
    // Last update request time in milliseconds
    @observable onUpdateInspector = new Date().getUTCMilliseconds();
    // Currently selected Objects
    @observable controlsObject3D: Object3D | Object3D[] | null = null;

    @observable controlsMode: TYPE.TransformModes = TYPE.transformModes[0];
    @observable controlsSpace: TYPE.TransformSpaces = TYPE.transformSpaces[0];
    @observable environment: TYPE.Environments = TYPE.environments[0];

    @observable useRootSelection: boolean = false;
    constructor() {
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
        while (object && this.useRootSelection && object.parent && !(object.parent instanceof Scene)) {
            object = object.parent;
        }
        console.log(object);

        this.controlsObject3D = object;
        if (object)
            this.controlsTarget = object.id
        else
            this.controlsTarget = -1;
        console.log(this.controlsTarget);
    }

    // 0 = translate | 1 = rotate | 2 = scale
    @action.bound setControlsMode = (mode: number) => { this.controlsMode = TYPE.transformModes[mode] }
    @action.bound setControlsModeByName = (mode: TYPE.TransformModes) => { this.controlsMode = mode }
    // 0 = world | 1 = local
    @action.bound setControlSpace = (mode: number) => { this.controlsSpace = TYPE.transformSpaces[mode] }
    @action.bound setControlSpaceByName = (mode: TYPE.TransformSpaces) => { this.controlsSpace = mode }
    // all default environment types
    @action.bound setEnvironment = (index: number) => { this.environment = TYPE.environments[index] }
    @action.bound setEnvironmentByName = (environment: TYPE.Environments) => { this.environment = environment }

    // this is NOT ok
    @action.bound badForceUpdateInspector = () => { this.onUpdateInspector = new Date().getUTCMilliseconds(); }

    @action.bound setScene(objects: Object3D[] = []) {
        this.setControlsTarget(null);
        this.sceneObjects = objects;
    }

    // When a new component is made, push it to the scene
    @action.bound addObject = (object: Object3D) => {
        this.sceneObjects.push(object);
    }

    @action.bound removeObject = (object: Object3D) => {
        this.setControlsTarget(null);
        const indx = this.sceneObjects.findIndex(obj => obj.uuid == object.uuid);
        if (indx != -1) {
            this.sceneObjects.splice(indx, 1);
            console.log(this.sceneObjects);
            // object.traverse(o => {
            // if (o instanceof Mesh) {
            // (o.geometry as BufferGeometry).dispose();
            // }
            // });
        }
    }

    @action.bound spliceObject = (index: number, deleteCount: number = 1, items?: Object3D | null) => {
        console.log(index, deleteCount);
        if (index == -1) return;
        if (items)
            this.sceneObjects.splice(index, deleteCount, items);
        else
            this.sceneObjects.splice(index, deleteCount);
        console.log(this.sceneObjects);

    }

    @action.bound setRootSelection(b: boolean) {
        this.useRootSelection = b;
    }
}
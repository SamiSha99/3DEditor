import { makeObservable, observable, action } from "mobx";
import { Object3D, Scene, Color } from "three";
import * as TYPE from "./type";
import { Box } from "@orb_tools/create/Primitive";

export class AppStore {

    static _instance: AppStore;

    // Object3D ID
    @observable controlsTarget: number | number[] = -1;
    /** All instatiated Objects in the scene */
    @observable scene: Scene = new Scene();
    /** All objects that can be modified */
    @observable sceneObjects: Object3D[] = [];
    /**
    * These need to be in the root of the scene else they will cause a lot of bugs
    * When intersected their userData returns the reference for the object from sceneObjects
    */
    @observable sceneHelpers: Object3D[] = [];
    // Last update request time in milliseconds
    @observable onUpdateInspector = new Date().getUTCMilliseconds();
    // Currently selected Objects
    @observable controlsObject3D: Object3D | null = null;

    @observable controlsMode: TYPE.TransformModes = TYPE.transformModes[0];
    @observable controlsSpace: TYPE.TransformSpaces = TYPE.transformSpaces[0];
    @observable environment: TYPE.Environments = TYPE.environments[1]; //TYPE.environments[0];
    @observable background: Color | null = null;

    @observable useRootSelection: boolean = false;

    @observable isOriginPointMode: boolean = false;
    @observable isTransforming: boolean = false;

    constructor() {
        makeObservable(this)
        AppStore._instance = this;
        this.addObject(Box())
        this.setControlsTarget(this.sceneObjects[0])
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    @action.bound setControlsTarget = (object: Object3D | null) => {

        if (this.controlsObject3D == object) return;
        // Selects the highest in the hierachy regardless of which one clicked for now
        while (this.useRootSelection && object?.parent && !(object.parent instanceof Scene)) {
            object = object.parent;
        }
        this.controlsObject3D = object;
        console.log(this.controlsObject3D);
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
    // all default environment types from drei
    @action.bound setEnvironment = (index: number) => { this.environment = TYPE.environments[index] }
    @action.bound setEnvironmentByName = (environment: TYPE.Environments) => { this.environment = environment }

    @action.bound setbackground = (value: Color | null, enabled?: boolean) => { this.background = enabled ? value : null } //[value, enabled !== undefined ? enabled : this.background[1]]}

    @action.bound setIsTransforming = (b?: boolean) => { this.isTransforming = b != undefined ? b : !this.isTransforming }
    @action.bound setIsOriginPointMode = (b?: boolean) => { this.isOriginPointMode = b != undefined ? b : !this.isOriginPointMode }

    // this is NOT ok!!!
    @action.bound badForceUpdateInspector = () => { this.onUpdateInspector = new Date().getUTCMilliseconds(); }

    @action.bound setScene(objects: Object3D[] = [], helpers: Object3D[] = []) {
        this.setControlsTarget(null);
        this.sceneObjects = objects;
        this.sceneHelpers = helpers;
    }

    // When a new component is made, push it to the scene
    @action.bound addObject = (object: Object3D) => {
        this.sceneObjects.push(object);
    }

    @action.bound addHelper = (helper: Object3D) => {
        this.sceneHelpers.push(helper);
    }

    @action.bound removeObject = (object: Object3D) => {
        this.setControlsTarget(null);
        const indx = this.sceneObjects.findIndex(obj => obj.uuid == object.uuid);
        if (indx != -1) {
            if ("helper" in object.userData) {
                const helper = object.userData.helper as Object3D;
                const helperIndx = this.sceneHelpers.findIndex(hlp => hlp.uuid == helper.uuid);
                this.sceneHelpers.splice(helperIndx, 1);
            }
            this.sceneObjects.splice(indx, 1);
            console.log(this.sceneObjects);
        }
        else {
            object.removeFromParent();
        }

        // Cleanup helpers
        if ("helper" in object.userData) {
            const helper = object.userData.helper as Object3D;
            const helperIndx = this.sceneHelpers.findIndex(hlp => hlp.uuid == helper.uuid);
            this.sceneHelpers.splice(helperIndx, 1);
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
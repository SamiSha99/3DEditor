import { makeObservable, observable, action } from "mobx";
import { Object3D, Scene, Color, Texture, Fog } from "three";
import * as TYPE from "./type";
import { Box } from "@orb_tools/create/Primitive";
import { ActivePanelType, isPanelActive } from "@orb_UI/panels/Panels";

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

    static readonly DEFAULT_SCENE_BACKGROUND_COLOR = new Color(0x001029);

    @observable useRootSelection: boolean = false;

    @observable isTransforming: boolean = false;

    @observable activePanels: ActivePanelType[] = []

    constructor() {
        makeObservable(this)
        AppStore._instance = this;
        this.setControlsTarget(this.addObject(Box()))
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

    @action.bound setEnvironment = (value: Texture | null) => this.scene.environment = value;
    @action.bound setBackground = (value: Color | Texture | null) => this.scene.background = value;
    @action.bound setFog = (value: Fog | null) => this.scene.fog = value;

    @action.bound setIsTransforming = (b?: boolean) => { this.isTransforming = b != undefined ? b : !this.isTransforming }

    @action.bound addActivePanel = (value: ActivePanelType) => {
        if (this.activePanels.find(x => x.id == value.id))
            console.warn("Panel is already active, ignoring... ID:", value.id)
        else {
            const obj = Object.assign({}, value);
            if (!obj.flags) obj.flags = [];
            this.activePanels.push(obj);
        }
    }

    @action.bound addPanelFlag = (flag: string, to: ActivePanelType) => {
        const panel = isPanelActive(to);
        if (!panel) {
            console.warn("Panel", to.id, "is not active!");
            return;
        }
        if (panel.flags && !panel.flags.includes(flag)) {
            panel.flags.push(flag);
            console.log("added", flag, "to", panel.flags);
        }
    }

    @action.bound removePanelFlag = (flag: string, from: ActivePanelType) => {
        const panel = isPanelActive(from);
        if (!panel) {
            console.warn("Panel", from.id, "is not active!");
            return;
        }
        if (panel.flags && panel.flags.includes(flag)) {
            panel.flags.splice(panel.flags.indexOf(flag), 1);
            console.log("removed", flag, "from", panel.flags);
        }
    }

    @action.bound removeActivePanel = (id: string) => {
        const index = this.activePanels.findIndex(x => x.id == id);
        if (index == -1)
            console.warn("No panel found for", id, "index returned -1")
        else
            this.activePanels.splice(index, 1);
    }

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
        return object;
    }

    @action.bound addHelper = (helper: Object3D) => {
        this.sceneHelpers.push(helper);
        return helper;
    }

    @action.bound removeObject = (object: Object3D) => {
        this.setControlsTarget(null);
        const indx = this.sceneObjects.findIndex(obj => obj.uuid == object.uuid);
        if (indx != -1) {
            if (object.userData.helper) {
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
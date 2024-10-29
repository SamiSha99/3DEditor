import * as THREE from 'three'
import { makeObservable, observable, action } from "mobx";
import { ActivePanelType, isPanelActive } from "@orb_UI/panels/Panels";
import { Viewport } from "./Viewport";
import { createContext, useContext } from "react";

export const EditorContext = createContext<Editor>({} as any)
export const useEditor = () => useContext(EditorContext);

export class Editor {

    static _instance: Editor;

    gl?: THREE.WebGLRenderer;
    clock = new THREE.Clock();

    /** All instatiated Objects in the scene */
    @observable scene: THREE.Scene = new THREE.Scene();
    /** All objects that can be modified */
    @observable sceneObjects: THREE.Object3D[] = [];
    /**
     * These need to be in the root of the scene else they will cause a lot of bugs
     * When intersected their userData returns the reference for the object from sceneObjects
    */
    @observable sceneHelpers: THREE.Object3D[] = [];

    // Currently selected Objects
    @observable controlsTarget: THREE.Object3D | null = null;

    static readonly DEFAULT_SCENE_BACKGROUND_COLOR = new THREE.Color(0x001029);

    @observable useRootSelection: boolean = false;

    @observable activePanels: ActivePanelType[] = []

    @observable viewport = new Viewport(this);

    constructor() {
        makeObservable(this)
        Editor._instance = this;
        window.onkeydown = (e) => {
            if (e.key == "m")
                (this.controlsTarget as THREE.Mesh).geometry.scale(0.5, 1, 1);
            if (e.key == "n")
                (this.controlsTarget as THREE.Mesh).geometry.scale(2, 1, 1);
        }
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    update = () => {
        const delta = this.clock.getDelta();
        this.viewport.update(delta);
    }

    @action setTarget = (object: THREE.Object3D | null) => {

        if (this.controlsTarget == object) return;
        // Selects the highest in the hierachy regardless of which one clicked for now
        while (this.useRootSelection && object?.parent && !(object.parent instanceof THREE.Scene)) {
            object = object.parent;
        }
        this.controlsTarget = object;
        if (object) {

            this.viewport.controls.attach(object);
            if (this.viewport.controls.domElement)
                this.viewport.controls.connect();
        }
        else {
            this.viewport.controls.detach();
            if (this.viewport.controls.domElement)
                this.viewport.controls.disconnect();
        }

    }

    @action setEnvironment = (value: THREE.Texture | null) => this.scene.environment = value;
    @action setBackground = (value: THREE.Color | THREE.Texture | null) => this.scene.background = value;
    @action setFog = (value: THREE.Fog | THREE.FogExp2 | null) => this.scene.fog = value;

    @action addActivePanel = (value: ActivePanelType) => {
        if (this.activePanels.find(x => x.id == value.id))
            console.warn("Panel is already active, ignoring... ID:", value.id)
        else {
            const obj = Object.assign({}, value);
            if (!obj.flags) obj.flags = [];
            this.activePanels.push(obj);
        }
    }

    @action addPanelFlag = (flag: string, to: ActivePanelType) => {
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

    @action removePanelFlag = (flag: string, from: ActivePanelType) => {
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

    @action removeActivePanel = (id: string) => {
        const index = this.activePanels.findIndex(x => x.id == id);
        if (index == -1)
            console.warn("No panel found for", id, "index returned -1")
        else
            this.activePanels.splice(index, 1);
    }

    // to-do this needs to reinitialize the entirety of viewport again, probably.
    @action setScene(objects: THREE.Object3D[] = [], helpers: THREE.Object3D[] = []) {
        document.location.reload();
        return;
        this.setTarget(null);
        this.sceneObjects = objects;
        this.sceneHelpers = helpers;
    }

    /** Adds object to the scene, returns the added object */
    @action addObject = (object: THREE.Object3D) => {
        this.sceneObjects.push(object);
        return object;
    }

    /** Adds helper to the scene, returns the added helper */
    @action addHelper = (helper: THREE.Object3D) => {
        this.sceneHelpers.push(helper);
        return helper;
    }

    // this is broken when it comes to helpers, fix!
    /** Removes object from the scene, returns the removed object */
    @action removeObject = (object: THREE.Object3D) => {
        this.setTarget(null);
        const indx = this.sceneObjects.findIndex(obj => obj.uuid == object.uuid);
        if (indx != -1) {
            if (object.userData.helper) {
                const helper = object.userData.helper as THREE.Object3D;
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
            const helper = object.userData.helper as THREE.Object3D;
            const helperIndx = this.sceneHelpers.findIndex(hlp => hlp.uuid == helper.uuid);
            this.sceneHelpers.splice(helperIndx, 1);
        }
    }

    @action setRootSelection = (b: boolean) => {
        this.useRootSelection = b;
    }

    @action setGL = (gl: THREE.WebGLRenderer) => {
        this.gl = gl;
        gl.setAnimationLoop(this.update);
    }
}
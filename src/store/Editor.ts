import * as THREE from 'three'
import { makeObservable, observable, action } from "mobx";
import { Panel } from "@orb_UI/panels/Panels";
import { Viewport } from "./Viewport";
import { createContext, useContext } from "react";
import { IModelFileResponse } from './Interfaces';
import { DEBUG_STORAGE_MODALS_TEST } from './Data';

export const EditorContext = createContext<Editor>({} as any)
export const useEditor = () => useContext(EditorContext);

export class Editor {

    static _instance: Editor;

    /** This is passed from Fiber through onCanvasLoaded */
    gl!: THREE.WebGLRenderer;
    canvas!: HTMLCanvasElement;
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

    @observable useRootSelection: boolean = false;

    @observable activePanels: Panel[] = []

    @observable flags: string[] = [];

    /** Metadata of models from the storage. */
    @observable storageModels: IModelFileResponse[] = DEBUG_STORAGE_MODALS_TEST;

    /** Handles all related controls in the Canvas scene. */
    @observable viewport = new Viewport(this);

    constructor() {
        makeObservable(this)
        Editor._instance = this;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    @action setEnvironment = (value: THREE.Texture | null) => this.scene.environment = value;
    @action setBackground = (value: THREE.Color | THREE.Texture | null) => this.scene.background = value;
    @action setFog = (value: THREE.Fog | THREE.FogExp2 | null) => this.scene.fog = value;

    @action activatePanel = (value: Panel) => {
        if (this.activePanels.find(x => x.id == value.id))
            console.warn("Panel is already active, ignoring... ID:", value.id)
        else {
            const obj = Object.assign({}, value);
            if (!obj.flags) obj.flags = [];
            this.activePanels.push(obj);
        }
    }

    @action flag = (flag: string | string[], remove: boolean) => {
        remove ? this.removeFlag(flag) : this.addFlag(flag);
    }

    @action addFlag = (flag: string | string[]) => {
        if (!Array.isArray(flag)) flag = [flag];
        this.flags.push(...flag.filter(f => !this.flags.includes(f)));
        this.onAddFlag(flag);
    }

    @action removeFlag = (flag: string | string[]) => {
        if (!Array.isArray(flag)) flag = [flag];
        this.flags = this.flags.filter(f => !flag.includes(f));
        this.onRemoveFlag(flag);
    }

    @action hasFlag = (flag: string) => { return this.flags.includes(flag) }

    @action removeActivePanel = (id: string) => {
        const index = this.activePanels.findIndex(x => x.id == id);
        if (index == -1)
            console.warn("No panel found for", id, "index returned -1")
        else
            this.activePanels.splice(index, 1);
    }

    // to-do this needs to reinitialize the entirety of viewport again, probably.
    @action setScene = (objects: THREE.Object3D[] = [], helpers: THREE.Object3D[] = []) => {
        this.viewport.setTarget(null);
        this.sceneObjects = objects;
        this.sceneHelpers = helpers;
    }

    /** Adds object to the scene, returns the added object */
    @action addObject = (object: THREE.Object3D, select: boolean = false) => {
        this.sceneObjects.push(object);
        select && this.viewport.setTarget(object);
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
        this.viewport.setTarget(null);
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

    onLoad = (canvas: HTMLCanvasElement, gl: THREE.WebGLRenderer) => {
        this.canvas = canvas;
        this.gl = gl;
        gl.setAnimationLoop(this.update);
        this.viewport.onLoad(this.canvas, this.gl);
    }

    update = (delta = this.clock.getDelta()) => {
        this.viewport.update(delta);
        this.sceneHelpers.map((helper) => {
            if (helper.name == "debug_indexing") {
                helper.traverse((o) => {
                    if (!(o instanceof THREE.Group)) {
                        o.lookAt(this.viewport.camera.position);
                    }

                });
            }
            if (helper instanceof THREE.SpotLightHelper)
                helper.update();
        })
    }

    onAddFlag = (flag: string[]) => {
        this.viewport.onAddFlag(flag);
    }

    onRemoveFlag = (flag: string[]) => {
        this.viewport.onRemoveFlag(flag);
    }
}
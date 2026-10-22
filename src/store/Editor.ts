import * as THREE from 'three'
import { makeObservable, observable, action } from "mobx";
import { Panel } from "@orb_UI/panels/Main";
import { Viewport } from "./Viewport";
import { createContext, useContext } from "react";
import { IModelFileResponse, UpdatableObject3D } from './Interfaces';

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
    @observable sceneObjects = observable.array<THREE.Object3D>();
    /**
     * These need to be in the root of the scene else they will cause a lot of bugs
     * When intersected their userData returns the reference for the object from sceneObjects
    */
    @observable sceneHelpers = observable.array<THREE.Object3D>();

    @observable useRootSelection: boolean = false;

    @observable activePanels = observable.array<Panel>()

    @observable flags = observable.array<string>();

    /** Metadata of models from the storage. */
    @observable storageModels = observable.array<IModelFileResponse>();

    /** Handles all related controls in the Canvas scene. */
    @observable viewport = new Viewport(this);

    constructor() {
        makeObservable(this)
        Editor._instance = this;
        // Init starter scene
        (async () => {
            const { Box } = await import("@orb_tools/create/Primitive");
            const { loadEnvironmentSample } = await import("@orb_utils/Samples.ts");
            const DEBUGGING = false;
            const b = Box();
            const box = this.addObject(b);
            loadEnvironmentSample('forest').then((o) => o && this.setEnvironment(o.data));
            this.viewport.setTarget(box);
            if (DEBUGGING) {
                const { geometryPositionToText } = await import("@orb_utils/three/Geometry");
                const group = geometryPositionToText(b.geometry, 2)
                group && this.addHelper(group);
            }
        })();
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    @action setEnvironment = (value: THREE.Texture | null) => this.scene.environment = value;
    @action setBackground = (value: THREE.Color | THREE.Texture | null) => this.scene.background = value;
    @action setFog = (value: THREE.Fog | THREE.FogExp2 | null) => this.scene.fog = value;

    @action activatePanel = (value: Panel) => {
        if (this.activePanels.find(x => x.id == value.id))
            console.warn("Panel is already active, ignoring... ID:", value.id);
        else
            this.activePanels.push(value);
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
        flag.forEach(f => { this.flags.remove(f); });
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
        this.sceneObjects.replace(objects);
        this.sceneHelpers.replace(helpers);
    }

    /** Adds object to the scene, returns the added object */
    @action addObject = (object: THREE.Object3D, select: boolean = false) => {
        this.sceneObjects.push(object);
        select && this.viewport.setTarget(object);
        return object;
    }

    @action replaceObject = (oldObject: THREE.Object3D, newObject: THREE.Object3D, select: boolean = false) => {
        const oldParent = oldObject.parent;

        this.removeObject(oldObject);
        newObject.position.copy(oldObject.position);
        if (oldParent instanceof THREE.Scene) {
            this.addObject(newObject, select);
        }
        else {
            oldParent?.add(newObject);
            select && this.viewport.setTarget(newObject);
        }
    }

    /** Adds helper to the scene, returns the added helper */
    @action addHelper = (helper: THREE.Object3D) => {
        this.sceneHelpers.push(helper);
        return helper;
    }

    // this is broken when it comes to helpers, fix!
    /** Removes object from the scene, returns the removed object */
    @action removeObject = (object: THREE.Object3D) => {
        this.viewport.target == object && this.viewport.setTarget(null);
        // remove the helper first
        if (object.userData.helper) {
            const helper = object.userData.helper as THREE.Object3D;
            this.sceneHelpers.remove(helper);
        }
        // not inside sceneObjects? remove from parent probably
        if (!this.sceneObjects.remove(object)) {
            object.removeFromParent();
        }
        console.log(this.sceneObjects, this.sceneHelpers);
    }

    @action setRootSelection = (b: boolean) => {
        this.useRootSelection = b;
    }

    onLoad = (canvas: HTMLCanvasElement, gl: THREE.WebGLRenderer) => {
        this.canvas = canvas;
        this.gl = gl;
        this.gl.shadowMap.enabled = true;
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
            const updatable = (helper as UpdatableObject3D);
            updatable.update && updatable.update();
        })
    }

    onAddFlag = (flag: string[]) => {
        this.viewport.onAddFlag(flag);
    }

    onRemoveFlag = (flag: string[]) => {
        this.viewport.onRemoveFlag(flag);
    }
}
import * as THREE from 'three';
import * as TYPE from "./Type";
import { makeObservable, observable, action } from "mobx";
import { createContext, useContext } from 'react';
import { Editor } from '@orb_Editor';
import { TransformControls, TransformControlsGizmo } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/Addons';

export const ViewportContext = createContext<Viewport>({} as any)
export const useViewport = () => useContext(ViewportContext);

// This controls all related content that allows the user to interact with the scene
export class Viewport {

    // @ts-ignore
    private editor: Editor;
    static _instance: Viewport;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    orbitControls = new OrbitControls(this.camera);

    /** True when moving/rotating/scaling */
    @observable transforming: boolean = false;
    @observable transformControlsMode: TYPE.TransformModes = "translate";
    @observable transformControlsSpace: TYPE.TransformSpaces = "world";
    controls = new TransformControls(this.camera);

    grid = new THREE.Group().add(
        new THREE.GridHelper(100, 100, 0x2080ff, 0x2080ff),
        new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.0005, 0.5),
            new THREE.MeshBasicMaterial({ color: "red" })
        )
    )

    @observable gridEnabled: boolean = true;
    @observable fpsEnabled: boolean = false;

    constructor(editor: Editor) {
        makeObservable(this)
        Viewport._instance = this;
        this.editor = editor;
        this.camera.position.set(2.5, 1.5, 2.5);
        this.camera.lookAt(new THREE.Vector3());
        this.orbitControls.update();
        
        // disabling the plane pickers to not be overwhelming to users
        const controlsHelper = this.controls.getHelper().children[0] as TransformControlsGizmo;
        console.log(controlsHelper)
        const pickerTranslate = controlsHelper.picker.translate;
        const pickerLeftover = [] as THREE.Object3D[];
        pickerLeftover.push(pickerTranslate.children.find(c => c.name == "XY")!);
        pickerLeftover.push(pickerTranslate.children.find(c => c.name == "YZ")!);
        pickerLeftover.push(pickerTranslate.children.find(c => c.name == "XZ")!);
        pickerLeftover.push(pickerTranslate.children.find(c => c.name == "XYZ")!);
        pickerTranslate.remove(...pickerLeftover); 
        
        const gizmoTranslate = controlsHelper.gizmo.translate;
        const gizmoLeftover = [] as THREE.Object3D[];
        gizmoLeftover.push(gizmoTranslate.children.find(c => c.name == "XY")!);
        gizmoLeftover.push(gizmoTranslate.children.find(c => c.name == "YZ")!);
        gizmoLeftover.push(gizmoTranslate.children.find(c => c.name == "XZ")!);
        gizmoLeftover.push(gizmoTranslate.children.find(c => c.name == "XYZ")!);
        gizmoTranslate.remove(...gizmoLeftover); 

        console.log(pickerLeftover, gizmoLeftover)
        
        this.controls.addEventListener('dragging-changed', (e) => {
            this.orbitControls.enabled = !e.value;
            this.transforming = !!e.value;
        });
    }

    public static get Instance() { return this._instance; }

    // Called by Fiber when its loaded.
    onCanvasLoaded = (canvas: HTMLCanvasElement) => {
        this.orbitControls.domElement = canvas;
        this.orbitControls.connect();
        this.controls.domElement = canvas;
        this.controls.connect();
    }

    @action setTransforming = (b?: boolean) => { this.transforming = b != undefined ? b : !this.transforming }

    // 0 = translate | 1 = rotate | 2 = scale
    @action setTransformControlsMode = (mode: TYPE.Range<0, 3> | TYPE.TransformModes) => {
        this.transformControlsMode = typeof mode == "number" ? TYPE.transformModes[mode] : mode;
        this.controls.setMode(this.transformControlsMode);
    }
    // 0 = world | 1 = local
    @action setTransformControlsSpace = (mode: TYPE.Range<0, 2> | TYPE.TransformSpaces) => {
        this.transformControlsSpace = typeof mode == "number" ? TYPE.transformSpaces[mode] : mode;
        this.controls.setSpace(this.transformControlsSpace);
    }

    @action setGrid = (b: boolean) => { this.gridEnabled = b; }
    @action setFPS = (b: boolean) => { this.fpsEnabled = b; }
}
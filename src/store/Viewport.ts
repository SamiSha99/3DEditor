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
    cameraControls = new OrbitControls(this.camera);

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
    @observable viewHelperEnabled: boolean = true;

    constructor(editor: Editor) {
        makeObservable(this)
        Viewport._instance = this;
        this.editor = editor;
        this.camera.position.set(2.5, 1.5, 2.5);
        this.camera.lookAt(new THREE.Vector3());

        // Removing multi gizmo controls to avoid the controls being overwhelming, to-do: Make this a toggle option!
        const controlsHelper = this.controls.getHelper().children[0] as TransformControlsGizmo;
        const picker = controlsHelper.picker;
        const gizmo = controlsHelper.gizmo;

        // Translate
        picker.translate.remove(...picker.translate.children.filter(c => c.name == "XY" || c.name == "YZ" || c.name == "XZ" || c.name == "XYZ"));
        gizmo.translate.remove(...gizmo.translate.children.filter(c => c.name == "XY" || c.name == "YZ" || c.name == "XZ" || c.name == "XYZ"));

        // Rotate
        picker.rotate.remove(...picker.rotate.children.filter(c => c.name == "XYZE" || c.name == "E"));
        gizmo.rotate.remove(...gizmo.rotate.children.filter(c => c.name == "XYZE" || c.name == "E"));

        // Scale
        picker.scale.remove(...picker.scale.children.filter(c => c.name == "XY" || c.name == "YZ" || c.name == "XZ" || c.name == "XYZ"));
        gizmo.scale.remove(...gizmo.scale.children.filter(c => c.name == "XY" || c.name == "YZ" || c.name == "XZ" || c.name == "XYZ"));

        this.controls.addEventListener('dragging-changed', (e) => {
            this.cameraControls.enabled = !e.value;
            this.transforming = !!e.value;
        });


    }

    public static get Instance() { return this._instance; }

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
    @action setViewHelper = (b: boolean) => { this.viewHelperEnabled = b; }

    // Called by Fiber when its loaded.
    onCanvasLoaded = (canvas: HTMLCanvasElement) => {
        this.cameraControls.domElement = canvas;
        this.cameraControls.connect();

        this.cameraControls.enableDamping = true;
        this.cameraControls.dampingFactor = 0.1;
        this.cameraControls.zoomSpeed = 2;

        this.controls.domElement = canvas;
        this.controls.connect();
    }

    update = (_delta: number) => {
        this.cameraControls.update();
    }
}
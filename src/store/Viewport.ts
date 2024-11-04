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

    private cameraDragStart: boolean = false;

    constructor(editor: Editor) {
        makeObservable(this)
        Viewport._instance = this;
        this.editor = editor;
        this.camera.position.set(2.5, 1.5, 2.5);
        this.camera.lookAt(new THREE.Vector3());

        // Removing multi 3-gizmo controls to avoid the controls being overwhelming, to-do: Make this a toggle option!
        const controlsHelper = this.controls.getHelper().children[0] as TransformControlsGizmo;
        const picker = controlsHelper.picker;
        const gizmo = controlsHelper.gizmo;

        // Translate
        // Multi 3-gizmo can be confusing
        picker.translate.remove(...picker.translate.children.filter(c => c.name == "XYZ"));
        gizmo.translate.remove(...gizmo.translate.children.filter(c => c.name == "XYZ"));

        // Rotate
        picker.rotate.remove(...picker.rotate.children.filter(c => c.name == "XYZE" || c.name == "E"));
        gizmo.rotate.remove(...gizmo.rotate.children.filter(c => c.name == "XYZE" || c.name == "E"));
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

    /** Runs when left clicking on the Canvas */
    onSelectObject = (e: MouseEvent) => {
        // When adjusting objects with the controls or moving the camera in any way
        if (this.transforming) return;
        // Left Click only
        if (e.button != 0) return;
        console.log("selecting an object...")
        // Bounds are used to calculate an offseted AND/OR resized canvas that doesn't take the entire screen due to inspector.
        const bounds = this.editor.gl.domElement.getBoundingClientRect();
        const pointer = new THREE.Vector2(((e.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1, -((e.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, this.camera);
        const intersects = raycaster.intersectObjects([...this.editor.sceneObjects, ...this.editor.sceneHelpers], true);

        if (intersects.length <= 0) return;

        let hit = intersects[0].object;
        if (hit.userData.object as THREE.Object3D) hit = hit.userData.object;
        this.editor.setTarget(hit);
    }

    onLoad = (canvas: HTMLCanvasElement, _gl: THREE.WebGLRenderer) => {
        canvas.onpointerup = this.onSelectObject;
        this.cameraControls.domElement = canvas;
        this.cameraControls.connect();

        this.cameraControls.enableDamping = true;
        this.cameraControls.dampingFactor = 0.15;
        this.cameraControls.zoomSpeed = 2;

        this.controls.domElement = canvas;
        this.controls.connect();

        // Handles whether we should consider left click selection for tracing and selecting an object in the scene,
        // if transforming becomes true then we ignore onSelectObject
        this.controls.addEventListener('dragging-changed', (e) => { this.cameraControls.enabled = !e.value; this.transforming = !!e.value; });
        this.cameraControls.addEventListener('start', () => this.cameraDragStart = true);
        this.cameraControls.addEventListener('change', () => this.cameraDragStart && !this.transforming && (this.transforming = true));
        this.cameraControls.addEventListener('end', () => { this.transforming = false; this.cameraDragStart = false; });
    }

    update = (delta: number) => {
        this.cameraControls.update(delta);
    }
}
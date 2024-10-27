import * as THREE from 'three';
import * as TYPE from "./Type";
import { makeObservable, observable, action } from "mobx";
import { createContext, useContext } from 'react';
import { Editor } from '@orb_Editor';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/Addons';

export const ViewportContext = createContext<Viewport>({} as any)
export const useViewport = () => useContext(ViewportContext);

// This controls all related content that allows the user to interact with the scene
export class Viewport {

    // @ts-ignore
    private editor: Editor;
    static _instance: Viewport;

    /** True when moving/rotating/scaling */
    @observable transforming: boolean = false;

    @observable transformControlsMode: TYPE.TransformModes = TYPE.transformModes[0];
    @observable transformControlsSpace: TYPE.TransformSpaces = TYPE.transformSpaces[0];

    grid = new THREE.Group().add(
        new THREE.GridHelper(100, 100, 0x2080ff, 0x2080ff),
        new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.0005, 0.5),
            new THREE.MeshBasicMaterial({ color: "red" })
        )
    )

    camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 100);

    orbitControls = new OrbitControls(this.camera);

    controls = new TransformControls(this.camera);
    // transformControls = new TransformControls();    

    @observable gridEnabled: boolean = true;
    @observable fpsEnabled: boolean = false;

    constructor(editor: Editor) {
        makeObservable(this)
        Viewport._instance = this;
        this.editor = editor;
        setTimeout(() => {
            // this.controls.attach(this.editor.sceneObjects[0]);
            // const canvas = document.getElementById("main");
            // console.log(canvas)
            // this.controls.domElement = canvas;
            // this.editor.addObject(this.controls.getHelper());
            // this.controls.connect();
            // this.orbitControls.domElement = canvas;
            // this.orbitControls.connect();
            // this.editor.scene.add(this.camera);
            // console.log(this.controls.object);
        }, (1000));
    }

    public static get Instance() { return this._instance; }

    @action setTransforming = (b?: boolean) => { this.transforming = b != undefined ? b : !this.transforming }

    // 0 = translate | 1 = rotate | 2 = scale
    @action setTransformControlsMode = (mode: TYPE.Range<0, 3> | TYPE.TransformModes) => { typeof mode == "number" ? this.transformControlsMode = TYPE.transformModes[mode] : this.transformControlsMode = mode }
    // 0 = world | 1 = local
    @action setTransformControlsSpace = (mode: TYPE.Range<0, 2> | TYPE.TransformSpaces) => { typeof mode == "number" ? this.transformControlsSpace = TYPE.transformSpaces[mode] : this.transformControlsSpace = mode }

    @action setGrid = (b: boolean) => { this.gridEnabled = b; }

    @action setFPS = (b: boolean) => { this.fpsEnabled = b; }
}
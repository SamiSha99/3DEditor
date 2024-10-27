import * as THREE from 'three';
import * as TYPE from "./Type";
import { makeObservable, observable, action } from "mobx";
import { createContext, useContext } from 'react';

export const ViewportContext = createContext<Viewport>({} as any)
export const useViewport = () => useContext(ViewportContext);

// This controls all related content that allows the user to interact with the scene
export class Viewport {

    static _instance: Viewport;

    @observable transformControlsMode: TYPE.TransformModes = TYPE.transformModes[0];
    @observable transformControlsSpace: TYPE.TransformSpaces = TYPE.transformSpaces[0];

    grid = new THREE.Group().add(
        new THREE.GridHelper(100, 100, 0x2080ff, 0x2080ff),
        new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.0005, 0.5),
            new THREE.MeshBasicMaterial({ color: "red" })
        )
    )

    @observable gridEnabled: boolean = true;
    @observable fpsEnabled: boolean = false;

    constructor() {
        makeObservable(this)
        Viewport._instance = this;
    }

    public static get Instance() { return this._instance || (this._instance = new this()); }

    // 0 = translate | 1 = rotate | 2 = scale

    @action setTransformControlsMode = (mode: TYPE.Range<0, 3> | TYPE.TransformModes) => { typeof mode == "number" ? this.transformControlsMode = TYPE.transformModes[mode] : this.transformControlsMode = mode }
    // 0 = world | 1 = local
    @action setTransformControlsSpace = (mode: TYPE.Range<0, 2> | TYPE.TransformSpaces) => { typeof mode == "number" ? this.transformControlsSpace = TYPE.transformSpaces[mode] : this.transformControlsSpace = mode }

    @action setGrid = (b: boolean) => { this.gridEnabled = b; }

    @action setFPS = (b: boolean) => { this.fpsEnabled = b; }
}
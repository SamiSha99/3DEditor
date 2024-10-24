import * as THREE from 'three';
import { makeObservable, observable, action } from "mobx";
import { createContext, useContext } from 'react';

export const ViewportContext = createContext<Viewport>({} as any)
export const useViewport = () => useContext(ViewportContext);

// to-do move Editor grid to here
// This controls all related content that allows the user to interact with the scene
export class Viewport {

    static _instance: Viewport;

    grid = new THREE.Group().add(
        new THREE.GridHelper(100, 100, 0x2080ff, 0x2080ff),
        new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.0005, 0.5),
            new THREE.MeshBasicMaterial({ color: "red" })
        )
    )



    constructor() {
        makeObservable(this)
        Viewport._instance = this;
    }

    public static get Instance() { return this._instance || (this._instance = new this()); }

    @observable gridEnabled = true;
    @action setGrid = (b: boolean) => { this.gridEnabled = b; }

    @observable fpsEnabled = false;
    @action setFPS = (b: boolean) => { this.fpsEnabled = b; }
}
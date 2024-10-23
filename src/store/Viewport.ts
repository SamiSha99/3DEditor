import { makeObservable } from "mobx";

// to-do move Editor grid to here
// This controls all related content that allows the user to interact with the scene
export class Viewport {

    static _instance: Viewport;

    constructor() {
        makeObservable(this)
        Viewport._instance = this;
    }

    public static get Instance() { return this._instance || (this._instance = new this()); }
}
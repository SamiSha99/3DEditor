import { makeObservable } from "mobx";

export class Viewport {

    static _instance: Viewport;

    constructor() {
        makeObservable(this)
        Viewport._instance = this;
    }

    public static get Instance() { return this._instance || (this._instance = new this()); }
}
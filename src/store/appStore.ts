import { makeObservable, observable, action } from "mobx";
import { ReactNode } from "react";
import { Object3D } from "three";

const transformControlsModes = ['translate', 'rotate', 'scale', undefined]
const transformControlsSpaces = ['world', 'local']

export class AppStore {

    // All components in the scene
    @observable sceneComponents: Array<ReactNode> = []

    // Object3D ID
    @observable controlsTarget: number
    // The Object3D
    @observable controlsObject3D: Object3D | Object3D[]

    @observable controlsMode: 'translate' | 'rotate' | 'scale' | undefined
    @observable controlsSpace: 'world' | 'local'
    
    constructor(){
        makeObservable(this)
        this.controlsTarget = -1
        this.controlsMode = 'translate'
        this.controlsSpace = 'world'
        this.controlsObject3D = new Object3D()
    }

    @action.bound setControlsTarget = (object: Object3D) => {
        console.log(object,object.name,object.id);
        this.controlsObject3D = object
        this.controlsTarget = object.id
    }

    // 0 = translate | 1 = rotate | 2 = scale
    @action.bound setControlsMode = (mode: number) => {this.controlsMode = transformControlsModes[mode] as 'translate' | 'rotate' | 'scale' | undefined}
    @action.bound setControlsModeByName = (mode: string) => {this.controlsMode = mode as 'translate' | 'rotate' | 'scale' | undefined}
    
    // 0 = world | 1 = local
    @action.bound setControlSpace = (mode: number) => {this.controlsSpace = transformControlsSpaces[mode] as 'world' | 'local'}
    @action.bound setControlSpaceByName = (mode: string) => {this.controlsSpace = mode as 'world' | 'local'}
    @action.bound pushPrimitive = (box: ReactNode) => (this.sceneComponents.push(box))
}
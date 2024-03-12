import { makeObservable, observable, action } from "mobx";
import { ReactNode } from "react";

const transformControlsModes = ['translate', 'rotate', 'scale', undefined]
const transformControlsSpaces = ['world', 'local']

export class AppStore {

    @observable controlsTarget: number
    @observable controlsMode: 'translate' | 'rotate' | 'scale' | undefined
    @observable controlsSpace: 'world' | 'local'
    @observable boxes: Array<ReactNode>
    constructor(){
        makeObservable(this)
        this.controlsTarget = -1
        this.controlsMode = 'translate'
        this.controlsSpace = 'world'
        this.boxes = []
    }

    @action.bound setControlsTarget = (id: number) => {this.controlsTarget = id}

    // 0 = translate | 1 = rotate | 2 = scale
    @action.bound setControlsMode = (mode: number) => {this.controlsMode = transformControlsModes[mode] as 'translate' | 'rotate' | 'scale' | undefined}
    @action.bound setControlsModeByName = (mode: string) => {this.controlsMode = mode as 'translate' | 'rotate' | 'scale' | undefined}
    
    // 0 = world | 1 = local
    @action.bound setControlSpace = (mode: number) => {this.controlsSpace = transformControlsSpaces[mode] as 'world' | 'local'}
    @action.bound setControlSpaceByName = (mode: string) => {this.controlsSpace = mode as 'world' | 'local'}
    @action.bound pushPrimitive = (box: ReactNode) => (this.boxes.push(box))
}
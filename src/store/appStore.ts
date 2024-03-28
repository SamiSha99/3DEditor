import { makeObservable, observable, action } from "mobx";
import { ReactNode } from "react";
import { Object3D, Scene } from "three";
import * as TYPE from "./type";
import { EditorObject } from "../editor/Source/Object";

export class AppStore {

    // When instancing meshes, increment this, thankfully this is all locally, important specifically for "key={}" parameter
    meshInstanceIncremental: number = 0;

    // All components in the scene, this is bad please replace!!
    @observable sceneComponents: Array<ReactNode> = []
    // All objects in the scene including their react node renderer
    @observable objects: Array<EditorObject> = []

    // Object3D ID
    @observable controlsTarget: number
    
    @observable scene : Scene = new Scene();
    // The Object3D
    @observable controlsObject3D: Object3D | Object3D[] | null

    @observable controlsMode: TYPE.TransformModes
    @observable controlsSpace: TYPE.TransformSpaces
    
    constructor(){
        makeObservable(this)
        this.controlsTarget = -1
        this.controlsMode = 'translate'
        this.controlsSpace = 'world'
        this.controlsObject3D = null;
        this.meshInstanceIncremental = 0;
    }

    @action.bound setControlsTarget = (object: Object3D) => {
        
        console.log(this.controlsTarget);
        // Selecting groups > the object itself for now
        while(object.parent && !(object.parent instanceof Scene)) {
            console.log(object.parent);
            object = object.parent;
        }
        this.controlsObject3D = object;
        this.controlsTarget = object.id
        console.log(this.controlsTarget);
    }

    // 0 = translate | 1 = rotate | 2 = scale
    @action.bound setControlsMode = (mode: number) => {
        this.controlsMode = TYPE.transformModes[mode] as TYPE.TransformModes; //transformControlsModes[mode] as TYPE.TransformModes
    }
    @action.bound setControlsModeByName = (mode: string) => {
        this.controlsMode = mode as TYPE.TransformModes
    }
    
    // 0 = world | 1 = local
    @action.bound setControlSpace = (mode: number) => {
        this.controlsSpace = TYPE.transformSpaces[mode] as TYPE.TransformSpaces
    }

    @action.bound setControlSpaceByName = (mode: string) => {
        this.controlsSpace = mode as TYPE.TransformSpaces
    }

    // When a new component is made, push it to the scene
    @action.bound pushComponentToScene = (object: EditorObject) => {
        console.log(object);
        this.objects.push(object);
    };

    // to-do better implementation? 
    incrementMeshKey() {
        return this.meshInstanceIncremental++;
    }
}
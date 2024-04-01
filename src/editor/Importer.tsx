import { GLTFLoader, USDZLoader } from "three/examples/jsm/Addons.js";
import { EditorObject } from "./Source/EditorObject";
import { Vector3 } from "three";

type PushComponentToSceneAction = (node: EditorObject) => void;

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export async function doImport(pushComponentToScene: PushComponentToSceneAction, result: (b: boolean) => void) {
    const input = document.createElement('input');
    input.type = "file";
    input.accept = ".gltf, .glb, .usdz";
    input.style.display = "none";
    
    input.click();
    input.onchange = (e => {
        handleEvent(e as any, pushComponentToScene).then(() => {
            result(true);
        }).catch(() => {
            result(false);
        });
    });
}

async function handleEvent(e: React.ChangeEvent<HTMLInputElement>, pushComponentToScene: PushComponentToSceneAction) {
    const files = e.target.files as FileList;
    return files[0].arrayBuffer().then((value) => {
        const type = files[0].name.match(EXTENSION_REGEX)?.[0];

        switch(type) {    
            case ".gltf": 
            case ".glb": 
                new GLTFLoader().parseAsync(value, "").then((res) => {
                    let object: EditorObject = new EditorObject(res.scene);
                    if(object)
                    {
                        object.component?.scale.set(0.01, 0.01, 0.01);
                        pushComponentToScene(object)
                    }
                }).catch((res) => {
                    console.error("Failed to load file type", type, "\nIs this file corrupted? Result:", res);
                });
                break;
            case ".usdz":
            case ".usd":
                const o = new USDZLoader().parse(value);
                if(o)
                {
                    let object: EditorObject = new EditorObject(o);
                    if(object)
                        pushComponentToScene(object);
                }
                break;

            default: 
                console.error("Why is this type even being passed? =>", type);
                return false;
        }
    }).catch((error) => {
        console.error("Buffer error occured! =>", error);
        return false;
    });
}
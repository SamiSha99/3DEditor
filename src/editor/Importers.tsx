import { GLTFLoader, OBJLoader, USDZLoader } from "three/examples/jsm/Addons.js";
import { EditorObject } from "./Source/EditorObject";

type PushComponentToSceneAction = (node: EditorObject) => void;

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'
const ALLOWED_FORMAT_TYPES = ".gltf, .glb, .usdz, .obj, .fbx";

export async function doImport(pushComponentToScene: PushComponentToSceneAction, result: (b: boolean) => void) {
    const input = document.createElement('input');
    input.type = "file";
    input.accept = ALLOWED_FORMAT_TYPES;
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
        console.log("handling..");
        switch(type) {    
            case ".gltf": 
            case ".glb": 
                new GLTFLoader().parseAsync(value, "").then((res) => {
                    let object: EditorObject = new EditorObject(res.scene);
                    console.log(res.scene);
                    console.log(res.asset.generator)
                    if(object)
                    {
                        // TO-DO: SCALE SOLUTION IF THE MODEL IS FROM A DIFFERENT SOFTWARE!
                        //object.component?.scale.set(100, 100, 100);
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

export function doImportNew(onHandle: (result:any) => void) {
    const input = document.createElement('input');
    input.type = "file";
    input.accept = ALLOWED_FORMAT_TYPES;
    input.style.display = "none";
    
    input.click();
    input.onchange = (e => {
        // idk the conversion for this ok
        handleEventNew(e as any).then((value) => {
            console.log(value)
            value?.scale.set(0.01, 0.01,0.01);
            onHandle(value);
        }).catch((error) => {
            console.warn(error);
        });
    });
}

async function handleEventNew(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files as FileList;
    const type = files[0].name.match(EXTENSION_REGEX)?.[0];
    
    if(type == ".obj") {
        console.log("file[0]:",files[0])
        return files[0].text().then((result) => {
            console.log(result)
            const o = new OBJLoader().parse(result);
            console.log(o);
            return o;
        }).catch((error) => {
            console.warn(error);
        })
    }

    return files[0].arrayBuffer().then((value) => {

        switch(type) {
            case ".obj":
                return null;
            case ".gltf": 
            case ".glb": 
                new GLTFLoader().parseAsync(value, "").then((res) => {
                    const o = res.scene;
                    console.log(o);
                    return o;
                }).catch((res) => {
                    console.error("Failed to load file type", type, "\nIs this file corrupted? Result:", res);
                    return null;
                });
                return null;

            case ".usdz":
            case ".usd":
                const o = new USDZLoader().parse(value);
                console.log(o);
                return o;

            default: 
                console.error("Why is this type even being passed? =>", type);
                return null;
        }
    }).catch((error) => {
        console.error("Buffer error occured! =>", error);
        return null;
    });
}
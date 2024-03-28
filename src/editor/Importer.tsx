import { GLTFLoader, USDZLoader } from "three/examples/jsm/Addons.js";
import { EditorObject } from "./Source/Object";

type PushComponentToSceneAction = (node: EditorObject) => void;

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export function doImport(pushComponentToScene: PushComponentToSceneAction) {
    const handleEvent = (e: React.ChangeEvent<HTMLInputElement>, pushComponentToScene: PushComponentToSceneAction) => {
        const files = e.target.files as FileList;
        const buffer = files[0].arrayBuffer().then((value) => {
            const type = files[0].name.match(EXTENSION_REGEX)?.[0];

            switch(type) {
                case ".gltf": 
                case ".glb": 
                    new GLTFLoader().parse(value, "", (res) => {
                        let object: EditorObject = new EditorObject(res.scene);
                        pushComponentToScene(object)
                    });
                    break;
                case ".usdz":
                case ".usd":
                    const o = new USDZLoader().parse(value);
                    if(o)
                    {
                        let object: EditorObject = new EditorObject(o);
                        pushComponentToScene(object);
                    }
                    else
                        console.error("Failed to file of", type, "type!");
                    break;
                default: console.error("Why is this type even being passed? =>", type);
            }
        }).catch((error) => {
            console.error("Buffer error occured! =>", error);
        })
    }

    const input = document.createElement('input');
    input.type = "file";
    input.accept = ".gltf, .glb, .usdz";
    input.style.display = "none";
    input.onchange = (e => {
        handleEvent(e as any, pushComponentToScene)
    });
    input.click();
}

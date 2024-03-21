import { GLTFLoader, USDZLoader } from "three/examples/jsm/Addons.js";
import { Model } from "./MeshCreator/Models";
import { ReactNode } from "react";

type PushComponentToSceneAction = (node: ReactNode) => void;

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export function doImport(pushComponentToScene: PushComponentToSceneAction) {
    const handleEvent = (e: React.ChangeEvent<HTMLInputElement>, pushComponentToScene: PushComponentToSceneAction) => {
        const files = e.target.files as FileList;
        const buffer = files[0].arrayBuffer().then((value) => {
            const type = files[0].name.match(EXTENSION_REGEX)?.[0];

            switch(type) {
                case ".gltf": 
                case ".glb": 
                    new GLTFLoader().parse(value, "", (res) => {pushComponentToScene(<Model scene={res.scene} />)});
                    break;
                case ".usdz":
                case ".usd":
                    const o = new USDZLoader().parse(value);
                    if(o)
                        pushComponentToScene(<Model scene={o} />);
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
        // document.body.removeChild(input)
    });
    input.click();
}

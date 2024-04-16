import { GLTFLoader, OBJLoader, USDZLoader } from "three/examples/jsm/Addons.js";
import { Object3D } from "three";

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'
const ALLOWED_FORMAT_TYPES = ".glb, .usdz, .obj, .fbx"; //".gltf"

export async function doImport(onHandle: (result: Object3D | null) => void) {

    const input = document.createElement('input');
    input.type = "file";
    input.accept = ALLOWED_FORMAT_TYPES;
    input.style.display = "none";
    input.click();
    input.onchange = (e => {
        handleImportEvent(e as any).then((value) => {
            // conversions are an industry disagreement nightmare, conclusion: 1 = meter, do not argue with me
            onHandle(value);
        }).catch((error) => {
            console.warn(error);
        });
    });
}

async function handleImportEvent(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files as FileList;
    const type = files[0].name.match(EXTENSION_REGEX)?.[0];
    console.log("file:",files[0]);
    const path = URL.createObjectURL(files[0]);
    console.log(path);  
    // return null;
    switch(type) {
        case ".gltf":
            console.error("Not supported, for now, sorry!")
            return null;
        case ".obj":

            return files[0].text().then((text) => { 
                // if(type == ".gltf") return importGLTF(text);
                if(type == ".obj") return importOBJ(text)
                return null;
            }).catch((error) => {
                console.warn(error);
                return null;
            });
        case ".glb":
        case ".usdz":
        case ".usd":
            return files[0].arrayBuffer().then((buffer) => {
                if(type == ".glb") return importGLB(buffer);
                if(type == ".usdz" || type == ".usd") return importUSDZ(buffer);
                return null;
            }).catch((error) => {
                console.error("Failed to get buffer of file =>", files[0]);
                console.error("Returned ->",error);
                return null;
            })
    }
    return null;
}

export function importOBJ(data: string) {
    const o = new OBJLoader().parse(data);
    return o;
}

// to-do: verify if this can differntiate between gltf and glb?
export async function importGLTF(buffer: ArrayBuffer | string) {
    
    return new GLTFLoader().parseAsync(buffer, "").then((gltf) => {
        console.log(gltf);
        return gltf.scene;
    }).catch((error) => {
        console.warn("Error");
        console.error(error);
        return null;
    });
}

export async function importGLB(buffer: ArrayBuffer) {
    return importGLTF(buffer);
}

export function importUSDZ(buffer: ArrayBuffer) {
    const o = new USDZLoader().parse(buffer);
    if(!o) console.warn("Failed to load a USD/Z file.");
    return o;
}
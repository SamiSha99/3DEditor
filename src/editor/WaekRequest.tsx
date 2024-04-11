import * as EXPORTER from './Exporters';
import * as THREE from 'three';
import { GLTFLoader, OBJLoader, USDZLoader, RoomEnvironment, FBXLoader } from "three/examples/jsm/Addons.js";

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'
const ALLOWED_FORMAT_TYPES = ".glb, .usdz, .obj, .fbx"; //".gltf"
type ConversionTypes = ".gltf" | ".glb" | ".usdz" | ".obj"; // | ".fbx"
type AcceptableTypes = ".glb" | ".usdz" | ".obj" | ".fbx"

function loadModelData(data: ArrayBuffer | string, type: AcceptableTypes, to: ConversionTypes) {
    let loadedModel = null;
    
    switch(type)
    {
        case ".glb":
            if(data instanceof ArrayBuffer)
                importGLB(data).then((res) => {loadedModel = res});
            else
                console.error("");
            break;
        case ".usdz":
            loadedModel = importUSDZ(data);
            break;
        case ".obj":
            if(data instanceof ArrayBuffer)
                console.error("");
            else
                loadedModel = importOBJ(data);
            break;
        case ".fbx":
            loadedModel = importFBX(data);
            break;
        default:
            console.error("Invalid type passed", type);
            return;
    }

    if(!loadedModel) return console.error("Failed to load model");
    Screenshot(loadedModel);
}

export async function convertObject(object: THREE.Object3D, to: string) {

}

export async function importThenConvert(to: ConversionTypes) {

    await doImport((result) => {
        console.log("success on import:", result);
        if(result)
        {
            Screenshot(result);
            doExport(result, to);
        }
    });
}

function doExport(result: THREE.Object3D<THREE.Object3DEventMap> | null, to: ConversionTypes) {
    switch(to) {
        case ".gltf":   EXPORTER.doExportGLTF(result);          break;
        case ".glb":    EXPORTER.doExportGLTF(result, true);    break;
        case ".obj":    EXPORTER.doExportOBJ(result);           break;
        case ".usdz":   EXPORTER.doExportUSDZ(result);          break;
        // case ".fbx":    /* insert fbx here */                   break;
    }
}

export async function doImport(onHandle: (result: THREE.Object3D | null) => void) {

    const input = document.createElement('input');
    input.type = "file";
    input.accept = ALLOWED_FORMAT_TYPES;
    input.style.display = "none";
    // input.webkitdirectory = true;
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
        return gltf;
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

export function importFBX(buffer: string | ArrayBuffer) {
    const o = new FBXLoader().parse(buffer, "");
    if(!o) console.warn("Failed to load a FBX file");
    return o;
}

// Creates a screenshot
export async function Screenshot(group: THREE.Object3D) {

    const width = 1024;
    const height = 1024;
    const canvas = THREE.createCanvasElement()//(width, height, { alpha: true })
    
    canvas.height = height;
    canvas.width = width;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    
    const scene = new THREE.Scene();
    // Generate our own environment
    const pmremGen = new THREE.PMREMGenerator(renderer);
    const texture = pmremGen.fromScene(new RoomEnvironment(renderer), 0.5).texture;
    scene.background = new THREE.Color(0xE0E0E0);
    scene.environment = texture;
    
    scene.add(group);
    const camera = new THREE.PerspectiveCamera();

    console.log(group);
    if(group instanceof THREE.Group) {
        const bound = new THREE.Box3().setFromObject(group);
        const size = bound.getSize(new THREE.Vector3());
        const size2D = Math.max(size.x * size.y, size.x * size.z, size.z * size.y);
        const range = size2D;
        camera.position.x = -range/2;
        camera.position.y = range/2;
        camera.position.z = range/2;
        camera.lookAt(bound.getCenter(new THREE.Vector3()));
        console.log("Position offset is", camera.position.z, "SIZE:", size, "bound:", bound, "size2D (best):", size2D);
    }
    else {
        console.warn("Failed to set position from object, using a defaulter of 12");
        return;
    }
    
    const ambientLight = new THREE.AmbientLight('white', 1.0);
    scene.add(ambientLight);
    renderer.render(scene, camera)

    // How you will save the canvas is up to you, canvas provides .toBlob functionality
    return canvas;
}

function save(canvas: HTMLCanvasElement) {
    canvas.toBlob(blob => {
        if(blob)
            EXPORTER.save(blob, "preview.png");
    }, 'image/png', 1);
}
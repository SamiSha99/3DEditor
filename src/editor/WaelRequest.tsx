import * as THREE from 'three';
import { GLTFLoader, OBJLoader, USDZLoader, RoomEnvironment, FBXLoader, GLTFExporter, USDZExporter, OBJExporter } from "three/examples/jsm/Addons.js";

const conversionOptionsArray = [".gltf" , ".glb" , ".usdz" , ".obj"] as const;

export const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export type AcceptableTypes = ".gltf" | ".glb" | ".usdz" | ".obj" | ".fbx";
export const ALLOWED_FORMAT_TYPES = conversionOptionsArray.join(", ");

export type ConversionOptions = typeof conversionOptionsArray[number];

// Taking either text file as string 
export function loadFileData(data: ArrayBuffer | string, type: AcceptableTypes) {
    let loadedModel = null;
    
    switch(type)
    {
        case ".gltf":
            console.error("GLTF is not supported, sorry!");
            break;
        case ".glb":
            if(data instanceof ArrayBuffer)
                importGLB(data).then((res) => {
                    loadedModel = res?.scene;
                });
            else
                console.error("GLB doesn't accept ArrayBuffer");
            break;
        case ".usdz":
            if(data instanceof ArrayBuffer)
                loadedModel = importUSDZ(data);
            else
                console.error("USDZ accepts only ArrayBuffer");
            break;
        case ".obj":
            if(data instanceof ArrayBuffer)
                console.error("OBJ doesn't accept ArrayBuffer");
            else
                loadedModel = importOBJ(data);
            break;
        case ".fbx":
            loadedModel = importFBX(data);
            break;
        default:
            console.error("Invalid type passed", type);
            break;
    }
    return loadedModel;
}

// Converts an Object3D to a specific data file type
// Note: USDZ converter doesn't support passing animations so we should be careful if we do GLTF -> USDZ
// to-do: figure out a solution to this
export async function convertObject(object: THREE.Object3D, to: ConversionOptions) {
    switch(to) {
        case ".gltf":   return convertToGLTF(object);
        case ".glb":    return convertToGLTF(object, true);
        case ".obj":    return convertToOBJ(object);
        case ".usdz":   return convertToUSDZ(object);
        default: return null;
    }
}

// Makes a very quick scene that renders inside a hidden canvas with set screensize of 1024x1024
// group: The Object3D(s) that we want to screenshot
// quality: Manages the quality of the image | default: 1
// onComplete -> Returns a blob of an image/png format
export function screenshot(group: THREE.Object3D, onComplete: (blob: Blob | null) => void, quality: number = 1) {

    const width = 1024;
    const height = 1024;
    const canvas = THREE.createCanvasElement()
    
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
    console.log(group);
    
    const bound = new THREE.Box3().setFromObject(group);
    const size = bound.getSize(new THREE.Vector3());
    const range = Math.max(size.x * size.y, size.x * size.z, size.y * size.z); // Highest 2D space from x*y | x*z | y*z
    
    const camera = new THREE.PerspectiveCamera();
    camera.position.x = -range/2;
    camera.position.y = range/2;
    camera.position.z = range/2;
    camera.lookAt(bound.getCenter(new THREE.Vector3()));
    
    const ambientLight = new THREE.AmbientLight('white', 1.0);
    scene.add(ambientLight);
    renderer.render(scene, camera)

    canvas.toBlob(blob => {onComplete(blob)}, 'image/png', quality);
}

export function convertToGLTF(exportTarget: THREE.Object3D<THREE.Object3DEventMap> | THREE.Object3D<THREE.Object3DEventMap>[] | null, binary: boolean = false) {
    const exporter = new GLTFExporter();
    const object = exportTarget;
        
    if(!object) {
        console.log("Export type null!");
        return null;
    }
    exporter.parse(
        object,
        (result: { [key: string]: any; } | ArrayBuffer) => {
            return result;
        },
        (error) => {
            console.error('Failed to export content!\n', error);
            return null;
        },
        {binary: binary}
    );
    return null;
}

export function convertToUSDZ(exportTarget: THREE.Object3D<THREE.Object3DEventMap>) {

    if(!exportTarget) {
        console.warn("Export type null!")
        return null;
    }
    return new USDZExporter().parse(exportTarget).then(result => {
        const arraybuffer = result.buffer.slice(result.byteOffset, result.byteLength + result.byteOffset);
        return arraybuffer;
    }).catch((error) => {
        console.error("FAILED TO EXTRACT USDZ!!!", error);
        return null;
    });
}

export function convertToOBJ(exportTarget: THREE.Object3D<THREE.Object3DEventMap>) {
    if(!exportTarget) return console.warn("Export type null!");

    const data = (new OBJExporter().parse(exportTarget));
    return data;
}

// ############## //
//  BEGIN IMPORT  //
// ############## //

export function importOBJ(data: string) {
    const o = new OBJLoader().parse(data);
    if(!o) console.warn("Failed to load an OBJ file.");
    return o;
}

export async function importGLTF(buffer: ArrayBuffer | string) {
    
    return new GLTFLoader().parseAsync(buffer, "").then((gltf) => {
        console.log(gltf);
        return gltf;
    }).catch((error) => {
        console.error(error);
        console.warn("Failed to load a", buffer instanceof ArrayBuffer ? "GLB" : "GLTF", "file")
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
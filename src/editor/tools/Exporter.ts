import * as THREE from 'three';
import { GLTFExporter, OBJExporter, USDZExporter } from 'three/examples/jsm/Addons.js';

export type ExportType = "gltf" | "glb" | "usdz" | "obj"

export function doExport(scene: THREE.Object3D, as: ExportType) {

    switch(as) {
        case "gltf":
            exportGLTF(scene);
            break;
        case "glb":
            exportGLB(scene);
            break;
        case "usdz":
            exportUSDZ(scene);
            break;
        case "obj":
            exportOBJ(scene);
            break;
    }
}

// TO-DO: we need to export animations with GLTF/GLB
export function exportGLTF(scene: THREE.Object3D) {
    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => {
            const json = JSON.stringify(result as any, null, 2)
            saveString(json, "export.gltf");
        },
        (error) => {console.warn(error)},
        {binary: false, maxTextureSize: 2048}
    );
}

export function exportGLB(scene: THREE.Object3D) {
    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => saveArrayBuffer(result as ArrayBuffer, "export.glb"),
        (error) => {console.warn(error)},
        {binary: true, maxTextureSize: 2048}
    );
}

export function exportOBJ(scene: THREE.Object3D) {
    const exporter = new OBJExporter();
    saveString(exporter.parse(scene), "export.obj")
}

/** Exported type is always USDA, if we want to support USDC we need to go for a WASM solution which requires implementation that is even way larger than threejs!!! */
export function exportUSDZ(scene: THREE.Object3D) {
    const exporter = new USDZExporter();
    exporter.parse(scene, {quickLookCompatible: true, maxTextureSize: 2048}).then(
        result => 
        {
            const buffer =  result.buffer.slice(result.byteOffset, result.byteLength + result.byteOffset);
            saveArrayBuffer(buffer, "export.usdz");
        },
        ((reason) => {console.warn(reason)})
    )
}

export function save(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

export function saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
	save( new Blob([buffer], {type:'application/octet-stream'}), filename);
}

export function saveString(text: string, filename: string) {
	save( new Blob([text], {type:'text/plain'} ), filename );
}

// function getAnimations( scene ) {
//     const animations = [];
//     scene.traverse( function ( object ) {
//         animations.push( ... object.animations );
//     } );
//     return animations;
// }
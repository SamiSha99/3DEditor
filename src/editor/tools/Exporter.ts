import * as THREE from 'three';
import { GLTFExporter, OBJExporter, USDZExporter } from 'three/examples/jsm/Addons.js';

export type ExportType = "gltf" | "glb" | "usdz" | "obj"

export type ExportOptions = {
    type: ExportType,
    name?: string,
    maxTextureSize?: number
}

export function doExport(scene: THREE.Object3D, options: ExportOptions) {

    switch (options.type) {
        case "gltf":
            exportGLTF(scene, options);
            break;
        case "glb":
            exportGLB(scene, options);
            break;
        case "usdz":
            exportUSDZ(scene, options);
            break;
        case "obj":
            exportOBJ(scene, options);
            break;
    }
}

// TO-DO: we need to export animations with GLTF/GLB
export function exportGLTF(scene: THREE.Object3D, options: ExportOptions) {
    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => {
            const json = JSON.stringify(result as any, null, 2)
            saveString(json, (options.name || "export") + ".gltf");
        },
        (error) => { console.warn(error) },
        { binary: false, maxTextureSize: options.maxTextureSize || Infinity }
    );
}

// We could probably improve this
// Make an option that exports mtl serperately with all textures, something simple, nothing big
export function exportGLB(scene: THREE.Object3D, options: ExportOptions) {
    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => saveArrayBuffer(result as ArrayBuffer, (options.name || "export") + ".glb"),
        (error) => { console.warn(error) },
        { binary: true, maxTextureSize: options.maxTextureSize || Infinity }
    );
}

export function exportOBJ(scene: THREE.Object3D, options: ExportOptions) {
    const exporter = new OBJExporter();
    saveString(exporter.parse(scene), (options.name || "export") + ".obj");
    // if(scene instanceof THREE.Mesh)
        // saveString(materialToData(scene.material), (options.name || "export") + ".mtl");
}

/** Exported type is always USDA, if we want to support USDC we need to go for a WASM solution which requires implementation that is even way larger than threejs!!! */
export function exportUSDZ(scene: THREE.Object3D, options: ExportOptions) {
    const exporter = new USDZExporter();
    exporter.parse(scene, { quickLookCompatible: true, maxTextureSize: options.maxTextureSize || Infinity }).then(
        result => {
            const buffer = result.buffer.slice(result.byteOffset, result.byteLength + result.byteOffset);
            saveArrayBuffer(buffer, (options.name || "export") + ".usdz");
        },
        ((reason) => { console.warn(reason) })
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
    save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

export function saveString(text: string, filename: string) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}

// export function materialToData(material: THREE.Material) {
// 
    // let output = '';
    // if (material instanceof Array) {
        // for (const mtl of material) output += materialToData(mtl);
    // } else {
        // output += `newmtl ${(material.name !== '') ? material.name : `material ${material.id}`}\n`;
// 
        // output += 'Ns 10.0000\n';
        // output += 'Ni 1.5000\n';
        // output += 'd 1.0000\n';
        // output += 'Tr 0.0000\n';
        // output += 'Tf 1.0000 1.0000 1.0000\n';
        // output += 'illum 2\n';
        // output += `Ka ${material.color.r} ${material.color.g} ${material.color.b}\n`;
        // output += `Kd ${material.color.r} ${material.color.g} ${material.color.b}\n`;
        // output += 'Ks 0.0000 0.0000 0.0000\n';
        // output += 'Ke 0.0000 0.0000 0.0000\n';
    // }
// 
    // return output;
// }


// function getAnimations( scene ) {
//     const animations = [];
//     scene.traverse( function ( object ) {
//         animations.push( ... object.animations );
//     } );
//     return animations;
// }
import * as THREE from 'three';
import { GLTFExporter, OBJExporter, PLYExporter, STLExporter, USDZExporter } from 'three/examples/jsm/Addons.js';
import { computeVertexNormals } from '../utils/MeshUtils';

export type OnExport = (result: Blob) => void;

export type USDZExporterAnchoringTypes = "plane" | "image" | "face" | "none"

export type ExportType = "gltf" | "glb" | "usdz" | "obj" | "ply" | "stl"

export type ExportOptions = {
    type: ExportType,
    name?: string,
    maxTextureSize?: number, // only GLTF, GLB and USDZ
    binary?: boolean // only GLTF, GLB, PLY, STL
}

export function doExport(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {

    switch (options.type) {
        case "gltf": exportGLTF(scene, options, onExport); break;
        case "glb": exportGLB(scene, options, onExport); break;
        case "usdz": exportUSDZ(scene, options, onExport); break;
        case "obj": exportOBJ(scene, options, onExport); break;
        case "stl": exportSTL(scene, options, onExport); break;
        case "ply": exportPLY(scene, options, onExport); break;
    }
}

// TO-DO: we need to export animations with GLTF/GLB
export function exportGLTF(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {
    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => {
            const json = JSON.stringify(result as any, null, 2)
            const blob = saveString(json);
            onExport && onExport(blob);
        },
        (error) => { console.warn(error) },
        { binary: false, maxTextureSize: options.maxTextureSize || Infinity }
    );
}

// We could probably improve this
// Make an option that exports mtl serperately with all textures, something simple, nothing big
export function exportGLB(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {
    const exporter = new GLTFExporter();

    exporter.parse(
        scene,
        (result) => {
            const blob = saveArrayBuffer(result as ArrayBuffer)
            onExport && onExport(blob);
        },
        (error) => { console.warn(error) },
        { binary: true, maxTextureSize: options.maxTextureSize || Infinity }
    );
}

export function exportOBJ(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {
    const exporter = new OBJExporter();
    const blob = saveString(exporter.parse(scene));
    onExport && onExport(blob);
}

/** Exported type is always USDA, if we want to support USDC we need to go for a WASM solution which requires implementation that is even way larger than threejs!!! */
export async function exportUSDZ(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {
    const exporter = new USDZExporter();
    // let computing: boolean = false;

    scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
            if (!(obj.material instanceof THREE.MeshStandardMaterial)) {
                const mat = obj.material as THREE.MeshPhongMaterial;
                const standardMat = new THREE.MeshStandardMaterial();
                standardMat.copy(mat);
                standardMat.map = mat.map;
                standardMat.aoMap = mat.aoMap;
                standardMat.normalMap = mat.normalMap;
                obj.material = standardMat;
                computeVertexNormals(obj);
            }
        }
    })

    exporter.parseAsync(scene, { quickLookCompatible: true, maxTextureSize: options.maxTextureSize || Infinity }).then(
        result => {
            const buffer = result.buffer.slice(result.byteOffset, result.byteLength + result.byteOffset);
            const blob = saveArrayBuffer(buffer);
            onExport && onExport(blob);
        },
        ((reason) => { console.warn(reason) })
    )
}

export function exportPLY(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {
    const exporter = new PLYExporter();
    const binary = options.binary || false;
    exporter.parse(scene,
        result => {
            const blob = binary ? saveArrayBuffer(result as ArrayBuffer) : saveString(result as string);
            onExport && onExport(blob);
        },
        { binary: binary }
    );
}

export function exportSTL(scene: THREE.Object3D, options: ExportOptions, onExport?: OnExport) {
    const exporter = new STLExporter();
    const binary = options.binary || false;

    const result = exporter.parse(scene, { binary: binary });
    const blob = binary ? saveArrayBuffer(result as any as ArrayBuffer) : saveString(result as string);
    onExport && onExport(blob);
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

export function saveArrayBuffer(buffer: ArrayBuffer) { return new Blob([buffer], { type: 'application/octet-stream' }); }
export function saveString(text: string) { return new Blob([text], { type: 'text/plain' }); }

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
import * as THREE from 'three';
import { GLTFExporter, GLTFExporterOptions, OBJExporter, PLYExporter, PLYExporterOptions, STLExporter, STLExporterOptions, USDZExporter, USDZExporterOptions } from 'three/examples/jsm/Addons.js';

export type OnExport = (result: Blob) => void;

// to-do, is there anything that documents these anchoring types? can we change those?
export type USDZExporterAnchoringTypes = "plane" | "image" //| "object" // apparently object not supported
export type USDZExporterAlignmentTypes = "horizontal" | "vertical" | "any"

export type ExportType = undefined | "gltf" | "usdz" | "obj" | "ply" | "stl" | "json"

export interface ExportOptions<T extends ExportParameters> {
    type: ExportType,
    selectionOnly?: boolean,
    name?: string,
    parameters?: T
}

export type ExportParameters = GLTFExporterOptions & AnimationParameters | USDZExporterOptions | PLYExporterOptions | STLExporterOptions

// ################################
// # BEGIN DEFAULT EXPORT OPTIONS #
// ################################

export interface AnimationParameters {
    optimizeAnimations: boolean,
}

export interface GeometryParameters {
    // to-do
}

export interface GLTFExporterOptionsNew extends GLTFExporterOptions, AnimationParameters { }

export const DEFAULT_GLTF_EXPORTER_OPTIONS: Readonly<GLTFExporterOptions & AnimationParameters> = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: true, // note: by default false but we want to encourage the usage of the binary format so it will be on for everyone
    embedImages: true,
    maxTextureSize: Infinity,
    animations: undefined,
    forceIndices: false,
    optimizeAnimations: false
};

// Based on default source code 
// https://github.com/mrdoob/three.js/blob/86c3bd390f623005f2fae07b3dca23f904102e05/examples/jsm/exporters/USDZExporter.js#L34-L42
export const DEFAULT_USDZ_EXPORTER_OPTIONS_AR = {
    anchoring: { type: 'plane' as "plane" },
    planeAnchoring: { alignment: 'horizontal' as "horizontal" | "vertical" | "any" }
}

// Ditto above
export const DEFAULT_USDZ_EXPORTER_OPTIONS: Readonly<USDZExporterOptions> = {
    ar: { ...DEFAULT_USDZ_EXPORTER_OPTIONS_AR },
    includeAnchoringProperties: false,
    quickLookCompatible: false,
    maxTextureSize: 1024
};

export const DEFAULT_PLY_EXPORTER_OPTIONS: Readonly<PLYExporterOptions> = {
    binary: false,
    excludeAttributes: [], // normal, uv, color and/or index
    littleEndian: false
};

export const DEFAULT_STL_EXPORTER_OPTIONS: Readonly<STLExporterOptions> = {
    binary: false
};

// ##############################
// # END DEFAULT EXPORT OPTIONS #
// ##############################

export function doExport(scene: THREE.Object3D, options: ExportOptions<ExportParameters>, onExport?: OnExport) {

    switch (options.type) {
        case "gltf": exportGLTF(scene, options as ExportOptions<GLTFExporterOptions>, onExport); break;
        case "usdz": exportUSDZ(scene, options as ExportOptions<USDZExporterOptions>, onExport); break;
        case "stl": exportSTL(scene, options as ExportOptions<STLExporterOptions>, onExport); break;
        case "ply": exportPLY(scene, options as ExportOptions<PLYExporterOptions>, onExport); break;
        case "obj": exportOBJ(scene, onExport); break;
        case "json": 
            const json = scene.toJSON();
            const blob = saveJSON(json as any as string);
            onExport && onExport(blob);
            break;
    }
}

export function exportGLTF(scene: THREE.Object3D, options: ExportOptions<GLTFExporterOptions>, onExport?: OnExport) {
    if ((options.parameters as GLTFExporterOptions).binary) {
        exportGLB(scene, options, onExport);
        return;
    }
    const exporter = new GLTFExporter();

    if (options.parameters) {
        // undefined? ok, export all of them inside the object
        // not undefined? ok export what is inside the options.parameters.animations
        if (options.parameters.animations == undefined)
            options.parameters.animations = getAnimations(scene);

        if ((options.parameters as AnimationParameters).optimizeAnimations)
            options.parameters.animations = optimizeAnimations(options.parameters.animations);
    }

    exporter.parse(
        scene,
        (result) => {
            const json = JSON.stringify(result as any, null, 2)
            const blob = saveString(json);
            onExport && onExport(blob);
        },
        (error) => { console.warn(error) },
        options.parameters
    );
}

export function exportGLB(scene: THREE.Object3D, options: ExportOptions<GLTFExporterOptions>, onExport?: OnExport) {
    const exporter = new GLTFExporter();

    if (options.parameters) {
        // undefined? ok, export all of them inside the object
        // not undefined? ok export what is inside the options.parameters.animations
        if (options.parameters.animations == undefined)
            options.parameters.animations = getAnimations(scene);

        if ((options.parameters as AnimationParameters).optimizeAnimations)
            options.parameters.animations = optimizeAnimations(options.parameters.animations);
    }

    exporter.parse(
        scene,
        (result) => {
            const blob = saveArrayBuffer(result as ArrayBuffer)
            onExport && onExport(blob);
        },
        (error) => { console.warn(error) },
        options.parameters
    );
}

export function exportOBJ(scene: THREE.Object3D, onExport?: OnExport) {
    const exporter = new OBJExporter();
    const blob = saveString(exporter.parse(scene));
    onExport && onExport(blob);
}

/** Exported type is always USDA, if we want to support USDC we need to go for a WASM solution which requires implementation that is even way larger than threejs!!! */
export async function exportUSDZ(scene: THREE.Object3D, options: ExportOptions<USDZExporterOptions>, onExport?: OnExport) {
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
            }
        }
    })

    exporter.parseAsync(scene, options.parameters).then(
        result => {
            const buffer = result.buffer.slice(result.byteOffset, result.byteLength + result.byteOffset);
            const blob = saveArrayBuffer(buffer);
            onExport && onExport(blob);
        },
        ((reason) => { console.warn(reason) })
    )
}

export function exportPLY(scene: THREE.Object3D, options: ExportOptions<PLYExporterOptions>, onExport?: OnExport) {
    const exporter = new PLYExporter();
    exporter.parse(scene,
        result => {
            const blob = options.parameters?.binary ? saveArrayBuffer(result as ArrayBuffer) : saveString(result as string);
            onExport && onExport(blob);
        },
        options.parameters
    );
}

export function exportSTL(scene: THREE.Object3D, options: ExportOptions<STLExporterOptions>, onExport?: OnExport) {
    const exporter = new STLExporter();
    const result = exporter.parse(scene, options.parameters);
    const blob = options.parameters?.binary ? saveArrayBuffer(result as any as ArrayBuffer) : saveString(result as string);
    onExport && onExport(blob);
}

export function exportAnimationClip(ac: THREE.AnimationClip, optimize: boolean = false, onExport?: OnExport) {
    if (optimize)
        ac = ac.optimize();
    const json = THREE.AnimationClip.toJSON(ac);
    const blob = saveJSON(json as any);
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

export function saveLink(link: string, fileName: string, type?: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.href = link;
    a.download = fileName;
    a.type = type ? type : "";
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

export function saveArrayBuffer(buffer: ArrayBuffer) { return new Blob([buffer], { type: 'application/octet-stream' }); }
export function saveString(text: string) { return new Blob([text], { type: 'text/plain' }); }
export function saveJSON(text: string) { return new Blob([JSON.stringify(text, null, "\t")], { type: 'application/json' }) }

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


function getAnimations(scene: THREE.Object3D) {
    const animations: THREE.AnimationClip[] = [];
    scene.traverse(function (object) {
        animations.push(...object.animations);
    });
    return animations;
}

function optimizeAnimations(animations: THREE.AnimationClip[]) {
    const optimized: THREE.AnimationClip[] = [];
    for (const animation of animations)
        optimized.push(animation.clone().optimize());
    return optimized;
}
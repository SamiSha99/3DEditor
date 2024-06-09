import * as THREE from 'three';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { message } from 'antd';
import { OBJLoader, MTLLoader } from 'three/examples/jsm/Addons.js';
import { exportGLB } from './exporter';
const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i;

export async function handleFiles(files: File[], callback: (f: any) => any) {
    const manager = new THREE.LoadingManager();
    const filesMap = createFilesMap(files) as { [name: string]: File };

    manager.setURLModifier((url) => {
        url = url.replace(/^(\.?\/)/, "");
        const file = filesMap[url];
        if (file) {
            console.log("Loading", url);
            return URL.createObjectURL(file);
        }
        return url;
    });

    files.forEach((file) => handleFile(file, manager, callback));
}

async function handleFile(
    file: File,
    manager: THREE.LoadingManager | null = null,
    callback: (f: any) => any
) {
    const type = file.name.match(EXTENSION_REGEX)?.[0];
    if (!manager) {
        manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            url = url.replace(/^(\.?\/)/, "");
            if (file) {
                console.log("Loading", url);
                return URL.createObjectURL(file);
            }
            return url;
        });
    }

    const reader = new FileReader();

    if (type === ".zip") {
        reader.addEventListener(
            "load",
            async function (event) {
                handleZIP(event.target?.result, callback);
            },
            false
        );
        reader.readAsArrayBuffer(file);
    }
}

async function handleZIP(
    data: string | ArrayBuffer | null | undefined,
    callback: (f: any) => any
) {
    if (!data) {
        message.error("ZIP data returned " + data);
        return;
    }
    const zip = unzipSync(new Uint8Array(data as ArrayBuffer));

    const manager = new THREE.LoadingManager();
    manager.setURLModifier((url) => {
        const file = zip[url];
        if (file) {
            const blob = new Blob([file.buffer], {
                type: "application/octet-stream",
            });
            return URL.createObjectURL(blob);
        }
        return url;
    });

    for (const path in zip) {
        const pathParts: string[] = path.split('/');
        const fileNameWithExt: string = pathParts[pathParts.length - 1];
        if (path.includes("__MACOSX") || fileNameWithExt.startsWith(".") || fileNameWithExt === '') {
            continue
        }
        // const file = zip[path];
        // const manager = new THREE.LoadingManager();
        // manager.setURLModifier((url) => {
        //   const file = zip[url];
        //   if (file) {
        //     const blob = new Blob([file.buffer], {
        //       type: "application/octet-stream",
        //     });
        //     return URL.createObjectURL(blob);
        //   }
        //   return url;
        // });

        const extension = path.match(EXTENSION_REGEX)?.[0];

        if (extension == ".obj") {
            // get the mtl
            const objPath = path;
            console.log("#### objPath", objPath)
            for (const path in zip) {
                const pathParts: string[] = path.split('/');
                const fileNameWithExt: string = pathParts[pathParts.length - 1];
                if (path.includes("__MACOSX") || fileNameWithExt.startsWith(".") || fileNameWithExt === '') {
                    continue
                }
                if (path.match(EXTENSION_REGEX)?.[0].toLowerCase() === ".mtl") {
                    console.log("#### mtl file", path)
                    const mtlLoader = new MTLLoader(manager);
                    // Modify mapping
                    let map = strFromU8(zip[path]);
                    map = modifyMap(map, "map_Kd", "baked_mesh_tex0.png");
                    map = modifyMap(map, "map_ao", "baked_mesh_ao0.png");
                    map = modifyMap(map, "map_tangentSpaceNormal", "baked_mesh_norm0.png");
                    map = modifyMap(map, "Kd", "1 1 1");
                    console.log("$$$$ map", map)
                    const mat = mtlLoader.parse(map, "");
                    mat.preload();
                    const loader = new OBJLoader(manager);
                    const object = loader
                        .setMaterials(mat)
                        .parse(strFromU8(zip[objPath]));
                    setTimeout(() => {
                        exportGLB(object, callback)
                    }, 2000);
                }
            }
            break;
        }
    }
}

/** Returns the value related to this key from the input */
export function matchOnMap(input: string, key: string) {
    const mapRegex = new RegExp(`\\b${key}\\b\\s+([^\\n]+)`);
    const res = input.match(mapRegex);
    return res?.[1];
}

/** Replaces the value of the current key related to this input */
export function modifyMap(input: string, key: string, value: string) {
    const mapRegex = new RegExp(`(\\b${key}\\b\\s+)([^\\n]+)`);
    const res = input.replace(mapRegex, `$1${value}`);
    return res;
}

function createFilesMap(files: File[]) {
    const map = {};
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        Object.assign(map, { [file.name]: file });
    }
    return map;
}
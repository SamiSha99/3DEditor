import * as THREE from 'three';
import { message } from 'antd';
import { GLTFLoader, DRACOLoader, KTX2Loader, OBJLoader, USDZLoader, MTLLoader, FBXLoader, PLYLoader, STLLoader, RGBELoader } from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { isFileImage, sleep } from '@orb_utils/Main';
import { USDZLoader as USDC_Loader } from "three-usdz-loader";
import { doConvert } from './Converter';
import { doExport } from './Exporter';
import { blob } from 'stream/consumers';
/** Extension of the file including a dot "." */
const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i;

type OnImport<T> = (result: T) => void;

export function doImport(onImport: OnImport<THREE.Object3D>) {
    const input = document.createElement('input');
    input.type = "file";
    input.style.display = "none";
    input.multiple = true;
    input.click();
    input.onchange = ((e: Event) => {
        const filelist = (e as any as React.ChangeEvent<HTMLInputElement>).target.files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            let files: File[] = [];
            for (let i = 0; i < filelist.length; i++) {
                files.push(filelist[i]);
                if (isFileImage(filelist[i])) {
                    importTexture(filelist[i], (res) => {
                        const mat = new THREE.MeshStandardMaterial({ map: res });
                        const plane = new THREE.Mesh(new THREE.PlaneGeometry(), mat);
                        plane.name = "Plane"
                        onImport(plane);
                    })
                }
            }
            handleFiles(files, onImport);
        }
        else
            message.error("FileList returned null.");
    });
}

export function doImportTexture(onImport: OnImport<THREE.Texture>) {
    const input = document.createElement('input');
    input.type = "file";
    input.style.display = "none";
    input.multiple = true;
    input.accept = ".png, .svg, .jpg, .jpeg, .tga, .bmp, .webp, .hdr";
    input.click();
    input.onchange = ((e: Event) => {
        const filelist = (e as any as React.ChangeEvent<HTMLInputElement>).target.files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            let files: File[] = [];
            for (let i = 0; i < filelist.length; i++) files.push(filelist[i]);
            files.map((file) => {
                importTexture(file, (res) => {
                    onImport(res);
                })
            })
        }
        else
            message.error("FileList returned null.")
    })
}

export function importTexture(file: File, onImport: OnImport<THREE.Texture>) {
    const url = URL.createObjectURL(file);
    const type = file.type;
    console.log("type", file.name.match(/\.[0-9a-z]+$/i)![0], type)
    const loader = file.name.match(/\.[0-9a-z]+$/i)![0] == ".hdr" ? new RGBELoader() : new THREE.TextureLoader();
    if (loader instanceof RGBELoader)
        loader.load(
            url,
            (res) => {
                res.colorSpace = THREE.SRGBColorSpace;
                res.flipY = true;
                res.needsUpdate = true;
                onImport(res);
                URL.revokeObjectURL(url);
            },
            undefined,
            (res) => {
                console.error("FAILED!", res)
                URL.revokeObjectURL(url);
            }
        )
    else
        loader.load(
            url,
            (res) => {
                res.colorSpace = THREE.SRGBColorSpace;
                res.flipY = true;
                res.needsUpdate = true;
                onImport(res);
                URL.revokeObjectURL(url);
            },
            undefined,
            (res) => {
                console.error("FAILED!", res)
                URL.revokeObjectURL(url);
            }
        )
}

export function doImportAnimationClip(onImport: OnImport<THREE.AnimationClip>) {
    const input = document.createElement('input');
    input.type = "file";
    input.style.display = "none";
    input.multiple = true;
    input.accept = ".ac";
    input.click();
    input.onchange = ((e: Event) => {
        const filelist = (e as any as React.ChangeEvent<HTMLInputElement>).target.files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            let files: File[] = [];
            for (let i = 0; i < filelist.length; i++) files.push(filelist[i]);
            files.map((file) => {
                const reader = new FileReader();
                reader.addEventListener('load', async function (event) {
                    const contents = event.target?.result as string;
                    const object = JSON.parse(contents);
                    const animationClip: THREE.AnimationClip = THREE.AnimationClip.parse(object);
                    onImport(animationClip);
                });
                reader.readAsText(file)
            })
        }
        else
            message.error("FileList returned null.")
    })
}

export function doImportFileList(filelist: FileList, onImport: OnImport<THREE.Object3D>) {

    if (filelist.length <= 0) {
        message.error("No files were selected.");
        return;
    }

    let files: File[] = [];
    for (let i = 0; i < filelist.length; i++) files.push(filelist[i]);
    handleFiles(files, onImport);
}

export function doImportFile(file: File, onImport: OnImport<THREE.Object3D>) {
    if (!file) {
        message.error("No files were selected.");
        return;
    }
    handleFiles([file], onImport);
}

export function doImportFiles(files: File[], onImport: OnImport<THREE.Object3D>) {
    if (files.length <= 0) {
        message.error("No files were selected.");
        return;
    }
    handleFiles(files, onImport);
}

function handleFiles(files: File[], onImport: OnImport<THREE.Object3D>) {
    const manager = new THREE.LoadingManager();
    const filesMap = createFilesMap(files) as { [name: string]: File };

    manager.setURLModifier((url) => {
        url = url.replace(/^(\.?\/)/, '');
        const file = filesMap[url];
        if (file) {
            console.log('Loading', url);
            return URL.createObjectURL(file);
        }
        return url;
    });

    files.forEach((file) => handleFile(file, manager, onImport));
}

function handleFile(file: File, manager: THREE.LoadingManager | null = null, onImport: OnImport<THREE.Object3D>) {
    const type = file.name.match(EXTENSION_REGEX)?.[0];

    if (!manager) {
        manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            url = url.replace(/^(\.?\/)/, '');
            if (file) {
                console.log('Loading', url);
                return URL.createObjectURL(file);
            }
            return url;
        });
    }

    const reader = new FileReader();

    switch (type) {
        case ".gltf":
            reader.addEventListener('load', async function (event) {
                const contents = event.target?.result as string | ArrayBuffer;
                const loader = createGLTFLoader(manager);
                loader.parse(contents, '',
                    (result) => {
                        const scene = result.scene;
                        scene.name = file.name;
                        scene.animations.push(...result.animations);
                        loader.dracoLoader?.dispose();
                        onImport(scene);
                        return scene;
                    },
                    (error) => {
                        message.error("Failed to load .gltf file. [" + error + "]");
                    });

            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".glb":
            reader.addEventListener('load', async function (event) {
                const contents = event.target?.result as string | ArrayBuffer;
                const loader = createGLTFLoader();
                console.log(contents);
                loader.parse(contents, '', function (result) {

                    const scene = result.scene;
                    scene.name = file.name;
                    scene.userData = result.userData;
                    scene.animations.push(...result.animations);
                    loader.dracoLoader?.dispose();
                    onImport(scene);
                    return scene;
                });

            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".usdz":
        case ".usda":
        case ".usdc":
        case ".usd":
            reader.addEventListener('load', async function (event) {

                const contents = event.target?.result as string | ArrayBuffer;
                try {
                    const group = new USDZLoader(manager).parse(contents);
                    group.name = file.name;
                    onImport(group);
                }
                catch (err) {
                    // A hack to avoid massive amount of inexplainable bugs that I don't want to tackle with
                    // Loads the file via a three-usdz-loader fork that syncs with threejs version
                    // waits 0.05 seconds for textures/materials to load
                    // then convert it to USD ASCII type and import it immediatly
                    // nothing of the model should be lost
                    if (("" + err).includes(".usdc")) {
                        message.warning("Crate type detected (USDC). We recommend USD ASCII (USDA) whenever possible for better results!", 5);
                        const loader = new USDC_Loader();
                        const loadedModel = (await loader.loadFile(file, new THREE.Group()));
                        const group = loadedModel.getGroup().clone(true);
                        // wait a little for textures/materials to be loaded
                        await sleep(50);
                        // convert object result
                        doExport(group, {
                            type: "usdz"
                        }, (b) => {
                            const filydummy = new File([b], file.name);
                            doImportFile(filydummy, (o) => { o.name = file.name; onImport(o) });
                            loadedModel.clear();
                        })
                    }
                    else
                        message.error("Failed to load USDZ model.");
                }

            }, false);
            reader.addEventListener('error', async function (event) {

                message.error("" + event.target);
            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".obj":
            reader.addEventListener('load', async function (event) {

                const contents = event.target?.result as string;

                const group = new OBJLoader().parse(contents);
                group.name = file.name;
                if (group.children.length <= 0)
                    message.error("Failed to load OBJ model.");
                else
                    onImport(group)

            }, false);
            reader.readAsText(file);
            break;
        case ".ply":
            reader.addEventListener('load', async function (event) {
                const contents = event.target?.result as string | ArrayBuffer;
                const buffer = new PLYLoader().parse(contents);

                let mesh;
                if (buffer.index !== null) {
                    const material = new THREE.MeshStandardMaterial();
                    mesh = new THREE.Mesh(buffer, material);
                    mesh.name = file.name;
                }
                else {
                    const material = new THREE.PointsMaterial({ size: 0.01 });
                    material.vertexColors = buffer.hasAttribute('color');
                    mesh = new THREE.Points(buffer, material);
                    mesh.name = file.name;
                }

                onImport(mesh);
            }, false);
            console.log(typeof file);
            reader.readAsArrayBuffer(file);
            break;
        case ".stl":
            reader.addEventListener('load', async function (event) {
                const contents = event.target?.result as string | ArrayBuffer;
                const geometry = new STLLoader().parse(contents);
                const material = new THREE.MeshStandardMaterial();
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = file.name;
                onImport(mesh);
            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".fbx":
            reader.addEventListener('load', async function (event) {
                const contents = event.target?.result as string | ArrayBuffer;
                const group = new FBXLoader(manager).parse(contents, "");
                group.name = file.name;
                onImport(group);
            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".zip":
            reader.addEventListener('load', async function (event) {
                handleZIP(event.target?.result, onImport);
            }, false);
            reader.readAsArrayBuffer(file);
            break;
    }
}

function handleZIP(data: string | ArrayBuffer | null | undefined, onImport: OnImport<THREE.Object3D>) {
    if (!data) {
        message.error("ZIP data returned " + data);
        return;
    }

    const zip = unzipSync(new Uint8Array(data as ArrayBuffer));

    for (const path in zip) {
        const file = zip[path];
        const manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            const file = zip[url];
            if (file) {
                const blob = new Blob([file.buffer], { type: 'application/octet-stream' });
                return URL.createObjectURL(blob);
            }
            return url;
        });

        const extension = path.match(EXTENSION_REGEX)?.[0];

        switch (extension) {

            case ".fbx": {
                const loader = new FBXLoader(manager);
                const object = loader.parse(file.buffer, path);
                onImport(object);
                break;
            }

            case ".glb": {
                const loader = createGLTFLoader();
                loader.parse(file.buffer, '', result => {
                    const scene = result.scene;
                    scene.animations.push(...result.animations);
                    onImport(scene);
                    loader.dracoLoader?.dispose();
                });
                break;
            }

            case ".gltf": {
                const loader = createGLTFLoader(manager);
                loader.parse(strFromU8(file), '', result => {
                    const scene = result.scene;
                    scene.animations.push(...result.animations);
                    onImport(scene);
                    loader.dracoLoader?.dispose();
                });
                break;
            }
            case ".obj": {
                // Get MTL via pathing
                const objMap = strFromU8(zip[path]);
                const mtlPath = path.includes("/") ? path.replace(/([^\/]+$)/g, matchOnMap(objMap, "mtllib")) : matchOnMap(objMap, "mtllib");

                let object: THREE.Object3D;
                const loader = new OBJLoader(manager);

                if (zip[mtlPath]) {
                    let map = strFromU8(zip[mtlPath]);
                    map = modifyMap(map, "Kd", "1 1 1");
                    const mtlLoader = new MTLLoader(manager);
                    const mat = mtlLoader.parse(map, "");
                    mat.preload();
                    manager.onProgress = (url, num, total) => console.log("Loaded", url, "Current Load Amount:", num / total * 100 + "%");
                    manager.onError = (url) => console.error("Failed to load", url);
                    manager.onLoad = () => {
                        console.log("Finished loading Material, parsing Object with the material.");
                        object = loader.setMaterials(mat).parse(strFromU8(zip[path]));
                        onImport(object);
                    }
                }
                else {
                    object = loader.parse(strFromU8(zip[path]));
                    onImport(object);
                }
            }
        }
    }
}

/** Returns the value related to this key from the input */
export function matchOnMap(input: string, key: string) {
    const mapRegex = new RegExp(`\\b${key}\\b\\s+([^\\n]+)`);
    const res = input.match(mapRegex);
    return res?.[1] || "";
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

function createGLTFLoader(manager: THREE.LoadingManager | undefined = undefined) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../examples/jsm/libs/draco/gltf/');

    const ktx2Loader = new KTX2Loader(manager);
    ktx2Loader.setTranscoderPath('../examples/jsm/libs/basis/');

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    return loader;
}
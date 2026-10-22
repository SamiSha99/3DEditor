import * as THREE from 'three';
import { message } from "@orb_utils/Message";
import { OBJLoader, USDLoader, MTLLoader, FBXLoader, PLYLoader, STLLoader, HDRLoader } from 'three/examples/jsm/Addons.js';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { isFileImage } from '@orb_utils/Main';
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
        const filelist = (e.target as HTMLInputElement).files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            for (let i = 0; i < filelist.length; i++) {
                if (isFileImage(filelist[i])) {
                    importTexture(filelist[i], (res) => {
                        const mat = new THREE.MeshStandardMaterial({ map: res });
                        const plane = new THREE.Mesh(new THREE.PlaneGeometry(), mat);
                        plane.name = "Plane"
                        onImport(plane);
                    })
                }
            }
            handleFiles(filelist, onImport);
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
        const filelist = (e.target as HTMLInputElement).files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            const files: File[] = [];
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
    const loader = file.name.match(/\.[0-9a-z]+$/i)![0] == ".hdr" ? new HDRLoader() : new THREE.TextureLoader();
    if (loader instanceof HDRLoader)
        loader.load(
            url,
            (res) => {
                res.colorSpace = THREE.SRGBColorSpace;
                // res.flipY = true;
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
        const filelist = (e.target as HTMLInputElement).files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            const files: File[] = [];
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

export function doImportScene(onImport: OnImport<THREE.Scene>) {
    const input = document.createElement('input');
    input.type = "file";
    input.style.display = "none";
    input.multiple = false;
    input.accept = ".scene, .json";
    input.click();
    input.onchange = ((e: Event) => {
        const filelist = (e.target as HTMLInputElement).files;
        if (filelist) {
            if (filelist.length <= 0) {
                message.error("No files were selected.");
                return;
            }
            const file: File = filelist[0];
            // files.map((file) => {
            // const reader = new FileReader();
            // reader.addEventListener('load', async function (event) {
            const loader = new THREE.ObjectLoader();
            const objUrl = URL.createObjectURL(file);
            loader.load(objUrl, (object) => {
                object.name = file.name;
                if (object instanceof THREE.Scene) {
                    onImport(object);
                }
                URL.revokeObjectURL(objUrl);
            }, () => { }, (error) => {
                console.error("Failed to load scene file.", error);
                message.error("Failed to load scene file. [" + error + "]");
                URL.revokeObjectURL(objUrl);
            });

        }
        else
            message.error("FileList returned null.")
    })
}

export function doImportFile(file: File, onImport: OnImport<THREE.Object3D>) {
    if (!file) {
        message.error("No files were selected.");
        return;
    }
    handleFiles([file], onImport);
}

function handleFiles(files: File[] | FileList, onImport: OnImport<THREE.Object3D>) {
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
    for (let i = 0; i < files.length; i++) handleFile(files[i], manager, onImport);
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
    reader.addEventListener('progress', function (event) {
        const size = '(' + new Intl.NumberFormat('en-us', { useGrouping: true }).format(Math.floor(event.total / 1000)) + ' KB)';
        const progress = Math.floor((event.loaded / event.total) * 100) + '%';
        console.log('Loading', file.name, size, progress);
    });

    switch (type) {
        case ".gltf":
            reader.addEventListener('load', async function (event) {
                const contents = event.target!.result!;
                const loader = await createGLTFLoader(manager);
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
                        console.error(error);
                        message.error("Failed to load .gltf file. [" + error + "]");
                    });

            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".glb":
            reader.addEventListener('load', async (event) => {
                console.log("loading!")
                const contents = event.target!.result!;
                const loader = await createGLTFLoader();
                console.log(contents);
                loader.parse(contents, '',
                    (result) => {
                        const scene = result.scene;
                        scene.name = file.name;
                        scene.userData = result.userData;
                        scene.animations.push(...result.animations);
                        onImport(scene);

                        return scene;
                    },
                    (error) => {
                        console.error(error);
                        message.error("Failed to load .glb file. [" + error + "]");
                    });

            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".usdz":
        case ".usda":
        case ".usdc":
        case ".usd":
            reader.addEventListener('load', async function (event) {
                const contents = event.target!.result as ArrayBuffer;
                // USDLoader detects ASCII (USDA), crate (USDC) and USDZ archives from the file contents.
                // Normals are taken from the file, or computed by the loader when missing.
                // onLoad fires once all textures have loaded.
                try {
                    new USDLoader(manager).parse(contents, '',
                        (group) => {
                            group.name = file.name;
                            onImport(group);
                        },
                        (error) => {
                            console.error(error);
                            message.error("Failed to load USD model. [" + error + "]");
                        });
                }
                catch (err) {
                    console.error(err);
                    message.error("Failed to load USD model. [" + err + "]");
                }
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

async function handleZIP(data: string | ArrayBuffer | null | undefined, onImport: OnImport<THREE.Object3D>) {
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
                const blob = new Blob([file.buffer as ArrayBuffer], { type: 'application/octet-stream' });
                return URL.createObjectURL(blob);
            }
            return url;
        });

        const extension = path.match(EXTENSION_REGEX)?.[0];

        switch (extension) {

            case ".fbx": {
                const loader = new FBXLoader(manager);
                const object = loader.parse(file.buffer as ArrayBuffer, path);
                onImport(object);
                break;
            }

            case ".glb": {
                const loader = await createGLTFLoader();
                loader.parse(file.buffer as ArrayBuffer | string, '', result => {
                    console.log("test", result);
                    const scene = result.scene;
                    scene.animations.push(...result.animations);
                    onImport(scene);
                    loader.dracoLoader?.dispose();
                });
                break;
            }

            case ".gltf": {
                const loader = await createGLTFLoader(manager);
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
                const mtlPath = path.includes("/") ? path.replace(/([^/]+$)/g, matchOnMap(objMap, "mtllib")) : matchOnMap(objMap, "mtllib");

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

function createFilesMap(files: FileList | File[]) {
    const map = {} as Record<string, File>;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        map[file.name] = file;
    }
    return map;

}

export async function createGLTFLoader(manager: THREE.LoadingManager | undefined = undefined) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
    const { KTX2Loader } = await import('three/examples/jsm/loaders/KTX2Loader.js');
    const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
    const dracoLoader = new DRACOLoader(manager);
    dracoLoader.setDecoderPath('../examples/jsm/libs/draco/gltf/');

    const ktx2Loader = new KTX2Loader(manager);
    ktx2Loader.setTranscoderPath('../examples/jsm/libs/basis/');

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    return loader;
}
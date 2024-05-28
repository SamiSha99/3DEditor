import * as THREE from 'three';
import { message } from 'antd';
import { GLTFLoader, DRACOLoader, KTX2Loader, OBJLoader, USDZLoader, MTLLoader, FBXLoader} from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { computeAllVertexNormals } from '../Utils/MeshUtils';

/** Extension of the file including a dot "." */
const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; 

type OnImport = (scene: THREE.Object3D) => void;

export function doImport(onImport: OnImport) {
    const input = document.createElement('input');
    input.type = "file";
    input.style.display = "none";
    input.multiple = true;
    input.click();
    input.onchange = ((e: Event) => {
        const filelist = (e as any as React.ChangeEvent<HTMLInputElement>).target.files;
        if(filelist) {
            if(filelist.length <= 0) { 
                message.error("No files were selected.");
                return;
            }
            let files: File[] = [];
            for(let i = 0; i < filelist.length; i++) files.push(filelist[i]);
            handleFiles(files, onImport);
        }
        else
            message.error("FileList returned null.");
    });
}

export function doImportFileList(filelist: FileList, onImport: OnImport) {
    
    if(filelist.length <= 0) { 
        message.error("No files were selected.");
        return;
    }
    
    let files: File[] = [];
    for(let i = 0; i < filelist.length; i++) files.push(filelist[i]);
    handleFiles(files, onImport);
}

function handleFiles(files: File[], onImport: OnImport) {
    const manager = new THREE.LoadingManager();
    const filesMap = createFilesMap(files) as {[name:string]: File};

    manager.setURLModifier((url) => {
        url = url.replace( /^(\.?\/)/, '' );
        const file = filesMap[url];
        if(file) {
        	console.log('Loading', url);
        	return URL.createObjectURL(file);
        }
        return url;
    });

    files.forEach((file) => handleFile(file, manager, onImport));
}

function handleFile(file: File, manager: THREE.LoadingManager | null = null, onImport: OnImport) {
    const type = file.name.match(EXTENSION_REGEX)?.[0];
    
    if(!manager) {
        manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            url = url.replace( /^(\.?\/)/, '' );
            if(file) {
                console.log('Loading', url);
                return URL.createObjectURL(file);
            }
            return url;
        });
    }

    const reader = new FileReader();

    switch(type) {
        case ".gltf":
            reader.addEventListener('load', async function (event) {
                const contents = event.target?.result as string | ArrayBuffer;
                const loader = createGLTFLoader(manager);
                loader.parse(contents, '',
                (result) => {
                    const scene = result.scene;
                    scene.name = file.name;
                    scene.animations.push( ...result.animations );
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
                loader.parse(contents, '', function (result) {

                    const scene = result.scene;
                    scene.name = file.name;

                    scene.animations.push( ...result.animations );
                    loader.dracoLoader?.dispose();
                    onImport(scene);
                    return scene;
                });

            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".usdz":
            reader.addEventListener('load', async function ( event ) {

                const contents = event.target?.result as string | ArrayBuffer;

                const group = new USDZLoader().parse(contents);
                if(group.children.length <= 0)
                    message.error("Failed to load USDZ model.");
                else
                    onImport(group)

            }, false);
            reader.readAsArrayBuffer(file);
            break;
        case ".obj":
            reader.addEventListener('load', async function ( event ) {

                const contents = event.target?.result as string;

                const group = new OBJLoader().parse(contents);
                group.name = file.name;
                if(group.children.length <= 0) 
                    message.error("Failed to load OBJ model.");
                else
                    onImport(group)

            }, false);
            reader.readAsText(file);
            break;
        case ".zip":
            reader.addEventListener('load', async function ( event ) {
                handleZIP(event.target?.result, onImport);
            }, false);
            reader.readAsArrayBuffer(file);
            break;
    }
}

export function loadOBJLocalTest() {
    const manager = new THREE.LoadingManager();
    manager.setURLModifier((url) => {
        console.log(url);
        return url;
    });
    const oLoader = new OBJLoader(manager);
    const mtlLoader = new MTLLoader(manager);
    mtlLoader
    .setPath("")
    .load("outputResult.mtl", (onload) => {
        const mat = onload;
        mat.preload();
        oLoader
        .setMaterials(mat)
        .setPath("")
        .load("outputResult.obj", (object) => {
            computeAllVertexNormals(object);
            console.log(object);
        })
    });
}

function handleZIP(data: string | ArrayBuffer | null | undefined, onImport: OnImport) {
    if(!data) {
        message.error("ZIP data returned " + data);
        return;
    }

    const zip = unzipSync(new Uint8Array(data as ArrayBuffer));

    for(const path in zip) {
        const file = zip[path];
        const manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            const file = zip[url];
            if(file) {
                const blob = new Blob([file.buffer], {type: 'application/octet-stream'});
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

                if(zip[mtlPath]) {
                    let map = strFromU8(zip[mtlPath]);
                    map = modifyMap(map, "Kd", "1 1 1");
                    const mtlLoader = new MTLLoader(manager);
                    const mat = mtlLoader.parse(map, "");
                    mat.preload();
                    object = loader.setMaterials(mat).parse(strFromU8(zip[path]));
                }
                else
                    object = loader.parse(strFromU8(zip[path]));
                // i don't like this, we need to call this when textures are loaded for the object
                onImport(object);            
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
        Object.assign(map, {[file.name]:file});
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
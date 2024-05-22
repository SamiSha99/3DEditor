import * as THREE from 'three';
import { message } from 'antd';
import { GLTFLoader, DRACOLoader, KTX2Loader, OBJLoader, USDZLoader, MTLLoader, FBXLoader, MaterialInfo} from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';
import { AppStore } from '@orb_AppStore';
import { computeAllVertexNormals } from '../utils/MeshUtils';
import { exportGLB } from './Exporter';

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export async function doImport() {
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
            handleFiles(files);
        }
        else
            message.error("FileList returned null.");
    });
}

function handleFiles(files: File[]) {
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

    files.forEach((file) => handleFile(file, manager));
}

async function handleFile(file: File, manager: THREE.LoadingManager | null = null) {
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
                    pushToScene(scene);
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
                    pushToScene(scene);
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
                    pushToScene(group)

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
                    pushToScene(group)

            }, false);
            reader.readAsText(file);
            break;
        case ".zip":
            reader.addEventListener('load', async function ( event ) {
                handleZIP(event.target?.result);
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
            pushToScene(object);
        })
    });
}

async function handleZIP(data: string | ArrayBuffer | null | undefined) {
    if(!data) {
        message.error("ZIP data returned " + data);
        return;
    }
    const zip = unzipSync(new Uint8Array(data as ArrayBuffer));

    // let's see if its as simple as it gets
    if(zip["model.obj"] && zip["materials.mtl"]) {
        let materials = new MTLLoader().parse(strFromU8(zip["materials.mtl"]), "");
        materials.preload();
        const loader = new OBJLoader();
        loader.setMaterials(materials);
        const object = loader.parse(strFromU8(zip["model.obj"]));
        computeAllVertexNormals(object);
        pushToScene(object);
        // pushToScene(new THREE.AmbientLight("white", Math.PI));
    }
    // let's try searching deeper
    // else
    // {
        // let objFile: Uint8Array | null = null, mtlFile: Uint8Array | null = null;
        // for(const path in zip) {
            // if(path.match(EXTENSION_REGEX)?.[0].toLowerCase() == ".obj") objFile = zip[path];
            // if(path.match(EXTENSION_REGEX)?.[0].toLowerCase() == ".mtl") mtlFile = zip[path];
            // if(!objFile || !mtlFile) continue; 
            // 
            // const materials = new MTLLoader().parse(strFromU8(mtlFile), "");
            // const object = new OBJLoader().setMaterials(materials).parse(strFromU8(objFile));
            // computeAllVertexNormals(object);
            // pushToScene(object);
            // break;
        // }
    // }

    

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
                pushToScene(object);
                break;
            }

            case ".glb": {
                const loader = createGLTFLoader();
                loader.parse(file.buffer, '', result => {
                    const scene = result.scene;
                    scene.animations.push(...result.animations);
                    pushToScene(scene);
                    loader.dracoLoader?.dispose();
                });
                break;
            }

            case ".gltf": {
                const loader = createGLTFLoader(manager);
                loader.parse(strFromU8(file), '', result => {
                    const scene = result.scene;
                    scene.animations.push(...result.animations);
                    pushToScene(scene);
                    loader.dracoLoader?.dispose();
                });
                break;
            }
            case ".obj": {
                // get the mtl
                const objPath = path;
                for(const path in zip) {
                    if(path.match(EXTENSION_REGEX)?.[0].toLowerCase() == ".mtl") {
                        const mtlLoader = new MTLLoader(manager);
                        let newMap = strFromU8(zip[path]);
                        const newMatDtr = replaceMap(newMap);
                        console.log("newMatDtr", newMatDtr)
                        const mat = mtlLoader.parse(newMatDtr, "");
                        console.log(mat);
                        // console.log(strFromU8(zip[path]));
                        // mat.materialsInfo.Texture = {kd: [1,1,1]};
                        // console.log(mat.materialsInfo);
                        mat.getAsArray().map((mat) => {
                            console.log(mat);
                            if(mat as THREE.MeshBasicMaterial)
                                (mat as THREE.MeshBasicMaterial).color = new THREE.Color("white");
                        })
                        mat.preload();
                        const loader = new OBJLoader(manager);
                        const object = loader.setMaterials(mat).parse(strFromU8(zip[objPath]));
                        pushToScene(object);
                    }
                }
            }
        }
    }
}

function replaceMapNew(input:string, key: string, value: string) {
    
    const mapRegex = new RegExp(`/(${key}\\s+)([^\\s]+)/`);
    console.log(mapRegex);
    const res = input.replace(mapRegex, `$1${value}`);
    console.log(key,res);
    return res;
}

function replaceMap(input: string, 
    mapKd: string = "baked_mesh_tex0.png", 
    mapAo: string = "baked_mesh_ao0.png",
    mapNormals: string = "baked_mesh_norm0.png"): string {
    // Regular expression to match 'map_Kd' followed by any non-whitespace characters (the texture file name)
    const mapKdRegex = /(map_Kd\s+)([^\s]+)/;
    const mapAoRegex = /(map_ao\s+)([^\s]+)/;
    const mapNormalsRegex = /(map_tangentSpaceNormal\s+)([^\s]+)/;

    // Replace the matched texture file name with the replacement string
    let res = input.replace(mapKdRegex, `$1${mapKd}`);
    res = res.replace(mapAoRegex, `$1${mapAo}`);
    res = res.replace(mapNormalsRegex, `$1${mapNormals}`);

    return res
}

function createFilesMap(files: File[]) {
    const map = {};
    for (let i = 0; i < files.length; i++) {
        const file = files[ i ];
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

export function pushToScene(object3d: THREE.Object3D) {
    AppStore._instance.pushComponentToScene(object3d);
}
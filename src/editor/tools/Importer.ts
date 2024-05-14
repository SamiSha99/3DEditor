import * as THREE from 'three';
import { message } from 'antd';
import { GLTFLoader, DRACOLoader, KTX2Loader, OBJLoader, USDZLoader, MTLLoader, FBXLoader} from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { AppStore } from '../../store/appStore';
import { strFromU8, unzipSync } from 'three/examples/jsm/libs/fflate.module.js';

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

const MATERIALS_MTL = "materials.mtl";
const MODEL_OBJ = "model.obj";

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

function handleFile(file: File, manager: THREE.LoadingManager | null = null) {
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
                    message.error("Failed to load USDZ model.");
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

function handleZIP(data: string | ArrayBuffer | null | undefined) {
    if(!data) {
        message.error("ZIP data returned " + data);
        return;
    }
    const zip = unzipSync(new Uint8Array(data as ArrayBuffer));

    if(zip[MODEL_OBJ] && zip[MATERIALS_MTL]) {
        const materials = new MTLLoader().parse(strFromU8(zip[MATERIALS_MTL]), "");
        const object = new OBJLoader().setMaterials(materials).parse(strFromU8(zip[MODEL_OBJ]));
        pushToScene(object);
    }

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
        }
    }
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

function pushToScene(object3d: THREE.Object3D) {
    AppStore._instance.pushComponentToScene(object3d);
}
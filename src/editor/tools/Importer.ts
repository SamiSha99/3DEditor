import * as THREE from 'three';
import { message } from 'antd';
import { GLTFLoader, DRACOLoader, KTX2Loader, OBJLoader, USDZLoader} from 'three/examples/jsm/Addons.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { AppStore } from '../../store/appStore';

const EXTENSION_REGEX = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i; // Extension of the file with '.'

export async function doImport(onHandle: (result: THREE.Object3D | THREE.Object3D[] | null) => void, onError: (msg: string) => void) {
    const input = document.createElement('input');
    input.type = "file";
    input.style.display = "none";
    input.multiple = true;
    input.click();
    input.onchange = ((e: Event) => {
        const filelist = (e as any as React.ChangeEvent<HTMLInputElement>).target.files;
        if(filelist) {
            if(filelist && filelist.length <= 0) onError("No files were selected.");
            let files: File[] = [];
            for(let i = 0; i < filelist.length; i++) files.push(filelist[i]);
            handleFiles(files);
        }
        else
            onError("Null error");
    });
}

function handleFiles(files: File[]) {
    const loadingManager = new THREE.LoadingManager();
    const filesMap = createFilesMap(files) as {[name:string]: File};
        
    loadingManager.setURLModifier((url) => {
        url = url.replace( /^(\.?\/)/, '' ); // remove './'

        const file = filesMap[url];
        if(file) {
        	console.log('Loading', url);
        	return URL.createObjectURL(file);
        }

        return url;
    });
    files.forEach((file) => {
        handleFile(file, loadingManager)
    })
}

function handleFile(file: File, manager: THREE.LoadingManager | null = null) {
    const type = file.name.match(EXTENSION_REGEX)?.[0];
    if(!manager) manager = new THREE.LoadingManager();

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
                    AppStore._instance.pushComponentToScene(scene);
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
                    AppStore._instance.pushComponentToScene(scene);
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
                    AppStore._instance.pushComponentToScene(group)

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
                    AppStore._instance.pushComponentToScene(group)

            }, false);
            reader.readAsText(file);
            break;
        // default:
            // const errorMessage = "Format type \"" + type + "\" not supported!"; 
            // message.error(errorMessage)
            // console.log(errorMessage);
    }
}

function createFilesMap(files: File[]) {
    const map = {};
    for ( let i = 0; i < files.length; i ++ ) {

        const file = files[ i ];
        Object.assign(map, {[file.name]:file});
    }
    console.log(map);
    return map;

}

function createGLTFLoader(manager: THREE.LoadingManager | undefined = undefined) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../examples/jsm/libs/draco/gltf/' );

    const ktx2Loader = new KTX2Loader(manager);
    ktx2Loader.setTranscoderPath( '../examples/jsm/libs/basis/' );

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    return loader;
}
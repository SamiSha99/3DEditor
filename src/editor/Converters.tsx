import * as THREE from 'three';
import * as IMPORTER from './Importers';
import * as EXPORTER from './Exporters'

let sceneHolder: THREE.Scene | null = new THREE.Scene() ;

function initScene() {
    if(sceneHolder) return;
    
    sceneHolder = new THREE.Scene();
}

export function flushScene() {
    if(!sceneHolder) return;
    console.log("flushing..");
    while(sceneHolder.children.length) {
        sceneHolder.remove(sceneHolder.children[0]);
    }
    sceneHolder = null;
}

export async function doConversion(to: string) {
    
    flushScene();
    await IMPORTER.doImportNew((result) => {
        console.log("success on import:", result);
        EXPORTER.doExportGLTF(result);
    });
}
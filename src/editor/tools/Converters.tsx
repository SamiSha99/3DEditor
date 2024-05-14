import * as IMPORTER from './Importers';
import * as EXPORTER from './Exporters';
import * as THREE from 'three';
import { Screenshot } from './ModelPreviewer';

type ConversionTypes = ".gltf" | ".glb" | ".usdz" | ".obj"; // | ".fbx"

export async function convertObject(object: THREE.Object3D, to: string) {
    
}

export async function importThenConvert(to: ConversionTypes) {

    await IMPORTER.doImport((result) => {
        console.log("success on import:", result);
        if(result)
        {
            Screenshot(result);
            doExport(result, to);
        }
    });
}

function doExport(result: THREE.Object3D<THREE.Object3DEventMap> | null, to: ConversionTypes) {
    switch(to) {
        case ".gltf":   EXPORTER.doExportGLTF(result);          break;
        case ".glb":    EXPORTER.doExportGLTF(result, true);    break;
        case ".obj":    EXPORTER.doExportOBJ(result);           break;
        case ".usdz":   EXPORTER.doExportUSDZ(result);          break;
    }
}




import * as IMPORTER from './Importer.ts';
import * as EXPORTER from './Exporter.ts';
import * as THREE from 'three';

export type ConversionTypes = ".gltf" | ".glb" | ".usdz" | ".obj";

export function doConvert(to: ConversionTypes) {
    IMPORTER.doImport((result) => {
        console.log("success on import:", result);
        if(result)
            doExport(result, to);
    });
}

export function doConvertFileList(fileList: FileList, to: ConversionTypes) {
    IMPORTER.doImportFileList(fileList, (result) => {
        if(result)
            doExport(result, to);
    });
}

function doExport(result: THREE.Object3D<THREE.Object3DEventMap>, to: ConversionTypes) {
    
    setTimeout(() => {
        switch(to) {
            case ".gltf":   EXPORTER.exportGLTF(result);          break;
            case ".glb":    EXPORTER.exportGLB(result);           break;
            case ".obj":    EXPORTER.exportOBJ(result);           break;
            case ".usdz":   EXPORTER.exportUSDZ(result);          break;
        }
    }, 1000);
}

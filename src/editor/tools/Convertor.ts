import * as IMPORTER from './Importer.ts';
import * as EXPORTER from './Exporter.ts';
import * as THREE from 'three';

export function doConvert(options: EXPORTER.ExportOptions) {
    IMPORTER.doImport((result) => {
        console.log("success on import:", result);
        if (result)
            doExport(result, options);
    });
}

export function doConvertFileList(fileList: FileList, options: EXPORTER.ExportOptions) {
    IMPORTER.doImportFileList(fileList, (result) => {
        if (result)
            doExport(result, options);
    });
}

function doExport(result: THREE.Object3D<THREE.Object3DEventMap>, options: EXPORTER.ExportOptions) {

    setTimeout(() => {
        switch (options.type) {
            case "gltf": EXPORTER.exportGLTF(result, options); break;
            case "glb": EXPORTER.exportGLB(result, options); break;
            case "obj": EXPORTER.exportOBJ(result, options); break;
            case "usdz": EXPORTER.exportUSDZ(result, options); break;
        }
    }, 1000);
}

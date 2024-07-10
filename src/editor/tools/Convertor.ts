import * as IMPORTER from './Importer.ts';
import * as EXPORTER from './Exporter.ts';
import * as THREE from 'three';

type OnConvert = EXPORTER.OnExport;

export function doConvert(options: EXPORTER.ExportOptions, onConvert?: OnConvert) {
    IMPORTER.doImport((result) => {
        console.log("success on import:", result);
        if (result)
            doExport(result, options, (blob) => {onConvert && onConvert(blob)});
    });
}

export function doConvertFile(file: File, options: EXPORTER.ExportOptions, onConvert?: OnConvert) {
    IMPORTER.doImportFile(file, (result) => {
        if(result)
            doExport(result, options, (blob) => {onConvert && onConvert(blob)});
    })
}

export function doConvertFileList(fileList: FileList, options: EXPORTER.ExportOptions, onConvert?: OnConvert) {
    doConvertFile(fileList[0], options, (blob) => {onConvert && onConvert(blob)});
    
    // IMPORTER.doImportFileList(fileList, (result) => {
    //     if (result)
    //         doExport(result, options, (blob) => {onConvert && onConvert(blob)});
    // });
}

export function doConvertFiles(files: File[], options: EXPORTER.ExportOptions, onConvert?: OnConvert) {
    IMPORTER.doImportFiles(files, (result) => {
        if(result)
            doExport(result, options, (blob) => {onConvert && onConvert(blob)});    
    })
}

function doExport(result: THREE.Object3D<THREE.Object3DEventMap>, options: EXPORTER.ExportOptions, onExport?: EXPORTER.OnExport) {

    setTimeout(() => {
        switch (options.type) {
            case "gltf": EXPORTER.exportGLTF(result, options, (blob) => onExport && onExport(blob)); break;
            case "glb": EXPORTER.exportGLB(result, options, (blob) => onExport && onExport(blob)); break;
            case "obj": EXPORTER.exportOBJ(result, options, (blob) => onExport && onExport(blob)); break;
            case "usdz": EXPORTER.exportUSDZ(result, options, (blob) => onExport && onExport(blob)); break;
        }
    }, 1000);
}

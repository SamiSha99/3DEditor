// ########## //
// DEPRECATED //
// ########## //

// import * as IMPORTER from './Importer.ts';
// import * as EXPORTER from './Exporter.ts';
// import * as THREE from 'three';
// import { PLYExporterOptions, STLExporterOptions, USDZExporterOptions } from 'three/examples/jsm/Addons';

// type OnConvert = EXPORTER.OnExport;

// export function DEBUG_doConvertAllTypes(file: File) {
//     // doConvertFile(file, { type: "glb" }, (result) => EXPORTER.save(result, "DEBUG_Export.glb"));
//     // doConvertFile(file, { type: "gltf" }, (result) => EXPORTER.save(result, "DEBUG_Export.gltf"));
//     // doConvertFile(file, { type: "usdz" }, (result) => EXPORTER.save(result, "DEBUG_Export.usdz"));
//     // doConvertFile(file, { type: "stl" }, (result) => EXPORTER.save(result, "DEBUG_Export.stl"));
//     // doConvertFile(file, { type: "ply" }, (result) => EXPORTER.save(result, "DEBUG_Export.ply"));
//     // doConvertFile(file, { type: "obj" }, (result) => EXPORTER.save(result, "DEBUG_Export.obj"));
// }

// export function doConvert(options: EXPORTER.ExportOptions<EXPORTER.ExportParameters>, onConvert?: OnConvert) {
//     IMPORTER.doImport((result) => {
//         console.log("success on import:", result);
//         if (result)
//             doExport(result, options, (blob) => { onConvert && onConvert(blob) });
//     });
// }

// export function doConvertFile(file: File, options: EXPORTER.ExportOptions<EXPORTER.ExportParameters>, onConvert?: OnConvert) {
//     const DEBUGGING = false;
//     if (DEBUGGING)
//         DEBUG_doConvertAllTypes(file);
//     else
//         IMPORTER.doImportFile(file, (result) => {
//             if (result)
//                 doExport(result, options, (blob) => { onConvert && onConvert(blob) });
//         })
// }

// export function doConvertFileList(fileList: FileList, options: EXPORTER.ExportOptions<EXPORTER.ExportParameters>, onConvert?: OnConvert) {
//     const DEBUGGING = false;
//     if (DEBUGGING)
//         DEBUG_doConvertAllTypes(fileList[0]);
//     else
//         doConvertFile(fileList[0], options, (blob) => { onConvert && onConvert(blob) });
// }

// export function doConvertFiles(files: File[], options: EXPORTER.ExportOptions<EXPORTER.ExportParameters>, onConvert?: OnConvert) {
//     IMPORTER.doImportFiles(files, (result) => {
//         if (result)
//             doExport(result, options, (blob) => { onConvert && onConvert(blob) });
//     })
// }

// function doExport(result: THREE.Object3D<THREE.Object3DEventMap>, options: EXPORTER.ExportOptions<EXPORTER.ExportParameters>, onExport?: EXPORTER.OnExport) {

//     setTimeout(() => {
//         switch (options.type) {
//             case "gltf": EXPORTER.exportGLTF(result, options, (blob) => onExport && onExport(blob)); break;
//             case "obj": EXPORTER.exportOBJ(result, (blob) => onExport && onExport(blob)); break;
//             case "usdz": EXPORTER.exportUSDZ(result, options as EXPORTER.ExportOptions<USDZExporterOptions>, (blob) => onExport && onExport(blob)); break;
//             case "ply": EXPORTER.exportPLY(result, options as EXPORTER.ExportOptions<PLYExporterOptions>, (blob) => onExport && onExport(blob)); break;
//             case "stl": EXPORTER.exportSTL(result, options as EXPORTER.ExportOptions<STLExporterOptions>, (blob) => onExport && onExport(blob)); break;
//         }
//     }, 1000);
// }

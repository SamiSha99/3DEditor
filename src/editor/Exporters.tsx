import { GLTFExporter, OBJExporter, USDZExporter } from "three/examples/jsm/Addons.js";
import { Object3D, Object3DEventMap } from "three";

export function doExport() {
   
}

export function doExportGLTF(exportTarget: Object3D<Object3DEventMap> | Object3D<Object3DEventMap>[] | null, binary: boolean = false) {
    const exporter = new GLTFExporter();
    const object = exportTarget;
        
    if(!object) return;

    exporter.parse(
        object,
        (result: { [key: string]: any; } | ArrayBuffer) => {
            
            if(binary && result instanceof ArrayBuffer)
                exportGLB(result);
            else
                exportGLTF(result);
            
        },
        function (error) {
            console.error('Failed to export content!\n', error);
    
        },
        {binary: binary}
    );
}

export function doExportUSDZ(exportTarget: Object3D<Object3DEventMap> | Object3D<Object3DEventMap>[] | null) {
    const exporter = new USDZExporter();
    
    if(!exportTarget) return console.warn("Export type null!");

    (exporter.parse(exportTarget as Object3D, {quickLookCompatible: true, maxTextureSize:2048})).then(result => {
        exportUSDZ(result);
    }).catch((error) => {
        console.error("FAILED TO EXTRACT USDZ!!!", error);
    });
}

export function doExportOBJ(exportTarget: Object3D<Object3DEventMap> | Object3D<Object3DEventMap>[] | null) {
    const exporter = new OBJExporter();
    
    if(!exportTarget) return console.warn("Export type null!");

    const data = (exporter.parse(exportTarget as Object3D));
    exportOBJ(data);
}

function exportGLB(result: ArrayBuffer) {
    save(new Blob([result], {type: 'application/octet-stream'}), 'export.glb');
}

function exportGLTF(result: any) {
    const json = JSON.stringify(result, null, 2);
    save(new Blob([json], {type: 'application/json'}), "export.gltf");
}

function exportUSDZ(result: Uint8Array) {
    const arraybuffer = result.buffer.slice(result.byteOffset, result.byteLength + result.byteOffset);
    save(new Blob([arraybuffer], {type: 'application/octet-stream'}), "export.usdz");
}

function exportOBJ(result: string) {
    save(new Blob([result], {type: 'model/obj'}), "export.obj")
}

export function save(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
}
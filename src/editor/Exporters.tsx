import { GLTFExporter, USDZExporter } from "three/examples/jsm/Addons.js";
import { useStores } from "../App";
import { Object3D } from "three";
import { observer } from "mobx-react-lite";

export const Exporter = observer(() => {
    const {controlsObject3D, controlsTarget} = useStores();

    const doExport = (binary : boolean = true) => {
        const exporter = new GLTFExporter();
        console.log(controlsObject3D, controlsTarget)
        const object = controlsObject3D;
        
        if(!object) return;
        console.log(object);


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
    return <button onClick={() => doExport(false)}>Exporter</button>
})

// IMPORTANT NOTE!!! (For future self (Me! Sami!))
// USD/Z types only export one object, this can be literally the mesh or the scene
// Find a solution to export multiple selected objects?
export const ExporterUSDZ = () => {
    const {controlsObject3D} = useStores();

    const doExport = () => {
        const exporter = new USDZExporter();
        const object = controlsObject3D;

        (exporter.parse(object as Object3D)).then(result => {
            exportUSDZ(result);
        }).catch((error) => {
            console.error("FAILED TO EXTRACT USDZ!!!", error);
        });
    }
    return <button onClick={() => doExport()}>Exporter USDZ</button>
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

function save(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    document.body.removeChild(a);
}
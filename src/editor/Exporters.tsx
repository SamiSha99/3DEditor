import { GLTFExporter, USDZExporter } from "three/examples/jsm/Addons.js";
import { useStores } from "../App";
import { useThree } from "@react-three/fiber";
import { Object3D } from "three";

export const Exporter = () => {
    const {controlsObject3D} = useStores();

    const doExport = (binary : boolean = true) => {
        const exporter = new GLTFExporter();
        const object = controlsObject3D;
        exporter.parse(
            object,
            (result: { [key: string]: any; } | ArrayBuffer) => {
                
                if(binary && result instanceof ArrayBuffer)
                   exportGLB(result);
                else
                    exportGLTF(result);
                
            },
            function (error) {
                console.log('Failed to export content!\n', error);
        
            },
            {binary: binary}
        );
    }
    return <button onClick={() => doExport(false)}>Exporter</button>
}

// IMPORTANT NOTE!!! (For future self (Me! Sami!))
// USD/Z types only export one object, this can be literally the mesh or the scene
// Find a solution to export multiple selected objects?
export const ExporterUSDZ = () => {
    const {controlsObject3D} = useStores();

    const doExport = () => {
        const exporter = new USDZExporter();
        const object = controlsObject3D;
        (exporter.parse(object as Object3D)).then(res => {
            console.log(res);
            const arraybuffer = res.buffer.slice(res.byteOffset, res.byteLength + res.byteOffset); 
            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.href = URL.createObjectURL(new Blob( [ arraybuffer ], { type: 'application/octet-stream' } ));
            a.download = 'export.usdz';
            a.click();
            document.removeChild(a);
        }).catch((error) => {
            console.error("FAILED TO EXTRACT USDZ!!!", error);
        });
    }
    return <button onClick={() => doExport()}>Exporter USDZ</button>
}

function exportGLB(result: ArrayBuffer) {
    const a = document.createElement( 'a' );
    // workaround for firefox
    a.style.display = 'none';
    document.body.appendChild( a );
    a.href = URL.createObjectURL( new Blob( [ result ], { type: 'application/octet-stream' } ) );
    a.download = 'export.glb';
    a.click();
    document.removeChild(a);
}

function exportGLTF(result: any) {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.gltf';
    a.click();
    URL.revokeObjectURL(url);
}
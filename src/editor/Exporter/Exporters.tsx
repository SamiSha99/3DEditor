import { GLTFExporter } from "three/examples/jsm/Addons.js";
import { useStores } from "../../App";

export const Exporter = () => {
    const {controlsObject3D} = useStores()
    const doExport = (binary : boolean = true) => {
        const exporter = new GLTFExporter();
        const object = controlsObject3D;
        exporter.parse(
            object,
            (gltf: { [key: string]: any; } | ArrayBuffer) => {
                
                // glb
                if(gltf instanceof ArrayBuffer)
                {
                    const link = document.createElement( 'a' );
                    // workaround for firefox
                    link.style.display = 'none';
                    document.body.appendChild( link );
                    link.href = URL.createObjectURL( new Blob( [ gltf ], { type: 'application/octet-stream' } ) );
                    link.download = 'export.glb';
                    link.click();
                }
                // gltf
                else
                {
                    const json = JSON.stringify(gltf, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'export.gltf';
                    a.click();
                    URL.revokeObjectURL(url);
                }
            },
            function () {
        
                console.log('An error happened while exporting a', (binary ? 'GLB' : 'GTFL'), 'file');
        
            },
            {binary: binary}
        );
    }
return <button onClick={() => doExport(true)}>Exporter</button>
}
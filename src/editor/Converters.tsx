import * as IMPORTER from './Importers';
import * as EXPORTER from './Exporters';
import * as THREE from 'three';

export async function doConversion(to: string) {

    await IMPORTER.doImportNew((result) => {
        console.log("success on import:", result);
        if(result)
            Virtuealize_Canvas(result);
        switch(to) {
            case ".gltf":   EXPORTER.doExportGLTF(result);          break;
            case ".glb":    EXPORTER.doExportGLTF(result, true);    break;
            case ".obj":    EXPORTER.doExportOBJ(result);           break;
            case ".usdz":   EXPORTER.doExportUSDZ(result);          break;
            case ".fbx":    /* insert fbx here */                   break;
        }
    });
}

async function Virtuealize_Canvas(group: THREE.Object3D) {

    const width = 1024;
    const height = 1024;
    const canvas = THREE.createCanvasElement()//(width, height, { alpha: true })
    
    canvas.height = height;
    canvas.width = width;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    
    const scene = new THREE.Scene();
    scene.add(group);

    const light = new THREE.AmbientLight();
    light.intensity = 1;
    light.color.set(0xfffee0); //light yellow
    
    const camera = new THREE.PerspectiveCamera(75);

    console.log(group);
    if(group instanceof THREE.Group) {
        const bound = new THREE.Box3().setFromObject(group);
        const size = bound.getSize(new THREE.Vector3());
        const size2D = Math.max(size.x * size.y, size.x * size.z, size.z * size.y);
        const range = size2D;
        camera.position.x = -range/2;
        camera.position.y = range/2;
        camera.position.z = range;
        camera.lookAt(bound.getCenter(new THREE.Vector3()));
        console.log("Position offset is", camera.position.z, "SIZE:", size, "bound:", bound, "size2D (best):", size2D);
    }
    else {
        console.warn("Failed to set position from object, using a defaulter of 12");
        return;
    }
    
    const ambientLight = new THREE.AmbientLight('white', 1.0);
    scene.add(ambientLight);
    
    renderer.render(scene, camera);
    // setTimeout(() => save(canvas), 200);
    save(canvas);
}

function save(canvas: HTMLCanvasElement) {
    canvas.toBlob(blob => {
        if(blob)
            EXPORTER.save(blob, "preview.png");
    }, 'image/png', 1);
}
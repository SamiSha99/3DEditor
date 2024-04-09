import * as IMPORTER from './Importers';
import * as EXPORTER from './Exporters';
import * as THREE from 'three';

export async function doConversion(to: string) {

    await IMPORTER.doImportNew((result) => {
        console.log("success on import:", result);
        Virtuealize_Canvas(result);
        EXPORTER.doExportGLTF(result);
    });
}

async function Virtuealize_Canvas(objects: THREE.Object3D) {

    const width = 1024;
    const height = 1024;
    const canvas = THREE.createCanvasElement()//(width, height, { alpha: true })
    
    canvas.height = height;
    canvas.width = width;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    
    const scene = new THREE.Scene();
    scene.add(objects);
    objects.children.forEach(child => {
        if(child instanceof THREE.Mesh) {
            // (child.geometry as THREE.BufferGeometry).computeBoundingBox();
            // console.log(child.geometry);
        }
    });

    const camera = new THREE.PerspectiveCamera(75);
    
    camera.position.z = 11
    
    const ambientLight = new THREE.AmbientLight('white', 1.0);
    scene.add(ambientLight);
    
    renderer.render(scene, camera);
    setTimeout(() => save(canvas), 500);
}

function save(canvas: HTMLCanvasElement) {
    canvas.toBlob(blob => {
        if(blob)
            EXPORTER.save(blob, "preview.png");
    }, 'image/png', 1);
}
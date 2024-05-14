import * as THREE from 'three';
import * as EXPORTER from './Exporters'
import { RoomEnvironment } from 'three/examples/jsm/Addons.js';

export async function Screenshot(group: THREE.Object3D) {

    const width = 1024;
    const height = 1024;
    const canvas = THREE.createCanvasElement();
    
    canvas.height = height;
    canvas.width = width;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    
    const scene = new THREE.Scene();
    // Generate our own environment
    const pmremGen = new THREE.PMREMGenerator(renderer);
    const texture = pmremGen.fromScene(new RoomEnvironment(renderer), 0.5).texture;
    scene.background = new THREE.Color(0xE0E0E0);
    scene.environment = texture;
    
    scene.add(group);
    const camera = new THREE.PerspectiveCamera();

    console.log(group);
    if(group instanceof THREE.Group) {
        const bound = new THREE.Box3().setFromObject(group);
        const size = bound.getSize(new THREE.Vector3());
        const size2D = Math.max(size.x * size.y, size.x * size.z, size.z * size.y);
        const range = size2D;
        camera.position.x = -range/2;
        camera.position.y = range/2;
        camera.position.z = range/2;
        camera.lookAt(bound.getCenter(new THREE.Vector3()));
        console.log("Position offset is", camera.position.z, "SIZE:", size, "bound:", bound, "size2D (best):", size2D);
    }
    else {
        console.warn("Failed to set position from object, using a defaulter of 12");
        return;
    }
    
    const ambientLight = new THREE.AmbientLight('white', 1.0);
    scene.add(ambientLight);
    renderer.render(scene, camera)

    save(canvas)
}

function save(canvas: HTMLCanvasElement) {
    canvas.toBlob(blob => {
        if(blob)
            EXPORTER.save(blob, "preview.png");
    }, 'image/png', 1);
}
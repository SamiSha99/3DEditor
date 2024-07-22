import * as THREE from 'three';
import * as EXPORTER from './exporter.ts';
import { RoomEnvironment } from 'three/examples/jsm/Addons.js';
import { message } from 'antd';

export async function Screenshot(object: THREE.Object3D) {
    
    if (!(object instanceof THREE.Object3D)) {
        console.warn("Invalid object selected!");
        message.error("Invalid object selected!");
        return null;
    }

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

    scene.add(object);
    
    
    object.position.set(0, 0, 0);
    const bound = new THREE.Box3().setFromObject(object);
    const size = bound.getSize(new THREE.Vector3());
    const size2D = Math.max(size.x * size.y, size.x * size.z, size.z * size.y);
    const range = size2D;
    const camera = new THREE.PerspectiveCamera();
    camera.position.x = -range / 2;
    camera.position.y = range / 2;
    camera.position.z = range / 2;
    camera.lookAt(bound.getCenter(new THREE.Vector3()));
    console.log("Position offset is", camera.position.z, "SIZE:", size, "bound:", bound, "size2D (best):", size2D);

    const ambientLight = new THREE.AmbientLight('white', 1.0);
    scene.add(ambientLight);
    renderer.render(scene, camera)

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
    return blob as Blob;
}

function save(canvas: HTMLCanvasElement) {
    canvas.toBlob(blob => {
        if (blob)
            EXPORTER.save(blob, "preview.png");
    }, 'image/png', 1);
}
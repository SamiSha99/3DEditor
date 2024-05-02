import { EditorObject } from "../Source/EditorObject";
import * as THREE from 'three';
import { EditorObjectButton } from "../Source/EditorObjectButton";

export function GenerateButton(pushComponentToScene: (object: EditorObject) => void) {
    let mesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial());
    
    (mesh.material as THREE.MeshStandardMaterial).transparent = true;
    (mesh.material as THREE.MeshStandardMaterial).wireframe = true;
    (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ffff);

    
    const obj = new EditorObjectButton(mesh, "Button3D");
    pushComponentToScene(obj);
    return obj;
}
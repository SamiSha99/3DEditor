import * as THREE from 'three';
import { Sphere } from './Primitive';

export function Button3D() {
    const mesh = Sphere();
    (mesh.material as THREE.MeshStandardMaterial).transparent = true;
    (mesh.material as THREE.MeshStandardMaterial).color.set(0xFFB6C1);
    (mesh.material as THREE.MeshStandardMaterial).opacity = 0.5;
    mesh.name = "Button3D";
    mesh.userData = {interactable: true};
    return mesh;
}
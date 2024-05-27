import * as THREE from 'three';
import { GenerateSphere } from './Primitives';

export function GenerateButton() {
    let mesh = GenerateSphere();
    (mesh.material as THREE.MeshStandardMaterial).transparent = true;
    (mesh.material as THREE.MeshStandardMaterial).color.set(0xFFB6C1);
    (mesh.material as THREE.MeshStandardMaterial).opacity = 0.5;
    mesh.name = "Button3D";
    return mesh;
}
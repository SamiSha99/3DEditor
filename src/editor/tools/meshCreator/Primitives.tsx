import * as THREE from 'three';

export function GenerateBox() {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Box";
    return mesh;
}

export function GenerateSphere() {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Sphere";
    return mesh;
}

export function GenerateCylinder() {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Cylinder";
    return mesh;
}

export function GeneratePlane() {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Plane";
    return mesh;
}

export function GenerateCapsule() {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Capsule";
    return mesh;
}

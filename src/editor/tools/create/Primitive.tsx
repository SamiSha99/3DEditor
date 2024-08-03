import * as THREE from 'three';

export function Box() {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Box";
    return mesh;
}

export function Sphere() {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Sphere";
    return mesh;
}

export function Cylinder() {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Cylinder";
    return mesh;
}

export function Plane() {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Plane";
    return mesh;
}

export function Capsule() {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Capsule";
    return mesh;
}

export function Torus() {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Torus";
    return mesh;
}

export function Cone() {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(), new THREE.MeshStandardMaterial());
    mesh.name = "Cone";
    return mesh;
}

export function Pyramid() {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(1,1,4), new THREE.MeshStandardMaterial());
    mesh.name = "Pyramid";
    return mesh;
}

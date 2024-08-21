import * as THREE from 'three';

export function Box(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material);
    mesh.name = "Box";
    return mesh;
}

type SphereConstructorInterface = {
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number,
}

export function Sphere(
    { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength }: SphereConstructorInterface = {},
    material: THREE.Material = new THREE.MeshStandardMaterial()
) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Sphere";
    return mesh;
}

export function Cylinder(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(), material);
    mesh.name = "Cylinder";
    return mesh;
}

export function Plane(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
    mesh.name = "Plane";
    return mesh;
}

export function Capsule(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(), material);
    mesh.name = "Capsule";
    return mesh;
}

export function Torus(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(), material);
    mesh.name = "Torus";
    return mesh;
}

export function Cone(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(), material);
    mesh.name = "Cone";
    return mesh;
}

export function Pyramid(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 4), material);
    mesh.name = "Pyramid";
    return mesh;
}

export function Icosahedron(material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);
    mesh.name = "Icosahedron";
    return mesh;
}

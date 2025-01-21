import * as THREE from 'three';

export type Args<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;

export function Box(
    [width, height, depth, widthSegments, heightSegments, depthSegments]: Args<typeof THREE.BoxGeometry> = [],
    material: THREE.Material = new THREE.MeshStandardMaterial()) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments), material);
    mesh.name = "Box";
    return mesh;
}

export function Sphere(
    [radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength]: Args<typeof THREE.SphereGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Sphere";
    return mesh;
}

export function Cylinder(
    [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]: Args<typeof THREE.CylinderGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength), material);
    mesh.name = "Cylinder";
    return mesh;
}

export function Plane(
    [width, height, widthSegments, heightSegments]: Args<typeof THREE.PlaneGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, widthSegments, heightSegments), material);
    mesh.name = "Plane";
    return mesh;
}

export function Capsule(
    [radius, length, capSegments, radialSegments]: Args<typeof THREE.CapsuleGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments), material);
    mesh.name = "Capsule";
    return mesh;
}

export function Torus(
    [radius, tube, radialSegments, tubularSegments, arc]: Args<typeof THREE.TorusGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc), material);
    mesh.name = "Torus";
    return mesh;
}

export function Cone(
    [radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength]: Args<typeof THREE.ConeGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength), material);
    mesh.name = "Cone";
    return mesh;
}

// Polyhedrons

export function Tetrahedron(
    [radius, detail]: Args<typeof THREE.TetrahedronGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(radius, detail), material);
    mesh.name = "Tetrahedron";
    return mesh;
}

export function Dodecahedron(
    [radius, detail]: Args<typeof THREE.DodecahedronGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(radius, detail), material);
    mesh.name = "Dodecahedron";
    return mesh;
}

export function Octahedron(
    [radius, detail]: Args<typeof THREE.OctahedronGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(radius, detail), material);
    mesh.name = "Octahedron";
    return mesh;
}

export function Icosahedron(
    [radius, detail]: Args<typeof THREE.IcosahedronGeometry> = [],
    material = new THREE.MeshStandardMaterial()
) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, detail), material);
    mesh.name = "Icosahedron";
    return mesh;
}

// Other

export function Pyramid(material = new THREE.MeshStandardMaterial()) {
    const mesh = Cone([1, 1, 4], material);
    mesh.name = "Pyramid";
    return mesh;
}
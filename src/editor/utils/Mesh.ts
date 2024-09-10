import * as THREE from 'three';

export function computeVertexNormals(o: THREE.Object3D) {
    if (o instanceof THREE.Mesh && o.geometry instanceof THREE.BufferGeometry) {
        o.geometry.computeVertexNormals();
        return true;
    }
    return false;
}

export function computeAllVertexNormals(o: THREE.Object3D) {

    if (o instanceof THREE.Mesh && o.geometry instanceof THREE.BufferGeometry)
        o.geometry.computeVertexNormals();
    if (o.children.length == 0) return;
    o.children.forEach(child => { computeAllVertexNormals(child); });
}

/** Inverts BufferGeometry normals inside out and vice versa. */
export function invertGeometry(geometry: THREE.BufferGeometry) {
    if (!geometry.index) return;
    const index = geometry.index.array

    for (let i = 0, il = index.length / 3; i < il; i++) {
        let x = index[i * 3]
        index[i * 3] = index[i * 3 + 2]
        index[i * 3 + 2] = x
    }
    geometry.index.needsUpdate = true
}

/** Returns an additive value to Translate Geometry and its Object3D, Values are [Geometry, Position] */
export function getTranslationAmount(o: THREE.Object3D, amount: THREE.Vector3) {
    const distance = amount.distanceTo({ x: 0, y: 0, z: 0 });
    const dragDirWorld = o.worldToLocal(o.localToWorld(amount));
    dragDirWorld.transformDirection(o.matrixWorld.clone().invert()).normalize();
    // division isn't perfect to-do fix with multi axis dragging
    const t = dragDirWorld.clone().negate().multiplyScalar(distance).divide(o.scale);
    const p = dragDirWorld.clone().transformDirection(o.matrixWorld).normalize().multiplyScalar(distance);
    return [t, p] as [THREE.Vector3, THREE.Vector3];
}

export function translateOriginPoint(o: THREE.Mesh, amount: THREE.Vector3) {
    const [t, p] = getTranslationAmount(o, amount);
    const geometry = (o.geometry as THREE.BufferGeometry);
    geometry.translate(t.x, t.y, t.z);
    o.position.add(p);
}
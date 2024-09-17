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

/**
* Returns an additive value to Translate Geometry and its Object3D, Returns Vectors as [Geometry, Object] | 
* o - the Object we want to translate |
* amount - the translation amount |
* byObject - switches the translation by using the object or its origin point
*/
export function getTranslationAmount(o: THREE.Object3D, amount: THREE.Vector3, byObject?: boolean) {
    const distance = amount.distanceTo(byObject ? o.position : { x: 0, y: 0, z: 0 });
    const dragDirWorld = (byObject ? amount.clone().sub(o.position) : o.worldToLocal(o.localToWorld(amount))).normalize();
    // turn this local direction to the world direction
    dragDirWorld.transformDirection(o.matrixWorld.clone().invert());
    // division isn't perfect to-do fix with multi axis dragging
    const t = dragDirWorld.clone().negate().multiplyScalar(distance).divide(o.scale);
    const p = dragDirWorld.clone().transformDirection(o.matrixWorld).multiplyScalar(distance);
    return [t, p] as [THREE.Vector3, THREE.Vector3];
}

export function translateOriginPoint(o: THREE.Mesh, amount: THREE.Vector3, byObject?: boolean) {
    const [t, p] = getTranslationAmount(o, amount, byObject);
    const geometry = (o.geometry as THREE.BufferGeometry);
    if (!byObject) {
        geometry.translate(t.x, t.y, t.z);
        o.position.add(p);
    }
    else {
        t.negate();
        geometry.translate(t.x, t.y, t.z);
    }
}
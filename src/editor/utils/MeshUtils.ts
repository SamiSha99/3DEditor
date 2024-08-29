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
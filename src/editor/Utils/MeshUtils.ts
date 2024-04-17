import * as THREE from 'three'; 

export function computeVertexNormals(o: THREE.Object3D) {
    if(o instanceof THREE.Mesh && o.geometry instanceof THREE.BufferGeometry) {
        o.geometry.computeVertexNormals();
        return true;
    }
    return false;
}

export function computeAllVertexNormals(o: THREE.Object3D) {
    
    if(o instanceof THREE.Mesh && o.geometry instanceof THREE.BufferGeometry) {
        o.geometry.computeVertexNormals();
        console.log("computing vertexes!")
    }
    if(o.children.length == 0) return;
    o.children.forEach(child => {computeAllVertexNormals(child);});
}
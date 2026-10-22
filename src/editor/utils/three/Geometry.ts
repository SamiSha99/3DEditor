import * as THREE from 'three';
import HelvetikerFont from "../../../assets/fonts/helvetiker_regular.typeface.json";
import { BufferGeometryUtils, FontLoader } from 'three/examples/jsm/Addons';
import { Range } from '@orb_types';

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

const fl = new FontLoader();
const font = fl.parse(HelvetikerFont);
/** 
 * Converts a position into ShapeGeometry text to showcase their vertex index and position.
 *  
 * Duplicate vertices must be accounted and might be different between engines, ergo blender and WebGL 
 * https://discourse.threejs.org/t/incorrect-vertex-count/29096/4
 * 
 * to-do: FIX MEMORY LEAK WHEN REFRESHING THE PAGE (maybe window.onbeforeunload?).
 */
export function positionToText(info: { index: number, position: THREE.Vector3 | THREE.Vector3Like, setPosition?: boolean, showPosition?: boolean, color?: THREE.Color }) {
    const DEFAULT_SIZE = 0.05;

    const shapes = font.generateShapes("(" + info.index + ")" + (info.showPosition ? ` = (${info.position.x},${info.position.y},${info.position.z})` : ""), 1);
    const geometry = new THREE.ShapeGeometry(shapes, 1);
    const material = new THREE.MeshBasicMaterial();
    material.side = THREE.DoubleSide;
    !info.color && (info.color = new THREE.Color(0xFF00FF));
    material.color = info.color;
    // For clarity 
    material.depthTest = false;
    const textGeometry = new THREE.Mesh(geometry, material);
    textGeometry.name = "" + info.index;
    textGeometry.scale.multiplyScalar(DEFAULT_SIZE);
    info.setPosition && textGeometry.position.copy(info.position);
    geometry.computeBoundingBox();
    info.setPosition && geometry.translate(-geometry.boundingBox!.max.x / 2 + 0.01 * Math.random(), 0.01 * Math.random(), 0.01 * Math.random());
    return textGeometry;
}

/** Shows coordinates of every geometry's vertex */
export function geometryVertexPositionToText(geometry: THREE.BufferGeometry) {
    const group = new THREE.Group();
    if (!geometry.hasAttribute('position')) {
        console.warn(`Passed geometry has no position attribute (vertices).`)
        return group;
    }

    geometry.computeVertexNormals();
    const positionAttribute = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        group.add(positionToText({ index: i, position: vertex, setPosition: true, showPosition: false }));
    }

    group.renderOrder = 0;
    group.name = "debug_vertices (" + positionAttribute.count + ")";
    return group;
}

/** Merge vertices by tolerance of a geometry, does pre-attribute clean-up. */
export function mergeVertices(geometry: THREE.BufferGeometry, tolerance?: number) {
    geometry.deleteAttribute('normal');
    geometry.deleteAttribute('uv');
    return BufferGeometryUtils.mergeVertices(geometry, tolerance);
}

export function geometryFacePositionToText(geometry: THREE.BufferGeometry) {
    const group = new THREE.Group();
    if (!geometry.hasAttribute('position')) {
        console.warn(`Passed geometry has no position attribute (vertices) to find their faces.`);
        return group;
    }
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.index!.array;
    const vertex = new THREE.Vector3();
    const face = new THREE.Vector3();
    for (let i = 0; i < indexAttribute.length / 3; i++) {
        face.set(0, 0, 0);
        const i3 = i * 3;
        face.add(vertex.fromBufferAttribute(positionAttribute, indexAttribute[i3]));
        face.add(vertex.fromBufferAttribute(positionAttribute, indexAttribute[i3 + 1]));
        face.add(vertex.fromBufferAttribute(positionAttribute, indexAttribute[i3 + 2]));
        face.divideScalar(3);
        group.add(positionToText({ index: i, position: face, setPosition: true, showPosition: false, color: new THREE.Color(0xFF4D01) }));
    }
    group.renderOrder = 0;
    group.name = "debug_faces (" + indexAttribute.length / 3 + ")";
    return group;
}
/** 
 * Gives an index of vertices or faces or both, positioned on each of them.
 * 0 = Vertices
 * 1 = Faces
 * 2 = Both
 */
export function geometryPositionToText(geometry: THREE.BufferGeometry, mode: Range<0, 3>) {
    switch (mode) {
        case 0:
            return geometryVertexPositionToText(geometry);
        case 1:
            return geometryFacePositionToText(geometry);
        case 2:
            const group = new THREE.Group();
            group.add(geometryVertexPositionToText(geometry))
            group.add(geometryFacePositionToText(geometry))
            group.name = "debug_indexing";
            return group;
    }
}
/**
* Returns an additive value to Translate Geometry and its Object3D.
* @param o - the Object we want to translate
* @param amount - the translation amount 
* @param byObject - switches the translation by using the object or its origin point
* @return {[THREE.Vector3, THREE.Vector3]} [Geometry, Object] 
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
import * as THREE from 'three';
import { 
    Box as _Box, 
    Cylinder as _Cylinder, 
    Plane as _Plane, 
    Sphere as _Sphere} from '@react-three/drei';
import { EditorObject } from '../Source/EditorObject';


export function GenerateBox(pushComponentToScene: (object: EditorObject) => void) {
    pushComponentToScene(new EditorObject(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())));
}

export function GenerateSphere(pushComponentToScene: (object: EditorObject) => void) {
    pushComponentToScene(new EditorObject(new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial())));
}

export function GenerateCylinder(pushComponentToScene: (object: EditorObject) => void) {
    pushComponentToScene(new EditorObject(new THREE.Mesh(new THREE.CylinderGeometry(), new THREE.MeshStandardMaterial())));
}

export function GeneratePlane(pushComponentToScene: (object: EditorObject) => void) {
    pushComponentToScene(new EditorObject(new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshStandardMaterial())));
}
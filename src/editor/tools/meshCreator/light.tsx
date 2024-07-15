import * as THREE from 'three';

export function GenerateAmbientLight() {
    let light = new THREE.AmbientLight();
    light.name = "AmbientLight";
    return light;
}
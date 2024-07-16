import * as THREE from 'three';

export function GenerateAmbientLight() {
    let light = new THREE.AmbientLight();
    light.name = "AmbientLight";
    return light;
}

export function GeneratePointLight() {
    const light = new THREE.PointLight();
    light.name = "PointLight";
    return light;
}
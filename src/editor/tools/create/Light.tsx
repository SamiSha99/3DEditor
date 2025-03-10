import * as THREE from 'three';
import { CreateHelper } from './Helpers';

type GenerateInfo = {
    object: THREE.Object3D,
    helper?: THREE.Object3D
}

export function AmbientLight() {
    const light = new THREE.AmbientLight();
    light.name = "AmbientLight";
    return { object: light } as GenerateInfo;
}

export function PointLight() {
    const light = new THREE.PointLight();
    light.name = "PointLight";
    const helper = CreateHelper(THREE.PointLightHelper, light);
    return { object: light, helper: helper as THREE.PointLightHelper } as GenerateInfo;
}

export function HemisphereLight() {
    const light = new THREE.HemisphereLight(0x0088ff, 0xFFA500);
    light.name = "HemisphereLight";
    const helper = CreateHelper(THREE.HemisphereLightHelper, light);
    return { object: light, helper: helper } as GenerateInfo;
}

export function SpotLight() {
    const light = new THREE.SpotLight();
    light.name = "SpotLight";
    const helper = CreateHelper(THREE.SpotLightHelper, light);
    helper?.update();
    return { object: light, helper: helper } as GenerateInfo;
}
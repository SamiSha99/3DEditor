import { AppStore } from '@orb_AppStore';
import * as THREE from 'three';
import { PointLightHelper } from 'three';

export function GenerateAmbientLight() {
    let light = new THREE.AmbientLight();
    light.name = "AmbientLight";
    return light;
}

export function GeneratePointLight() {
    const light = new THREE.PointLight();
    light.name = "PointLight";

    const helper = new THREE.PointLightHelper(light, 1);
    helper.userData = { "object": light as THREE.Object3D };

    const geometry = new THREE.SphereGeometry(2, 4, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
    const picker = new THREE.Mesh(geometry, material);
    picker.name = 'picker';
    picker.userData = { "object": light as THREE.Object3D };
    helper.add(picker);
    AppStore.Instance.sceneHelpers.push(helper);
    // light.add(helper);
    return light;
}
import * as THREE from 'three';

const DEBUG_SHOW_HELPER = false;

export type Helpers = typeof THREE.PointLightHelper | typeof THREE.SpotLightHelper | typeof THREE.HemisphereLightHelper

export type HelperUserData = {
    "object": THREE.Object3D
}

export function CreateHelper(helper: Helpers, object: THREE.Object3D) {
    const userData = CreateUserData(object);
    let helperObject = null;
    switch (helper) {
        case THREE.PointLightHelper:
            helperObject = new THREE.PointLightHelper(object as THREE.PointLight, 1);
            break;
        case THREE.HemisphereLightHelper:
            helperObject = new THREE.HemisphereLightHelper(object as THREE.HemisphereLight, 1);
            break;
        case THREE.SpotLightHelper:
            console.log((object as THREE.SpotLight));
            console.log((object as THREE.Light));
            helperObject = new THREE.SpotLightHelper((object as THREE.SpotLight), "white");
            break;
        default:
            return helperObject;
    }

    if (helperObject) {
        helperObject.name = 'helper';
        helperObject.traverse((helperComponent) => {
            helperComponent.userData = userData;
        })
        helperObject.userData = userData;
        object.userData = {"helper": helperObject};
        const picker = CreatePicker(object);
        helperObject.add(picker);
    }
    return helperObject;
}

export function CreateUserData(object: THREE.Object3D) {
    return { "object": object } as HelperUserData;
}

export function CreatePicker(object: THREE.Object3D) {
    const geometry = new THREE.SphereGeometry(1, 4, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: DEBUG_SHOW_HELPER, visible: DEBUG_SHOW_HELPER, opacity: 0.25 });
    const picker = new THREE.Mesh(geometry, material);
    picker.name = 'picker';
    picker.userData = { "object": object } as HelperUserData;
    picker.renderOrder = DEBUG_SHOW_HELPER ? 1 : 0;
    return picker;
}
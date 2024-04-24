import * as THREE from 'three';
import { Pane } from 'tweakpane';

export function buildPane(pane: Pane, target: THREE.Object3D) {
    const type = String(typeof target)
    const PARAMS = {
        position: {x: target.position.x as number, y: target.position.y as number, z: target.position.z as number},
        rotation: {x: target.rotation.x as number, y: target.rotation.y as number, z: target.position.z as number},
        scale: {x: target.scale.x as number, y: target.scale.y as number, z: target.scale.z as number},
        type: target.type as string,
        name: target.name as string,
        visible: target.visible as boolean,
        castShadow: target.castShadow as boolean,
        receiveShadow: target.receiveShadow as boolean,
        renderOrder: target.renderOrder as number,
        parent: target.parent as THREE.Object3D
    };

    pane.addBinding(PARAMS, 'type', {label: "Type", readonly: true});    
    pane.addBinding(PARAMS, 'name', {label: "Name"}).on('change', (ev) => {target.name = ev.value;});
    pane.addBinding(PARAMS, 'position', {label: "Position"}).on('change', (ev) => {target.position.set(ev.value.x, ev.value.y, ev.value.z);});
    pane.addBinding(PARAMS, 'rotation', {label: "Rotation"}).on('change', (ev) => {target.rotation.set(ev.value.x, ev.value.y, ev.value.z);});
    pane.addBinding(PARAMS, 'scale', {label: "Scale"}).on('change', (ev) => {target.scale.set(ev.value.x, ev.value.y, ev.value.z);});
    pane.addBinding(PARAMS, 'visible', {label: "Visible"}).on('change', (ev) => {target.visible = ev.value;});
    pane.addBinding(PARAMS, 'castShadow', {label: "Cast Shadow"}).on('change', (ev) => {target.castShadow = ev.value;});
    pane.addBinding(PARAMS, 'receiveShadow', {label: "Receive Shadow"}).on('change', (ev) => {target.receiveShadow = ev.value;});
    pane.addBinding(PARAMS, 'renderOrder', {step: 1, label: "Render Order"}).on('change', (ev) => {target.renderOrder = ev.value;});
    return pane;
}

export function disposePane(pane: Pane | null) {
    if(!pane) return;
    pane.dispose();
    pane = null;
}


export function JSONtoPanel(text: string) {
    
}
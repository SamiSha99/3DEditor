import * as THREE from 'three';
import { commonKeys, getAllPropertyNames } from './Main';

/** 
 * Passes common parameters from two different material classes
 * 
 * e.g. A "MeshStandardMaterial" passing its parameters to "MeshBasicMaterial".
 */
export const passParameters = (from: THREE.Material, to: THREE.Material) => {
    const fromProps = getAllPropertyNames(from);
    const toProps = getAllPropertyNames(to);
    console.log(fromProps, toProps);
    const common = commonKeys(fromProps, toProps);
    console.log(common);
    common.forEach(c => {
        console.log((to as any)[c], "=", (from as any)[c])
        const toDescriptor = Object.getOwnPropertyDescriptor(to, c);
        const fromDescriptor = Object.getOwnPropertyDescriptor(from, c);
        if (toDescriptor && fromDescriptor && toDescriptor.writable) {
            (to as any)[c] = (from as any)[c];
        }
    });
    to.needsUpdate = true;
}
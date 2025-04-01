import * as THREE from 'three';
import { commonKeys, getAllPropertyNames } from '../Main';

/** 
 * Passes matching parameters from two different material classes
 * 
 * e.g. A "MeshStandardMaterial" passing its parameters to "MeshBasicMaterial".
 */
export const passParameters = (from: THREE.Material, to: THREE.Material, ignore: string[] = []) => {
    const fromProps = getAllPropertyNames(from);
    const toProps = getAllPropertyNames(to);
    const common = commonKeys(fromProps, toProps);
    let res = common;
    if(ignore) res = res.filter(r => !ignore.includes(r));
    res.forEach(c => {
        const toDescriptor = Object.getOwnPropertyDescriptor(to, c);
        const fromDescriptor = Object.getOwnPropertyDescriptor(from, c);
        if (toDescriptor && fromDescriptor && toDescriptor.writable) {
            (to as any)[c] = (from as any)[c];
        }
    });
    to.needsUpdate = true;
}
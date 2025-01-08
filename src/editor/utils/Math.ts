import * as THREE from 'three';
import { create, all } from 'mathjs'

const math = create(all)
/**
 * Takes inputs of a string and then evaluate, extremely limited to avoid code injection
 */
export const evaluateFormula = math.evaluate

math.import({
    // most important (hardly any functional impact)
    'import': function () { throw new Error('Function import is disabled') },
    'createUnit': function () { throw new Error('Function createUnit is disabled') },
    'reviver': function () { throw new Error('Function reviver is disabled') },

    // extra (has functional impact)
    'evaluate': function () { throw new Error('Function evaluate is disabled') },
    'parse': function () { throw new Error('Function parse is disabled') },
    'simplify': function () { throw new Error('Function simplify is disabled') },
    'derivative': function () { throw new Error('Function derivative is disabled') },
    'resolve': function () { throw new Error('Function resolve is disabled') },
    'zeros': function () { throw new Error('Function zeros is disabled') },
}, { override: true })


/** Returns a normalized vector in Quaternion form, good for direction vectors. */
export const quaternionFromNormal = (normal: THREE.Vector3Like) => {
    const quaternion = new THREE.Quaternion();
    if (normal.y > 0.9999) {
        quaternion.set(0, 0, 0, 1);
    }
    else if (normal.y < -0.9999) {
        quaternion.set(1, 0, 0, 0);
    }
    else {
        const axis = new THREE.Vector3().set(normal.z, 0, -normal.x).normalize();
        const radian = Math.acos(normal.y);
        quaternion.setFromAxisAngle(axis, radian);
    }
    return quaternion;
}

type QuatToVector3Direction = "forward" | "up" | "left";
/** Returns the vector of the passed quaternion */
export const quaternionToVector3 = (q: THREE.Quaternion, direction: QuatToVector3Direction = "up") => {
    const v = new THREE.Vector3();

    switch (direction) {
        case "forward":
            v.set(
                2 * (q.x * q.z + q.w * q.y),
                2 * (q.y * q.z - q.w * q.x),
                1 - 2 * (q.x * q.x + q.y * q.y)
            );
            break;
        case "up":
            v.set(
                2 * (q.x * q.y - q.w * q.z),
                1 - 2 * (q.x * q.x + q.z * q.z),
                2 * (q.y * q.z + q.w * q.x)
            );
            break;
        case "left":
            v.set(
                1 - 2 * (q.y * q.y + q.z * q.z),
                2 * (q.x * q.y + q.w * q.z),
                2 * (q.x * q.z - q.w * q.y)
            );
            break;
    }

    return v;
}
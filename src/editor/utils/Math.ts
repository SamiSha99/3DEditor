import * as THREE from 'three';

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
                q.x = 1 - 2 * (q.y * q.y + q.z * q.z),
                q.y = 2 * (q.x * q.y + q.w * q.z),
                q.z = 2 * (q.x * q.z - q.w * q.y)
            );
            break;
    }

    return v;
}
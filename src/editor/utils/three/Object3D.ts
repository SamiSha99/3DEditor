import { Object3D, Vector3 } from "three"

type Axis = "x" | "y" | "z"
/** Returns a vector direction of a normalized Axis default is Z similar to Object3D.getWorldDirection() */
export const getWorldDirectionByAxis = (object: Object3D, axis: Axis = "z") => {

    object.updateWorldMatrix(true, false);
    const e = object.matrixWorld.elements;
    switch (axis) {
        case "x": return new Vector3(e[0], e[1], e[2]);
        case "y": return new Vector3(e[4], e[5], e[6]);
        case "z": return new Vector3(e[8], e[9], e[10]);

    }
}
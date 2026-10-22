import * as THREE from "three";
import { ItemObject, Limit, AnyObject } from "./Item";
import { Axis, ItemAxes } from "./ItemAxes";
import { KeyToValueOfType } from "@orb_types";

const AXES: Axis[] = ["x", "y", "z", "w"];

interface QuaternionInterface<T extends AnyObject, K extends KeyToValueOfType<T, THREE.Quaternion>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string, w?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit, w?: Limit }
    onChange?: (value: THREE.Quaternion) => void
}

export const ItemQuaternion = <T extends AnyObject, K extends KeyToValueOfType<T, THREE.Quaternion>>(props: QuaternionInterface<T, K>) => {
    return <ItemAxes {...props} axes={AXES} />
}

export default ItemQuaternion;

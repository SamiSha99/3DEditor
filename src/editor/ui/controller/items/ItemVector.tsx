import * as THREE from "three";
import { ItemObject, Limit, AnyObject } from "./Item";
import { Axis, ItemAxes } from "./ItemAxes";
import { KeyToValueOfType } from "@orb_types";

const AXES_2: Axis[] = ["x", "y"];
const AXES_3: Axis[] = ["x", "y", "z"];
const AXES_4: Axis[] = ["x", "y", "z", "w"];

interface Vector2Interface<T extends AnyObject, K extends KeyToValueOfType<T, THREE.Vector2>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string },
    limit?: { x?: Limit, y?: Limit }
    onChange?: (value: THREE.Vector2) => void
}

export const ItemVector2 = <T extends AnyObject, K extends KeyToValueOfType<T, THREE.Vector2>>(props: Vector2Interface<T, K>) => {
    return <ItemAxes {...props} axes={AXES_2} hint />
}

interface Vector3Interface<T extends AnyObject, K extends KeyToValueOfType<T, THREE.Vector3>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit }
    onChange?: (value: THREE.Vector3) => void
}

export const ItemVector3 = <T extends AnyObject, K extends KeyToValueOfType<T, THREE.Vector3>>(props: Vector3Interface<T, K>) => {
    return <ItemAxes {...props} axes={AXES_3} />
}

interface Vector4Interface<T extends AnyObject, K extends KeyToValueOfType<T, THREE.Vector4>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string, w?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit, w?: Limit }
    onChange?: (value: THREE.Vector4) => void
}

export const ItemVector4 = <T extends AnyObject, K extends KeyToValueOfType<T, THREE.Vector4>>(props: Vector4Interface<T, K>) => {
    return <ItemAxes {...props} axes={AXES_4} />
}

export default { ItemVector2, ItemVector3, ItemVector4 };

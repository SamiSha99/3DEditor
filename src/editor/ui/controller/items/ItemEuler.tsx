import { Select } from "antd";
import { useState } from "react";
import * as THREE from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils";
import { ItemObject, Limit, AnyObject } from "./Item";
import { Axis, AxisUnits, ItemAxes } from "./ItemAxes";
import { KeyToValueOfType } from "@orb_types";

const orderOptions = [
    { value: "XYZ", label: "XYZ" },
    { value: "YXZ", label: "YXZ" },
    { value: "ZXY", label: "ZXY" },
    { value: "ZYX", label: "ZYX" },
    { value: "YZX", label: "YZX" },
    { value: "XZY", label: "XZY" }
];

const AXES: Axis[] = ["x", "y", "z"];
const DEGREES: AxisUnits = { toDisplay: radToDeg, fromDisplay: degToRad };
const LIMIT_DEGREES: Limit = { min: -180, max: 180 };
const LIMIT_RADIANS: Limit = { min: -Math.PI, max: Math.PI };

interface EulerInterface<T extends AnyObject, K extends KeyToValueOfType<T, THREE.Euler>> extends ItemObject<T, K> {
    labelEuler?: { x?: string, y?: string, z?: string },
    showOrder?: boolean
    isDegree?: boolean,
    onChange?: (value: THREE.Euler) => void
}

export const ItemEuler = <T extends AnyObject, K extends KeyToValueOfType<T, THREE.Euler>>(props: EulerInterface<T, K>) => {
    const { object, variable, labelEuler, showOrder, isDegree, onChange } = props;
    const limit = isDegree ? LIMIT_DEGREES : LIMIT_RADIANS;
    const [order, setOrder] = useState<THREE.EulerOrder | undefined>((object[variable] as THREE.Euler | undefined)?.order);

    return (
        <ItemAxes
            {...props}
            axes={AXES}
            labelVector={labelEuler}
            units={isDegree ? DEGREES : undefined}
            limit={{ x: limit, y: limit, z: limit }}
            step={isDegree ? 180 / 32 : Math.PI / 32}
        >
            {showOrder &&
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    Order
                    <Select
                        style={{ width: 80 }}
                        size="small"
                        value={order}
                        options={orderOptions}
                        onChange={(o: THREE.EulerOrder) => {
                            const euler = object[variable] as THREE.Euler;
                            euler.reorder(o);
                            setOrder(o);
                            onChange && onChange(euler);
                        }}
                    />
                </div>
            }
        </ItemAxes>
    )
}

export default ItemEuler;

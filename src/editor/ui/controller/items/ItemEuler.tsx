import { Form, Select, InputNumber, Tooltip, SelectProps } from "antd";
import React, { useState } from "react";
import { toFixedStripped } from "@orb_utils/Main";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { clamp, degToRad, radToDeg } from "three/src/math/MathUtils";
import { labelFromVariable, MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./SharedItemOptions";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";

// to-do: labels MAYBE as the labels specifiers?
const OrderOptions: SelectProps['options'] = [
    { value: "XYZ", label: "XYZ" },
    { value: "YXZ", label: "YXZ" },
    { value: "ZXY", label: "ZXY" },
    { value: "ZYX", label: "ZYX" },
    { value: "YZX", label: "YZX" },
    { value: "XZY", label: "XZY" }
];

type EulerInterface<T> = {
    variable: string,
    object: T,
    label?: string,
    labelEuler?: { x?: string, y?: string, z?: string },
    showOrder?: boolean
    isDegree?: boolean,
    onChange?: (value: THREE.Euler) => void
}

export const ItemEuler: React.FC<EulerInterface<{ [key: string]: any }>> = (
    { variable, object, label, labelEuler, showOrder, isDegree, onChange }
) => {

    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;

    const [x, setX] = useState<number>(object[variable].x);
    const [y, setY] = useState<number>(object[variable].y);
    const [z, setZ] = useState<number>(object[variable].z);


    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        x != object[variable].x && setX(object[variable].x)
        y != object[variable].y && setY(object[variable].y)
        z != object[variable].z && setZ(object[variable].z)
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)} style={{ marginBottom: '0px', display: 'inline-block' }}>
            <Tooltip title={toFixedStripped(isDegree ? radToDeg(x) : x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3 - 3px)' }}
                    size="small"
                    value={isDegree ? radToDeg(x) : x}
                    precision={PRECISION_AMOUNT}
                    addonBefore={labelEuler?.x ? labelEuler.x : "X"}
                    controls={false}
                    min={isDegree ? -180 : -Math.PI}
                    max={isDegree ? 180 : Math.PI}
                    step={isDegree ? 30 : Math.PI * 0.1667}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        v = isDegree ? degToRad(v) : v;
                        setX(v);
                        (object[variable] as THREE.Euler).x = v;
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    step={isDegree ? 30 : Math.PI * 0.1667}
                    onStep={(value, _rate, direction) => {
                        let clamped = 0;
                        if (isDegree)
                            clamped = degToRad(clamp(radToDeg((object[variable] as THREE.Euler).x) + value * direction, -180, 180));
                        else
                            clamped = clamp((object[variable] as THREE.Euler).x + value * direction, -Math.PI, Math.PI);
                        (object[variable] as THREE.Euler).x = clamped;
                        setX((object[variable] as THREE.Euler).x);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
            <Tooltip title={toFixedStripped(isDegree ? radToDeg(y) : y, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3 - 3px)' }}
                    size="small"
                    value={isDegree ? radToDeg(y) : y}
                    precision={PRECISION_AMOUNT}
                    addonBefore={labelEuler?.y ? labelEuler.y : "Y"}
                    controls={false}
                    min={isDegree ? -180 : -Math.PI}
                    max={isDegree ? 180 : Math.PI}
                    step={isDegree ? 30 : Math.PI * 0.1667}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        v = isDegree ? degToRad(v) : v;
                        setY(v);
                        (object[variable] as THREE.Euler).y = v;
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    step={isDegree ? 30 : Math.PI * 0.1667}
                    onStep={(value, _rate, direction) => {
                        let clamped = 0;
                        if (isDegree)
                            clamped = degToRad(clamp(radToDeg((object[variable] as THREE.Euler).y) + value * direction, -180, 180));
                        else
                            clamped = clamp((object[variable] as THREE.Euler).y + value * direction, -Math.PI, Math.PI);
                        (object[variable] as THREE.Euler).y = clamped;
                        setY((object[variable] as THREE.Euler).y);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
            <Tooltip title={toFixedStripped(isDegree ? radToDeg(z) : z, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3 - 3px)' }}
                    size="small"
                    value={isDegree ? radToDeg(z) : z}
                    precision={PRECISION_AMOUNT}
                    addonBefore={labelEuler?.z ? labelEuler.z : "Z"}
                    controls={false}
                    min={isDegree ? -180 : -Math.PI}
                    max={isDegree ? 180 : Math.PI}
                    step={isDegree ? 30 : Math.PI * 0.1667}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        v = isDegree ? degToRad(v) : v;
                        setZ(v);
                        (object[variable] as THREE.Euler).z = v;
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    step={isDegree ? 30 : Math.PI * 0.1667}
                    onStep={(value, _rate, direction) => {
                        let clamped = 0;
                        if (isDegree)
                            clamped = degToRad(clamp(radToDeg((object[variable] as THREE.Euler).z) + value * direction, -180, 180));
                        else
                            clamped = clamp((object[variable] as THREE.Euler).z + value * direction, -Math.PI, Math.PI);
                        (object[variable] as THREE.Euler).z = clamped;
                        setZ((object[variable] as THREE.Euler).z);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
            {showOrder && false &&
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 6 }} label={"Order"} style={{ marginBottom: '0px', alignItems: 'center', alignContent: 'center' }}>
                    <Tooltip title={"Order: " + order} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                        <Select
                            style={{ width: "100%" }}
                            size="small"
                            value={order}
                            options={OrderOptions}
                            onChange={(value) => {
                                // setOrder(value);
                                // onChange && onChange({
                                // x: isDegree ? radToDeg(x) : x,
                                // y: isDegree ? radToDeg(y) : y,
                                // z: isDegree ? radToDeg(z) : z,
                                // order: value,
                                // isDegree: isDegree
                                // });
                            }}
                        />
                    </Tooltip>
                </Form.Item>
            }
        </Form.Item>
    )
}

export default ItemEuler;
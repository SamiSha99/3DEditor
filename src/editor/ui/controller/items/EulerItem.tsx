import { Form, Select, InputNumber, Tooltip, SelectProps, Slider, Button } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { toFixedStripped } from "src/editor/utils/Utils";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { clamp, degToRad, radToDeg } from "three/src/math/MathUtils";
import { MOUSE_ENTER_DELAY } from "./SharedItemOptions";
import { DraggableButtonController } from "../../antd/DraggableButtonController";

type EulerInterface = {
    label?: string,
    variable: THREE.Euler
    showOrder?: boolean
    // If true, numbers are visualized in degree but the inner code is always radian regardless.
    isDegree?: boolean
    labelEuler?: { x?: string, y?: string, z?: string, order?: string },
    onChange: (value: { x: number, y: number, z: number, order: THREE.EulerOrder, isDegree?: boolean }) => void
}

// to-do: labels MAYBE as the labels specifiers?
const OrderOptions: SelectProps['options'] = [
    { value: "XYZ", label: "XYZ" },
    { value: "YXZ", label: "YXZ" },
    { value: "ZXY", label: "ZXY" },
    { value: "ZYX", label: "ZYX" },
    { value: "YZX", label: "YZX" },
    { value: "XZY", label: "XZY" }
];

export const EulerItem: React.FC<EulerInterface> = (
    { label, variable, showOrder, isDegree, labelEuler, onChange }
) => {
    const yRef = useRef<HTMLInputElement>(null);
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);
    const [z, setZ] = useState(variable.z);
    const [order, setOrder] = useState(variable.order);

    const [loopStop, loopStart, isActive] = useDeltaTime(() => {
        if (x != variable.x) setX(variable.x);
        if (y != variable.y) setY(variable.y);
        if (z != variable.z) setZ(variable.z);
        if (order != variable.order) setOrder(variable.order);
    });

    return (
        <Form.Item label={label ? label : "vector3"} style={{ marginBottom: '0px', display: 'inline-block' }}>
            <Tooltip title={toFixedStripped(isDegree ? radToDeg(x) : x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>

                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3)' }}
                    size="small"
                    value={isDegree ? radToDeg(x) : x}
                    precision={isDegree ? 2 : 3}
                    addonBefore={labelEuler?.x ? labelEuler.x : "X"}
                    controls={false}
                    min={isDegree ? -180 : -Math.PI}
                    max={isDegree ? 180 : Math.PI}
                    step={isDegree ? 60 : 1}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setX(isDegree ? degToRad(v) : v);
                        onChange && onChange({
                            x: v,
                            y: isDegree ? radToDeg(y) : y,
                            z: isDegree ? radToDeg(z) : z,
                            order: order,
                            isDegree: isDegree
                        });
                    }} />
            </Tooltip>
            <Tooltip title={toFixedStripped(isDegree ? radToDeg(y) : y, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    ref={yRef}
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3)' }}
                    size="small"
                    value={isDegree ? radToDeg(y) : y}
                    precision={isDegree ? 2 : 3}
                    addonBefore={labelEuler?.y ? labelEuler.y : "Y"}
                    controls={false}
                    min={isDegree ? -180 : -Math.PI}
                    max={isDegree ? 180 : Math.PI}
                    step={isDegree ? 60 : 1}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setY(isDegree ? degToRad(v) : v);
                        onChange && onChange({
                            x: isDegree ? radToDeg(x) : x,
                            y: v,
                            z: isDegree ? radToDeg(z) : z,
                            order: order,
                            isDegree: isDegree
                        });
                    }} />
                {/* <DraggableButtonController
                    step={isDegree ? 60 : 1}
                    onStep={(v, rate) => {
                        console.log("WHY IS:", y)
                        v = (isDegree ? radToDeg(y) : y) + v;
                        const newvalue = clamp((isDegree ? radToDeg(y) : y) + v, isDegree ? -180 : -Math.PI, isDegree ? 180 : Math.PI);
                        onChange && onChange({
                            x: isDegree ? radToDeg(x) : x,
                            y: newvalue,
                            z: isDegree ? radToDeg(z) : z,
                            order: order,
                            isDegree: isDegree
                        })
                        setY(isDegree ? degToRad(newvalue) : newvalue);
                    }}
                /> */}
            </Tooltip>
            <Tooltip title={toFixedStripped(isDegree ? radToDeg(z) : z, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3)' }}
                    size="small"
                    value={isDegree ? radToDeg(z) : z}
                    precision={isDegree ? 2 : 3}
                    addonBefore={labelEuler?.z ? labelEuler.z : "Z"}
                    controls={false}
                    min={isDegree ? -180 : -Math.PI}
                    max={isDegree ? 180 : Math.PI}
                    step={isDegree ? 60 : 1}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setZ(isDegree ? degToRad(v) : v);
                        onChange && onChange({
                            x: isDegree ? radToDeg(x) : x,
                            y: isDegree ? radToDeg(y) : y,
                            z: v,
                            order: order,
                            isDegree: isDegree
                        });
                    }} />
            </Tooltip>
            {showOrder &&
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 6 }} label={"Order"} style={{ marginBottom: '0px', alignItems: 'center', alignContent: 'center' }}>
                    <Tooltip title={"Order: " + order} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                        <Select
                            style={{ width: "100%" }}
                            size="small"
                            value={order}
                            options={OrderOptions}
                            onChange={(value) => {
                                setOrder(value);
                                onChange && onChange({
                                    x: isDegree ? radToDeg(x) : x,
                                    y: isDegree ? radToDeg(y) : y,
                                    z: isDegree ? radToDeg(z) : z,
                                    order: value,
                                    isDegree: isDegree
                                });
                            }}
                        />
                    </Tooltip>
                </Form.Item>
            }
        </Form.Item>

    )
}

export default EulerItem;
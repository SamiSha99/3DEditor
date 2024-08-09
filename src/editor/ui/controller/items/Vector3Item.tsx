import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { toFixedStripped } from "src/editor/utils/Utils";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./SharedItemOptions";

type Vector3Interface = {
    label?: string,
    variable: THREE.Vector3
    labelVector?: { x?: string, y?: string, z?: string },
    onChange: (value: { x: number, y: number, z: number }) => void
}

export const Vector3Item: React.FC<Vector3Interface> = (
    { label, variable, labelVector, onChange }
) => {
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);
    const [z, setZ] = useState(variable.z);

    const [loopStop, loopStart, isActive] = useDeltaTime((delta) => {
        if (x != variable.x) setX(variable.x);
        if (y != variable.y) setY(variable.y);
        if (z != variable.z) setZ(variable.z);
    });

    return (
        <Form.Item label={label ? label : "Vector3"}>
            <Tooltip title={toFixedStripped(x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3)' }}
                    size="small"
                    precision={3}
                    controls={true}
                    changeOnWheel
                    value={x}
                    addonBefore={labelVector?.x ? labelVector.x : "X"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setX(v);
                        onChange && onChange({ x: v, y: y, z: z });
                    }} />
            </Tooltip>
            <Tooltip title={toFixedStripped(y, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3)' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    controls={true}
                    changeOnWheel
                    value={y}
                    addonBefore={labelVector?.y ? labelVector.y : "Y"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setY(v);
                        onChange && onChange({ x: x, y: v, z: z });
                    }} />
            </Tooltip>
            <Tooltip title={toFixedStripped(z, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: 'calc(100%/3)' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    controls={true}
                    changeOnWheel
                    value={z}
                    addonBefore={labelVector?.z ? labelVector.z : "Z"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setZ(v);
                        onChange && onChange({ x: x, y: y, z: v });
                    }} />
            </Tooltip>
        </Form.Item>

    )
}

export default Vector3Item;
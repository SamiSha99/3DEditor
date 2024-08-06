import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { toFixedStripped } from "src/editor/utils/Utils";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { MOUSE_ENTER_DELAY } from "./SharedItemOptions";

type Vector3Interface = {
    label?: string,
    variable: THREE.Vector3
    labelVector?: { x?: string, y?: string, z?: string },
    onChange: (value: { x: number, y: number, z: number } | null) => void
}

export const Vector3Item: React.FC<Vector3Interface> = (
    { label, variable, labelVector, onChange, ...prop }
) => {
    const defaultVector = { x: variable.x, y: variable.y, z: variable.z }
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);
    const [z, setZ] = useState(variable.z);

    const [loopStop, loopStart, isActive] = useDeltaTime((delta) => {
        if (x != variable.x) setX(variable.x);
        if (y != variable.y) setY(variable.y);
        if (z != variable.z) setZ(variable.z);
    });

    return (
        <Form.Item label={label ? label : "Vector3"} style={{ marginBottom: '0px', display: 'inline-block' }}>
            <Tooltip title={`X: ${toFixedStripped(x, 3)}`} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    style={{ width: '33%' }}
                    size="small"
                    defaultValue={defaultVector.x}
                    value={x}
                    precision={3}
                    addonBefore={labelVector?.x ? labelVector.x : "X"}
                    controls={false}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setX(v);
                        onChange && onChange({ x: v, y: y, z: z });
                    }} />
            </Tooltip>
            <Tooltip title={`Y: ${toFixedStripped(y, 3)}`} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    style={{ width: '33%' }}
                    size="small"
                    defaultValue={defaultVector.y}
                    value={y}
                    precision={3}
                    addonBefore={labelVector?.y ? labelVector.y : "Y"}
                    controls={false}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setY(v);
                        onChange && onChange({ x: x, y: v, z: z });
                    }} />
            </Tooltip>
            <Tooltip title={`Z: ${toFixedStripped(z, 3)}`} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    style={{ width: '33%' }}
                    size="small"
                    defaultValue={defaultVector.z}
                    value={z}
                    precision={3}
                    addonBefore={labelVector?.z ? labelVector.z : "Z"}
                    controls={false}
                    changeOnWheel
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
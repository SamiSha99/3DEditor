import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import * as THREE from "three";
import { MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./SharedItemOptions";
import { useDeltaTime } from "src/store/Hooks";

type Vector2Interface = {
    label?: string,
    variable: THREE.Vector2
    labelVector2?: { x?: string, y?: string },
    onChange: (value: { x: number, y: number } | null) => void
};

export const Vector2Item: React.FC<Vector2Interface> = (
    { label, labelVector2, variable, onChange }
) => {
    const defaultVector2 = { x: variable.x, y: variable.y }
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);

    const [loopStop, loopStart, isActive] = useDeltaTime(() => {
        if (x != variable.x) setX(variable.x);
        if (y != variable.y) setY(variable.y);
    });

    return (
        <Form.Item label={label ? label : "Vector2"}>
            <Tooltip title={x} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: '50%' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    defaultValue={defaultVector2.x}
                    value={x}
                    addonBefore={labelVector2?.x}
                    controls={false}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setX(v)
                        onChange && onChange({ x: v, y: y });
                    }} />
            </Tooltip>
            <Tooltip title={y} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ width: '50%' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    defaultValue={defaultVector2.y}
                    value={y}
                    addonBefore={labelVector2?.y}
                    controls={false}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setY(v);
                        onChange && onChange({ x: x, y: v });
                    }} />
            </Tooltip>
        </Form.Item>
    )
}

export default Vector2Item;
import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { toFixedStripped } from "src/editor/utils/Utils";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { labelFromVariable, MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./SharedItemOptions";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";

type Vector2Interface<T> = {
    label?: string,
    object: T,
    variable: string,
    labelVector?: { x?: string, y?: string, z?: string },
    onChange?: (value: THREE.Vector2) => void
}

export const ItemVector2: React.FC<Vector2Interface<{ [key: string]: any }>> = (
    { label, object, variable, labelVector, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [x, setX] = useState<number>(object[variable].x);
    const [y, setY] = useState<number>(object[variable].y);


    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        x != object[variable].x && setX(object[variable].x)
        y != object[variable].y && setY(object[variable].y)
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={toFixedStripped(x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ width: 'calc(50%/3 - 3px)' }}
                    size="small"
                    precision={3}
                    controls={false}
                    changeOnWheel
                    value={x}
                    addonBefore={labelVector?.x ? labelVector.x : "X"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        (object[variable] as THREE.Vector2).setX(v);
                        setX(v);
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector2).x + value * direction;
                        const res = (object[variable] as THREE.Vector2).setX(newVal).x;
                        setX(res);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
            <Tooltip title={toFixedStripped(y, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ width: 'calc(50%/3 - 3px)' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    controls={false}
                    changeOnWheel
                    value={y}
                    addonBefore={labelVector?.y ? labelVector.y : "Y"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        (object[variable] as THREE.Vector2).setY(v);
                        setY(v);
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector2).y + value * direction;
                        const res = (object[variable] as THREE.Vector2).setY(newVal).y;
                        setY(res);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
        </Form.Item>

    )
}

type Vector3Interface<T> = {
    label?: string,
    object: T,
    variable: string,
    labelVector?: { x?: string, y?: string, z?: string },
    onChange?: (value: THREE.Vector3) => void
}

export const ItemVector3: React.FC<Vector3Interface<{ [key: string]: any }>> = (
    { label, object, variable, labelVector, onChange }
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
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={toFixedStripped(x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ width: 'calc(100%/3 - 3px)' }}
                    size="small"
                    precision={3}
                    controls={false}
                    changeOnWheel
                    value={x}
                    addonBefore={labelVector?.x ? labelVector.x : "X"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        (object[variable] as THREE.Vector3).setX(v);
                        setX(v);
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector3).x + value * direction;
                        const res = (object[variable] as THREE.Vector3).setX(newVal).x;
                        setX(res);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
            <Tooltip title={toFixedStripped(y, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ width: 'calc(100%/3 - 3px)' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    controls={false}
                    changeOnWheel
                    value={y}
                    addonBefore={labelVector?.y ? labelVector.y : "Y"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        (object[variable] as THREE.Vector3).setY(v);
                        setY(v);
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector3).y + value * direction;
                        const res = (object[variable] as THREE.Vector3).setY(newVal).y;
                        setY(res);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
            <Tooltip title={toFixedStripped(z, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ width: 'calc(100%/3 - 3px)' }}
                    size="small"
                    precision={PRECISION_AMOUNT}
                    controls={false}
                    changeOnWheel
                    value={z}
                    addonBefore={labelVector?.z ? labelVector.z : "Z"}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        (object[variable] as THREE.Vector3).setZ(v);
                        setZ(v);
                        onChange && onChange(object[variable]);
                    }} />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector3).z + value * direction;
                        const res = (object[variable] as THREE.Vector3).setZ(newVal).z;
                        setZ(res);
                        onChange && onChange(object[variable]);
                    }}
                />
            </Tooltip>
        </Form.Item>

    )
}

export default {ItemVector2, ItemVector3};
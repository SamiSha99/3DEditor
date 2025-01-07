import { Form, InputNumberProps, Tooltip } from "antd";
import { useState } from "react";
import { toFixedStripped } from "@orb_utils/Main";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { DRAGGABLE_CONTROLLER_WIDTH, Item, labelFromVariable, Limit, MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";
import { InputNumberStyle } from "./style";

const defaultProps: InputNumberProps<number> = {
    size: "small",
    controls: false,
    changeOnWheel: true,
    formatter: (v) => { return `${!v ? 0 : toFixedStripped(v, PRECISION_AMOUNT)}` },
    parser: (v) => v as unknown as number,
}

const vector2Props: InputNumberProps<number> = {
    style: { width: 'calc(100%/2 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    ...defaultProps
}

const vector3Props: InputNumberProps<number> = {
    style: { width: 'calc(100%/3 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    ...defaultProps
}

interface Vector2Interface extends Item {
    precision?: number | false,
    labelVector?: { x?: string, y?: string },
    limit?: { x?: Limit, y?: Limit }
    onChange?: (value: THREE.Vector2) => void
}

export const ItemVector2 = (props: Vector2Interface) => {
    let { label, labelInVariable, precision, object, variable, labelVector, limit, onChange, tooltip } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [x, setX] = useState<number>(object[variable].x);
    const [y, setY] = useState<number>(object[variable].y);


    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        x != object[variable].x && setX(object[variable].x)
        y != object[variable].y && setY(object[variable].y)
    });



    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <Tooltip title={toFixedStripped(x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumberStyle
                    {...vector2Props}
                    onFocus={loopStop}
                    onBlur={loopStart}
                    precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                    value={x}
                    min={limit?.x?.min}
                    max={limit?.x?.max}
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
                <InputNumberStyle
                    {...vector2Props}
                    onFocus={loopStop}
                    onBlur={loopStart}
                    precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                    value={y}
                    min={limit?.y?.min}
                    max={limit?.y?.max}
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

interface Vector3Interface extends Item {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit }
    onChange?: (value: THREE.Vector3) => void
}

export const ItemVector3 = (props: Vector3Interface) => {
    let { label, labelInVariable, object, variable, precision, labelVector, limit, onChange, tooltip } = props;
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
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <InputNumberStyle
                {...vector3Props}
                onFocus={loopStop}
                onBlur={loopStart}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={x}
                min={limit?.x?.min}
                max={limit?.x?.max}
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
            <InputNumberStyle
                {...vector3Props}
                onFocus={loopStop}
                onBlur={loopStart}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={y}
                min={limit?.y?.min}
                max={limit?.y?.max}
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
                onDragEnd={() => {
                    onChange && onChange(object[variable]);
                }}
            />
            <InputNumberStyle
                {...vector3Props}
                onFocus={loopStop}
                onBlur={loopStart}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={z}
                min={limit?.z?.min}
                max={limit?.z?.max}
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
        </Form.Item >

    )
}

export default { ItemVector2, ItemVector3 };
import { Form, InputNumberProps } from "antd";
import { useState } from "react";
import { toFixedStripped } from "@orb_utils/Main";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { DRAGGABLE_CONTROLLER_WIDTH, ItemObject, labelFromVariable, Limit, PRECISION_AMOUNT } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";
import { InputNumberStyle } from "./style";
import { evaluateFormula } from "@orb_utils/Math";
import { KeyToValueOfType } from "@orb_types";

const defaultProps: InputNumberProps<number> = {
    size: "small",
    controls: false,
    changeOnWheel: true,
    formatter: (v: any) => { return `${!v ? 0 : toFixedStripped(v, PRECISION_AMOUNT)}` },
    parser: (v) => v as unknown as number,
}

const quaternionProps: InputNumberProps<number> = {
    style: { width: 'calc(100%/4 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    ...defaultProps
}

interface QuaternionInterface<T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Quaternion>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string, w?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit, w?: Limit }
    onChange?: (value: THREE.Quaternion) => void
}

export const ItemQuaternion = <T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Quaternion>>(props: QuaternionInterface<T, K>) => {
    let { label, labelInVariable, object, variable, precision, labelVector, limit, onChange, tooltip } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [x, setX] = useState<number>(object[variable].x);
    const [y, setY] = useState<number>(object[variable].y);
    const [z, setZ] = useState<number>(object[variable].z);
    const [w, setW] = useState<number>(object[variable].w);


    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        x != object[variable].x && setX(object[variable].x)
        y != object[variable].y && setY(object[variable].y)
        z != object[variable].z && setZ(object[variable].z)
        w != object[variable].w && setW(object[variable].w)
    });

    const onChangeQuaternion = (v: { x?: number, y?: number, z?: number, w?: number }) => {
        (object[variable] as THREE.Quaternion).set(
            v.x ?? x,
            v.y ?? y,
            v.z ?? z,
            v.w ?? w
        );
        v.x != undefined && setX(v.x);
        v.y != undefined && setY(v.y);
        v.z != undefined && setZ(v.z);
        v.w != undefined && setW(v.w);
        onChange && onChange(object[variable]);
    }

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <InputNumberStyle
                {...quaternionProps}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeQuaternion({ x: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeQuaternion({ x: v });
                    }
                }}
                precision={precision == false ? 0 : precision ?? PRECISION_AMOUNT}
                value={x}
                min={limit?.x?.min}
                max={limit?.x?.max}
                addonBefore={labelVector?.x ? labelVector.x : "X"}
                onChange={(v) => v != undefined && onChangeQuaternion({ x: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Quaternion).x + value * direction;
                    (object[variable] as THREE.Quaternion).x = newVal;
                    onChangeQuaternion({ x: newVal });
                }}
            />
            <InputNumberStyle
                {...quaternionProps}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeQuaternion({ y: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeQuaternion({ y: v });
                    }
                }}
                precision={precision == false ? 0 : precision ?? PRECISION_AMOUNT}
                value={y}
                min={limit?.y?.min}
                max={limit?.y?.max}
                addonBefore={labelVector?.y ? labelVector.y : "Y"}
                onChange={(v) => v != undefined && onChangeQuaternion({ y: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Quaternion).y + value * direction;
                    (object[variable] as THREE.Quaternion).y = newVal;
                    onChangeQuaternion({ y: newVal });
                }}
            />
            <InputNumberStyle
                {...quaternionProps}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeQuaternion({ z: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeQuaternion({ z: v });
                    }
                }}
                precision={precision == false ? 0 : precision ?? PRECISION_AMOUNT}
                value={z}
                min={limit?.z?.min}
                max={limit?.z?.max}
                addonBefore={labelVector?.z ? labelVector.z : "Z"}
                onChange={(v) => v != undefined && onChangeQuaternion({ z: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Quaternion).z + value * direction;
                    (object[variable] as THREE.Quaternion).z = newVal;
                    onChangeQuaternion({ z: newVal });
                }}
            />
            <InputNumberStyle
                {...quaternionProps}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeQuaternion({ w: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeQuaternion({ w: v });
                    }
                }}
                precision={precision == false ? 0 : precision ?? PRECISION_AMOUNT}
                value={w}
                min={limit?.w?.min}
                max={limit?.w?.max}
                addonBefore={labelVector?.w ? labelVector.w : "W"}
                onChange={(v) => v != undefined && onChangeQuaternion({ w: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Quaternion).w + value * direction;
                    (object[variable] as THREE.Quaternion).w = newVal;
                    onChangeQuaternion({ w: newVal });
                }}
            />
        </Form.Item >
    )
}
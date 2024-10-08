import { Form, Select, InputNumber, SelectProps, InputNumberProps } from "antd";
import React, { useState } from "react";
import { toFixedStripped } from "@orb_utils/Main";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { clamp, degToRad, radToDeg } from "three/src/math/MathUtils";
import { DRAGGABLE_CONTROLLER_WIDTH, Item, labelFromVariable, PRECISION_AMOUNT } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";

const orderOptions = [
    { value: "XYZ", label: "XYZ" },
    { value: "YXZ", label: "YXZ" },
    { value: "ZXY", label: "ZXY" },
    { value: "ZYX", label: "ZYX" },
    { value: "YZX", label: "YZX" },
    { value: "XZY", label: "XZY" }
];

const eulerProps: InputNumberProps<number> = {
    precision: PRECISION_AMOUNT,
    controls: false,
    changeOnWheel: true,
    formatter: (v) => { return `${!v ? 0 : toFixedStripped(v, PRECISION_AMOUNT)}°` },
    parser: (v) => v as unknown as number,
    style: { width: 'calc(100%/3 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    size: "small"
}

interface EulerInterface extends Item {
    labelEuler?: { x?: string, y?: string, z?: string },
    showOrder?: boolean
    isDegree?: boolean,
    onChange?: (value: THREE.Euler) => void
}

export const ItemEuler: React.FC<EulerInterface> = (
    { variable, object, label, labelInVariable, labelEuler, showOrder, isDegree, onChange, tooltip }
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

    const props: InputNumberProps<number> = {
        min: isDegree ? -180 : -Math.PI,
        max: isDegree ? 180 : Math.PI,
        step: isDegree ? 180 / 32 : Math.PI / 32,
        onFocus: () => loopStop(),
        onBlur: () => loopStart()
    }

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} style={{ marginBottom: '0px', display: 'inline-block' }} tooltip={tooltip}>
            <InputNumber
                {...eulerProps}
                {...props}
                value={isDegree ? radToDeg(x) : x}
                addonBefore={labelEuler?.x ? labelEuler.x : "X"}
                onChange={(v: number | null) => {
                    if (v == null) return;
                    v = isDegree ? degToRad(v) : v;
                    setX(v);
                    (object[variable] as THREE.Euler).x = v;
                    onChange && onChange(object[variable]);
                }} />
            <DraggableButtonController
                step={props.step as number}
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
            <InputNumber
                {...eulerProps}
                {...props}
                value={isDegree ? radToDeg(y) : y}
                addonBefore={labelEuler?.y ? labelEuler.y : "Y"}
                onChange={(v: number | null) => {
                    if (v == null) return;
                    v = isDegree ? degToRad(v) : v;
                    setY(v);
                    (object[variable] as THREE.Euler).y = v;
                    onChange && onChange(object[variable]);
                }} />
            <DraggableButtonController
                step={props.step as number}
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
            <InputNumber
                {...eulerProps}
                {...props}
                value={isDegree ? radToDeg(z) : z}
                addonBefore={labelEuler?.z ? labelEuler.z : "Z"}
                onChange={(v: number | null) => {
                    if (v == null) return;
                    v = isDegree ? degToRad(v) : v;
                    setZ(v);
                    (object[variable] as THREE.Euler).z = v;
                    onChange && onChange(object[variable]);
                }} />
            <DraggableButtonController
                step={props.step as number}
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
            {showOrder &&
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 6 }} label={"Order"} style={{ marginBottom: '0px', alignItems: 'center', alignContent: 'center' }}>
                    <Select
                        style={{ width: "100%" }}
                        size="small"
                        value={orderOptions[0]}
                        options={orderOptions}
                        labelInValue={true}
                    />
                </Form.Item>
            }
        </Form.Item>
    )
}

export default ItemEuler;
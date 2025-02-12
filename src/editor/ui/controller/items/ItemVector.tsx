import { Form, InputNumberProps, Tooltip } from "antd";
import { useState } from "react";
import { toFixedStripped } from "@orb_utils/Main";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";
import { DRAGGABLE_CONTROLLER_WIDTH, ItemObject, labelFromVariable, Limit, MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./Item";
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

const vector2Props: InputNumberProps<number> = {
    style: { width: 'calc(100%/2 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    ...defaultProps
}

const vector3Props: InputNumberProps<number> = {
    style: { width: 'calc(100%/3 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    ...defaultProps
}

const vector4Props: InputNumberProps<number> = {
    style: { width: 'calc(100%/4 - ' + DRAGGABLE_CONTROLLER_WIDTH + ')' },
    ...defaultProps
}

interface Vector2Interface<T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Vector2>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string },
    limit?: { x?: Limit, y?: Limit }
    onChange?: (value: THREE.Vector2) => void
}

export const ItemVector2 = <T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Vector2>>(props: Vector2Interface<T, K>) => {
    let { label, labelInVariable, precision, object, variable, labelVector, limit, onChange, tooltip } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [x, setX] = useState<number>(object[variable].x);
    const [y, setY] = useState<number>(object[variable].y);


    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        x != object[variable].x && setX(object[variable].x)
        y != object[variable].y && setY(object[variable].y)
    });

    const onChangeVector2 = (v: { x?: number, y?: number }) => {
        (object[variable] as THREE.Vector2).set(
            v.x != undefined ? v.x : x,
            v.y != undefined ? v.y : y
        );
        v.x != undefined && setX(v.x);
        v.y != undefined && setY(v.y);
        onChange && onChange(object[variable]);
    }
    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <Tooltip title={toFixedStripped(x, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumberStyle
                    {...vector2Props}
                    onFocus={loopStop}
                    onBlur={loopStart}
                    onKeyDown={(e) => {
                        if (e.code == "Enter") {
                            const v = evaluateFormula((e.target as HTMLInputElement).value);
                            v != null && onChangeVector2({ x: v });
                        }
                    }}
                    precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                    value={x}
                    min={limit?.x?.min}
                    max={limit?.x?.max}
                    addonBefore={labelVector?.x ? labelVector.x : "X"}
                    onChange={(v) => { v != undefined && onChangeVector2({ x: v }) }}
                />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector2).x + value * direction;
                        const res = (object[variable] as THREE.Vector2).setX(newVal).x;
                        onChangeVector2({ x: res as number });
                    }}
                />
            </Tooltip>
            <Tooltip title={toFixedStripped(y, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumberStyle
                    {...vector2Props}
                    onFocus={loopStop}
                    onBlur={loopStart}
                    onKeyDown={(e) => {
                        if (e.code == "Enter") {
                            const v = evaluateFormula((e.target as HTMLInputElement).value);
                            v != null && onChangeVector2({ y: v });
                        }
                    }}
                    precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                    value={y}
                    min={limit?.y?.min}
                    max={limit?.y?.max}
                    addonBefore={labelVector?.y ? labelVector.y : "Y"}
                    onChange={(v) => { v != undefined && onChangeVector2({ y: v }) }}
                />
                <DraggableButtonController
                    onStep={(value, _rate, direction) => {
                        const newVal = (object[variable] as THREE.Vector2).y + value * direction;
                        const res = (object[variable] as THREE.Vector2).setY(newVal).y;
                        onChangeVector2({ y: res as number });
                    }}
                />
            </Tooltip>
        </Form.Item>

    )
}

interface Vector3Interface<T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Vector3>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit }
    onChange?: (value: THREE.Vector3) => void
}

export const ItemVector3 = <T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Vector3>>(props: Vector3Interface<T, K>) => {
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

    const onChangeVector3 = (v: { x?: number, y?: number, z?: number }) => {
        (object[variable] as THREE.Vector3).set(
            v.x != undefined ? v.x : x,
            v.y != undefined ? v.y : y,
            v.z != undefined ? v.z : z
        );
        v.x != undefined && setX(v.x);
        v.y != undefined && setY(v.y);
        v.z != undefined && setZ(v.z);
        onChange && onChange(object[variable]);
    }

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <InputNumberStyle
                {...vector3Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector3({ x: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector3({ x: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={x}
                min={limit?.x?.min}
                max={limit?.x?.max}
                addonBefore={labelVector?.x ? labelVector.x : "X"}
                onChange={(v) => v != undefined && onChangeVector3({ x: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector3).x + value * direction;
                    const res = (object[variable] as THREE.Vector3).setX(newVal).x;
                    onChangeVector3({ x: res });
                }}
            />
            <InputNumberStyle
                {...vector3Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector3({ y: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector3({ y: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={y}
                min={limit?.y?.min}
                max={limit?.y?.max}
                addonBefore={labelVector?.y ? labelVector.y : "Y"}
                onChange={(v) => v != undefined && onChangeVector3({ y: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector3).y + value * direction;
                    const res = (object[variable] as THREE.Vector3).setY(newVal).y;
                    onChangeVector3({ y: res });
                }}
            />
            <InputNumberStyle
                {...vector3Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector3({ z: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector3({ z: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={z}
                min={limit?.z?.min}
                max={limit?.z?.max}
                addonBefore={labelVector?.z ? labelVector.z : "Z"}
                onChange={(v) => v != undefined && onChangeVector3({ z: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector3).z + value * direction;
                    const res = (object[variable] as THREE.Vector3).setZ(newVal).z;
                    onChangeVector3({ z: res });
                }}
            />
        </Form.Item >

    )
}

interface Vector4Interface<T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Vector4>> extends ItemObject<T, K> {
    precision?: number | false,
    labelVector?: { x?: string, y?: string, z?: string, w?: string },
    limit?: { x?: Limit, y?: Limit, z?: Limit, w?: Limit }
    onChange?: (value: THREE.Vector4) => void
}

export const ItemVector4 = <T extends Record<string, any>, K extends KeyToValueOfType<T, THREE.Vector4>>(props: Vector4Interface<T, K>) => {
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

    const onChangeVector4 = (v: { x?: number, y?: number, z?: number, w?: number }) => {
        (object[variable] as THREE.Vector4).set(
            v.x != undefined ? v.x : x,
            v.y != undefined ? v.y : y,
            v.z != undefined ? v.z : z,
            v.w != undefined ? v.w : w
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
                {...vector4Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector4({ x: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector4({ x: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={x}
                min={limit?.x?.min}
                max={limit?.x?.max}
                addonBefore={labelVector?.x ? labelVector.x : "X"}
                onChange={(v) => v != undefined && onChangeVector4({ x: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector4).x + value * direction;
                    const res = (object[variable] as THREE.Vector4).setX(newVal).x;
                    onChangeVector4({ x: res });
                }}
            />
            <InputNumberStyle
                {...vector4Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector4({ y: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector4({ y: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={y}
                min={limit?.y?.min}
                max={limit?.y?.max}
                addonBefore={labelVector?.y ? labelVector.y : "Y"}
                onChange={(v) => v != undefined && onChangeVector4({ y: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector4).y + value * direction;
                    const res = (object[variable] as THREE.Vector4).setY(newVal).y;
                    onChangeVector4({ y: res });
                }}
            />
            <InputNumberStyle
                {...vector4Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector4({ z: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector4({ z: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={z}
                min={limit?.z?.min}
                max={limit?.z?.max}
                addonBefore={labelVector?.z ? labelVector.z : "Z"}
                onChange={(v) => v != undefined && onChangeVector4({ z: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector4).z + value * direction;
                    const res = (object[variable] as THREE.Vector4).setZ(newVal).z;
                    onChangeVector4({ z: res });
                }}
            />
            <InputNumberStyle
                {...vector4Props}
                onFocus={loopStop}
                onBlur={(e) => {
                    loopStart();
                    const v = evaluateFormula(e.target.value);
                    v != null && onChangeVector4({ w: v });
                }}
                onKeyDown={(e) => {
                    if (e.code == "Enter") {
                        const v = evaluateFormula((e.target as HTMLInputElement).value);
                        v != null && onChangeVector4({ w: v });
                    }
                }}
                precision={precision == false ? 0 : precision != undefined ? precision : PRECISION_AMOUNT}
                value={w}
                min={limit?.w?.min}
                max={limit?.w?.max}
                addonBefore={labelVector?.w ? labelVector.w : "W"}
                onChange={(v) => v != undefined && onChangeVector4({ w: v })}
            />
            <DraggableButtonController
                onStep={(value, _rate, direction) => {
                    const newVal = (object[variable] as THREE.Vector4).w + value * direction;
                    const res = (object[variable] as THREE.Vector4).setW(newVal).w;
                    onChangeVector4({ w: res });
                }}
            />
        </Form.Item >

    )
}

export default { ItemVector2, ItemVector3, ItemVector4 };
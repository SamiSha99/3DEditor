import { Form, Slider } from "antd";
import React, { useState } from "react";
import { PRECISION_AMOUNT, Limit, labelFromVariable, DRAGGABLE_CONTROLLER_WIDTH, ItemObject } from "./Item";
import { useDeltaTime } from "src/store/Hooks";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";
import { toFixedStripped } from "@orb_utils/Main";
import { InputNumberStyle } from "./style";
import { evaluateFormula } from "@orb_utils/Math";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";
import { KeyToValueOfType } from "@orb_types";

type NumberTypes = number | undefined;

interface InputNumberInterface<T extends Record<string, any>, K extends KeyToValueOfType<T, NumberTypes>> extends ItemObject<T, K> {
    limit?: Limit,
    step?: number,
    stepSlider?: number
    addonBefore?: React.ReactNode
    addonAfter?: React.ReactNode
    onChange?: (value: number) => void
}

export const ItemNumber = <T extends Record<string, any>, K extends KeyToValueOfType<T, NumberTypes>>(props: InputNumberInterface<T, K>) => {
    let { label, labelInVariable, object, variable, limit, readonly, step, stepSlider, onChange, tooltip, addonBefore, addonAfter, } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<number>(object[variable]);

    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable]);
    });

    const onChangeNumber = (v: number | null) => {
        if (v == null) return;
        setValue(v)
        object[variable] = v as T[K];
        onChange && onChange(v);
    }

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            {
                !readonly && limit &&
                <Slider
                    style={{ display: 'inline-block', width: "calc(80% - 20px)", marginRight: 15 }}
                    min={limit?.min}
                    max={limit?.max}
                    step={stepSlider == undefined ? 0.01 : stepSlider}
                    onChange={(v) => onChangeNumber(v as number)}
                    value={v}
                />

            }
            <div style={{ display: limit ? 'inline-block' : '', width: limit ? "33.333%" : "33.333%", float: "right" }}>
                <InputNumberStyle
                    style={{ width: readonly ? "100%" : `calc(100% - ${DRAGGABLE_CONTROLLER_WIDTH})` }}
                    controls={false}
                    onFocus={loopStop}
                    onKeyDown={(e) => {
                        if (e.code == "Enter") {
                            const v = evaluateFormula((e.target as HTMLInputElement).value);
                            v != null && onChangeNumber(v);
                        }
                    }}
                    onBlur={(e) => {
                        loopStart();
                        const v = evaluateFormula(e.target.value);
                        v != null && onChangeNumber(v);
                    }}
                    value={v}
                    min={limit?.min}
                    max={limit?.max}
                    precision={PRECISION_AMOUNT}
                    formatter={(v) => { return `${!v ? 0 : toFixedStripped(v, PRECISION_AMOUNT)}` }}
                    parser={(v) => v as unknown as number}
                    addonBefore={addonBefore}
                    addonAfter={addonAfter}
                    changeOnWheel
                    readOnly={readonly}
                    step={step == undefined ? 0.1 : step}
                    disabled={readonly}
                    onChange={(v) => onChangeNumber(v as number)}
                />
                {
                    !readonly &&
                    <DraggableButtonController
                        onStep={(value, _rate, direction) => {
                            const newVal = object[variable] as number + value * direction;
                            object[variable] = newVal as T[K];
                            const res = newVal;
                            onChangeNumber(res);
                        }}
                    />
                }
            </div>
        </Form.Item>
    )
}

export default ItemNumber;
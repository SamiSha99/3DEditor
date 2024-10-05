import { Form, InputNumber, Slider, Tooltip } from "antd";
import React, { useState } from "react";
import { MOUSE_ENTER_DELAY, PRECISION_AMOUNT, Item, Limit, labelFromVariable } from "./Item";
import { useDeltaTime } from "src/store/Hooks";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";

interface InputNumberInterface extends Item {
    limit?: Limit,
    stepSlider?: number
    onChange?: (value: number) => void
}

export const ItemNumber: React.FC<InputNumberInterface> = (
    { label, labelInVariable, object, variable, limit, readonly, stepSlider, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<number>(object[variable]);

    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable]);
    });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label}>
            {
                !readonly && limit &&
                <Slider
                    style={{ display: 'inline-block', width: "calc(80% - 20px)", marginRight: 15 }}
                    min={limit?.min}
                    max={limit?.max}
                    step={stepSlider == undefined ? 0.01 : stepSlider}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setValue(v)
                        object[variable] = v;
                        onChange && onChange(v);
                    }}
                    value={v}
                />

            }
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    style={{ display: limit ? 'inline-block' : '', width: limit ? "20%" : "100%" }}
                    onFocus={loopStop}
                    onBlur={loopStart}
                    value={v}
                    min={limit?.min}
                    max={limit?.max}
                    precision={PRECISION_AMOUNT}
                    controls={false}
                    changeOnWheel
                    readOnly={readonly}
                    disabled={readonly}
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setValue(v)
                        object[variable] = v;
                        onChange && onChange(v);
                    }} />
            </Tooltip>
        </Form.Item>
    )
}

export default ItemNumber;
import { Form, InputNumber, Slider, Tooltip } from "antd";
import React, { useState } from "react";
import { labelFromVariable, MOUSE_ENTER_DELAY, PRECISION_AMOUNT, Item, Limit } from "./Item";
import { useDeltaTime } from "src/store/Hooks";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";

interface InputNumberInterface extends Item {
    limit?: Limit,
    onChange?: (value: number) => void
}

export const ItemNumber: React.FC<InputNumberInterface> = (
    { label, object, variable, limit, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<number>(object[variable]);

    const [loopStop, loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable]);
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                {
                    // limit?.min &&
                    // limit?.max &&
                    // <Slider
                    //     style={{ display: 'inline-block', width: '100%' }}
                    //     min={limit?.min}
                    //     max={limit?.max}
                    //     onChange={(v: number | null) => {
                    //         if (v == null) return;
                    //         setValue(v)
                    //         object[variable] = v;
                    //         onChange && onChange(v);
                    //     }}
                    //     value={object[variable]}
                    // />
                }
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
                    min={limit?.min}
                    max={limit?.max}
                    precision={PRECISION_AMOUNT}
                    controls={false}
                    changeOnWheel
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
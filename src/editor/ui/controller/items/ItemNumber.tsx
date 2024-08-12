import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { labelFromVariable, MOUSE_ENTER_DELAY, PRECISION_AMOUNT } from "./SharedItemOptions";
import { useDeltaTime } from "src/store/Hooks";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";

type InputNumberInterface<T> = {
    label?: string,
    object: T,
    variable: string,
    onChange?: (value: number) => void
}

export const ItemNumber: React.FC<InputNumberInterface<{ [key: string]: any }>> = (
    { label, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<number>(object[variable]);

    const [loopStop, loopStart, isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable]);
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
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
import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { MOUSE_ENTER_DELAY } from "./SharedItemOptions";
import { useDeltaTime } from "src/store/Hooks";

type InputNumberInterface<T> = {
    label?: string,
    object: T,
    variable: string,
    addonBefore?: string,
    onChange: (value: number) => void
}

export const InputNumberItem: React.FC<InputNumberInterface<{ [key: string]: any }>> = (
    { label, object, variable, onChange }
) => {
    if (!Object.keys(object).find(key => key == variable)) {
        console.error("Failed to get the key from variable! variable =>", variable, "\nObject:\n", object);
        return (<></>)
    }
    const [v, setValue] = useState<number>(object[variable]);

    const [loopStop, loopStart, isActive] = useDeltaTime(() => {
        if (v != undefined && object[variable] != undefined && v != object[variable]) setValue(object[variable]);
    });

    return (
        <Form.Item label={label ? label : "InputNumber"} style={{ marginBottom: '0px' }}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
                    controls={false}
                    changeOnWheel
                    onChange={(v: number | null) => {
                        if (v == null) return;
                        setValue(v)
                        onChange && onChange(v);
                    }} />
            </Tooltip>
        </Form.Item>
    )
}

export default InputNumberItem;
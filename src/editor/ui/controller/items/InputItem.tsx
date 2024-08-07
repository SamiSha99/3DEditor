import { Form, Tooltip, Input } from "antd";
import React, { useState } from "react";
import { MOUSE_ENTER_DELAY } from "./SharedItemOptions";
import { useDeltaTime } from "src/store/Hooks";

type InputInterface<T> = {
    label?: string,
    object: T,
    variable: string,
    onChange: (value: string) => void
}

export const InputItem: React.FC<InputInterface<{ [key: string]: any }>> = (
    { label, object, variable, onChange }
) => {
    if (!Object.keys(object).find(key => key == variable)) {
        console.error("Failed to get the key from variable! variable =>", variable, "\nObject:\n", object);
        return (<></>)
    }

    const [v, setValue] = useState<string>(object[variable]);

    const [loopStop, loopStart, isActive] = useDeltaTime(() => {
        if (v != object[variable]) {
            setValue(object.name);
        }
    });

    return (
        <Form.Item label={label ? label : "Input"} style={{ marginBottom: '0px' }}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <Input
                    onFocus={() => loopStop()}
                    onBlur={() => loopStart()}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
                    onChange={(v) => {
                        if(v == null) return;
                        setValue(v.target.value);
                        onChange && onChange(v.target.value);
                    }} />
            </Tooltip>
        </Form.Item>
    )
}

export default InputItem;
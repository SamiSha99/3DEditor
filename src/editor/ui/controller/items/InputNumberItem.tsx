import { Form, InputNumber, Tooltip } from "antd";
import React, { useState } from "react";
import { MOUSE_ENTER_DELAY } from "./SharedItemOptions";

type InputNumberInterface = {
    label?: string,
    variable: number,
    addonBefore?: string,
    onChange: (value: number | null) => void
}

export const InputNumberItem: React.FC<InputNumberInterface> = (
    { label, variable, onChange }
) => {
    const [v, setValue] = useState(variable);

    return (
        <Form.Item label={label ? label : "InputNumber"} style={{ marginBottom: '0px' }}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <InputNumber
                    style={{ display: 'inline-block', width: '100%' }}
                    defaultValue={variable}
                    value={v}
                    controls={false}
                    changeOnWheel
                    variant="outlined"
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
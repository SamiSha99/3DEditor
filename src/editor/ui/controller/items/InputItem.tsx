import { Form, Tooltip, Input } from "antd";
import React, { useState } from "react";
import { MOUSE_ENTER_DELAY } from "./SharedItemOptions";

type InputInterface = {
    label?: string,
    variable: string,
    onChange: (value: string | null) => void
}

export const InputItem: React.FC<InputInterface> = (
    { label, variable, onChange }
) => {
    const [v, setValue] = useState(variable);

    return (
        <Form.Item label={label ? label : "Input"} style={{ marginBottom: '0px' }}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <Input
                    style={{ display: 'inline-block', width: '99%' }}
                    defaultValue={variable}
                    value={v}
                    onChange={(v) => {
                        setValue(v.target.value)
                        onChange && onChange(v.target.value);
                    }} />
            </Tooltip>
        </Form.Item>
    )
}

export default InputItem;
import { Form, Tooltip, Input, Tabs } from "antd";
import React, { useState } from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./SharedItemOptions";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";

interface InputInterface extends Item {
    onChange?: (value: string) => void
}

export const ItemInput: React.FC<InputInterface> = (
    { label, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<string>(object[variable]);

    const [loopStop, loopStart, _] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <Input
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
                    onChange={(v) => {
                        if (v == null) return;
                        setValue(v.target.value);
                        object[variable] = v.target.value;
                        onChange && onChange(v.target.value);
                    }} />
            </Tooltip>
        </Form.Item>
    )
}

export default ItemInput;
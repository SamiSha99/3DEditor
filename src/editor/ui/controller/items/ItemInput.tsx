import { Form, Input } from "antd";
import React, { useState } from "react";
import { ItemObject, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";
import TextArea from "antd/es/input/TextArea";
import { KeyToValueOfType } from "@orb_types";

interface InputInterface<T extends Record<string, any>, K extends KeyToValueOfType<T, string>> extends ItemObject<T, K> {
    onChange?: (value: string) => void
    addonBefore?: React.ReactNode,
    addonAfter?: React.ReactNode,
    textArea?: boolean,
}

export const ItemInput = <T extends Record<string, any>, K extends KeyToValueOfType<T, string>>(props: InputInterface<T, K>) => {
    let { label, labelInVariable, object, variable, readonly, onChange, tooltip, addonBefore, addonAfter, textArea } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<string>(object[variable]);

    const [loopStop, loopStart, _] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            {
                textArea &&
                <TextArea
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
                    readOnly={readonly}
                    disabled={readonly}
                    onChange={(v) => {
                        if (v == null) return;
                        setValue(v.target.value);
                        object[variable] = v.target.value as T[K];
                        onChange && onChange(v.target.value);
                    }}
                />
            }
            {
                !textArea &&
                <Input
                    onFocus={loopStop}
                    onBlur={loopStart}
                    style={{ display: 'inline-block', width: '100%' }}
                    value={v}
                    addonBefore={addonBefore}
                    addonAfter={addonAfter}
                    readOnly={readonly}
                    disabled={readonly}
                    onChange={(v) => {
                        if (v == null) return;
                        setValue(v.target.value);
                        object[variable] = v.target.value as T[K];
                        onChange && onChange(v.target.value);
                    }} />
            }
        </Form.Item>
    )
}

export default ItemInput;
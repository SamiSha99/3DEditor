import { Input } from "antd";
import React, { useState } from "react";
import { ItemObject, resolveLabel, AnyObject, invalidVariable } from "./Item";
import { ItemRow } from "./ItemRow";
import { ItemInvalidAlert } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";
import TextArea from "antd/es/input/TextArea";
import { KeyToValueOfType } from "@orb_types";

interface InputInterface<T extends AnyObject, K extends KeyToValueOfType<T, string>> extends ItemObject<T, K> {
    onChange?: (value: string) => void
    addonBefore?: React.ReactNode,
    addonAfter?: React.ReactNode,
    textArea?: boolean,
}

export const ItemInput = <T extends AnyObject, K extends KeyToValueOfType<T, string>>(props: InputInterface<T, K>) => {
    const { object, variable, readonly, onChange, tooltip, layout, addonBefore, addonAfter, textArea } = props;
    const [v, setValue] = useState<string>(object[variable]);

    const [loopStop, loopStart] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;

    return (
        <ItemRow label={resolveLabel(props)} tooltip={tooltip} layout={layout}>
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
        </ItemRow>
    )
}

export default ItemInput;
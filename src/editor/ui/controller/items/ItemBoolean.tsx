import { Form, Switch } from "antd";
import React, { useState } from "react";
import { ItemObject, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";
import { KeyToValueOfType } from "@orb_types";

interface BooleanInterface<T extends Record<string, any>, K extends KeyToValueOfType<T, boolean>> extends ItemObject<T, K> {
    onChange?: (value: boolean) => void
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
}

export const ItemBoolean = <T extends Record<string, any>, K extends KeyToValueOfType<T, boolean>>(props: BooleanInterface<T, K>) => {
    let { label, labelInVariable, object, variable, icons, onChange, tooltip } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<boolean>(object[variable]);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <div style={{ float: "right" }}>
                <Switch
                    style={{ margin: "2px 5px" }}
                    defaultChecked={object[variable]}
                    checkedChildren={icons?.on}
                    unCheckedChildren={icons?.off}
                    onChange={(e) => {
                        setValue(e);
                        object[variable] = e as T[K];
                        onChange && onChange(e);
                    }} />
            </div>
        </Form.Item>
    )
}

export default ItemBoolean;
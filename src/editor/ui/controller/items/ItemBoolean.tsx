import { Form, Switch } from "antd";
import React, { useState } from "react";
import { Item, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";

interface BooleanInterface extends Item {
    onChange?: (value: boolean) => void
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
}

export const ItemBoolean: React.FC<BooleanInterface> = (
    { label, labelInVariable, object, variable, icons, onChange, tooltip }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<boolean>(object[variable]);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <Switch
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "2px 0" }}
                defaultChecked={object[variable]}
                checkedChildren={icons?.on}
                unCheckedChildren={icons?.off}
                onChange={(e) => {
                    setValue(e);
                    object[variable] = e;
                    onChange && onChange(e);
                }} />
        </Form.Item>
    )
}

export default ItemBoolean;
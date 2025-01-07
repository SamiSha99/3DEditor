import { Form, Switch } from "antd";
import React, { useState } from "react";
import { Item, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { useDeltaTime } from "src/store/Hooks";

interface BooleanInterface extends Item {
    onChange?: (value: boolean) => void
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
}

export const ItemBoolean = (props: BooleanInterface) => {
    let { label, labelInVariable, object, variable, icons, onChange, tooltip } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<boolean>(object[variable]);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <Switch
                style={{ margin: "2px 5px" }}
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
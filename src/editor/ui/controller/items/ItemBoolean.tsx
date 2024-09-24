import { Form, Switch, Tooltip } from "antd";
import React, { useState } from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useDeltaTime } from "src/store/Hooks";

interface BooleanInterface extends Item {
    onChange?: (value: boolean) => void
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
}

export const ItemBoolean: React.FC<BooleanInterface> = (
    { label, object, variable, icons, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<boolean>(object[variable]);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip style={{ display: 'inline-block', backgroundColor: "red" }} title={"" + v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
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
            </Tooltip>
        </Form.Item>
    )
}

export default ItemBoolean;
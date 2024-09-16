import { Form, Tooltip } from "antd";
import React, { useState } from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useDeltaTime } from "src/store/Hooks";

interface BooleanInterface extends Item {
    onChange?: (value: boolean) => void
}

export const ItemBoolean: React.FC<BooleanInterface> = (
    { label, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<boolean>(object[variable]);

    const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable])
    });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <div style={{ backgroundColor: "#303030", border: "2px solid #404040"}}>
                <Tooltip style={{ display: 'inline-block', backgroundColor: "red" }} title={"" + v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <Checkbox
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "2px 0" }}
                        defaultChecked={object[variable]}
                        onChange={(e) => {
                            const b = e.target.checked;
                            setValue(b);
                            object[variable] = b;
                            onChange && onChange(b);
                        }} />
                </Tooltip>
            </div>
        </Form.Item>
    )
}

export default ItemBoolean;
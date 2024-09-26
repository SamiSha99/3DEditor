import { Button, Form, Tooltip } from "antd";
import React from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";


interface ButtonInterface extends Item {
    onClick?: () => void,
    buttonName: string,
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
}

export const ItemButton: React.FC<ButtonInterface> = (
    { label, object, variable, buttonName, onClick }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    // const [v, setValue] = useState<boolean>(object[variable]);

    // const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
    //     v != object[variable] && setValue(object[variable])
    // });

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Tooltip style={{ display: 'inline-block', backgroundColor: "red" }} title={""} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <Button onClick={() => { onClick && onClick() }} children={buttonName} />
            </Tooltip>
        </Form.Item>
    )
}

export default ItemButton;
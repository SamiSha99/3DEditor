import { Button, Form, Tooltip } from "antd";
import React from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { SizeType } from "antd/es/config-provider/SizeContext";


interface ButtonInterface extends Item {
    onClick?: () => void,
    buttonName: string,
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
    size?: SizeType
}

export const ItemButton: React.FC<ButtonInterface> = (
    { label, labelInVariable, object, variable, size, buttonName, onClick }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    // const [v, setValue] = useState<boolean>(object[variable]);

    // const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
    //     v != object[variable] && setValue(object[variable])
    // });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label}>
            <Tooltip title={""} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                <Button size={size} block style={{ width: "100%" }} onClick={() => { onClick && onClick() }} children={buttonName} />
            </Tooltip>
        </Form.Item>
    )
}

export default ItemButton;
import { Button, Form } from "antd";
import React from "react";
import { Item, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { SizeType } from "antd/es/config-provider/SizeContext";


interface ButtonInterface extends Item {
    onClick?: () => void,
    buttonName: string,
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
    size?: SizeType
}

export const ItemButton: React.FC<ButtonInterface> = (
    { label, labelInVariable, object, variable, size, buttonName, onClick, tooltip }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    // const [v, setValue] = useState<boolean>(object[variable]);

    // const [_loopStop, _loopStart, _isActive] = useDeltaTime(() => {
    //     v != object[variable] && setValue(object[variable])
    // });

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <Button size={size} block style={{ width: "100%" }} onClick={() => { onClick && onClick() }} children={buttonName} />
        </Form.Item>
    )
}

export default ItemButton;
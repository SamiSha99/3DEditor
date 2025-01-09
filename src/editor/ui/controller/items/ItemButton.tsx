import { Button, Form } from "antd";
import React from "react";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ItemObjectless } from "./Item";


interface ButtonInterface extends ItemObjectless {
    onClick?: () => void,
    buttonName: string | React.ReactNode,
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
    size?: SizeType,
    tooltip?: string
    label?: string
    disabled?: boolean
}

export const ItemButton = (props: ButtonInterface) => {
    let { label, size, buttonName, onClick, tooltip, disabled } = props;

    return (
        <Form.Item label={label} tooltip={tooltip}>
            <Button size={size ? size : "small"} block style={{ width: "100%" }} onClick={() => { onClick && onClick() }} children={buttonName} disabled={disabled} />
        </Form.Item>
    )
}

export default ItemButton;
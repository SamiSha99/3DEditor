import { Button } from "antd";
import React from "react";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ItemBase } from "./Item";
import { ItemRow } from "./ItemRow";


interface ButtonInterface extends ItemBase {
    onClick?: () => void,
    buttonName: string | React.ReactNode,
    icons?: { on?: React.ReactNode, off?: React.ReactNode }
    size?: SizeType,
    tooltip?: string
    label?: string
    disabled?: boolean
}

export const ItemButton = (props: ButtonInterface) => {
    const { label, size, buttonName, onClick, tooltip, disabled, layout } = props;

    return (
        <ItemRow label={label} tooltip={tooltip} layout={layout}>
            <Button size={size ? size : "small"} block style={{ width: "100%" }} onClick={() => { onClick && onClick() }} children={buttonName} disabled={disabled} />
        </ItemRow>
    )
}

export default ItemButton;
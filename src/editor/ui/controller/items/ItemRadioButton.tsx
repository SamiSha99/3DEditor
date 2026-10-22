import { Radio } from "antd";
import React from "react";
import { ItemBase } from "./Item";
import { ItemRow } from "./ItemRow";

interface RadioButtonInterface extends ItemBase {
    onClick?: (value: string) => void,
    tooltip?: string,
    label?: string,
    disabled?: boolean,
    defaultValue?: string,
    props: { value: string, children: React.ReactNode }[]
}

export const ItemRadioButton = (radioProps: RadioButtonInterface) => {
    const { label, onClick, tooltip, layout, props, defaultValue } = radioProps;
    return (
        <ItemRow label={label} tooltip={tooltip} layout={layout}>
            <Radio.Group style={{ display: "flex" }} value={defaultValue} onChange={(e) => onClick && onClick(e.target.value)}>
                {props.map((p) => <Radio.Button key={p.value} style={{ flex: 1, minWidth: 0, paddingInline: 4, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} value={p.value} children={p.children} />)}
            </Radio.Group>
        </ItemRow>
    )
}

export default ItemRadioButton;
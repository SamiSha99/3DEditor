import { Form, Radio } from "antd";
import React from "react";
import { ItemObjectless } from "./Item";

interface RadioButtonInterface extends ItemObjectless {
    onClick?: (value: string) => void,
    tooltip?: string,
    label?: string,
    disabled?: boolean,
    defaultValue?: any,
    props: { value: string, children: React.ReactNode }[]
}

export const ItemRadioButton = (radioProps: RadioButtonInterface) => {
    let { label, onClick, tooltip, props, defaultValue } = radioProps;
    return (
        <Form.Item label={label} tooltip={tooltip}>
            <Radio.Group style={{ display: "flex" }} value={defaultValue} onChange={(e) => onClick && onClick(e.target.value)}>
                {props.map((p) => <Radio.Button style={{ flex: 1, textAlign: "center" }} value={p.value} children={p.children} />)}
            </Radio.Group>
        </Form.Item>
    )
}

export default ItemRadioButton;
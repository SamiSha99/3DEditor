import { Form, Radio } from "antd";
import React from "react";

interface RadioButtonInterface {
    onClick?: (value: string) => void,
    tooltip?: string,
    label?: string,
    disabled?: boolean,
    defaultValue?: any,
    props: { value: string, children: React.ReactNode }[]
}

export const ItemRadioButton: React.FC<RadioButtonInterface> = (
    { label, onClick, tooltip, props, defaultValue }
) => {
    return (
        <Form.Item label={label} tooltip={tooltip}>
            <Radio.Group value={defaultValue} onChange={(e) => onClick && onClick(e.target.value)}>
                {props.map((p) => <Radio.Button value={p.value} children={p.children} />)}
            </Radio.Group>
        </Form.Item>
    )
}

export default ItemRadioButton;
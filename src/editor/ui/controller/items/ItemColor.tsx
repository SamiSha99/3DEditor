import { ColorPicker, Form } from "antd";
import React, { useState } from "react";
import { Item, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { Color } from "three";
import { AggregationColor } from "antd/es/color-picker/color";

interface ColorInterface extends Item {
    onChange?: (value: Color) => void,
    onChangeComplete?: (value: Color) => void,
    onClear?: () => void,
    allowClear?: boolean,
    disabledAlpha?: boolean,
    defaultColor?: string
}

let timeoutActive: boolean = false;

export const ItemColor: React.FC<ColorInterface> = (
    { label, labelInVariable, object, variable, disabled, disabledAlpha, allowClear, defaultColor, onChange, onChangeComplete, onClear, tooltip }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [v, setValue] = useState<Color>(object[variable]);

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label} tooltip={tooltip}>
            <ColorPicker
                defaultValue={defaultColor ? defaultColor : v.getHexString()}
                disabled={disabled}
                disabledAlpha={disabledAlpha}
                allowClear={allowClear}
                onChange={(value: AggregationColor) => {
                    if (!timeoutActive) {
                        timeoutActive = true
                        setTimeout(() => {
                            timeoutActive = false;
                            const color = object[variable] as Color;
                            color.set(value.toHexString());
                            setValue(color);
                            onChange && onChange(color);
                        }, 33);
                    }
                }}
                onChangeComplete={(value) => {
                    const color = object[variable] as Color;
                    color.set(value.toHexString());
                    setValue(color);
                    onChangeComplete && onChangeComplete(color);
                }}
                onClear={() => {
                    (object[variable] as Color).set(0x000000);
                    onClear && onClear();
                }}
            />
        </Form.Item>
    )
}

export default ItemColor;
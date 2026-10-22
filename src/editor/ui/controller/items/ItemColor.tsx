import { ColorPicker } from "antd";
import { useState } from "react";
import { ItemObject, resolveLabel, AnyObject, invalidVariable } from "./Item";
import { ItemRow } from "./ItemRow";
import { ItemInvalidAlert } from "./ItemAlert";
import { Color } from "three";
import { AggregationColor } from "antd/es/color-picker/color";
import { KeyToValueOfType } from "@orb_types";

export interface ColorInterface<T extends AnyObject, K extends KeyToValueOfType<T, Color>> extends ItemObject<T, K> {
    onChange?: (value: Color) => void,
    onChangeComplete?: (value: Color) => void,
    onClear?: () => void,
    allowClear?: boolean,
    disabledAlpha?: boolean,
    defaultColor?: string
}

let timeoutActive: boolean = false;

export const ItemColor = <T extends AnyObject, K extends KeyToValueOfType<T, Color>>(props: ColorInterface<T, K>) => {
    const { object, variable, disabled, disabledAlpha, allowClear, defaultColor, onChange, onChangeComplete, onClear, tooltip, layout } = props;
    const [v, setValue] = useState<Color>(object[variable]);

    // to-do this doesn't update at all from outside sources!

    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;

    return (
        <ItemRow label={resolveLabel(props)} tooltip={tooltip} layout={layout}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
            </div>
        </ItemRow>
    )
}

export default ItemColor;
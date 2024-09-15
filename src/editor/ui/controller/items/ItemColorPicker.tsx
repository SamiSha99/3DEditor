import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Color } from "antd/es/color-picker";
import { Checkbox, Form, ColorPicker } from "antd";
import { Item } from "./SharedItemOptions";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";
interface ColorPickerInterface extends Item {
    disabled?: boolean,
    defaultValue?: string
    allowAlpha?: boolean
    allowClear?: boolean
    onChangeCheckbox?: (e: CheckboxChangeEvent) => void
    onChangeColorPicker?: (value: Color, hex: string) => void
    onChangeCompleteColorPicker?: (value: Color) => void
}

export const ItemColorPicker: React.FC<ColorPickerInterface> = (
    { label, object, variable, disabled, defaultValue, allowAlpha, allowClear, onChangeCheckbox, onChangeColorPicker, onChangeCompleteColorPicker }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    
    return (
        <Form.Item label={label}>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                <Checkbox onChange={(e) => { onChangeCheckbox && onChangeCheckbox(e) }} />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                <ColorPicker
                    defaultValue={defaultValue}
                    disabled={disabled != undefined ? disabled : false}
                    disabledAlpha={!allowAlpha}
                    allowClear={allowClear}
                    onChange={(value: Color, hex: string) => { onChangeColorPicker && onChangeColorPicker(value, hex); }}
                    onChangeComplete={(value) => { onChangeCompleteColorPicker && onChangeCompleteColorPicker(value); }}
                />
            </Form.Item>
        </Form.Item>
    )
}

export default ItemColorPicker;
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Color } from "antd/es/color-picker";
import { Checkbox, Form, ColorPicker } from "antd";
type ColorPickerInterface = {
    label: string
    enabled?: boolean,
    defaultValue?: string
    allowAlpha?: boolean
    allowClear?: boolean
    onChangeCheckbox?: (e: CheckboxChangeEvent) => void
    onChangeColorPicker?: (value: Color, hex: string) => void
    onChangeCompleteColorPicker?: (value: Color) => void
}

export const ItemColorPicker: React.FC<ColorPickerInterface> = (
    { label, enabled, defaultValue, allowAlpha, allowClear, onChangeCheckbox, onChangeColorPicker, onChangeCompleteColorPicker }
) => {
    return (
        <Form.Item label={label}>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                <Checkbox onChange={(e) => { onChangeCheckbox && onChangeCheckbox(e) }} />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
                <ColorPicker
                    defaultValue={defaultValue}
                    disabled={!enabled}
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
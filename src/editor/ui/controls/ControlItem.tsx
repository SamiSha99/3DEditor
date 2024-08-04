import { Checkbox, Form, ColorPicker, Select, Input, InputNumber, Tooltip } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Color } from "antd/es/color-picker"
import React, { useEffect, useState } from "react"

type SelectItemInterface = {
    label: string
    enabled?: boolean
    defaultValue?: string
    labelInValue?: boolean
    options?: { value: string, label: string }[]
    onChangeSelect?: (select: { value: string, label: string }) => void
}

export const SelectItem: React.FC<SelectItemInterface> = (
    { label, enabled, defaultValue, labelInValue, options, onChangeSelect }
) => {
    return (
        <Form.Item label={label}>
            <Select
                disabled={!enabled}
                defaultValue={defaultValue ? { "value": defaultValue, "label": defaultValue } : undefined}
                labelInValue={labelInValue}
                onChange={(select: { value: string, label: string }) => { onChangeSelect && onChangeSelect(select); }}
                options={options}
            />
        </Form.Item>
    )
}

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

export const ColorPickerItem: React.FC<ColorPickerInterface> = (
    { label, enabled, defaultValue, allowAlpha, allowClear, onChangeCheckbox, onChangeColorPicker, onChangeCompleteColorPicker }
) => {
    return (
        <Form.Item label={label} style={{ marginBottom: '0px' }}>
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

type Input3Interface = {
    label?: string,
    lableX?: string,
    lableY?: string,
    lableZ?: string,
    x: number,
    y: number,
    z: number,
    onChangeX?: (v: number | null) => void,
    onChangeY?: (v: number | null) => void,
    onChangeZ?: (v: number | null) => void,
}

export const Input3Item: React.FC<Input3Interface> = (
    { label, lableX, lableY, lableZ, x, y, z, onChangeX, onChangeY, onChangeZ }
) => {
    const [_x, setX] = useState(x);
    const [_y, setY] = useState(y);
    const [_z, setZ] = useState(z);
    return (
        <Form.Item label={label ? label : "Vector3"} style={{ marginBottom: '0px' }}>
            <Tooltip title={_x ? _x : "0"} mouseEnterDelay={1}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                    <InputNumber
                        defaultValue={_x ? _x : 0}
                        addonBefore={lableX ? lableX : "X"}
                        controls={false}
                        onChange={(v: number | null) => {
                            if (v != null) setX(v);
                            onChangeX && onChangeX(v);
                        }} />
                </Form.Item>
            </Tooltip>
            <Tooltip title={_y ? _y : "0"} mouseEnterDelay={1}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                    <InputNumber
                        defaultValue={_y ? _y : 0}
                        addonBefore={lableY ? lableY : "Y"}
                        controls={false}
                        onChange={(v: number | null) => {
                            if (v != null) setY(v);
                            onChangeY && onChangeY(v);
                        }} />
                </Form.Item>
            </Tooltip>
            <Tooltip title={_z ? _z : "0"} mouseEnterDelay={1}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                    <InputNumber
                        defaultValue={_z ? _z : 0}
                        addonBefore={lableZ ? lableZ : "Z"}
                        controls={false}
                        onChange={(v: number | null) => {
                            if (v != null) setZ(v);
                            onChangeZ && onChangeZ(v);
                        }} />
                </Form.Item>
            </Tooltip>
        </Form.Item>
    )
}
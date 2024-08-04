import { Checkbox, Form, ColorPicker, Select, InputNumber, Tooltip } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Color } from "antd/es/color-picker";
import React, { useState } from "react";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";

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

type Vector3Interface = {
    label?: string,
    variable: THREE.Vector3
    labelVector?: { x?: string, y?: string, z?: string },
    onChange: (value: { x: number, y: number, z: number } | null) => void
}

export const Vector3Item: React.FC<Vector3Interface> = (
    { label, variable, labelVector, onChange }
) => {
    const defaultX = variable.x;
    const defaultY = variable.y;
    const defaultZ = variable.z;
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);
    const [z, setZ] = useState(variable.z);
    
    if (variable) {
        const [loopStop, loopStart, isActive] = useDeltaTime((delta) => {
            if (x != variable.x) setX(variable.x);
            if (y != variable.y) setY(variable.y);
            if (z != variable.z) setZ(variable.z);
        });
    }

    return (
        <Form.Item label={label ? label : "Vector3"} style={{ marginBottom: '0px' }}>
            <Tooltip title={x} mouseEnterDelay={0.5}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                    <InputNumber
                        defaultValue={defaultX}
                        value={x}
                        addonBefore={labelVector?.x ? labelVector.x : "X"}
                        controls={false}
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setX(v);
                            onChange && onChange({ x: v, y: y, z: z });
                        }} />
                </Form.Item>
            </Tooltip>
            <Tooltip title={y} mouseEnterDelay={0.5}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                    <InputNumber
                        defaultValue={defaultY}
                        value={y}
                        addonBefore={labelVector?.y ? labelVector.y : "Y"}
                        controls={false}
                        onInput={() => console.log("init?")}
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setY(v);
                            onChange && onChange({ x: x, y: v, z: z });
                        }} />
                </Form.Item>
            </Tooltip>
            <Tooltip title={z} mouseEnterDelay={0.5}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                    <InputNumber
                        defaultValue={defaultZ}
                        value={z}
                        addonBefore={labelVector?.z ? labelVector.z : "Z"}
                        controls={false}
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setZ(v);
                            onChange && onChange({ x: x, y: y, z: v });
                        }} />
                </Form.Item>
            </Tooltip>
        </Form.Item>
    )
}
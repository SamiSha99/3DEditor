import { Checkbox, Form, ColorPicker, Select, InputNumber, Tooltip, Input } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Color } from "antd/es/color-picker";
import React, { useState } from "react";
import { useDeltaTime } from "src/store/Hooks";
import * as THREE from "three";

const MOUSE_ENTER_DELAY = 0.5

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
type InputInterface = {
    label?: string,
    variable: string,
    onChange: (value: string | null) => void
}

export const InputItem: React.FC<InputInterface> = (
    { label, variable, onChange }
) => {
    const [v, setValue] = useState(variable);

    return (
        <Form.Item label={label ? label : "Input"} style={{ marginBottom: '0px' }}>
            <Form.Item>
                <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <Input
                        style={{ display: 'inline-block', width: '100%' }}
                        defaultValue={variable}
                        value={v}
                        onChange={(v) => {
                            setValue(v.target.value)
                            onChange && onChange(v.target.value);
                        }} />
                </Tooltip>
            </Form.Item>
        </Form.Item>
    )
}

type InputNumberInterface = {
    label?: string,
    variable: number,
    addonBefore?: string,
    onChange: (value: number | null) => void
}

export const InputNumberItem: React.FC<InputNumberInterface> = (
    { label, variable, onChange }
) => {
    const [v, setValue] = useState(variable);

    return (
        <Form.Item label={label ? label : "InputNumber"} style={{ marginBottom: '0px' }}>
            <Form.Item>
                <Tooltip title={v} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <InputNumber
                        style={{ display: 'inline-block', width: '100%' }}
                        defaultValue={variable}
                        value={v}
                        controls={false}
                        changeOnWheel
                        variant="outlined"
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setValue(v)
                            onChange && onChange(v);
                        }} />
                </Tooltip>
            </Form.Item>
        </Form.Item>
    )
}

type Vector2Interface = {
    label?: string,
    variable: THREE.Vector2
    labelVector2?: { x?: string, y?: string },
    onChange: (value: { x: number, y: number } | null) => void
};

export const Vector2Item: React.FC<Vector2Interface> = (
    { label, labelVector2, variable, onChange }
) => {
    const defaultVector2 = { x: variable.x, y: variable.y }
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);

    return (
        <Form.Item label={label ? label : "Vector2"} style={{ marginBottom: '0px' }}>
            <Form.Item style={{ display: 'inline-block' }}>
                <Tooltip title={x} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <InputNumber
                        style={{ float: 'right', width: 'calc(50% - 8px)' }}
                        defaultValue={defaultVector2.x}
                        value={x}
                        addonBefore={labelVector2?.x}
                        controls={false}
                        changeOnWheel
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setX(v)
                            onChange && onChange({ x: v, y: y });
                        }} />
                </Tooltip>
                <Tooltip title={y} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <InputNumber
                        style={{ float: 'right', width: 'calc(50% - 8px)' }}
                        defaultValue={defaultVector2.y}
                        value={y}
                        addonBefore={labelVector2?.y}
                        controls={false}
                        changeOnWheel
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setY(v);
                            onChange && onChange({ x: x, y: v });
                        }} />
                </Tooltip>
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
    { label, variable, labelVector, onChange, ...prop }
) => {
    const defaultVector = { x: variable.x, y: variable.y, z: variable.z }
    const [x, setX] = useState(variable.x);
    const [y, setY] = useState(variable.y);
    const [z, setZ] = useState(variable.z);

    const [loopStop, loopStart, isActive] = useDeltaTime((delta) => {
        if (x != variable.x) setX(variable.x);
        if (y != variable.y) setY(variable.y);
        if (z != variable.z) setZ(variable.z);
    });

    return (
        <Form.Item label={label ? label : "Vector3"} style={{ marginBottom: '0px' }}>
            <Form.Item style={{ display: 'inline-block' }}>
                <Tooltip title={z} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <InputNumber
                        style={{ float: 'right', width: 'calc(33% - 8px)' }}
                        defaultValue={defaultVector.z}
                        value={z}
                        precision={3}
                        addonBefore={labelVector?.z ? labelVector.z : "Z"}
                        controls={false}
                        changeOnWheel
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setZ(v);
                            onChange && onChange({ x: x, y: y, z: v });
                        }} />
                </Tooltip>
                <Tooltip title={y} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <InputNumber
                        style={{ float: 'right', width: 'calc(33% - 8px)' }}
                        defaultValue={defaultVector.y}
                        value={y}
                        precision={3}
                        addonBefore={labelVector?.y ? labelVector.y : "Y"}
                        controls={false}
                        changeOnWheel
                        onInput={() => console.log("init?")}
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setY(v);
                            onChange && onChange({ x: x, y: v, z: z });
                        }} />
                </Tooltip>
                <Tooltip title={x} mouseEnterDelay={MOUSE_ENTER_DELAY}>
                    <InputNumber
                        style={{ float: 'right', width: 'calc(33% - 8px)' }}
                        defaultValue={defaultVector.x}
                        value={x}
                        precision={3}
                        addonBefore={labelVector?.x ? labelVector.x : "X"}
                        controls={false}
                        changeOnWheel
                        onChange={(v: number | null) => {
                            if (v == null) return;
                            setX(v);
                            onChange && onChange({ x: v, y: y, z: z });
                        }} />
                </Tooltip>
            </Form.Item>
        </Form.Item>
    )
}
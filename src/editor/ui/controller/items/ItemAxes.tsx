import { Tooltip } from "antd";
import { useState } from "react";
import { MathUtils } from "three";
import { toFixedStripped } from "@orb_utils/Main";
import { evaluateFormula } from "@orb_utils/Math";
import { useDeltaTime } from "src/store/Hooks";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";
import { AnyObject, invalidVariable, ItemObject, Limit, MOUSE_ENTER_DELAY, PRECISION_AMOUNT, resolveLabel } from "./Item";
import { ItemInvalidAlert } from "./ItemAlert";
import { ItemRow } from "./ItemRow";
import { InputNumberStyle } from "./style";

export type Axis = "x" | "y" | "z" | "w";

// For values edited in other units than they're stored in, e.g degrees for radians.
export interface AxisUnits {
    toDisplay: (value: number) => number
    fromDisplay: (value: number) => number
}

// Typed text can be a formula, e.g "2 * pi", anything that doesn't evaluate to a number is ignored.
const evaluateNumber = (text: string) => {
    try {
        const v = evaluateFormula(text);
        return typeof v == "number" && isFinite(v) ? v : null;
    } catch {
        return null;
    }
}

interface AxisInputInterface {
    label: React.ReactNode
    value: number
    precision: number
    limit?: Limit
    // Used by the arrow keys, mouse wheel and drag handle.
    step?: number
    // Shows the value in a tooltip, for fields too narrow to read it.
    hint?: boolean
    onChange: (value: number) => void
    onStep: (delta: number) => void
    onFocus?: () => void
    onBlur?: () => void
}

// One axis of a vector-like item: a number field with a drag handle.
export const AxisInput = (props: AxisInputInterface) => {
    const { label, value, precision, limit, step, hint, onChange, onStep, onFocus, onBlur } = props;

    const commit = (text: string) => {
        const v = evaluateNumber(text);
        v != null && onChange(v);
    }

    const field = (
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
            <InputNumberStyle
                style={{ flex: 1, minWidth: 0 }}
                size="small"
                controls={false}
                changeOnWheel
                precision={precision}
                formatter={(v) => `${!v ? 0 : toFixedStripped(v, precision)}`}
                parser={(v) => v as unknown as number}
                value={value}
                min={limit?.min}
                max={limit?.max}
                step={step}
                addonBefore={label}
                onFocus={onFocus}
                onBlur={(e) => { onBlur && onBlur(); commit(e.target.value); }}
                onKeyDown={(e) => { e.code == "Enter" && commit((e.target as HTMLInputElement).value); }}
                onChange={(v) => { v != null && onChange(v); }}
            />
            <DraggableButtonController step={step} onStep={(value, _rate, direction) => onStep(value * direction)} />
        </div>
    );

    return hint ? <Tooltip title={toFixedStripped(value, 3)} mouseEnterDelay={MOUSE_ENTER_DELAY}>{field}</Tooltip> : field;
}

interface ItemAxesInterface<V> extends ItemObject<AnyObject, string> {
    axes: Axis[]
    precision?: number | false
    labelVector?: Partial<Record<Axis, string>>
    limit?: Partial<Record<Axis, Limit>>
    step?: number
    units?: AxisUnits
    hint?: boolean
    onChange?: (value: V) => void
    // Shown under the fields.
    children?: React.ReactNode
}

// Row editing the axes of object[variable] (Vector2/3/4, Quaternion, Euler).
export const ItemAxes = <V,>(props: ItemAxesInterface<V>) => {
    const { object, variable } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    return <ItemAxesFields {...props} />
}

const ItemAxesFields = <V,>(props: ItemAxesInterface<V>) => {
    const { object, variable, axes, precision, labelVector, limit, step, units, hint, onChange, tooltip, layout, children } = props;
    const get = (axis: Axis) => (object[variable] as Record<Axis, number>)[axis];
    const read = () => axes.map(get);
    const toDisplay = (v: number) => units ? units.toDisplay(v) : v;
    const fromDisplay = (v: number) => units ? units.fromDisplay(v) : v;
    const [values, setValues] = useState(read);

    // Picks up changes made elsewhere (gizmos, other items), paused while a field is focused.
    const [loopStop, loopStart] = useDeltaTime(() => {
        axes.some((axis, i) => get(axis) != values[i]) && setValues(read());
    });

    // value is in display units, clamped to the axis limit.
    const setAxis = (axis: Axis, value: number) => {
        const range = limit?.[axis];
        const clamped = range ? MathUtils.clamp(value, range.min ?? -Infinity, range.max ?? Infinity) : value;
        (object[variable] as Record<Axis, number>)[axis] = fromDisplay(clamped);
        setValues(read());
        onChange && onChange(object[variable]);
    }

    return (
        <ItemRow label={resolveLabel(props)} tooltip={tooltip} layout={layout}>
            <div style={{ display: "flex" }}>
                {axes.map((axis, i) => (
                    <AxisInput
                        key={axis}
                        label={labelVector?.[axis] ?? axis.toUpperCase()}
                        value={toDisplay(values[i])}
                        precision={precision == false ? 0 : precision ?? PRECISION_AMOUNT}
                        limit={limit?.[axis]}
                        step={step}
                        hint={hint}
                        onFocus={loopStop}
                        onBlur={loopStart}
                        onChange={(v) => setAxis(axis, v)}
                        onStep={(delta) => setAxis(axis, toDisplay(get(axis)) + delta)}
                    />
                ))}
            </div>
            {children}
        </ItemRow>
    )
}

export default ItemAxes;

import { Slider } from "antd";
import React, { useState } from "react";
import { PRECISION_AMOUNT, Limit, resolveLabel, ItemObject, AnyObject, invalidVariable } from "./Item";
import { useInsideItemRow } from "./ItemContext";
import { ItemRow } from "./ItemRow";
import { useDeltaTime } from "src/store/Hooks";
import { ItemInvalidAlert } from "./ItemAlert";
import { toFixedStripped } from "@orb_utils/Main";
import { InputNumberStyle } from "./style";
import { evaluateFormula } from "@orb_utils/Math";
import { DraggableButtonController } from "@orb_UI/antd/DraggableButtonController";
import { KeyToValueOfType } from "@orb_types";

type NumberTypes = number | undefined;

interface InputNumberInterface<T extends AnyObject, K extends KeyToValueOfType<T, NumberTypes>> extends ItemObject<T, K> {
    limit?: Limit,
    step?: number,
    stepSlider?: number
    addonBefore?: React.ReactNode
    addonAfter?: React.ReactNode
    onChange?: (value: number) => void
    onFocus?: (e?: React.FocusEvent<HTMLElement>) => void
    onBlur?: (e?: React.FocusEvent<HTMLElement>) => void
}

export const ItemNumber = <T extends AnyObject, K extends KeyToValueOfType<T, NumberTypes>>(props: InputNumberInterface<T, K>) => {
    const { object, variable, limit, readonly, step, stepSlider, onChange, onFocus, onBlur, tooltip, layout, addonBefore, addonAfter, nodrag, disabled } = props;
    const [v, setValue] = useState<number>(object[variable]);
    const nested = useInsideItemRow();
    const showSlider = !readonly && !!limit;

    const [loopStop, loopStart] = useDeltaTime(() => {
        v != object[variable] && setValue(object[variable]);
    });

    const onChangeNumber = (v: number | null) => {
        if (v == null) return;
        setValue(v)
        object[variable] = v as T[K];
        onChange && onChange(v);
    }

    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;

    return (
        <ItemRow label={resolveLabel(props)} tooltip={tooltip} layout={layout}>
            <div style={{ display: "flex", alignItems: "center" }}>
                {
                    // Without a slider its space stays empty, so standalone inputs line up with the ones that have one.
                    // Inside a group the input takes the whole cell instead.
                    (showSlider || !nested) &&
                    <div style={{ flex: 2, minWidth: 0, marginRight: 10 }}>
                        {
                            showSlider &&
                            <Slider
                                min={limit?.min}
                                max={limit?.max}
                                step={stepSlider == undefined ? 0.01 : stepSlider}
                                onChange={(v) => onChangeNumber(v as number)}
                                tooltip={{ formatter: (value) => value && toFixedStripped(value, 2) }}
                                onBlur={() => onBlur && onBlur()}
                                onFocus={() => onFocus && onFocus()}
                                value={v}
                                disabled={disabled}
                            />
                        }
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
                    <InputNumberStyle
                        style={{ flex: 1, minWidth: 0 }}
                        controls={false}
                        onFocus={(e) => { loopStop(); onFocus && onFocus(e); }}
                        onKeyDown={(e) => {
                            if (e.code == "Enter") {
                                const v = evaluateFormula((e.target as HTMLInputElement).value);
                                v != null && onChangeNumber(v);
                            }
                        }}
                        onBlur={(e) => {
                            loopStart();
                            const v = evaluateFormula(e.target.value);
                            v != null && onChangeNumber(v);
                            onBlur && onBlur(e);
                        }}
                        value={v}
                        min={limit?.min}
                        max={limit?.max}
                        precision={addonAfter ? 2 : PRECISION_AMOUNT}
                        formatter={(v) => { return `${!v ? 0 : toFixedStripped(v, addonAfter ? 2 : PRECISION_AMOUNT)}` }}
                        parser={(v) => v as unknown as number}
                        addonBefore={addonBefore}
                        addonAfter={addonAfter}
                        changeOnWheel
                        readOnly={readonly}
                        step={step == undefined ? 0.1 : step}
                        disabled={readonly || disabled}
                        onChange={(v) => onChangeNumber(v as number)}
                    />
                    {
                        !readonly && !nodrag && !disabled &&
                        <DraggableButtonController
                            onStep={(value, _rate, direction) => {
                                const newVal = object[variable] as number + value * direction;
                                object[variable] = newVal as T[K];
                                const res = newVal;
                                onChangeNumber(res);
                            }}
                        />
                    }
                </div>
            </div>
        </ItemRow>
    )
}

export default ItemNumber;
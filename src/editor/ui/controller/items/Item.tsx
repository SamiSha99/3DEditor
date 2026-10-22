import { TooltipProps } from "antd";

export const MOUSE_ENTER_DELAY = 0.3;
export const PRECISION_AMOUNT = 6;
export const DRAGGABLE_CONTROLLER_WIDTH = "4px";

export const labelFromVariable = (variable: string) => {
    const title = variable.replace(/([a-z])([A-Z])/g, '$1 $2');
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export const resolveLabel = (props: { label?: string | false, labelInVariable?: boolean, variable?: string }) => {
    const { label, labelInVariable, variable } = props;
    return labelInVariable && !label && variable ? labelFromVariable(variable) : label;
}

// inline:  [label | value]
// stacked: [label]
//          [value spanning the whole row]
// full:    [value spanning the whole row, no label]
export type ItemRowLayout = "inline" | "stacked" | "full";

// A node, or Tooltip props with an optional `icon`, the same shapes Form.Item's `tooltip` accepted.
export type ItemTooltip = React.ReactNode | (TooltipProps & { icon?: React.ReactElement });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export const invalidVariable = (object: object, variable: string) => {
    return !Object.keys(object).find(key => key == variable || key == "_" + variable); // some keys have "_" at the beginning
}

export interface ItemBase {
    label?: string | false,
    tooltip?: ItemTooltip
    disabled?: boolean,
    readonly?: boolean,
    nodrag?: boolean
    layout?: ItemRowLayout
}

export interface Item extends ItemBase {
    labelInVariable?: boolean
}

export interface ItemObject<T extends AnyObject, K> extends Item {
    object: T,
    variable: K,
}

export type Limit = { min?: number, max?: number }
export const LIMIT_01 = { min: 0, max: 1 } as Limit;
export const LIMIT_BIPOLAR = { min: -1, max: 1 } as Limit;

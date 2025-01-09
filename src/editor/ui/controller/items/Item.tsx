import { FormItemProps } from "antd/es/form/FormItem";

export const MOUSE_ENTER_DELAY = 0.3;
export const PRECISION_AMOUNT = 6;
export const DRAGGABLE_CONTROLLER_WIDTH = "4px";

export const labelFromVariable = (variable: string) => {
    let title = variable.replace(/([a-z])([A-Z])/g, '$1 $2');
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export interface ItemObjectless extends Omit<Item, 'variable' | 'object' | 'labelInVariable'> { }

export interface Item extends FormItemProps {
    object: { [key: string]: any }
    default?: any
    variable: string
    label?: string | false,
    labelInVariable?: boolean
    disabled?: boolean,
    readonly?: boolean
}

export type Limit = { min?: number, max?: number }
export const LIMIT_01 = { min: 0, max: 1 } as Limit;
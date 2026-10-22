import { Select } from "antd";
import { ItemObject, resolveLabel, AnyObject, invalidVariable } from "./Item";
import { ItemRow } from "./ItemRow";
import { ItemInvalidAlert } from "./ItemAlert";
import { DefaultOptionType } from "antd/es/select";
import { KeyToValueOfType } from "@orb_types";

type SelectType = DefaultOptionType[]

interface SelectInterface<T extends AnyObject, K extends KeyToValueOfType<T, SelectType>> extends ItemObject<T, K> {
    disabled?: boolean
    defaultValue?: string
    labelInValue?: boolean
    options?: DefaultOptionType[]
    // to-do: the passed content is string when [labelInValue = false] otherwise very misleading, this needs to be checked further
    onChangeSelect?: (select: { value: string, label: string } | string | number) => void;
}

export const ItemSelect = <T extends AnyObject, K extends KeyToValueOfType<T, SelectType>>(props: SelectInterface<T, K>) => {
    const { object, variable, disabled, defaultValue, labelInValue, onChangeSelect, tooltip, layout } = props;
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const list = object[variable] as DefaultOptionType[];

    return (
        <ItemRow label={resolveLabel(props)} tooltip={tooltip} layout={layout}>
            <Select
                style={{ width: "100%" }}
                disabled={disabled}
                defaultValue={defaultValue ? { value: defaultValue, label: defaultValue } : undefined}
                labelInValue={labelInValue}
                onChange={(select: { value: string, label: string }) => { onChangeSelect && onChangeSelect(select); }}
                options={list}
            />
        </ItemRow>
    )
}

export default ItemSelect;
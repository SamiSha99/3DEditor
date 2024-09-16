import { Form, Select } from "antd";
import { Item, labelFromVariable } from "./Item";
import { invalidVariable, ItemInvalidAlert } from "./ItemAlert";
import { DefaultOptionType } from "antd/es/select";

interface SelectInterface extends Item {
    disabled?: boolean
    defaultValue?: string
    labelInValue?: boolean
    options?: DefaultOptionType[]
    onChangeSelect?: (select: { value: string, label: string }) => void
}

export const ItemSelect: React.FC<SelectInterface> = (
    { label, object, variable, disabled, defaultValue, labelInValue, onChangeSelect }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const list = object[variable] as DefaultOptionType[];

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <Select
                disabled={disabled != undefined ? disabled : false}
                defaultValue={defaultValue ? { value: defaultValue, label: defaultValue } : undefined}
                labelInValue={labelInValue}
                onChange={(select: { value: string, label: string }) => { onChangeSelect && onChangeSelect(select); }}
                options={list}
            />
        </Form.Item>
    )
}

export default ItemSelect;
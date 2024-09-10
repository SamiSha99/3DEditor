import { Form, Select } from "antd";

type SelectInterface = {
    label: string
    enabled?: boolean
    defaultValue?: string
    labelInValue?: boolean
    options?: { value: string, label: string }[]
    onChangeSelect?: (select: { value: string, label: string }) => void
}

export const ItemSelect: React.FC<SelectInterface> = (
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

export default ItemSelect;
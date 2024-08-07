import { Form, Select } from "antd";

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
        <Form.Item label={label} style={{marginBottom: '0px', display: 'inline-block', width: '100%'}}>
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

export default SelectItem;
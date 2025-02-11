import { Alert, Form } from "antd"
import { LabelTooltipType } from "antd/es/form/FormItemLabel"
import { ItemBase } from "./Item"

interface ItemGroupInterface extends ItemBase {
    label?: string,
    children: React.ReactNode | React.ReactNode[]
    sizes?: string[]
    tooltip?: LabelTooltipType
}

export const ItemGroup = (props: ItemGroupInterface) => {
    let { label, sizes, children, tooltip } = props
    if (!Array.isArray(children)) children = [children];
    if (Array.isArray(children)) {
        if (!sizes) {
            sizes = []
            sizes.push(...Array(children.length).fill(100 / children.length + "%"))
        }
        return (
            <Form.Item label={label} tooltip={tooltip}>
                {children?.map((c, index) => <Form.Item style={{ display: 'inline-block', width: sizes![index], margin: "-5px 0px" }}>{c}</Form.Item>)}
            </Form.Item>
        )
    }
    return (
        <Form.Item label={label}>
            <Alert message={`Grouping failed for "${label}" with sizes: ${sizes}.`} type="error" showIcon />
        </Form.Item>
    )
}

export default ItemGroup;
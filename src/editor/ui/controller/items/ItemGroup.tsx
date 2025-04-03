import { Alert, Form } from "antd"
import { LabelTooltipType } from "antd/es/form/FormItemLabel"
import { ItemBase } from "./Item"

interface ItemGroupInterface extends ItemBase {
    label?: string,
    children: React.ReactNode | React.ReactNode[]
    // string is the sizes in % up to 100%
    // number is coverted to string[] with the sum of all numbers = 100% 
    // e.g [1, 2, 3] = ["16.67%", "33.33%", "50%"]
    sizes?: string[] | number[]
    tooltip?: LabelTooltipType
}

export const ItemGroup = (props: ItemGroupInterface) => {
    let { label, sizes, children, tooltip } = props
    if (!Array.isArray(children)) children = [children];
    if (Array.isArray(children)) {
        if (sizes == undefined) {
            sizes = [] as string[];
            sizes.push(...Array(children.length).fill(100 / children.length + "%"))
        }
        else if (sizes.every(item => typeof item === "number")) {
            const totalSum = sizes.reduce((a, b) => a + b, 0) as number;
            sizes = sizes.map((item) => { return `${(item / totalSum) * 100}%`; }) as string[];
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
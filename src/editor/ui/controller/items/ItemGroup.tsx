import { Alert, Form } from "antd"

type ItemGroupInterface = {
    label: string,
    children: React.ReactNode | React.ReactNode[]
    sizes?: string[]
}

export const ItemGroup: React.FC<ItemGroupInterface> = (
    { label, sizes, children }
) => {
    if (!Array.isArray(children)) children = [children];
    if (Array.isArray(children)) {
        if (!sizes) {
            sizes = []
            sizes.push(...Array(children.length).fill(100 / children.length + "%"))
        }
        return (
            <Form.Item label={label}>
                {children?.map((c, index) => <Form.Item style={{ display: 'inline-block', width: sizes![index] }}>{c}</Form.Item>)}
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
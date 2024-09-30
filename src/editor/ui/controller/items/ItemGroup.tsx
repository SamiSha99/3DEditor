import { Form } from "antd"

type ItemGroupInterface = {
    label: string,
    children: React.ReactNode[]
    sizes?: string[]
}

export const ItemGroup: React.FC<ItemGroupInterface> = (
    { label, sizes, children }
) => {
    if (!sizes) {
        sizes = []
        sizes.push(...Array(children.length).fill(100 / children?.length + "%"))
    }
    return (
        <Form.Item label={label}>
            {children?.map((c, index) => <Form.Item style={{ display: 'inline-block', width: sizes[index] }}>{c}</Form.Item>)}
        </Form.Item>
    )
}

export default ItemGroup;
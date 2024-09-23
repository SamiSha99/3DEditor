import { Collapse } from "antd"

type ItemGroupInterface = {
    label: string,
    key: string,
    children?: React.ReactNode
}

export const ItemGroup: React.FC<ItemGroupInterface> = (
    { label, key, children }
) => {
    return (
        <Collapse
            style={{ width: "100%" }}
            items={[{ label: label, key: key, children: children }]}
        />
    )
}

export default ItemGroup;
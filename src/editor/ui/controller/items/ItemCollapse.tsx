import { Collapse } from "antd"
import { SizeType } from "antd/es/config-provider/SizeContext"

type ItemCollapseInterface = {
    label: React.ReactNode,
    children?: React.ReactNode,
    collapsed?: boolean,
    size?: SizeType,
    extra?: React.ReactNode,
    alwaysOpen?: boolean
}

export const ItemCollapse: React.FC<ItemCollapseInterface> = (
    { label, children, collapsed, size, extra, alwaysOpen }
) => {
    return (
        <Collapse
            defaultActiveKey={!collapsed ? ["1"] : undefined}
            style={{ width: "100%" }}
            size={size}
            collapsible={alwaysOpen ? "icon" : undefined}
            items={[{ label: label, key: "1", children: <div>{children}</div>, extra: extra, showArrow: !alwaysOpen }]}
        />
    )
}

export default ItemCollapse;
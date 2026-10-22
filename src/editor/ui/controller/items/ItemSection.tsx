import { Divider } from "antd";

interface ItemSectionInterface {
    label: React.ReactNode
}

// Titled divider spanning the whole row, starts a new section of items.
export const ItemSection = (props: ItemSectionInterface) => {
    return <Divider orientation="left" children={props.label} />
}

export default ItemSection;

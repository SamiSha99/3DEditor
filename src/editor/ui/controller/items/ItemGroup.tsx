import { Children } from "react"
import { ItemBase } from "./Item"
import { ItemRow } from "./ItemRow"

interface ItemGroupInterface extends ItemBase {
    label?: string,
    children: React.ReactNode | React.ReactNode[]
    // string is a fixed size per child, e.g ["75%", "25%"], sizes that add up to more than 100% wrap to the next line
    // number is a ratio of the row, e.g [1, 2, 3] = 1/6, 2/6 and 3/6 of the row
    // children without a size share the remaining space
    sizes?: string[] | number[]
}

export const ItemGroup = (props: ItemGroupInterface) => {
    const { label, sizes, children, tooltip, layout } = props;

    return (
        <ItemRow label={label} tooltip={tooltip} layout={layout}>
            <div style={{ display: "flex", flexWrap: "wrap", rowGap: 4 }}>
                {Children.toArray(children).map((c, index) => {
                    const size = sizes?.[index] ?? 1;
                    return <div key={index} style={{ flex: typeof size == "number" ? `${size} 1 0` : `0 0 ${size}`, minWidth: 0 }}>{c}</div>
                })}
            </div>
        </ItemRow>
    )
}

export default ItemGroup;

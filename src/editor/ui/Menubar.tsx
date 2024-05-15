import { File } from "./dropdowns/File";
import { Add } from "./dropdowns/Add";
import { Create } from "./dropdowns/Create"
import { Tools } from "./dropdowns/Tools";
import { MenuBarStyle } from "./style";

export const MenuBar = () => {
    return (
        <MenuBarStyle>
            <File />
            <Create />
            <Add />
            <Tools />
        </MenuBarStyle>
    )
}
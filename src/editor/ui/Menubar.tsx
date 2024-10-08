import File from "./dropdowns/File";
import Add from "./dropdowns/Add";
import Create from "./dropdowns/Create"
import Tools from "./dropdowns/Tools";
import Settings from "./dropdowns/Settings"
import { MenuBarStyle } from "./style";

export const MenuBar = () => {
    return (
        <MenuBarStyle>
            <File />
            <Add />
            {/* <Create /> */}
            <Tools />
            {/* <Settings /> */}
        </MenuBarStyle>
    )
}
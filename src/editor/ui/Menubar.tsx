import File from "./dropdowns/File";
import Add from "./dropdowns/Add";
import Tools from "./dropdowns/Tools";
import View from "./dropdowns/View"
import { MenuBarStyle } from "./style";

export const MenuBar = () => {
    return (
        <MenuBarStyle>
            <File />
            <Add />
            <Tools />
            <View />
        </MenuBarStyle>
    )
}
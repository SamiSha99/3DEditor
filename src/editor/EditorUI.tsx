import { PrimitiveList } from './MeshCreator/Primitives'
import { Exporter, ExporterUSDZ } from './Exporters';
import { Importer } from './Importer';
import { useStores } from '../App';
import { observer } from 'mobx-react-lite';
import { Dropdown, MenuProps, Button, Space } from 'antd'; 
import { UserOutlined } from '@ant-design/icons';
let mode = 0;
let space = 0;


export const EditorUI = observer(() => {
    const {controlsSpace, controlsMode, setControlsMode, setControlSpace, controlsObject3D} = useStores()
    document.body.onkeyup = function(e) {
        if(e.key == " "|| e.code == "Space" || e.keyCode == 32) 
            setControlsMode(++mode >= 3 ? (mode = 0) : mode)
        console.log(controlsObject3D);
    }
    return (
        <div style={{position:'absolute', zIndex:2}}>

            <PrimitiveList />
            <Dropdown menu={menuProps}> 
                <Button>Export</Button>
            </Dropdown>
                
            <button onClick={() => setControlSpace(++space >= 2 ? (space = 0) : space)}>{controlsSpace.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</button>
            <Exporter />
            <ExporterUSDZ />
            <Importer />
        </div>
    )
})

const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };
  
  const items: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: '3rd menu item',
      key: '3',
      icon: <UserOutlined />,
      danger: true,
    },
    {
      label: '4rd menu item',
      key: '4',
      icon: <UserOutlined />,
      danger: true,
      disabled: true,
    },
  ];
  
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

export default EditorUI
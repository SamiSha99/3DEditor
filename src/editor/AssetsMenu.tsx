import { observer } from "mobx-react-lite"
import { Dropdown, Image, MenuProps, message, Tooltip } from "antd";
import { useEditor } from "@orb_Editor";
import { IModelFileResponse } from "src/store/Interfaces";
import { doImportFile } from "@orb_tools/Importer";
import { useState } from "react";

const AssetsMenu = observer(() => {
    const { storageModels } = useEditor();

    console.log(storageModels);

    return (
        <div style={{ width: "90%", margin: "auto", height: "100%" }}>
            <h1>Assets</h1>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    flexWrap: "wrap",
                    marginTop: "10px"
                }}>
                    {storageModels.map((asset) => { return <Asset asset={asset} /> })}
                </div>
            </div>
        </div>
    )
})

interface Asset {
    asset: IModelFileResponse
}

const Asset = observer((props: Asset) => {
    const { asset } = props;
    const { addObject } = useEditor();
    const [open, setOpen] = useState(false);

    const getFileFromURL = async (url: string, type: "glb" | "usdz") => {
        const response = await fetch(url);
        const data = await response.blob();
        const file = new File([data], type == "glb" ? asset.metadataAndroid.displayName : asset.metadata.displayName);
        return file;
    }

    const items: MenuProps['items'] = [
        {
            label: 'Import GLB',
            key: '1',
            onClick: async () => {
                const file = await getFileFromURL(asset.fileUrlAndroid, "glb");
                doImportFile(file, (result) => {
                    console.log(result);
                    addObject(result, true);
                    message.success("Imported GLB to Scene!");
                });
            }
        },
        {
            label: 'Import USDZ',
            key: '2',
            onClick: async () => {
                const file = await getFileFromURL(asset.fileUrl, "usdz");
                doImportFile(file, (result) => {
                    console.log(result);
                    addObject(result, true);
                    message.success("Imported USDZ to Scene!");
                });
            }
        }
    ];

    return (
        <div style={{ padding: "5px max(5px, 0.5%)" }}>
            <Dropdown menu={{ items }} trigger={['contextMenu']} onOpenChange={(b) => setOpen(b)}>
                <div style={{ width: 64, height: 64 }}>
                    <Image
                        style={{
                            border: "3px solid white",
                            boxShadow: "5px 5px 3px 1px rgba(0, 0, 0, 0.4)",
                            backgroundColor: "#696969"
                        }}
                        src={asset.fileThumbnail}
                        typeof="png"
                        preview={false}
                    />
                    <Tooltip title={open ? "" : asset.fileName}>
                        <div style={{ width: "100%", textOverflow: "ellipsis", overflow: "hidden" }}>
                            {asset.fileName}
                        </div>
                    </Tooltip>
                </div>
            </Dropdown>
        </div>
    )
})

export default AssetsMenu;
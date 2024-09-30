import { Button, Form, Image, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import { Item, labelFromVariable } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { Material, Texture } from "three";
import { saveLink } from "@orb_tools/Exporter";
import { CloudUploadOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { doImportTexture } from "@orb_tools/Importer";

interface TextureInterface extends Item {
    onChange?: (value?: Texture) => void
}

type TextureObject = {
    url: string,
    type: string
}

export const ItemTexture: React.FC<TextureInterface> = (
    { label, labelInVariable, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [textureObject, setTextureObject] = useState<TextureObject | undefined>(undefined);
    const [hoverUploadIcon, setHoverUploadIcon] = useState(false);
    const imageRef = useRef<any>(null!);

    const makeImageObject = (t: Texture) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        canvas.width = t.image.width;
        canvas.height = t.image.height;
        ctx?.drawImage(t.image, 0, 0, t.image.width, t.image.height, 0, 0, t.image.width, t.image.height);
        canvas.toBlob((b) => {
            if (!b) return;
            textureObject && URL.revokeObjectURL(textureObject.url)
            const obj = { url: URL.createObjectURL(b), type: b.type } as TextureObject;
            setTextureObject(obj);
            imageRef.current.src = obj.url;
        });
    }

    object[variable] && !textureObject && makeImageObject(object[variable] as Texture);

    const requestUploadTexture = () => {
        doImportTexture((texture) => {
            object[variable] = texture;
            (object[variable] as Texture).needsUpdate = true;
            (object as Material).needsUpdate = true;
            makeImageObject(object[variable]);
            onChange && onChange(texture);
            setHoverUploadIcon(false);
        })
    }

    const requestDownloadTexture = () => {
        textureObject && saveLink(textureObject.url, variable, textureObject.type)
    }

    return (
        <Form.Item label={labelInVariable && !label ? labelFromVariable(variable) : label}>
            <div style={{ display: "flex" }}>
                <div style={{ width: 64, height: 64, flexShrink: 0, backgroundColor: "#303030", outline: "2px solid #404040", display: "flex", alignItems: "center", justifyContent: "center" }}
                    onMouseEnter={() => {

                        !textureObject && setHoverUploadIcon(true);
                    }}
                    onMouseLeave={() => {
                        !textureObject && setHoverUploadIcon(false);
                    }}>
                    {
                        !textureObject?.url &&
                        <div style={{ color: "darkgrey", width: hoverUploadIcon ? "100%" : undefined, height: hoverUploadIcon ? "100%" : undefined }}>
                            {hoverUploadIcon ? <Button style={{ width: "100%", height: "100%" }} icon={<CloudUploadOutlined style={{ fontSize: 32 }} />} onClick={requestUploadTexture} /> : "[empty]"}
                        </div>
                    }
                    {
                        textureObject?.url &&
                        <Image
                            style={{ objectFit: "cover" }}
                            src={textureObject.url}
                            preview={{ mask: <EyeOutlined style={{ fontSize: 32 }} /> }}
                        />
                    }
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button icon={<CloudUploadOutlined />} onClick={requestUploadTexture} />
                    <Button icon={<DownloadOutlined />} disabled={!object[variable]} onClick={requestDownloadTexture} />
                    <Popconfirm
                        title="Remove Texture"
                        description="This cannot be undone."
                        onConfirm={() => {
                            const t = object[variable] as Texture;
                            t.dispose();
                            object[variable] = undefined;
                            (object as Material).needsUpdate = true;
                            setTextureObject(undefined);
                            onChange && onChange(undefined);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger={object[variable]} disabled={!object[variable]} icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            </div>
        </Form.Item >
    )
}

export default ItemTexture;
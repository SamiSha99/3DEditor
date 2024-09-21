import { Button, Form, Image, ImageProps, Popconfirm, Tooltip } from "antd";
import React, { useRef, useState } from "react";
import { Item, labelFromVariable, MOUSE_ENTER_DELAY } from "./Item";
import { ItemInvalidAlert, invalidVariable } from "./ItemAlert";
import { CanvasTexture, Material, Texture } from "three";
import { saveLink } from "@orb_tools/Exporter";
import { CloseOutlined, DeleteOutlined, DownloadOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import { doImportTexture } from "@orb_tools/Importer";

interface TextureInterface extends Item {
    onChange?: (value: string) => void
}

type TextureObject = {
    url: string,
    type: string
}

export const ItemTexture: React.FC<TextureInterface> = (
    { label, object, variable, onChange }
) => {
    if (invalidVariable(object, variable)) return <ItemInvalidAlert variable={variable} object={object} />;
    const [textureObject, setTextureObject] = useState<TextureObject | undefined>(undefined);
    const imageRef = useRef<any>(null!);

    const makeImageObject = (t: Texture) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        canvas.width = t.image.width;
        canvas.height = t.image.height;
        ctx?.drawImage(t.image, 0, 0, t.image.width, t.image.height, 0, 0, t.image.width, t.image.height);
        canvas.toBlob((b) => {
            if (!b) return;
            console.log(b.type);
            if (textureObject)
                URL.revokeObjectURL(textureObject.url)
            const obj = { url: URL.createObjectURL(b), type: b.type };
            setTextureObject(obj);
            imageRef.current.src = obj.url;

        });
    }

    if (object[variable] && !textureObject) {
        makeImageObject(object[variable] as Texture);
    }

    const requestUploadTexture = () => {
        doImportTexture((texture) => {
            object[variable] = texture;
            (object[variable] as Texture).needsUpdate = true;
            (object as Material).needsUpdate = true;
            makeImageObject(object[variable]);
        })
    }

    const requestDownloadTexture = () => {
        console.log(object[variable].image);
        if (textureObject)
            saveLink(textureObject.url, variable, textureObject.type)
    }

    return (
        <Form.Item label={label ? label : labelFromVariable(variable)}>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        width: 96,
                        height: 48,
                        backgroundColor: "#303030",
                        border: "2px solid #404040",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {!textureObject?.url && <CloseOutlined style={{ fontSize: 18 }} />}
                    {
                        textureObject?.url &&
                        <Image
                            style={{ objectFit: "cover" }}
                            src={textureObject.url}
                            preview={{ mask: <EyeOutlined style={{ fontSize: 18 }} /> }}
                            height={48}
                            width={96}
                        />
                    }
                </div>
                <Button icon={<UploadOutlined />} onClick={requestUploadTexture} />
                <Button icon={<DownloadOutlined />} disabled={!object[variable]} onClick={requestDownloadTexture} />
                <Popconfirm
                    title="Delete Texture"
                    description="This cannot be undone."
                    onConfirm={() => {
                        const t = object[variable] as Texture;
                        t.dispose();
                        t.needsUpdate = true;
                        object[variable] = undefined;
                        setTextureObject(undefined);
                        (object as Material).needsUpdate = true;
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger={object[variable]} disabled={!object[variable]} icon={<DeleteOutlined />} />
                </Popconfirm>
            </div>
        </Form.Item >
    )
}

export default ItemTexture;
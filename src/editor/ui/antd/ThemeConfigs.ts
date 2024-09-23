import { theme, ThemeConfig } from "antd";

export const MainTheme: ThemeConfig = {
    algorithm: [theme.darkAlgorithm,],
    components: {
        Form: {
            itemMarginBottom: 0
        },
        InputNumber: {
            size: 10,
            inputFontSizeSM: 12,
            inputFontSize: 12,
            inputFontSizeLG: 12,
            paddingBlock: 2,
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Input: {
            size: 10,
            inputFontSizeSM: 12,
            inputFontSize: 12,
            inputFontSizeLG: 12,
            paddingBlock: 2,
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Select: {
            colorBorder: "rgba(0, 0, 0, 0.02)"
        },
        Button: {
            defaultBg: "#212121",
            defaultHoverBg: "#323232",
            defaultActiveBg: "#323232",
            colorBorder: "none",
        },
        Radio: {
            colorBorderSecondary: "none",
            colorPrimaryBorder: "none",
            buttonBg: "none",
            colorBorder: "rgb(0,0,0,0)",
        },
        Divider: {
            colorSplit: "rgb(255, 255, 255, 0.5)",
            lineWidth: 2,
            fontSize: 28
        },
        Checkbox: {
            controlInteractiveSize: 18
        },
        Slider: {
            controlHeight: 0,
            margin: 200
        },
        Tree: {

        }
    },
    token: {
        borderRadius: 0,
        borderRadiusSM: 0,
        borderRadiusLG: 0,
        borderRadiusOuter: 0,
        borderRadiusXS: 0,
        motion: true
    }
}

export const PanelsThemeConfig: ThemeConfig = {
    components: {
        Divider: {
            margin: 0,
        },
        Button: {
            defaultBg: "#3d3d3d"
        },
        Card: {
            // headerFontSize: "1vw"
        }
    },
    token: {
        motion: false
    }
}
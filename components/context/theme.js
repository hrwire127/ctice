import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';

const themeLight = createTheme({
    palette: {
        background: {
            default: "#DCDCDC",
            paper: "#F2F2F2"
        },
        primary: {
            main: "#143F6B"
        },
        secondary: {
            main: "#FEB139"
        },
        tertiary: {
            main: "#2D5C7F"
        },
        base: {
            main: "#332FD0"
        },
        text: {
            default: "#262626",
            primary: "#292929",
            tertiary: "#2D5C7F",
            base: "#332FD0",
            error: "#d32f2f",
            success: "#2e7d32",
            info: "#0288d1"
        },
        shadow: "rgba(118, 118, 118, 0.23)",
    },
    card: "#F2F2F2",
    top: "#EBEBEB",
    line: "#9F9F9F",
    title: {
        font: "'Lato', sans-serif",
        size: 22,
        weight: 600,
        color: "rgb(0 0 0 / 60%)",
    },
    gradient: "linear-gradient(274deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 0%, #143F6B 0%, #4D77FF 100%)",
    maxPadding: 200,
    minPadding: 60,
    drawerWidth: 170,
    windowDrawerWidth: 280,
    cardHeight: 55,
    containerMaxWidth: 800
});

const themeBlack = createTheme({
    palette: {
        background: {
            default: "#262626",
            paper: "#111111"
        },
        primary: {
            main: "#FEB139",
        },
        secondary: {
            main: "#143F6B"
        },
        tertiary: {
            main: "#FFBC80"
        },
        base: {
            main: "#F55353"
        },
        text: {
            default: "#FEB139",
            primary: "#ECECEC",
            tertiary: "#FFBC80",
            base: "#F55353",
            error: "#d32f2f",
            success: "#2e7d32",
            info: "#0288d1"
        },
        shadow: "rgba(118, 118, 118, 0.23)",
        mode: "dark",
    },
    typography: {
        body1: {
            color: "#ECECEC"
        },
        h1: {
            color: "#FF9F45"
        },
        h2: {
            color: "#FF9F45"
        },
        h3: {
            color: "#FF9F45"
        },
        h4: {
            color: "#FF9F45"
        },
        h5: {
            color: "#FF9F45"
        },
        h6: {
            color: "#FF9F45"
        },
    },
    card: "#111111",
    top: "#1E1E1E",
    line: "#c9c9c9",
    title: {
        font: "'Lato', sans-serif",
        size: 22,
        weight: 600,
        color: "#FEB139",
    },
    gradient: "linear-gradient(274deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 0%,#FEB139 0%, #F55353 100%)",
    maxPadding: 200,
    minPadding: 60,
    drawerWidth: 170,
    windowDrawerWidth: 280,
    cardHeight: 55,
    containerMaxWidth: 800

});

export { themeLight, themeBlack };
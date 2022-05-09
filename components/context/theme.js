import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';

const themeLight = createTheme({
    palette: {
        primary: {
            main: "#143F6B"
        },
        secondary: {
            main: "#FEB139"
        },
        base: {
            main: "#332FD0"
        }
    },
    title: {
        font: "'Lato', sans-serif",
        size: 22,
        weight: 600,
        color: "rgb(0 0 0 / 60%)",
    },
    background:
    {
        primary: "white",
        secondary: "#d9d9d9"
    },
    gradient: "linear-gradient(274deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 0%, #143F6B 0%, #4D77FF 100%)"
});

const themeBlack = createTheme({
    palette: {
        primary: {
            main: "#FEB139"
        },
        secondary: {
            main: "#143F6B"
        },
        base: {
            main: "#F55353"
        },
        text: {
            primary: "#ffffff"
        },
    },
    title: {
        font: "'Lato', sans-serif",
        size: 22,
        weight: 600,
        color: "#FEB139",
    },
    background:
    {
        primary: "#222222",
        secondary: "#2b2b2b"
    },
    gradient: "linear-gradient(274deg, rgba(255,255,255,0) 0%, rgba(0,0,0,1) 0%,#FEB139 0%, #F55353 100%)"

});

export { themeLight, themeBlack };
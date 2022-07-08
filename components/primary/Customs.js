import React, { useState } from 'react'
import { LightMode, DarkMode, TableRows, Lens, Score, DateRange } from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';
import StyleContext from '../context/contextStyle'
import SortContext from '../context/contextSort'
import useStyles from '../../assets/styles/_Customs'
import Redirects_CS from '../../utilsCS/CS_Redirects'
import useWindowSize from '../hooks/useWindowSize'

function Customs(props)
{
    const { user, setThemeLight, light, setSortCtx, setStyleCtx, setError } = props;
    const sortCtx = React.useContext(SortContext);
    const styleCtx = React.useContext(StyleContext);

    const [theme, setTheme] = useState(light ? 'light' : 'dark');
    const [style, setStyle] = useState(styleCtx);
    const [sort, setSorting] = useState(sortCtx);
    const [windowSmSize] = useWindowSize(400, 0);
    const [windowMdSize] = useWindowSize(600, 0);

    const classes = useStyles()

    const imgWidth = windowSmSize ? "80%" : (windowMdSize ? "60%" : "35%")

    const ImgSelected = { width: imgWidth, opacity: 0.5 }
    const ImgEmpty = { width: imgWidth, boxShadow: "0 0 10px -5px", cursor: "pointer" }

    const handleTheme = (e, newTheme) =>
    {
        if (newTheme !== null)
        {
            fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/theme`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { light: newTheme === "light" ? false : true, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                .then(async res =>
                {
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    setThemeLight(res.obj)
                    setTheme(newTheme);
                })
        }
    };

    const handleStyle = (e, newStyle) =>
    {
        if (newStyle !== null)
        {
            fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/style`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { newStyle, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                .then(async res =>
                {
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    setStyleCtx(newStyle)
                    setStyle(newStyle);
                })
        }
    };

    const handleSort = (e, newSort) =>
    {
        if (newSort !== null)
        {
            fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/sort`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { newSort, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                .then(async res =>
                {
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    setSortCtx(newSort)
                    setSorting(newSort);
                })
        }
    };

    return (
        <Box
            component="main"
            className={classes.Body}
        >
            <Box sx={{ p: 2 }}>
                <Typography className={classes.Heading} variant="h5">Theme</Typography>
                <Box
                    value={theme}
                    exclusive
                    onChange={handleTheme}
                    aria-label="Theme"
                >
                    <Box className={classes.Container}>
                        <img crossOrigin="anonymous" src="/images/theme-1.png"
                            style={theme === "light"
                                ? ImgSelected
                                : ImgEmpty}
                            onClick={(e) => handleTheme(e, "light")} />
                        <img crossOrigin="anonymous" src="/images/theme-2.png"
                            style={theme === "dark"
                                ? ImgSelected
                                : ImgEmpty}
                            onClick={(e) => handleTheme(e, "dark")} />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 2 }}>
                <Typography className={classes.Heading} variant="h5">Style</Typography>
                <Box
                    value={style}
                    exclusive
                    onChange={handleStyle}
                    aria-label="Style"
                >
                    <Box className={classes.Container}>
                        <img crossOrigin="anonymous" src={theme === "light" ? "/images/full-white.png" : "/images/full-black.png"}
                            style={style === "full"
                                ? ImgSelected
                                : ImgEmpty}
                            onClick={(e) => handleStyle(e, "full")} />
                        <img crossOrigin="anonymous" src={theme === "light" ? "/images/compact-white.png" : "/images/compact-black.png"}
                            style={style === "compact"
                                ? ImgSelected
                                : ImgEmpty}
                            onClick={(e) => handleStyle(e, "compact")} />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 2 }}>
                <Typography className={classes.Heading} variant="h5">Sort</Typography>
                <Box
                    value={sort}
                    exclusive
                    onChange={handleStyle}
                    aria-label="Sort"
                >
                    <Box className={classes.Container}>
                        <img crossOrigin="anonymous" src={theme === "light" ? "/images/date-white.png" : "/images/date-black.png"}
                            style={sort === "date"
                                ? ImgSelected
                                : ImgEmpty}
                            onClick={(e) => handleSort(e, "date")} />
                        <img crossOrigin="anonymous" src={theme === "light" ? "/images/score-white.png" : "/images/score-black.png"}
                            style={sort === "score"
                                ? ImgSelected
                                : ImgEmpty}
                            onClick={(e) => handleSort(e, "score")} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Customs
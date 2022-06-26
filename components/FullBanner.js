import React, { useEffect } from 'react'
import { Box, Paper, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import useStyles from '../assets/styles/_FullBanner'
import DocView from './DocView'

function FullBanner(props)
{
    const { banner, setOpen } = props //
    const classes = useStyles()

    useEffect(() =>
    {
        const main = document.querySelector(".cover")
        main.style.position = "absolute"
        main.style.zIndex = 2
        main.style.background = "rgba(255, 255, 255, 0.2)"
        main.style.backdropFilter = "blur(8px)"
        main.style.minHeight = "100%"
        main.style.width = "98.9vw"

        main.addEventListener('click', () =>
        {
            setOpen(false)
        })

        return () =>
        {
            const main = document.querySelector(".cover")
            main.style = null
        }
    }, [])

    return (
        <Paper
            elevation={12}
            className={classes.classes}
        >
            <Box sx={{ display: "flex", justifyContent: "right" }}>
                <IconButton onClick={() => setOpen(false)} align="right"><Close /></IconButton>
            </Box>
            <DocView url={banner.content} raw={banner.raw} />
        </Paper>
    )
}

export default FullBanner
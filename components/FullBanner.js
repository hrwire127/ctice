import React, { useEffect } from 'react'
import { Box, Paper, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import DocView from './DocView'

function FullBanner(props)
{
    const { banner, setOpen } = props //

    useEffect(() =>
    {
        const main = document.querySelector(".cover")
        main.style.position = "absolute"
        main.style.zIndex = 2
        main.style.background = "rgba(255, 255, 255, 0.2)"
        main.style.backdropFilter = "blur(8px)"
        main.style.height = "100%"
        main.style.width = "98.9vw"

        return () =>
        {
            const main = document.querySelector(".cover")
            main.style = null
            main.style = null
        }
    }, [])

    return (
        <Paper
            elevation={12}
            sx={{
                width: "80vw",
                height: "80vh",
                zIndex: 4,
                position: "absolute",
                top: "50%",
                left: "50%",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "right" }}>
                <IconButton onClick={() => setOpen(false)} align="right"><Close /></IconButton>
            </Box>
            <DocView url={banner.content} raw={banner.raw} />
        </Paper>
    )
}

export default FullBanner
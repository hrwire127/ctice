import React from 'react'
import { Box, Paper, Toolbar, IconButton } from '@mui/material'
import { Clear } from "@mui/icons-material"
import DocView from "./DocView"

function NotifItem(props)
{
    const { content } = props //

    return (
        <Box sx={{ width: "100%", border: "1px solid", borderRadius: 1, position: "relative" }}>
            <IconButton sx={{ position: "absolute" }} size="small"><Clear /></IconButton>
            <DocView url={content} />
        </Box>
    )
}

export default NotifItem
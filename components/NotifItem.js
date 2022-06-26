import React from 'react'
import { Box, Paper, Toolbar, IconButton } from '@mui/material'
import { Clear } from "@mui/icons-material"
import DocView from "./DocView"

function NotifItem(props)
{
    const { content, raw, onDelete, index } = props //

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            <IconButton
                sx={{ position: "absolute" }}
                size="small"
                onClick={() => onDelete(index)}
            >
                <Clear />
            </IconButton>
            <DocView url={content} raw={raw} />
        </Box>
    )
}

export default NotifItem
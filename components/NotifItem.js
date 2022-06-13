import React from 'react'
import { Box, Paper, Toolbar, IconButton } from '@mui/material'
import { Clear } from "@mui/icons-material"
import DocView from "./DocView"

function NotifItem(props)
{
    const { content, raw, onDelete, index } = props //

    console.log(content)

    return (
        <Box sx={{ width: "100%", border: "1px solid", borderRadius: 1, position: "relative" }}>
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
import React from 'react'
import { Box, Paper } from "@mui/material"
import DocView from './DocView'

function FixedBanner(props)
{
    const { banner } = props //

    return (
        <Paper sx={{ width: "100%" }}>
            <DocView url={banner.content} raw={banner.raw} />
        </Paper>
    )
}

export default FixedBanner
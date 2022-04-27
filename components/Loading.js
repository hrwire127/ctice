import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function Loading(props)
{
    if (props)
    {
        if (props.center)
        {
            return <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                <Box role="status">
                    <CircularProgress />
                </Box>
            </div>
        }
        else if (props.middle)
        {
            return <div style={{ display: "flex", height: "100", alignItems: "center" }}>
                <Box role="status">
                    <CircularProgress />
                </Box>
            </div>
        }
        else if (props.full)
        {
            return <div style={{ display: "flex", width: "100%", height: "100", justifyContent: "center", alignItems: "center" }}>
                <Box role="status">
                    <CircularProgress />
                </Box>
            </div>
        } 
        else if (props.fullPage)
        {
            return <div style={{ position: "absolute", top: "50%", left: "50%"}}>
                <Box role="status">
                    <CircularProgress />
                </Box>
            </div>
        }
    }
    return <Box role="status">
        <CircularProgress />
    </Box>
}

export default Loading;
import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function Loading(props)
{
    if (props.middle)
    {
        return <div style={{ position: "absolute", top: "50%" }}>
            <Box role="status">
                <CircularProgress />
            </Box>
        </div>
    }
    else if (props.center)
    {
        return <div style={{ position: "absolute", left: "50%" }}>
            <Box role="status">
                <CircularProgress />
            </Box>
        </div>
    }
    else if (props.fullPage)
    {
        return <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Box role="status">
                <CircularProgress />
            </Box>
        </div>
    }
    else
    {
        return <Box role="status">
            <CircularProgress />
        </Box>
    }
}

export default Loading;
import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function Loading()
{
    return <Box sx={{position: "absolute", top: "50%", left: "50%"}} role="status">
        <CircularProgress />
    </Box>;
}

export default Loading;
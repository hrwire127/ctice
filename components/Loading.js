import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function Loading()
{
    return <Box role="status">
        <CircularProgress />
    </Box>;
}

export default Loading;
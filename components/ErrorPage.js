import React from 'react'
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

function ErrorPage(props)
{

    const { status, message } = props;
    return (
        <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h1" component="div">{status}</Typography>
            <Typography variant="h6" sx={{ width: "30vw", margin: "auto" }}>{message}</Typography>
            <Link href="/">
                <Button variant="text">Back Home</Button>
            </Link>
        </Box>
    )
}

export default ErrorPage
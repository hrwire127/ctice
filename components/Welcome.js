import React from 'react'
import { Typography, Box } from '@mui/material'
import Link from 'next/link';

function Welcome()
{
    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography component="h5" variant="h5">Account Registered!</Typography>
            <Link href="/user/login">
                Login
            </Link>
        </Box>
    )
}

export default Welcome
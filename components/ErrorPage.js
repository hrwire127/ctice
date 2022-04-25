import React from 'react'
import { Box, Typography, Button, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import BackLink from "./BackLink";

function ErrorPage(props)
{

    const { status, message } = props;
    return (
        <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h1" component="div">{status}</Typography>
            <Typography variant="h6" sx={{ width: "30vw", margin: "auto" }}>{message}</Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Link href="/">
                    <MuiLink variant="text"
                        sx={{
                            color: "#1976d2",
                            '&:hover': {
                                cursor: "pointer",
                            }
                        }}
                    >
                        Home
                    </MuiLink>
                </Link>
                <BackLink>Back</BackLink>
            </Box>
        </Box>
    )
}

export default ErrorPage
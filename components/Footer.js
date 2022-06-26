import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';

function Copyright()
{
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link color="inherit" href="https://ctice.com/">
                Ctice
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function Footer()
{
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: "white",
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body1">
                    Ctice
                </Typography>
                <Copyright />
            </Container>
        </Box>
    );
}

export default Footer

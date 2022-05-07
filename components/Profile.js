import React from 'react'
import { Button, CssBaseline, Grid, Box, Typography, Container, Link } from '@mui/material';

function Profile(props)
{
    const { resetPassword, user } = props;
    const { username, status, date, email } = user;

    return (<Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h3">
                {username}
            </Typography>
            <Box
                sx={{ mt: 1 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h7" >
                            {status}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h7" >
                            {date}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h7" >
                            {email}
                        </Typography>
                    </Grid>
                    <Link onClick={resetPassword}>Reset Password</Link>
                </Grid>
            </Box>
        </Box>
    </Container>
    )
}

export default Profile
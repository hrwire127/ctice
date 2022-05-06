import React from 'react'
import { Alert, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, FormHelperText } from '@mui/material';

function Profile(props)
{
    const { username, status, date } = props.user;

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
            <Typography component="h1" variant="h5">
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
                </Grid>
            </Box>
        </Box>
    </Container>
    )
}

export default Profile
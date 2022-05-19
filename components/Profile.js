import React, { useState, useEffect } from 'react'
import
    {
        IconButton, Button,
        CssBaseline, Grid,
        Box, Typography,
        Container, Link
    } from '@mui/material';
import { CropData, getDateDifference } from '../utilsCS/_client';
import { Edit, CheckBox, HighlightOff, Cake } from '@mui/icons-material';

function Profile(props)
{
    const { resetPassword, user, isToken } = props;
    const { username, status, date, email, profile } = user;

    const [diff, setDiff] = useState()

    useEffect(() =>
    {
        setDiff(getDateDifference(new Date(), new Date(date)))
    }, [])


    return (<Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: "left", gap: 2, alignItems: "center" }}>
            <Typography component="h1" variant="h3">
                {username}
            </Typography>
            <IconButton >
                <Edit />
            </IconButton>
        </Box>
        <img src={profile} />
        <Box sx={{ display: 'flex', justifyContent: "left", gap: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: "left" }}>
                <Box>
                    {status === "Active" ? (<CheckBox color="success" />) : <HighlightOff color="danger" />}
                </Box>
                <Typography variant="h7" >
                    {status}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: "left" }}>
                <Cake sx={{ fontSize: 20 }} />
                <Typography variant="h7" >
                    Member for {diff}
                </Typography>
            </Box>
        </Box>

        <Grid item xs={12}>

        </Grid>
        <Grid item xs={12}>
            <Typography variant="h7" >
                {email}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            {isToken
                ? (<Typography variant="h7" color="text.danger">
                    An email was sent for the password reset
                </Typography>)
                : (<Link sx={{ "&:hover": { cursor: "pointer" } }} onClick={resetPassword}>
                    Reset Password
                </Link>)
            }
        </Grid>
    </Container >
    )
}

export default Profile
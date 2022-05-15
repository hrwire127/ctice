import React, { useState, useEffect } from 'react'
import { Button, CssBaseline, Grid, Box, Typography, Container, Link } from '@mui/material';
import { CropData, getDateDifference } from '../utilsCS/_client';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CakeIcon from '@mui/icons-material/Cake';
function Profile(props)
{
    const { resetPassword, user } = props;
    const { username, status, date, email } = user;

    const [diff, setDiff] = useState()

    useEffect(() =>
    {
        setDiff(getDateDifference(new Date(), new Date(date)))
    }, [])


    return (<Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography component="h1" variant="h3">
            {username}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: "left", gap: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: "left" }}>
                <Box>
                    {status === "Active" ? (<CheckBoxIcon color="success" />) : <HighlightOffIcon color="danger" />}
                </Box>
                <Typography variant="h7" >
                    {status}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: "left" }}>
                <CakeIcon sx={{fontSize: 20}}/>
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
        {/* <Link onClick={resetPassword}>Reset Password</Link> */}
    </Container>
    )
}

export default Profile
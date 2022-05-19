import React, { useState, useEffect } from 'react'
import
{
    IconButton, Button,
    CssBaseline, Grid,
    Box, Typography,
    Container, Link as MuiLink
} from '@mui/material';
import { CropData, getDateDifference } from '../utilsCS/_client';
import { Edit, CheckBox, HighlightOff, Cake } from '@mui/icons-material';
import Link from 'next/link'

function Profile(props)
{
    const { user, isToken } = props;
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
            <Link href="/user/change">
                <IconButton >
                    <Edit />
                </IconButton>
            </Link>
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
    </Container >
    )
}

export default Profile
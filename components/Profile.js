import React, { useState, useEffect } from 'react'
import
{
    Grid,
    Box, Typography, Paper,
    Link as MuiLink
} from '@mui/material';
import { getDateDifference } from '../utilsCS/_basic';
import { CheckBox, HighlightOff, Cake, LocationOn, Twitter, LinkedIn, Facebook, Email } from '@mui/icons-material';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

function Profile(props)
{
    const { user, isResetToken } = props;
    const { username, status, date, email, profile, location, bio, connections } = user;

    const diff = getDateDifference(new Date(), new Date(date[0]))
    const editorState = JSON.parse(bio).blocks[0].text !== "" ? EditorState.createWithContent(convertFromRaw(JSON.parse(bio))) : undefined

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper sx={{ width: "350px", height: "350px" }} >
                        <img src={profile.url} style={{ width: "350px", height: "350px", borderRadius: 4 }} />
                    </Paper>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="space-between" flexDirection="column">
                    <Box sx={{ display: 'flex', justifyContent: "left", alignItems: "center" }}>
                        {status === "Active" ? (<CheckBox color="success" sx={{ fontSize: 60 }} />) : <HighlightOff color="danger" sx={{ fontSize: 60 }} />}
                        <Typography variant="h4">
                            {username}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: "left", alignItems: "center" }}>
                        <Email sx={{ fontSize: 60 }} />
                        <Typography variant="h5">
                            {email}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: "left", alignItems: "center" }}>
                        <Cake sx={{ fontSize: 60 }} />
                        <Typography variant="h5" >
                            {diff}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: "left", alignItems: "center" }}>
                        <LocationOn sx={{ fontSize: 60 }} />
                        <Typography variant="h5" >
                            {location ? location.name : "Unknown"}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ width: "100%", mt: 6 }}>
                <Typography variant="h2" align="center">
                    About Me
                </Typography>
                <Paper sx={{ width: "100%", minHeight: 250, padding: 2 }} >
                    {editorState && (<Editor editorKey="editor" readOnly={true} editorState={editorState} />)}
                </Paper>
            </Box>

            <Box sx={{ width: "100%", mt: 6 }}>
                <Typography variant="h2" align="center" >
                    Connections
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <a href={connections.twitter}>
                        <Paper sx={{ width: 100, minHeight: 100, display: 'flex', justifyContent: "center", alignItems: "center" }}>
                            <Twitter sx={{ fontSize: 60 }} />
                        </Paper>
                    </a>
                    <a href={connections.linkedin}>
                        <Paper sx={{ width: 100, minHeight: 100, display: 'flex', justifyContent: "center", alignItems: "center" }}>
                            <LinkedIn sx={{ fontSize: 60 }} />
                        </Paper>
                    </a>
                    <a href={connections.facebook}>
                        <Paper sx={{ width: 100, minHeight: 100, display: 'flex', justifyContent: "center", alignItems: "center" }}>
                            <Facebook sx={{ fontSize: 60 }} />
                        </Paper>
                    </a>
                </Box>
            </Box>
        </>
    )
}

export default Profile
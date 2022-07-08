import React, { useState } from 'react'
import
{
    Grid,
    Box, Typography, Paper,
    Link as MuiLink
} from '@mui/material';
import { getDateDifference } from '../../utilsCS/_basic';
import { Check, Close, Cake, LocationOn, Twitter, LinkedIn, Facebook, Email } from '@mui/icons-material';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import useStyles from '../../assets/styles/_Profile';
import EditorView from '../EditorView';

function Profile(props)
{
    const { user, isResetToken } = props;
    const { username, status, date, email, profile, location, bio, connections } = user;

    const diff = getDateDifference(new Date(), new Date(date[0]))
    const editorState = JSON.parse(bio).blocks[0].text !== "" ? EditorState.createWithContent(convertFromRaw(JSON.parse(bio))) : undefined

    const classes = useStyles()

    console.log(connections)

    return (
        <Box
            component="main"
            className={classes.Container}
        >
            <Box className={classes.Content}>
                <Box className={classes.FrontInfo}>
                    <Box className={classes.Profile}>
                        <img crossOrigin="anonymous" src={profile ? profile.url ? profile.url : "/images/def-profile.jpg" : "/images/def-profile.jpg"}
                            className={classes.Img} />
                    </Box>
                    <Box className={classes.SecInfo}>
                        <Typography variant="h3" className={classes.Username}>
                            {username}
                        </Typography>
                        {status === "Active"
                            ? (<Box className={classes.Status}>
                                <Check color="success" sx={{ fontSize: 20 }} />
                                <Typography color="text.success" >active</Typography>
                            </Box>)
                            : (<Box className={classes.Status}>
                                <Close color="error" sx={{ fontSize: 20 }} />
                                <Typography color="text.error" >disabled</Typography>
                            </Box>)}
                        <Box className={classes.Name}>
                            <Email sx={{ fontSize: 20 }} />
                            <Typography variant="h8">
                                {email}
                            </Typography>
                        </Box>
                        <Box className={classes.ThirdInfo}>
                            <Box>
                                <Cake sx={{ fontSize: 20 }} />
                                <Typography variant="h8" >
                                    Member for {diff}
                                </Typography>
                            </Box>
                            <Box>
                                <LocationOn sx={{ fontSize: 20 }} />
                                <Typography variant="h8" >
                                    {location ? location.name : "Unknown"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ width: "100%", mt: 6 }}>
                    <Typography variant="h4" align="left">
                        About Me
                    </Typography>
                    <Box className={classes.TextArea}>
                        {editorState && (
                            <EditorView data={JSON.parse(bio)} />)}
                    </Box>
                </Box>

                <Box sx={{ width: "100%", mt: 6 }}>
                    <Typography variant="h4" align="left" >
                        Connections
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                        <a href={connections.twitter}>
                            <Box className={classes.Connection}>
                                <Twitter color="primary" sx={{ fontSize: 60 }} />
                            </Box>
                        </a>
                        <a href={connections.linkedin}>
                            <Box className={classes.Connection}>
                                <LinkedIn color="primary" sx={{ fontSize: 60 }} />
                            </Box>
                        </a>
                        <a href={connections.facebook}>
                            <Box className={classes.Connection}>
                                <Facebook color="primary" sx={{ fontSize: 60 }} />
                            </Box>
                        </a>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Profile
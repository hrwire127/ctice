import React, { useState, useEffect } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton } from '@mui/material'
import useStyles from "../assets/styles/_ReplyCard"
import { CropData, getDateDifference } from '../utilsCS/_client';
import UserContext from './context/contextUser'
import { Build, Delete } from '@mui/icons-material';
import Vote from "./Vote";

function ReplyCard(props)
{
    const { _id, content, date, author, setEdit, handleDelete, user } = props;
    const [likes, setLikes] = useState(props.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(props.likes.filter(el => el.typeOf === false));
    const [initDiff, setInitialDiff] = useState()
    const [diff, setDiff] = useState()
    const classes = useStyles();
    const userCtx = React.useContext(UserContext);

    const data = JSON.parse(content)
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    useEffect(() =>
    {
        setInitialDiff(getDateDifference(new Date(), new Date(date[0])))
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

    return (
        <Box className={classes.Card}>
            <Box className={classes.Line} />
            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Vote comment user={user} likes={likes} setLikes={setLikes} d_id={_id} dislikes={dislikes} setDislikes={setDislikes} />
                <Box sx={{ width: "90%" }}>
                    <Editor editorKey="editor" readOnly={true} editorState={editorState} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: "space-evenly", gap: 1, width: "100%", mt: 2 }}>
                {userCtx === author.username && (
                    <Box>
                        <IconButton size="small" onClick={setEdit.bind(false)}><Build className={classes.Icon} /></IconButton>
                        <IconButton size="small" onClick={handleDelete}><Delete className={classes.Icon} /></IconButton>
                    </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1, }}>
                    <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                        Created {initDiff}
                    </Typography>
                    <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                        Edited {diff}
                    </Typography>
                    <Typography className={classes.Title} color="text.secondary" gutterBottom>
                        {author.username}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default ReplyCard
import React, { useState, useEffect } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton } from '@mui/material'
import useStyles from "../assets/styles/_ReplyCard"
import { CropData, getDateDifference } from '../utilsCS/_client';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import { Build, Delete, Accessible } from '@mui/icons-material';
import Vote from "./Vote";

function ReplyCard(props)
{
    const { _id, content, date, author, setEdit, handleDelete, user, id, cid, status } = props;
    const [likes, setLikes] = useState(props.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(props.likes.filter(el => el.typeOf === false));
    const [initDiff, setInitialDiff] = useState()
    const [diff, setDiff] = useState()
    const classes = useStyles();
    const userCtx = React.useContext(UserContext);
    const adminCtx = React.useContext(AdminContext);

    const data = JSON.parse(content)
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    useEffect(() =>
    {
        setInitialDiff(getDateDifference(new Date(), new Date(date[0])))
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

    const switchReply = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/reply/${_id}/disable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET }
            )
        }).then(response => response.json())
            .then(async res =>
            { 
                CS_Redirects.tryResCS(res, window)
                console.log(res)
            })
    }

    return (
        <Box className={classes.Card} sx={status === "Disabled" ? { backgroundColor: "gray" } : {}}>
            <Box className={classes.Line} />
            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Vote reply user={user} likes={likes} setLikes={setLikes} d_id={_id} dislikes={dislikes} setDislikes={setDislikes} />
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
                    {adminCtx
                        && (<IconButton size="small" onClick={switchReply}>
                            <Accessible />
                        </IconButton>)
                    }
                </Box>
            </Box>
        </ Box>
    )
}

export default ReplyCard
import React, { useState, useContext } from 'react'
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, Typography, IconButton } from '@mui/material'
import { Build, Delete, Accessible } from '@mui/icons-material';
import useStyles from "../assets/styles/_ReplyCard"
import { getDateDifference } from '../utilsCS/_basic';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import 'draft-js/dist/Draft.css';
import Vote from "./Vote";

function ReplyCard(props)
{
    const { setEdit, user, id, cid, reply, setError } = props;
    const { _id: rid, content, date, author } = reply;

    const [likes, setLikes] = useState(reply.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(reply.likes.filter(el => el.typeOf === false));

    const userCtx = useContext(UserContext);
    const adminCtx = useContext(AdminContext);

    const data = JSON.parse(content)
    const editorState = EditorState.createWithContent(convertFromRaw(data))
    const diff = getDateDifference(new Date(), new Date(date[date.length - 1]))
    const initdiff = getDateDifference(new Date(), new Date(date[0]))
    const classes = useStyles();

    const handleDelete = async () =>
    {
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}/reply/${rid}`, {
                method: 'DELETE',
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) return setError(res.error)
                    if (res.err) setError(res.err.message)
                })
        })

    };

    const switchReply = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/reply/${rid}/switchstatus`, {
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
                if (res.error) return setError(res.error)
            })
    }

    return (
        <Box className={classes.Card} sx={status === "Disabled" ? { backgroundColor: "gray" } : {}}>
            <Box className={classes.Line} />
            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Vote setError={setError} reply user={user} likes={likes} setLikes={setLikes} d_id={rid} dislikes={dislikes} setDislikes={setDislikes} />
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
                        Created {initdiff}
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
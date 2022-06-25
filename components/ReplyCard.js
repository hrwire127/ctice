import React, { useState, useContext } from 'react'
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, Typography, IconButton, Paper, Avatar } from '@mui/material'
import { Build, Delete, Accessible, } from '@mui/icons-material';
import useStyles from "../assets/styles/_ReplyCard"
import { getDateDifference } from '../utilsCS/_basic';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import 'draft-js/dist/Draft.css';
import Vote from "./Vote";
import Redirects_CS from '../utilsCS/CS_Redirects'

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
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    // if (res.err) setError(res.err.message)
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
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
            })
    }

    return (
        <Box className={classes.Card}
            sx={status === "Disabled"
                ? { backgroundColor: "gray" }
                : {}}
        >
            <Box className={classes.Line} />
            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Vote setError={setError} reply user={user} likes={likes} setLikes={setLikes} d_id={rid} dislikes={dislikes} setDislikes={setDislikes} />
                <Box sx={{ width: "90%" }}>
                    <Box sx={{ minHeight: 100 }}>
                        <Editor editorKey="editor" readOnly={true} editorState={editorState} />
                    </Box>
                    <Box className={classes.FooterBar}>
                        {userCtx === author.username ? (
                            <Box>
                                <IconButton size="small" onClick={setEdit.bind(false)}><Build className={classes.Icon} /></IconButton>
                                <IconButton size="small" onClick={handleDelete}><Delete className={classes.Icon} /></IconButton>
                                {adminCtx
                                    && (<IconButton size="small" onClick={switchReply}>
                                        <Accessible />
                                    </IconButton>)
                                }
                            </Box>
                        ) : <Box></Box>}
                        <Box sx={{ display: 'flex', gap: 1, }}>
                            <Paper sx={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: "column", width: "auto", p: 2 }}>
                                <Typography variant="h11" color="text.secondary">
                                    {initdiff ? (<>{initdiff} ago</>) : (<>{diff} (edited)</>)}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: 1 }}>
                                    <Avatar alt={author.username} src={author.profile.url} />
                                    <Typography variant="h5">
                                        {author.username}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ Box>
    )
}

export default ReplyCard
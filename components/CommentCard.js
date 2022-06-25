import React, { useState } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, Button, Typography, IconButton, Grid, Collapse, Paper, Avatar } from '@mui/material'
import { Build, Delete, Close, Comment, Accessible } from '@mui/icons-material';
import useStyles from "../assets/styles/_CommentCard"
import { getDateDifference } from '../utilsCS/_basic';
import useLoading from '../components/hooks/useLoading'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import Vote from "./Vote";
import ReplyCreate from "./ReplyCreate";
import ReplyList from "./ReplyList"
import Link from 'next/link'
import Redirects_CS from '../utilsCS/CS_Redirects'
import EditorView from './EditorView';

function CommentCard(props)
{
    const { setEdit, fullWhile, user, id, comment, setError } = props;
    const { _id: cid, content, date, author } = comment;

    const [replies, setReplies] = useState([])
    const [status, setStatus] = useState(comment.status)
    const [likes, setLikes] = useState(comment.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(comment.likes.filter(el => el.typeOf === false));
    const [isReplying, setReply] = useState(false)

    const userCtx = React.useContext(UserContext);
    const adminCtx = React.useContext(AdminContext);

    // const data = JSON.parse(content)
    // const editorState = EditorState.createWithContent(convertFromRaw(data))
    const initDiff = getDateDifference(new Date(), new Date(date[0]))
    const diff = getDateDifference(new Date(), new Date(date[date.length - 1]))
    const classes = useStyles();

    const handleDelete = async () =>
    {
        fullWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}`, {
                method: 'DELETE',
            }).then(response => response.json())
                .then(async res =>
                {
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                })
        })
    };

    const switchComment = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${cid}/switchstatus`, {
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
                if (res.obj === true)
                {
                    setStatus(status === "Active" ? "Disabled" : "Active")
                }
            })
    }

    const ReplyFormCreate = () => (
        <Box className={classes.FullWidth} sx={status === "Disabled" ? { backgroundColor: "gray" } : {}}>
            <Grid container justifyContent="center">
                {isReplying ? (
                    <IconButton
                        aria-label="close"
                        color="tertiary"
                        size="small"
                        onClick={() =>
                        {
                            setReply(!isReplying);
                        }}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>)
                    : (<Box textAlign="center" sx={{ mt: 1 }}>
                        <Box display="flex" justifyContent="center" gap={1} alignItems="center">
                            <Box display="flex" justifyContent="center" gap={1} alignItems="center">
                                <Comment /> {replies.length}
                            </Box>
                            <Button onClick={() => setReply(!isReplying)} size="small" variant="text">Add Reply</Button>
                        </Box>
                    </Box>)}
            </Grid>

            <Collapse in={isReplying}>
                <ReplyCreate setError={setError} id={id} cid={cid} />
            </Collapse>
        </Box>)

    return (
        <Box className={classes.Card}>
            <Box className={classes.Container}>
                <Vote setError={setError} comment user={user} likes={likes} setLikes={setLikes} d_id={cid} dislikes={dislikes} setDislikes={setDislikes} />
                <Box sx={{ width: "90%" }}>
                    <Box sx={{ minHeight: 100 }}>
                        <EditorView data={JSON.parse(content)} />
                    </Box>
                    <Box className={classes.FooterBar}>
                        {userCtx === author.username ? (
                            <Box>
                                <IconButton size="small" onClick={setEdit.bind(false)}><Build className={classes.Icon} /></IconButton>
                                <IconButton size="small" onClick={handleDelete}><Delete className={classes.Icon} /></IconButton>
                                {adminCtx
                                    && (<IconButton size="small" onClick={switchComment}>
                                        <Accessible />
                                    </IconButton>)
                                }
                            </Box>
                        ) : <Box> </Box>}
                        <Box sx={{ display: 'flex', gap: 1, }}>
                            <Paper sx={{ display: 'flex', justifyContent: "center", alignItems: "center", flexDirection: "column", width: "auto", p: 2 }}>
                                <Typography variant="h11" color="text.secondary">
                                    {initDiff ? (<>{initDiff} ago</>) : (<>{diff} (edited)</>)}
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

            {user
                ? (<ReplyFormCreate />)
                : (
                    <Box display="flex" justifyContent="center">
                        <Link href="/user/login">
                            <Typography variant="h6" sx={{ "&:hover": { cursor: "pointer" } }}>
                                ...
                            </Typography>
                        </Link>
                    </Box>)}

            <ReplyList
                setError={setError}
                replies={replies}
                setReplies={setReplies}
                cid={cid}
                user={user}
                comment={comment}
                id={id}
            />

            <Box className={classes.Line} />
        </Box>
    )
}

export default CommentCard
import React, { useState, useEffect } from 'react'
import 'draft-js/dist/Draft.css';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton, Grid, Collapse } from '@mui/material'
import useStyles from "../assets/styles/_CommentCard"
import { CropData, getDateDifference, getLimitedReplies, timeout } from '../utilsCS/_client';
import { Build, Delete, Close, Comment, Accessible } from '@mui/icons-material';
import useLoading from '../components/hooks/useLoading'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import Vote from "./Vote";
import ReplyCreate from "./ReplyCreate";
import ReplyList from "./ReplyList"
import Link from 'next/link'

function CommentCard(props)
{
    const { setEdit, handleDelete, user, id } = props;
    const { _id, content, date, author } = props.comment;
    const [likes, setLikes] = useState(props.comment.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(props.comment.likes.filter(el => el.typeOf === false));
    const [initDiff, setInitialDiff] = useState()
    const [diff, setDiff] = useState()
    const [isReplying, setReply] = useState(false)
    const [status, setStatus] = useState(props.comment.status)
    const [alert, setAlert] = useState()
    const [creatingWhile, creatingSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [replyWhile, switchReply] = useLoading(false)
    const [replies, setReplies] = useState([])
    const classes = useStyles();
    const userCtx = React.useContext(UserContext);
    const adminCtx = React.useContext(AdminContext);

    const data = JSON.parse(content)
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const handleSubmit = async (body) =>
    {
        creatingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${_id}/reply`, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })

    };

    function loadMore(e)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            await timeout(500)
            const newReplies = await getLimitedReplies(replies, _id); //<=
            CS_Redirects.tryResCS(newReplies, window)
            setReplies(replies.concat(newReplies.obj));
        })
    }

    const switchComment = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/comment/${_id}/disable`, {
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
                console.log(res)
                if (res.obj === true)
                {
                    setStatus(status === "Active" ? "Disabled" : "Active")
                }
            })
    }

    useEffect(() =>
    {
        setInitialDiff(getDateDifference(new Date(), new Date(date[0])))
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

    const ReplyFormCreate = () =>
    {
        return (
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
                        : (<Box textAlign="center">
                            <Box display="flex" justifyContent="center" gap={1} alignItems="center">
                                <Box display="flex" justifyContent="center" gap={1} alignItems="center">
                                    <Comment /> {replies.length}
                                </Box>
                                <Button onClick={() => setReply(!isReplying)} size="small" variant="text">Add Reply</Button>
                            </Box>
                        </Box>)}
                </Grid>

                <Collapse in={isReplying}>
                    <ReplyCreate handleSubmit={handleSubmit} alert={alert} creatingSwitch={creatingSwitch} />
                </Collapse>
            </Box>)
    }

    return (
        <Box className={classes.Card}>
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
                    {adminCtx
                        && (<IconButton size="small" onClick={switchComment}>
                            <Accessible />
                        </IconButton>)
                    }
                </Box>
                <Typography className={classes.Title} color="text.secondary" gutterBottom>
                    {author.username}
                </Typography>
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

            <Box display="flex" alignItems="center" flexDirection="column">
                <ReplyList
                    loadMore={loadMore}
                    replies={replies}
                    _id={_id}
                    user={user}
                    comment={props.comment}
                    loadMoreSwitch={loadMoreSwitch}
                    replyWhile={replyWhile}
                    switchReply={switchReply}
                    setReplies={setReplies}
                    id={id}
                />
            </Box>

            <Box className={classes.Line} />
        </Box>
    )
}

export default CommentCard
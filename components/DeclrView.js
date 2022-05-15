import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, Typography, IconButton, Avatar, Collapse, Button, Grid } from '@mui/material';
import { Delete, Build, Close, KeyboardArrowUp, KeyboardArrowDown, Scale } from '@mui/icons-material';
import DocumentView from '../components/DocumentView';
import { CropData } from '../utilsCS/_client';
import Link from 'next/link'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { getLimitedComments, timeout, getClientUser } from '../utilsCS/_client'
import useStyles from '../assets/styles/_DeclrView';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import BackLink from "./BackLink";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
import arrow from "../assets/images/arrow.png";

function DeclrView(props)
{

    const {
        declaration,
        onDeclrDelete,
        creatingSwitch,
        alert,
        handleSubmit,
        commentWhile,
        switchComment,
        loadMore,
        setComments,
        comments,
        loadMoreSwitch } = props;

    const { title, description, file, date, authors, _id } = declaration;
    const userCtx = React.useContext(UserContext);
    const adminCtx = React.useContext(AdminContext);

    const [open, setOpen] = React.useState(true);
    const [likes, setLikes] = React.useState(declaration.likes.length);
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))
    // getClientUser

    useEffect(() =>
    {
        commentWhile(async () =>
        {
            await timeout(500)
            const newComments = await getLimitedComments(comments, _id);
            CS_Redirects.tryResCS(newComments, window)
            setComments(newComments.obj)
        })
    }, [])

    const onLike = async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(user, window)
        if (user)
        {
            if (declaration.likes.includes(user.obj._id))
            {
                return
            }
            else 
            {
                fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/like/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        { uid: user.obj._id, secret: process.env.NEXT_PUBLIC_SECRET }
                    )
                }).then(response => response.json())
                    .then(async res =>
                    {
                        CS_Redirects.tryResCS(res, window)
                        if (!res.redirect) setLikes(res.obj.length)
                    })
            }
        }

    }


    const Placeholder = (
        <Typography variant="h4" component="h5" color="text.secondary" sx={{ marginTop: 10 }}>
            No Upload...
        </Typography>)

    const CommentFormCreate = () =>
    {
        return (
            <Box className={classes.FullWidth}>
                {open && (
                    <Grid container justifyContent="center">
                        <IconButton
                            aria-label="close"
                            color="tertiary"
                            size="small"
                            onClick={() =>
                            {
                                setOpen(false);
                            }}
                        >
                            <KeyboardArrowUp fontSize="inherit" />
                        </IconButton>
                    </Grid>)}

                {!open && (
                    <Grid container justifyContent="center">
                        <IconButton
                            aria-label="close"
                            color="tertiary"
                            size="small"
                            onClick={() =>
                            {
                                setOpen(true);
                            }}
                        >
                            <KeyboardArrowDown fontSize="inherit" />
                        </IconButton>
                    </Grid>)}
                <Collapse in={open}>
                    <CommentCreate creatingSwitch={creatingSwitch} alert={alert} handleSubmit={handleSubmit} />
                </Collapse>
            </Box>)
    }

    const Comments = () =>
    {
        return (switchComment(0, () =>
        {
            return comments.length > 0
                ? (<>
                    <CommentList comments={comments} id={_id} />
                    {loadMoreSwitch(0, () => comments.length < declaration.comments.length && comments.length > 0 && (<Button onClick={loadMore}>Load More</Button>))}
                </>)
                : (<Typography component="h5" color="text.secondary" variant="h5">
                    No Comments
                </Typography>)
        }))
    }

    return (
        <Box>
            <Box className={classes.Bar}>
                <Box className={classes.Title}>
                    <Typography variant="h4" color="text.primary">
                        {title}
                    </Typography>
                    {adminCtx && (
                        <>
                            <Link href={`/edit/${_id}`}><IconButton size="small"><Build color="tertiary" /></IconButton></Link>
                            <Link href=""><IconButton onClick={onDeclrDelete} size="small"><Delete color="tertiary" /></IconButton></Link>
                        </>
                    )}
                </Box>
                <Typography variant="h8" color="text.secondary" alignSelf="center">
                    Created by {authors[0].username}
                </Typography>
            </Box>
            <Box className={classes.Bar}>
                <Typography variant="h9" color="text.secondary" sx={{ alignSelf: "center" }}>
                    Published on {date[date.length - 1].substring(0, 10)}, {date[date.length - 1].match(/\d\d:\d\d/)}
                </Typography>
                {authors.length > 1 &&
                    (<Typography variant="h9" color="text.secondary">
                        Last Edited by {authors[authors.length - 1].username}
                    </Typography>
                    )}


                {/* <BackLink>Back</BackLink> */}
            </Box>
            <Box className={classes.Line} />

            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Box className={classes.Vote}>
                    <KeyboardArrowUp onClick={onLike} color="tertiary" fontSize="large" className={classes.VoteBtn} />
                    {/* <img src={arrow.src} alt="up" width={20} height={10} /> */}
                    <Typography variant="h5" color="base" sx={{ fontWeight: 'bold' }}>
                        {likes}
                    </Typography>
                    <KeyboardArrowDown className={classes.VoteBtn} color="tertiary" />
                </Box>
                <Box sx={{ width: "90%" }}>
                    <Editor editorKey="editor" readOnly={true} editorState={editorState} />
                </Box>
            </Box>

            <Box className={classes.Line} />

            <Box className={classes.Paragraph}>
                <Typography component="h1" variant="h4">
                    Comments
                </Typography>

                <Box display="flex" alignItems="left" flexDirection="column">
                    <Comments />
                </Box>
            </Box>

            <Box className={classes.Line} />

            {userCtx ? (<CommentFormCreate />) : (<Typography variant="h6" color="text.base">Please Log in to comment</Typography>)}

            {/* {file ? (<DocumentView file={file} />) : Placeholder} */}
        </Box>
    )
}
export default DeclrView;

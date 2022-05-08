import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, Typography, IconButton, Avatar, Collapse, Button } from '@mui/material';
import { Delete, Build, Close } from '@mui/icons-material';
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
                console.log(user)
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
                        console.log(res)
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
            <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                    <CommentCreate creatingSwitch={creatingSwitch} alert={alert} handleSubmit={handleSubmit} />
                </Collapse>
                {open && (
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() =>
                        {
                            setOpen(false);
                        }}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>)}

                {!open && (<Button
                    variant="outlined"
                    onClick={() =>
                    {
                        setOpen(true);
                    }}
                >
                    Comment
                </Button>)}

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
                    Nothing
                </Typography>)
        }))
    }

    return (
        <Box className='h-75'>
            <Box className={classes.Content}>
                <Box className={classes.Paragraph}>
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <Typography variant="h4">
                            {title}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "10%" }}>
                            {adminCtx && (
                                <>
                                    <Link href={`/edit/${_id}`}><IconButton size="small"><Build /></IconButton></Link>
                                    <Link href=""><IconButton onClick={onDeclrDelete} size="small"><Delete /></IconButton></Link>
                                </>
                            )}
                        </Box>
                    </Box>

                    <Editor editorKey="editor" readOnly={true} editorState={editorState} />
                    <Typography variant="h9" color="text.secondary">
                        {date[date.length - 1].match(/\d\d:\d\d/)} _ {date[date.length - 1].substring(0, 10)}
                    </Typography>
                    <Typography variant="h9" color="text.secondary">
                        {likes} likes
                    </Typography>
                    <Button onClick={onLike}>Like</Button>
                    <Box display="flex" justifyContent="left" gap={1} alignItems="center">
                        <Typography variant="h8" color="text.secondary">
                            Created by {authors[0].username}
                        </Typography>
                        <Typography variant="h8" color="green"> {authors[0].status} </Typography>
                    </Box>


                    <BackLink>Back</BackLink>

                    <Typography component="h1" variant="h5">
                        Comments
                    </Typography>

                    {authors.length > 1 &&
                        (<Typography variant="h8" color="text.secondary">
                            Last Edited by {authors[authors.length - 1].username}
                        </Typography>
                        )}

                    {userCtx ? (<CommentFormCreate />) : (<Typography variant="h6">Please Log in to comment</Typography>)}

                    <Box display="flex" alignItems="left" flexDirection="column">
                        <Comments />
                    </Box>
                </Box>
                {file ? (<DocumentView file={file} />) : Placeholder}
            </Box>
        </Box >
    )
}
export default DeclrView;

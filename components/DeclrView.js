import React, { useState, useEffect, useContext } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import
{
    Box, Typography,
    IconButton, Avatar,
    Collapse, Button, Grid
} from '@mui/material';
import
{
    Delete, Build,
    TurnedInNot, KeyboardArrowUp,
    KeyboardArrowDown, Comment,
    IosShare, Accessible
} from '@mui/icons-material';
import { CropData } from '../utilsCS/_client';
import useStyles from '../assets/styles/_DeclrView';
import AdminContext from './context/contextAdmin'
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
import Link from 'next/link'
import Vote from "./Vote";

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
        loadMoreSwitch,
        user } = props;

    const { title, description, file, date, authors, _id } = declaration;
    const adminCtx = useContext(AdminContext);

    const [open, setOpen] = useState(true);
    const [likes, setLikes] = useState(declaration.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(declaration.likes.filter(el => el.typeOf === false));
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))
    // getClientUser

    const switchDeclr = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}/disable`, {
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
            })
    }

    const Placeholder = (
        <Typography variant="h4" component="h5" color="text.secondary" sx={{ marginTop: 10 }}>
            No Upload...
        </Typography>)

    const CommentFormCreate = () =>
    {
        return (
            <Box className={classes.FullWidth}>
                <Grid container justifyContent="center">
                    <IconButton
                        aria-label="close"
                        color="tertiary"
                        size="small"
                        onClick={() =>
                        {
                            setOpen(!open);
                        }}
                    >
                        {open ? (<KeyboardArrowUp fontSize="inherit" />) : (<KeyboardArrowDown fontSize="inherit" />)}
                    </IconButton>
                </Grid>

                <Collapse in={open}>
                    <CommentCreate creatingSwitch={creatingSwitch} alert={alert} handleSubmit={handleSubmit} />
                </Collapse>
            </Box>)
    }

    return (
        <Box>
            <Box className={classes.Bar}>
                <Box className={classes.Title}>
                    <Typography variant="h4" color="text.default">
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
                {adminCtx
                    && (<IconButton size="small" onClick={switchDeclr}>
                        <Accessible />
                    </IconButton>)
                }
                {/* <BackLink>Back</BackLink> */}
            </Box>
            <Box className={classes.Line} />

            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Vote user={user} likes={likes} setLikes={setLikes} d_id={_id} dislikes={dislikes} setDislikes={setDislikes} />
                <Box sx={{ width: "90%" }}>
                    <Editor editorKey="editor" readOnly={true} editorState={editorState} />
                </Box>
            </Box>

            <Box className={classes.Paragraph}>
                <Box display="flex" justifyContent="left" gap={1}>
                    <Comment /> {declaration.comments.length}
                </Box>

                <Box display="flex" justifyContent="left" gap={1}>
                    <IosShare />
                    <TurnedInNot />
                </Box>
            </Box>

            <Box className={classes.Line} />

            {user ? (<CommentFormCreate />) : (<Typography variant="h6" align="center"><Link href="/user/register">Sign up</Link> or <Link href="/user/login">Log in</Link> to comment</Typography>)}

            <Box display="flex" alignItems="center" flexDirection="column">
                <CommentList
                    loadMore={loadMore}
                    comments={comments}
                    _id={_id}
                    user={user}
                    declaration={declaration}
                    loadMoreSwitch={loadMoreSwitch}
                    commentWhile={commentWhile}
                    setComments={setComments}
                    switchComment={switchComment}
                />
            </Box>

            {/* {file ? (<DocumentView file={file} />) : Placeholder} */}
        </Box>
    )
}
export default DeclrView;

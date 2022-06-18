import React, { useState, useContext } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import
{
    Box, Typography,
    IconButton,
    Collapse, Grid, Paper
} from '@mui/material';
import
{
    Delete, Build,
    TurnedInNot, KeyboardArrowUp,
    KeyboardArrowDown, Comment,
    IosShare, Accessible, Bookmark
} from '@mui/icons-material';
import { CropData } from '../utilsCS/_basic';
import useStyles from '../assets/styles/_DeclrView';
import AdminContext from './context/contextAdmin'
import UserContext from './context/contextUser'
import Link from 'next/link'
import useLoading from './hooks/useLoading'
import Rules from "../utilsCS/clientRules"
import TransitionAlerts from './TransitionAlerts'
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
import Vote from "./Vote";
import { LinkedinShareButton } from 'react-share';
import { LinkedIn } from '@mui/icons-material';
import Redirects_CS from '../utilsCS/CS_Redirects'

function DeclrView(props)
{
    const { declaration, user, setError } = props;
    const { title, description, file, date, authors, _id: id, tags } = declaration;

    const adminCtx = useContext(AdminContext);
    const userCtx = useContext(UserContext);

    const [delalert, setDelAlert] = useState()
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState(declaration.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(declaration.likes.filter(el => el.typeOf === false));
    const [hasBookmark, setBookmark] = useState(user ? user.bookmarks.includes(id) : false);
    const [formOpen, setFormOpen] = useState(true);

    const [fullWhile, fullSwitch] = useLoading(false)

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    const classes = useStyles();

    const setDelError = (msg) =>  
    {
        setDelAlert(msg)
        setTimeout(() =>
        {
            setDelAlert()
        }, Rules.form_message_delay);
    }

    const switchStatus = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}/switchstatus`, {
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
                Redirects_CS.handleRes(res)
            })
    }

    const switchBookmark = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET, id }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                //window not working on SSR
                Redirects_CS.handleRes(res, window, setError)
                setBookmark(!hasBookmark)
            })
    }

    const onDeclrDelete = async (e) =>                                                                           
    {
        e.preventDefault();
        fullWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(async res =>
                {
                    //window not working on SSR
                    Redirects_CS.handleRes(res)
                    if (res.err) setDelError(res.err.message)
                })
        })
    }

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
                            setFormOpen(!formOpen);
                        }}
                    >
                        {formOpen
                            ? (<KeyboardArrowUp fontSize="inherit" />)
                            : (<KeyboardArrowDown fontSize="inherit" />)}
                    </IconButton>
                </Grid>

                <Collapse in={formOpen}>
                    <CommentCreate setError={setError} id={id} />
                </Collapse>
            </Box>)
    }

    const ShareButtons = () =>
    {
        return (
            <LinkedinShareButton
                url={typeof window !== "undefined" && window.location.url}
                title="Share"
            >
                <LinkedIn />
            </LinkedinShareButton>
        )
    }

    return fullSwitch(2, () => (
        <>
            {delalert && (<TransitionAlerts type="error" setFlash={setDelAlert}>{delalert}</TransitionAlerts>)}
            <Box className={classes.Bar}>
                <Box className={classes.Title}>
                    <Typography variant="h4" color="text.default">
                        {title}
                    </Typography>
                    {adminCtx && (
                        <>
                            <Link href={`/edit/${id}`}><IconButton size="small"><Build color="tertiary" /></IconButton></Link>
                            <Link href=""><IconButton onClick={onDeclrDelete} size="small"><Delete color="tertiary" /></IconButton></Link>
                        </>
                    )}
                </Box>
                <Typography variant="h8" color="text.secondary" alignSelf="center">
                    Created by {authors[0].username}
                </Typography>
            </Box>
            <ShareButtons />
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
                    && (<IconButton size="small" onClick={switchStatus}>
                        <Accessible />
                    </IconButton>)}
                {/* <BackLink>Back</BackLink> */}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: "space-evenly" }}>
                {tags.map(t => <Typography key={t._id} color="primary" fontWeight={600}>
                    {t.content}
                </Typography>)}
            </Box>

            <Box className={classes.Line} />

            <Box sx={{ display: "flex", gap: 2, maxHeight: "100vh" }}>
                <Vote setError={setError} user={user} likes={likes} setLikes={setLikes} d_id={id} dislikes={dislikes} setDislikes={setDislikes} />
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
                    {userCtx && (hasBookmark ? (<IconButton onClick={switchBookmark}><Bookmark /></IconButton>)
                        : (<IconButton onClick={switchBookmark}><TurnedInNot /></IconButton>))}
                </Box>
            </Box>

            <Box className={classes.Line} />

            {user ? (<CommentFormCreate />)
                : (<Typography variant="h6" align="center">
                    <Link href="/user/register">
                        Sign up
                    </Link> or <Link href="/user/login">
                        Log in
                    </Link> to comment
                </Typography>)}

            <CommentList
                setError={setError}
                comments={comments}
                declaration={declaration}
                user={user}
                setComments={setComments}
            />

            {/* {file ? (<DocumentView file={file} />) 
            : (<Typography variant="h4" component="h5" color="text.secondary" sx={{ marginTop: 10 }}>
                No Upload...
            </Typography>)} */}
        </>
    ))
}
export default DeclrView;

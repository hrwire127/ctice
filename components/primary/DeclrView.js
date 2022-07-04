import React, { useState, useContext } from 'react';
import
{
    Box, Typography,
    IconButton,
    Collapse, Grid, Paper,
    Avatar, Fab, Zoom, useScrollTrigger
} from '@mui/material';
import
{
    Delete, Build,
    TurnedInNot, KeyboardArrowUp,
    KeyboardArrowDown, Comment,
    IosShare, Accessible, Bookmark
} from '@mui/icons-material';
import useStyles from '../../assets/styles/_DeclrView';
import AdminContext from '../context/contextAdmin'
import UserContext from '../context/contextUser'
import Link from 'next/link'
import useLoading from '../hooks/useLoading'
import TransitionAlerts from '../TransitionAlerts'
import CommentCreate from "../CommentCreate";
import CommentList from "../CommentList";
import Vote from "../Vote";
import { LinkedinShareButton, FacebookShareButton, TwitterShareButton } from 'react-share';
import { LinkedIn, Facebook, Twitter } from '@mui/icons-material';
import Redirects_CS from '../../utilsCS/CS_Redirects'
import EditorView from '../EditorView';
import useAlertMsg from '../hooks/useAlertMsg';

function DeclrView(props)
{
    const { declaration, user, setError } = props;
    const { title, description, file, date, authors, _id: id, tags } = declaration;

    const adminCtx = useContext(AdminContext);
    const userCtx = useContext(UserContext);

    const [setDelAlertMsg, delalert, setDelAlert] = useAlertMsg()
    const [likes, setLikes] = useState(declaration.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(declaration.likes.filter(el => el.typeOf === false));
    const [hasBookmark, setBookmark] = useState(user ? user.bookmarks.includes(id) : false);
    const [formOpen, setFormOpen] = useState(true);

    const [fullWhile, fullSwitch] = useLoading(false)

    // const data = CropData(JSON.parse(description), 6);
    // const editorState = EditorState.createWithContent(convertFromRaw(data))

    const classes = useStyles();

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
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
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
                    if (res.error) setDelAlertMsg(res.error.message, "error")
                    else Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
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
            <Box>
                <LinkedinShareButton
                    url={typeof window !== "undefined" && window.location ? window.location.url : null}
                    title="Share"
                >
                    <LinkedIn />
                </LinkedinShareButton>
                <FacebookShareButton
                    url={typeof window !== "undefined" && window.location ? window.location.url : null}
                    title="Share"
                >
                    <Facebook />
                </FacebookShareButton>
                <TwitterShareButton
                    url={typeof window !== "undefined" && window.location ? window.location.url : null}
                    title="Share"
                >
                    <Twitter />
                </TwitterShareButton>
            </Box>
        )
    }

    return fullSwitch(2, () => (
        <Box
            component="main"
            className={classes.Container}
        >
            {delalert && (<TransitionAlerts type={delalert.type} setFlash={setDelAlert}>{delalert.message}</TransitionAlerts>)}
            <Box className={classes.Bar}>
                <Box className={classes.Title}>
                    <Typography variant="h4" color="text.default">
                        {title}
                    </Typography>
                    {adminCtx && (
                        <Box sx={{ display: 'flex', justifyContent: "left", flexWrap: "wrap" }}>
                            <Box>
                                <Link href={`/edit/${id}`}><IconButton size="small"><Build color="tertiary" /></IconButton></Link>
                            </Box>
                            <Box>
                                <Link href=""><IconButton onClick={onDeclrDelete} size="small"><Delete color="tertiary" /></IconButton></Link>
                            </Box>
                            <Box>
                                <IconButton size="small" onClick={switchStatus}>
                                    <Accessible color="tertiary" />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box className={classes.Bar}>
                <Box>
                    <Typography variant="" color="text.secondary" sx={{ alignSelf: "center" }}>
                        Published on
                    </Typography>
                    <Typography variant="" sx={{ alignSelf: "center", ml: 1 }}>
                        {date[0].substring(0, 10)} at {date[0].match(/\d\d:\d\d/)}
                    </Typography>
                </Box>
                {date.length > 1 && (<Box>
                    <Typography variant="" color="text.secondary" sx={{ alignSelf: "center" }}>
                        Edited on
                    </Typography>
                    <Typography variant="" sx={{ alignSelf: "center", ml: 1 }}>
                        {date[date.length - 1].substring(0, 10)} at {date[date.length - 1].match(/\d\d:\d\d/)}
                    </Typography>
                </Box>)}
            </Box>

            <Box className={classes.Line} />

            <Box className={classes.Body} >
                <Box className={classes.Vote}>
                    <Vote setError={setError} user={user} likes={likes} setLikes={setLikes} d_id={id} dislikes={dislikes} setDislikes={setDislikes} />

                    {userCtx && (hasBookmark ? (<IconButton onClick={switchBookmark}><Bookmark /></IconButton>)
                        : (<IconButton onClick={switchBookmark}><TurnedInNot /></IconButton>))}
                </Box>
                <Box sx={{ width: "90%" }}>
                    {/* <Editor editorKey="editor" readOnly={true} editorState={editorState} /> */}
                    <Box sx={{ minHeight: 200 }}>
                        <EditorView data={JSON.parse(description)} />
                    </Box>
                    <Box className={classes.Tags}>
                        {tags.map(t =>
                        (<Paper sx={{ pl: 1, pr: 1 }} key={t._id}>
                            <Typography color="primary" fontWeight={600}>
                                {t.content}
                            </Typography>
                        </Paper>)
                        )}
                    </Box>

                    <Box className={classes.Social}>
                        <ShareButtons />

                        <IconButton className={classes.Share} onClick={() => navigator.clipboard.writeText(window.location)}>
                            <IosShare sx={{ ml: 2 }} />
                        </IconButton>
                    </Box>

                    <Box className={classes.LastRow}>
                        <Box display="flex" justifyContent="left" gap={1}>
                            <Comment sx={{ fontSize: 50 }} />
                            <Typography variant="h4" >
                                {declaration.comments.length}
                            </Typography>
                        </Box>

                        <Box className={classes.Authors}>
                            {authors.length > 1 &&
                                (<Paper className={classes.Author}>
                                    <Typography variant="h11" color="text.secondary">
                                        Last Edited
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: 1 }}>
                                        <Avatar alt={authors[authors.length - 1].username} src={authors[authors.length - 1].profile.url} />
                                        <Typography variant="h5">
                                            {authors[authors.length - 1].username}
                                        </Typography>
                                    </Box>
                                </Paper>)}
                            <Paper className={classes.Author}>
                                <Typography variant="h11" color="text.secondary">
                                    Created
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: 1 }}>
                                    <Avatar alt={authors[0].username} src={authors[0].profile.url} />
                                    <Typography variant="h5">
                                        {authors[0].username}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>


                    {/* <BackLink>Back</BackLink> */}
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
                </Typography>)
            }

            <CommentList
                setError={setError}
                declaration={declaration}
                user={user}
            />
            {/* {file ? (<PdfView file={file} />) 
            : (<Typography variant="h4" component="h5" color="text.secondary" sx={{ marginTop: 10 }}>
                No Upload...
            </Typography>)} */}
        </Box >
    ))
}
export default DeclrView;

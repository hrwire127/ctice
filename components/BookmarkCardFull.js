import React, { useState } from 'react'
import 'draft-js/dist/Draft.css';
import useStyles from "../assets/styles/_DeclrCardFull"
import { CropData, getDateDifference } from '../utilsCS/_basic';
import Link from 'next/link'
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, CardActions, Card, CardContent, Typography, IconButton } from '@mui/material'
import { Delete } from "@mui/icons-material"
import Redirects_CS from '../utilsCS/CS_Redirects'
import EditorView from './EditorView';

function BookmarkCardFull(props) 
{
    const { title, _id: id, date, setError, description } = props;
    const [bookmarked, setBookmark] = useState(true)

    const likes = props.likes.filter(el => el.typeOf === true)
    const dislikes = props.likes.filter(el => el.typeOf === false)
    const classes = useStyles();
    // const data = CropData(JSON.parse(description), 6);
    // const editorState = EditorState.createWithContent(convertFromRaw(data))
    const diff = getDateDifference(new Date(), new Date(date[date.length - 1]))

    const switchBookmark = () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { secret: process.env.NEXT_PUBLIC_SECRET, id: _id }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                setBookmark(false)
            })
    }

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 160 }}>
                <Box className={classes.Top}>
                    <Typography className={classes.Title} color="text.secondary" gutterBottom>
                        <Link href={`/view/${id}`}>
                            {title}
                        </Link>
                    </Typography>
                    <Typography color={likes.length === dislikes.length ? "text.default" : (likes.length > dislikes.length ? "text.success" : "text.error")} variant="h6">
                        {likes.length - dislikes.length}
                    </Typography>
                </Box>
                <EditorView data={JSON.parse(description)} />
                {/* <Editor editorKey="editor" readOnly={true} editorState={editorState} /> */}
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                    {diff} ago
                </Typography>
                {bookmarked && (<IconButton onClick={switchBookmark}><Delete /></IconButton>)}
            </CardActions>
        </Card>
    )
}

export default BookmarkCardFull
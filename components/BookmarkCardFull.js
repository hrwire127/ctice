import React, { useEffect, useState } from 'react'
import 'draft-js/dist/Draft.css';
import useStyles from "../assets/styles/_DeclrCardFull"
import { CropData, getDateDifference } from '../utilsCS/_basic';
import Link from 'next/link'
import CS_Redirects from '../utilsCS/CS_Redirects';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, CardActions, Card, CardContent, Typography, IconButton } from '@mui/material'

function BookmarkCardFull(props) 
{
    const { title, _id: id, date } = props;
    const [bookmarked, setBookmark] = useState(true)

    const likes = props.likes.filter(el => el.typeOf === true)
    const dislikes = props.likes.filter(el => el.typeOf === false)
    const classes = useStyles();
    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))
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
                CS_Redirects.tryResCS(res, window)
                setBookmark(false)
            })
    }

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 160 }}>
                <Typography className={classes.Title} color="text.secondary" gutterBottom>
                    <Link href={`/view/${id}`}>
                        {title}
                    </Link>
                    <Typography color={likes.length === dislikes.length ? "text.default" : (likes.length > dislikes.length ? "text.success" : "text.error")} variant="h6">
                        {likes.length - dislikes.length}
                    </Typography>
                </Typography>
                <Editor editorKey="editor" readOnly={true} editorState={editorState} />
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
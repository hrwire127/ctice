import React, { useState } from 'react'
import Link from 'next/link'
import useStyles from "../assets/styles/_DeclrCardCompact"
import { Box, Typography, Paper, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { getDateDifference } from '../utilsCS/_basic';
import Redirects_CS from '../utilsCS/CS_Redirects'
import useWindowSize from './hooks/useWindowSize';

function BookmarkCardCompact(props)
{
    const { title, _id: id, date, setError } = props;
    const [bookmarked, setBookmark] = useState(true)
    const [windowSize] = useWindowSize(500, 2);

    const diff = getDateDifference(new Date(), new Date(date[date.length - 1]))
    const likes = props.likes.filter(el => el.typeOf === true)
    const dislikes = props.likes.filter(el => el.typeOf === false)
    const classes = useStyles();

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
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                setBookmark(false)
            })
    }

    return (<Paper className={classes.BookmarkCard}>
        <Box className={classes.Content} sx={bookmarked ? {} : { backgroundColor: "gray" }}>
            <Typography color={likes.length === dislikes.length ? "text.default" : (likes.length > dislikes.length ? "text.success" : "text.error")} variant="h6">
                {likes.length - dislikes.length}
            </Typography>
            <Link href={`/view/${id}`}>
                <Typography className={classes.Title}>
                    {title}
                </Typography>
            </Link>
        </Box>
        <Box>
            {windowSize && (
                <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                    {diff} ago
                </Typography>)}
            {bookmarked && (<IconButton onClick={switchBookmark}><Delete /></IconButton>)}
        </Box>
    </Paper >
    )
}


export default BookmarkCardCompact

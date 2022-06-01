import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import CS_Redirects from '../utilsCS/CS_Redirects';
import useStyles from "../assets/styles/_DeclrCard"
import { Box, Typography, Paper, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { getDateDifference } from '../utilsCS/_client';

function Bookmark(props)
{
    const { title, _id, date } = props;
    const [likes, setLikes] = useState(props.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(props.likes.filter(el => el.typeOf === false));
    const classes = useStyles();
    const [diff, setDiff] = useState()
    const [bookmarked, setBookmark] = useState(true)

    useEffect(() =>
    {
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

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

    return (<Paper className={classes.Card}>
        <Box className={classes.Content} sx={bookmarked ? {} : { backgroundColor: "gray" }}>
            <Typography color={likes.length === dislikes.length ? "text.default" : (likes.length > dislikes.length ? "text.success" : "text.error")} variant="h6">
                {likes.length - dislikes.length}
            </Typography>
            <Link href={`/view/${_id}`}>
                <Typography className={classes.Title}>
                    {title}
                </Typography>
            </Link>
        </Box>
        <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
            {diff} ago
        </Typography>
        {bookmarked && (<IconButton onClick={switchBookmark}><Delete /></IconButton>)}
    </Paper>
    )
}


export default Bookmark

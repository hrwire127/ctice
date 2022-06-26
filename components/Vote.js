import React from 'react'
import useStyles from "../assets/styles/_Vote"
import { Box, Typography } from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import Redirects_CS from '../utilsCS/CS_Redirects'

function Vote(props)
{
    const { user, likes, setLikes, d_id, dislikes, setDislikes, comment, reply, setError } = props;
    const classes = useStyles();

    const onLike = async (type) =>
    {
        const collectionName = reply ? "replies" : comment ? "comments" : "likes"
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${collectionName}/${d_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { type, secret: process.env.NEXT_PUBLIC_SECRET }
            )
        }).then(response => response.json())
            .then(async res =>
            {
                Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                if (!res.redirect) 
                {
                    const likes = res.obj.filter(el => el.typeOf === true)
                    const dislikes = res.obj.filter(el => el.typeOf === false)
                    setLikes(likes)
                    setDislikes(dislikes)
                }
            })
    }

    const UpColor = likes.filter(el => el.user.valueOf() === user._id.valueOf() && el.typeOf === true).length ? "base" : "tertiary"
    const DownColor = dislikes.filter(el => el.user.valueOf() === user._id.valueOf() && el.typeOf === false).length ? "base" : "tertiary"

    return (
        <Box className={classes.Vote}>
            {user ?
                likes.includes({ user: user._id, typeOf: true })
                    ? (<KeyboardArrowUp disabled fontSize="large" className={classes.VoteBtn} />)
                    : (<KeyboardArrowUp onClick={() => onLike(true)} color={UpColor} fontSize="large" className={classes.VoteBtn} />)
                : (<KeyboardArrowUp disabled fontSize="large" className={classes.VoteBtn} />)}
            <Typography variant="h5" color="base" sx={{ fontWeight: 'bold' }}>
                {likes.length - dislikes.length}
            </Typography>
            {user ?
                likes.includes({ user: user._id, typeOf: false })
                    ? (<KeyboardArrowDown disabled fontSize="large" className={classes.VoteBtn} />)
                    : (<KeyboardArrowDown onClick={() => onLike(false)} color={DownColor} fontSize="large" className={classes.VoteBtn} />)
                : (<KeyboardArrowDown disabled fontSize="large" className={classes.VoteBtn} />)}
        </Box>)
}

export default Vote
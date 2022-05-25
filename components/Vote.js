import React from 'react'
import useStyles from "../assets/styles/_Vote"
import { Box, Typography } from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import CS_Redirects from '../utilsCS/CS_Redirects'

function Vote(props)
{
    const { user, likes, setLikes, d_id, dislikes, setDislikes } = props;
    const classes = useStyles();


    const onLike = async (type) =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/likes/${d_id}`, {
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
                console.log(res)
                CS_Redirects.tryResCS(res, window)
                if (!res.redirect) 
                {
                    const likes = res.obj.filter(el => el.typeOf === true)
                    const dislikes = res.obj.filter(el => el.typeOf === false)
                    setLikes(likes)
                    setDislikes(dislikes)
                }
            })
    }

    return (
        <Box className={classes.Vote}>
            {user
                ? (<>
                    {likes.includes({ user: user._id, typeOf: true })
                        ? (<KeyboardArrowUp disabled fontSize="large" className={classes.VoteBtn} />)
                        : (<KeyboardArrowUp onClick={() => onLike(true)} color={likes.filter(el => el.user.valueOf() === user._id.valueOf() && el.typeOf === true).length ? "base" : "tertiary"} fontSize="large" className={classes.VoteBtn} />)
                    }
                    <Typography variant="h5" color="base" sx={{ fontWeight: 'bold' }}>
                        {likes.length - dislikes.length}
                    </Typography>
                    {likes.includes({ user: user._id, typeOf: false })
                        ? (<KeyboardArrowDown disabled fontSize="large" className={classes.VoteBtn} />)
                        : (<KeyboardArrowDown onClick={() => onLike(false)} color={dislikes.filter(el => el.user.valueOf() === user._id.valueOf() && el.typeOf === false).length ? "base" : "tertiary"} fontSize="large" className={classes.VoteBtn} />)
                    }
                </>)
                : (<>
                    <KeyboardArrowUp disabled fontSize="large" className={classes.VoteBtn} />
                    <Typography variant="h5" color="base" sx={{ fontWeight: 'bold' }}>
                        {likes.length - dislikes.length}
                    </Typography>
                    <KeyboardArrowDown disabled fontSize="large" className={classes.VoteBtn} />
                </>)}
        </Box>)
}

export default Vote

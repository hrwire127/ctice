import React from 'react'
import useStyles from "../assets/styles/_Vote"
import { Box, Typography } from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import CS_Redirects from '../utilsCS/CS_Redirects'

function Vote(props)
{
    const { user, likes, setLikes, d_id } = props;
    const classes = useStyles();


    const onLike = async () =>
    {
        fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/like/${d_id}`, {
            method: 'PUT',
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
                CS_Redirects.tryResCS(res, window)
                if (!res.redirect) setLikes(res.obj)
            })
    }

    return (
        <Box className={classes.Vote}>
            {user
                ? (<>
                    {likes.includes(user._id)
                        ? (<KeyboardArrowUp disabled fontSize="large" className={classes.VoteBtn} />)
                        : (<KeyboardArrowUp onClick={onLike} color="tertiary" fontSize="large" className={classes.VoteBtn} />)
                    }
                    <Typography variant="h5" color="base" sx={{ fontWeight: 'bold' }}>
                        {likes.length}
                    </Typography>
                    <KeyboardArrowDown className={classes.VoteBtn} color="tertiary" />
                </>)
                : (<>
                    <KeyboardArrowUp disabled fontSize="large" className={classes.VoteBtn} />
                    <Typography variant="h5" color="base" sx={{ fontWeight: 'bold' }}>
                        {likes.length}
                    </Typography>
                    <KeyboardArrowDown disabled fontSize="large" className={classes.VoteBtn}/>
                </>)}
        </Box>)
}

export default Vote

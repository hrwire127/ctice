import React, { useState } from 'react'
import 'draft-js/dist/Draft.css';
import { Box, Typography, Paper } from '@mui/material'
import useStyles from "../assets/styles/_DeclrCardCompact" 
import { getDateDifference } from '../utilsCS/_basic';
import Link from 'next/link'

function DeclrCardCompact(props) 
{ 
    const { title, _id, description, date } = props;

    const classes = useStyles();

    const likes = props.likes.filter(el => el.typeOf === true)
    const dislikes = props.likes.filter(el => el.typeOf === false)
    const diff = getDateDifference(new Date(), new Date(date[date.length - 1]))

    return (
        <Paper className={classes.Card}>
            <Box className={classes.Content}>
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
        </Paper>
    )
}

export default DeclrCardCompact
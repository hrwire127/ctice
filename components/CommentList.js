import React, { useState } from 'react'
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import CommentCard from './CommentCard';
import useStyles from '../assets/styles/_CommentList';

function CommentList(props)
{
    const { comments } = props;
    const classes = useStyles();

    return (
        <Box className={classes.List}>
            {comments.map(c => (
                <CommentCard {...c} key={c._id} />
            ))}
        </Box>
    )
}

export default CommentList
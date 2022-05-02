import React, { useState } from 'react'
import { Box, Typography, ButtonGroup, Button, Grid, IconButton } from '@mui/material';
import Comment from './Comment';
import useStyles from '../assets/styles/_CommentList';

function CommentList(props)
{
    const { comments, id } = props;
    const classes = useStyles();

    return (
        <Box className={classes.List}>
            {comments.map(c => (
               <Comment comment={c} id={id} key={c._id}/>
            ))}
        </Box>
    )
}

export default CommentList
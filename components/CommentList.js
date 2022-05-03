import React, { useState } from 'react'
import { Box } from '@mui/material';
import Comment from './Comment';
import useStyles from '../assets/styles/_CommentList';
import useLoading from './hooks/useLoading'

function CommentList(props)
{
    const { comments, id } = props;
    const classes = useStyles();
    const [loadingMoreWhile, loadingMoreSwitch] = useLoading(false)

    return (
        <Box className={classes.List}>
            {
                loadingMoreSwitch(0, () =>
                {
                    return comments.map(c => (
                        <Comment comment={c} id={id} key={c._id} loadingMoreWhile={loadingMoreWhile}/>
                    ))
                })
            }
        </Box>
    )
}

export default CommentList
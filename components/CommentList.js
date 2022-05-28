import React, { useState, useEffect } from 'react'
import
{
    Box, MenuItem, FormControl,
    Select, InputLabel, Button,
    Typography
} from '@mui/material';
import Comment from './Comment';
import useStyles from '../assets/styles/_CommentList';
import useLoading from './hooks/useLoading'
import { getLimitedComments, timeout, getClientUser } from '../utilsCS/_client'
import CS_Redirects from '../utilsCS/CS_Redirects'

function CommentList(props)
{
    const {
        comments,
        _id,
        user,
        declaration,
        loadMore,
        loadMoreSwitch,
        setComments,
        commentWhile,
        switchComment
    } = props;
    const classes = useStyles();
    const [loadingMoreWhile, loadingMoreSwitch] = useLoading(false)

    const [sort, setSorting] = React.useState(10);

    useEffect(() =>
    {
        commentWhile(async () =>
        {
            await timeout(500)
            const newComments = await getLimitedComments([], _id, sort);
            CS_Redirects.tryResCS(newComments, window)
            console.log(newComments.obj)
            setComments(newComments.obj)
        })
    }, [sort])

    const handleChange = (e) =>
    {
        setSorting(e.target.value);
    };

    //comments count

    return switchComment(0, () =>
    {
        return <Box className={classes.List}>
            <Box sx={{ display: 'flex', justifyContent: "right" }}>
                <FormControl sx={{ width: 120, mt: 2, mb: 2 }}>
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Sort"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>Date</MenuItem>
                        <MenuItem value={20}>Score</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {comments.length > 0
                ? (<>
                    {
                        loadingMoreSwitch(0, () =>
                        {
                            return comments.map(c => (<Comment comment={c} id={_id} user={user} key={c._id} loadingMoreWhile={loadingMoreWhile} />))
                        })
                    }
                    {
                        loadMoreSwitch(0, () => comments.length < declaration.comments.length && comments.length > 0 && (<Button onClick={(e) => loadMore(e, sort)}>Load More</Button>))
                    }
                </>)
                : (<Typography align="center" component="h1" color="text.secondary" variant="h5" sx={{ fontWeight: 800 }}>
                    . . .
                </Typography>)
            }
        </Box>
    })
}

export default CommentList;
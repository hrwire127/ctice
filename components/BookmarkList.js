import React, { useState, useEffect } from 'react'
import { Box, Button, } from '@mui/material';
import { getLimitedBookmarks, } from '../utilsCS/_get'
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from '../components/hooks/useLoading'
import BookmarkCard from "./BookmarkCard"
import useStyles from "../assets/styles/_DeclrList"

function BookmarkList(props)
{
    const { user } = props;
    const [bookmarks, setBookmarks] = useState([])
    const [fullWhile, fullSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const classes = useStyles();

    useEffect(() =>
    {
        fullWhile(async () =>
        {
            const newBookmarks = await getLimitedBookmarks([], user._id); // <==
            CS_Redirects.tryResCS(newBookmarks, window)
            setBookmarks(newBookmarks.obj)
        })
    }, [])

    function loadMore(e)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            const newBookmarks = await getLimitedBookmarks(bookmarks, user._id);
            CS_Redirects.tryResCS(newBookmarks, window)
            setBookmarks(bookmarks.concat(newBookmarks.obj));
        })
    }

    return (<Box className={classes.List}>
        {
            fullSwitch(0, () => 
            {
                return bookmarks.map(b => (<BookmarkCard key={b._id} {...b} />))
            })
        }
        {
            loadMoreSwitch(0, () => bookmarks.length < user.bookmarks.length
                && bookmarks.length > 0
                && (<Box textAlign="center">
                    <Button onClick={(e) => loadMore(e)}>Load More</Button>
                </Box>))
        }
    </Box>)
}


export default BookmarkList

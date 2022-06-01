import React, { useState, useEffect } from 'react'
import
{
    Box, MenuItem, FormControl,
    Select, InputLabel, Button,
    Typography
} from '@mui/material';
import { getLimitedBookmarks } from '../utilsCS/_client'
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from '../components/hooks/useLoading'
import Bookmark from "./Bookmark"
import useStyles from "../assets/styles/_DeclrList"

function BookmarkList(props)
{
    const { bookmarks, setBookmarks, user } = props;
    const [loadWhile, loadSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const classes = useStyles();

    useEffect(() =>
    {
        loadWhile(async () =>
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
            loadSwitch(0, () => 
            {
                return bookmarks.map(b => (<Bookmark key={b._id} {...b}/>))
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

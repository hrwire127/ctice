import React, { useState, useEffect, useContext } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { getLimitedBookmarks, loadLimitedBookmarks, countLimitedBookmarks } from '../utilsCS/_get'
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from '../components/hooks/useLoading'
import BookmarkCardCompact from "./BookmarkCardCompact"
import BookmarkCardFull from "./BookmarkCardFull"
import useStyles from "../assets/styles/_DeclrList"
import StyleContext from './context/contextStyle'
import { styleCompact, styleFull } from './context/styleEnum';
import Search from './Search'
import TagFilter from './TagFilter';
import handleAsync from './custom/handleAsync'

const BookmarkList = (props) => handleAsync(props, (props) =>
{
    const { user, fullTags, setError, Mounted } = props;
    const [queryValue, setQuery] = useState("");
    const [count, setCount] = useState(user.bookmarks.length);
    const [bookmarks, setBookmarks] = useState([])
    const [tags, setTags] = useState([]);
    const [fullWhile, fullSwitch] = useLoading(false)
    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const styleCtx = useContext(StyleContext);
    const classes = useStyles();

    useEffect(async () =>
    {
        fullWhile(async () =>
        {
            // if (queryValue !== "")
            // {
            //doclimit --!!!!
            const newBookmarks = await loadLimitedBookmarks([], queryValue, 4, user._id, tags)
            const newCount = await countLimitedBookmarks(queryValue, user._id, tags);
            if (newBookmarks.error) return setError(newBookmarks.error)
            if (newCount.error) return setError(newCount.error)

            if (Mounted)
            {
                setBookmarks(newBookmarks.obj)
                setCount(newCount.obj)
            }
            // }
            // else
            // {
            //     //doclimit --!!!!
            //     const newBookmarks = await getLimitedBookmarks([], 4, user._id, tags); // <==
            //     if (newBookmarks.error) return setError(newBookmarks.error)
            //     setBookmarks(newBookmarks.obj)
            //     setCount(user.bookmarks.length)
            // }
        })
    }, [queryValue, tags])

    function loadMore(e)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            //doclimit --!!!!
            const newBookmarks = await getLimitedBookmarks(bookmarks, 4, user._id);
            if (newBookmarks.error) return setError(newBookmarks.error)
            setBookmarks(bookmarks.concat(newBookmarks.obj));
        })
    }

    return (
        <>
            <Search query={queryValue} setQuery={setQuery} />
            <TagFilter fullTags={fullTags} setTags={setTags} />
            {count > 0
                ? (<>
                    <Box className={styleCtx === styleFull ? classes.ListCompact : classes.ListFull}>
                        {
                            fullSwitch(0, () => 
                            {
                                return bookmarks.map(b => styleCtx === styleFull ? (
                                    <BookmarkCardCompact setError={setError} key={b._id} {...b} />)
                                    : (<BookmarkCardFull setError={setError} key={b._id} {...b} />))
                            })
                        }
                        {
                            loadMoreSwitch(0, () => bookmarks.length < count
                                && bookmarks.length > 0
                                && (<Box textAlign="center">
                                    <Button onClick={(e) => loadMore(e)}>Load More</Button>
                                </Box>))
                        }
                    </Box>
                </>)
                : (<Typography align="center" variant="h4" color="text.secondary">Nothing</Typography>)
            }
        </>)
})

export default BookmarkList
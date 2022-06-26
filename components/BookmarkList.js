import React, { useState, useEffect, useContext, useReducer } from 'react'
import { Box, Button, Typography } from '@mui/material';
import { getLimitedBookmarks, loadLimitedBookmarks, countLimitedBookmarks } from '../utilsCS/_get'
import { styleFull, styleCompact } from "./context/styleEnum"
import useLoading from '../components/hooks/useLoading'
import BookmarkCardCompact from "./BookmarkCardCompact"
import BookmarkCardFull from "./BookmarkCardFull"
import useStyles from "../assets/styles/_DeclrList"
import StyleContext from './context/contextStyle'
import DeviceContext from './context/contextDevice'
import handleAsync from './custom/handleAsync'
import Redirects_CS from '../utilsCS/CS_Redirects'
import TagFilter from './TagFilter';
import Search from './Search'
import useLocalStorage from "./hooks/useLocalStorage"
import declrReducer from "./reducers/declrReducer"

const BookmarkList = (props) => handleAsync(props, (props) =>
{
    const { user, fullTags, setError, Mounted } = props;
    const [queryValue, setQuery] = useLocalStorage("query_bookmarks", "", true);
    const [tags, setTags] = useLocalStorage("bookmarks_tags", [], true);

    const [{ declarations: bookmarks, count }, dispatchBookmarks] = useReducer(declrReducer, { declarations: [], count: user.bookmarks.length });

    const [loadMoreWhile, loadMoreSwitch] = useLoading(false)
    const [fullWhile, fullSwitch] = useLoading(false)

    const device = useContext(DeviceContext)
    const styleCtx = useContext(StyleContext);
    const classes = useStyles();

    useEffect(async () =>
    {
        fullWhile(async () =>
        {
            const newBookmarks = await loadLimitedBookmarks([], queryValue, 4, user._id, tags)
            const newCount = await countLimitedBookmarks(queryValue, user._id, tags);

            Redirects_CS.handleRes(newBookmarks, typeof window !== "undefined" && window, setError)
            Redirects_CS.handleRes(newCount, typeof window !== "undefined" && window, setError)

            if (Mounted)
            {
                dispatchBookmarks({ type: "SET", declarations: newBookmarks.obj, count: newCount.obj })
            }
        })
    }, [queryValue, tags, Mounted])

    function loadMore(e)
    {
        e.preventDefault()
        loadMoreWhile(async () =>
        {
            //doclimit --!!!!
            const newBookmarks = await getLimitedBookmarks(bookmarks, device.doclimit, user._id);
            Redirects_CS.handleRes(newBookmarks, typeof window !== "undefined" && window, setError)
            dispatchBookmarks({ type: "ADD", declarations: newBookmarks.obj })
        })
    }

    return (
        <Box sx={{
            flexGrow: 1,
            padding: "24px",
            ["@media (max-width:960px)"]: {
                paddingRight: "60px",
                paddingLeft: "60px",
            },
            ["@media (max-width:530px)"]: {
                paddingRight: "50px",
                paddingLeft: "50px",
            },
        }}>
            <Box className={classes.Bar}>
                <Typography sx={{ textAlign: "center" }} variant="h4">
                    Bookmarks
                </Typography>
            </Box>
            <Box sx={{
                width: "100%",
                display: 'flex',
                justifyContent: "space-evenly",
                alignItems: "end",
                flexWrap: "wrap",
                mb: 4
            }}>
                <Search query={queryValue} setQuery={setQuery} />
                <TagFilter fullTags={fullTags} setTags={setTags} value={tags} />
            </Box>
            {count > 0
                ? (<>
                    <Box className={styleCtx === styleFull ? classes.ListFull : classes.ListCompact}>
                        {
                            fullSwitch(0, () => 
                            {
                                return bookmarks.map(b => styleCtx === styleFull
                                    ? (<BookmarkCardFull setError={setError} key={b._id} {...b} />)
                                    : (<BookmarkCardCompact setError={setError} key={b._id} {...b} />)
                                )
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
                : (<Typography align="center" variant="h5" color="text.secondary">Nothing</Typography>)
            }
        </Box >)
})

export default BookmarkList
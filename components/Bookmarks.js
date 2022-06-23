import React from 'react'
import { Typography } from "@mui/material"
import BookmarkList from "./BookmarkList"

function Bookmarks(props)
{
    const { user, fullTags, setError } = props;
    return (<>
        <Typography variant="h4">
            Bookmarks
        </Typography>
        <BookmarkList setError={setError} user={user} fullTags={fullTags} />
    </>)
}

export default Bookmarks
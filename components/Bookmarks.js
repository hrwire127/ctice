import React from 'react'
import { Typography } from "@mui/material"
import BookmarkList from "./BookmarkList"

function Bookmarks(props)
{
    const { user, fullTags } = props;
    return (<>
        <Typography variant="h3">
            Bookmarks
        </Typography>
        <BookmarkList user={user} fullTags={fullTags} />
    </>)
}

export default Bookmarks
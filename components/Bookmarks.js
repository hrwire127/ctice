import React from 'react'
import { Typography } from "@mui/material"
import BookmarkList from "./BookmarkList"

function Bookmarks(props)
{
    const { user } = props;
    return (<>
        <Typography variant="h3">
            Bookmarks
        </Typography>
        <BookmarkList user={user} /> 
    </>)
}

export default Bookmarks
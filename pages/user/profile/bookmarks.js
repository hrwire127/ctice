import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, getTags } from '../../../utilsCS/_get'
import BookmarkList from '../../../components/BookmarkList'
import UserNavigation from '../../../components/UserNavigation'

function bookmarks(props)
{
    const { fullTags, user, setError } = props
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        }
    }, [])

    return userCtx && (<UserNavigation>
        <BookmarkList user={user} fullTags={fullTags} setError={setError} />
    </UserNavigation>)
}

bookmarks.getInitialProps = async (props) =>
{
    const fullTags = await getTags()

    return determRendering(props, async () =>
    {
        const user = await getClientUser()
        if (user.error) return { error: user.error }
        if (fullTags.error) return { error: fullTags.error }

        return { fullTags: fullTags.obj, user: user.obj }
    }, async () =>
    {
        const { user } = props.query
        if (fullTags.error) return { error: fullTags.error }

        return { fullTags: fullTags.obj, user }
    })
}

export default bookmarks
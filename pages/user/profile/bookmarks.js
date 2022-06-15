import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import Profile from '../../../components/Profile'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, getTags } from '../../../utilsCS/_get'
import Bookmarks from '../../../components/Bookmarks'

function bookmarks(props)
{
    const { fullTags, user } = props
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return userCtx && (<Bookmarks user={user} fullTags={fullTags} />)
}

bookmarks.getInitialProps = async (props) =>
{
    const fullTags = await getTags()

    return determRendering(props, async () =>
    {
        const user = await getClientUser()
        CS_Redirects.tryResCS(user, window)
        CS_Redirects.tryResCS(fullTags, window)
        return { fullTags: fullTags.obj, user: user.obj, nav: "Profile" }
    }, async () =>
    {
        const { user } = props.query
        CS_Redirects.tryResSR(fullTags, props)
        return { fullTags: fullTags.obj, user, nav: "Profile" }
    })
}


export default bookmarks
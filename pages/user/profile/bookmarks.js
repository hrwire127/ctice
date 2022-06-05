import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import Profile from '../../../components/Profile'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'
import Bookmarks from '../../../components/Bookmarks'

function bookmarks(props)
{
    const { user, isResetToken } = props;
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return userCtx && (<Bookmarks user={user}/>)
}

bookmarks.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(user, window)
        return { user: user.obj, nav: "Profile" }
    }, async () =>
    {
        const user = JSON.parse(JSON.stringify(props.query.user));
        return { user, nav: "Profile" }
    })
}


export default bookmarks
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../components/context/contextUser'
import Profile from '../../components/Profile'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getClientUser, determRendering, checkToken } from "../../utilsCS/_basic"
import { getClientUser, } from '../../utilsCS/_get'

function profile(props)
{
    const { user, isToken } = props;
    const userCtx = useContext(UserContext);
    const [bookmarks, setBookmarks] = useState([])

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return userCtx && (<Profile
        user={user}
        isToken={isToken}
        bookmarks={bookmarks}
        setBookmarks={setBookmarks}
    />)
}

profile.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(user, window)
        const isToken = await checkToken(user.obj._id)
        CS_Redirects.tryResCS(isToken, window)
        return { user: user.obj, isToken: isToken.obj }
    }, async () =>
    {
        const user = JSON.parse(JSON.stringify(props.query.user));
        const isToken = await checkToken(user._id)
        CS_Redirects.tryResSR(isToken, props)
        return { user, isToken: isToken.obj }
    })
}


export default profile
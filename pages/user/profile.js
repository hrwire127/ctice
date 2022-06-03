import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../components/context/contextUser'
import Profile from '../../components/Profile'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../utilsCS/_basic"
import { getClientUser, } from '../../utilsCS/_get'

function profile(props)
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

    return userCtx && (<Profile
        user={user}
        isResetToken={isResetToken}
    />)
}

profile.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(user, window)
        const isResetToken = await checkToken(user.obj._id)
        CS_Redirects.tryResCS(isResetToken, window)
        return { user: user.obj, isResetToken: isResetToken.obj }
    }, async () =>
    {
        const user = JSON.parse(JSON.stringify(props.query.user));
        const isResetToken = await checkToken(user._id)
        CS_Redirects.tryResSR(isResetToken, props)
        return { user, isResetToken: isResetToken.obj }
    })
}


export default profile
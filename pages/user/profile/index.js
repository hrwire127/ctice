import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import Profile from '../../../components/Profile'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser } from '../../../utilsCS/_get'

function index(props)
{
    const { isResetToken, user } = props

    const userCtx = useContext(UserContext);

    useEffect(async () =>
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

index.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const user = await getClientUser()
        CS_Redirects.tryResCS(user, window)
        const isResetToken = await checkToken(user.obj._id)
        CS_Redirects.tryResCS(isResetToken, window)
        return { user: user.obj, isResetToken, nav: "Profile" }
    }, async () =>
    {
        const { user } = props.query
        const isResetToken = await checkToken(user._id)
        CS_Redirects.tryResCS(isResetToken, window)
        return { user, isResetToken, nav: "Profile" }
    })
}


export default index
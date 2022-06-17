import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import Change from '../../../components/Change'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken, getFlash } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'
import UserNavigation from '../../../components/UserNavigation'

function edit(props)
{
    const { isResetToken, user, setError } = props
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        }
    }, [])

    return userCtx && (<UserNavigation><Change
        user={user}
        isResetToken={isResetToken}
        setError={setError}
    /></UserNavigation>)
}

edit.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const user = await getClientUser()
        if (user.error) return { error: user.error }

        const isResetToken = await checkToken(user.obj._id)
        if (isResetToken.error) return { error: isResetToken.error }

        return { user: user.obj, isResetToken }
    }, async () =>
    {
        const { user } = props.query
        const isResetToken = await checkToken(user._id)
        if (isResetToken.error) return { error: isResetToken.error }
        return { user, isResetToken }
    })
}

export default edit
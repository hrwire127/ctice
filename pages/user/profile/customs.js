import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'
import Customs from '../../../components/Customs'
import UserNavigation from '../../../components/UserNavigation'

function customs(props)
{
    const { isResetToken, user, light,
        setThemeLight, setSorting: setSortCtx, setStyle: setStyleCtx, setError } = props;
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        }
    }, [])

    return userCtx && (<UserNavigation>
        <Customs
            user={user}
            light={light}
            setThemeLight={setThemeLight}
            setStyleCtx={setStyleCtx}
            setSortCtx={setSortCtx}
            setError={setError}
        />
    </UserNavigation>)
}

customs.getInitialProps = async (props) =>
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


export default customs
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import Change from '../../../components/Change'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken, getFlash } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'

function edit(props)
{
    const [user, setUser] = useState()
    const [isResetToken, setToken] = useState()
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }

        const newUser = await getClientUser();
        CS_Redirects.tryResCS(newUser, window)
        setUser(newUser.obj)
        const newToken = await checkToken(newUser.obj._id)
        CS_Redirects.tryResCS(newToken, window)
        setToken(newToken.obj)
    }, [])

    return userCtx && (<Change
        user={user}
        isResetToken={isResetToken}
    />)
}

edit.getInitialProps = async (props) =>
{
    return { nav: "Profile" }
}

export default edit
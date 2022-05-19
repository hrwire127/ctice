import React, { useContext, useEffect } from 'react'
import UserContext from '../../components/context/contextUser'
import Profile from '../../components/Profile'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getClientUser, determRendering, checkToken } from "../../utilsCS/_client"

function profile(props)
{
    const { user, isToken } = props;
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    const resetPassword = async () =>
    {
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/pending`, {
            method: 'POST',
        }).then(response => response.json())
            .then(res =>
            {
                CS_Redirects.tryResCS(res, window)
            })
    }



    return userCtx && (<Profile user={user} resetPassword={resetPassword} isToken={isToken} />)
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
        console.log(isToken)
        CS_Redirects.tryResSR(isToken, props)
        return { user, isToken: isToken.obj }
    })
}


export default profile
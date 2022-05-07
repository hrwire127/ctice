import React, { useContext, useEffect } from 'react'
import UserContext from '../../components/context/contextUser'
import Profile from '../../components/Profile'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getClientUser, determRendering } from "../../utilsCS/_client"

function profile(props)
{
    const { user } = props;
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

    return userCtx && (<Profile user={user} resetPassword={resetPassword}/>)
}

profile.getInitialProps = async (props) =>
{

    return determRendering(props, async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(user, window)
        return { user: user.obj }
    }, () =>
    {
        return { user: JSON.parse(JSON.stringify(props.query.user)) }
    })
}


export default profile
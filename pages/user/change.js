import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../components/context/contextUser'
import Change from '../../components/Change'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import useLoading from '../../components/hooks/useLoading'
import { getClientUser, determRendering, checkToken, timeout } from "../../utilsCS/_client"

function change(props)
{
    const { user, isToken } = props;
    const userCtx = useContext(UserContext);
    const [alert, setAlert] = useState()
    const [loadingWhile, switchLoading] = useLoading(false)

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const changeAccDetails = async (body) => 
    {
        loadingWhile(async () =>
        {
            timeout(5000)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/change`, {
                method: 'POST',
                body,
            }).then(response => response.json())
                .then(async res =>
                {
                    CS_Redirects.tryResCS(res, window)
                    if (res.err) setError(res.err.message)
                })
        })
    }

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

    return userCtx && (<Change
        user={user}
        changeAccDetails={changeAccDetails}
        isToken={isToken}
        switchLoading={switchLoading}
        resetPassword={resetPassword}
        alert={alert}
    />)
}

change.getInitialProps = async (props) =>
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

export default change
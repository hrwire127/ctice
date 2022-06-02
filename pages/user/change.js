import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../components/context/contextUser'
import Change from '../../components/Change'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import useLoading from '../../components/hooks/useLoading'
import { determRendering, checkToken, timeout, getDateDifference } from "../../utilsCS/_basic"
import { getClientUser, } from '../../utilsCS/_get'

function change(props)
{
    const { user, isResetToken } = props;
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
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/send`, {
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
        isResetToken={isResetToken}
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

export default change
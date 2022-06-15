import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'
import Customs from '../../../components/Customs'
import handleError from '../../../components/custom/handleError';

const customs = (props) => handleError(props, function (props)
{
    const { isResetToken, user, light,
        setThemeLight, setSorting: setSortCtx, setStyle: setStyleCtx } = props;
    const userCtx = useContext(UserContext);

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return userCtx && (<Customs
        user={user}
        light={light}
        setThemeLight={setThemeLight}
        setStyleCtx={setStyleCtx}
        setSortCtx={setSortCtx}
    />)
})

customs.getInitialProps = async (props) =>
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


export default customs
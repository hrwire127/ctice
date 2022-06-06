import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'
import Customs from '../../../components/Customs'

function customs(props)
{
    const { user, isResetToken, light,
        setThemeLight, setSorting: setSortCtx, setStyle: setStyleCtx } = props;
    console.log(props)
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
}

customs.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(user, window)
        const isResetToken = await checkToken(user.obj._id)
        CS_Redirects.tryResCS(isResetToken, window)
        return { user: user.obj, isResetToken: isResetToken.obj, nav: "Profile" }
    }, async () =>
    {
        const user = JSON.parse(JSON.stringify(props.query.user));
        const isResetToken = await checkToken(user._id)
        CS_Redirects.tryResSR(isResetToken, props)
        return { user, isResetToken: isResetToken.obj, nav: "Profile" }
    })
}


export default customs
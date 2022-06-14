import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../../components/context/contextUser'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, checkToken } from "../../../utilsCS/_basic"
import { getClientUser, } from '../../../utilsCS/_get'
import Customs from '../../../components/Customs'

function customs(props)
{
    const { light,
        setThemeLight, setSorting: setSortCtx, setStyle: setStyleCtx } = props;
    const userCtx = useContext(UserContext);
    const [user, setUser] = useState()

    useEffect(() =>
    {
        if (!userCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }

        const newUser = await getClientUser();
        CS_Redirects.tryResCS(newUser, window)
        setUser(newUser.obj)
        const isResetToken = await checkToken(newUser.obj._id)
        CS_Redirects.tryResCS(isResetToken, window)
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
    return { nav: "Profile" }
}


export default customs
import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getDeclr, } from "../../utilsCS/_declr"

function edit(props)
{
    const { declaration } = props;

    const adminCtx = React.useContext(AdminContext);

    useEffect(() =>
    {
        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return adminCtx && (<EditForm declaration={declaration} />)
}

edit.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declr, window)
        return { declaration: declr.obj, nav: "Home" }
    }, () =>
    {
        CS_Redirects.tryResSR(declr, props)
        return { declaration: declr.obj, nav: "Home" }
    })
}


export default edit
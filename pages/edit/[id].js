import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getDeclr, } from "../../utilsCS/_declr"
import { getTags } from '../../utilsCS/_get'

function edit(props)
{
    const { declaration, fullTags } = props;

    const adminCtx = React.useContext(AdminContext);


    useEffect(() =>
    {
        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return adminCtx && (<EditForm fullTags={fullTags} declaration={declaration} />)
}

edit.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);
    const fullTags = await getTags()

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declr, window)
        CS_Redirects.tryResCS(fullTags, window)
        return { declaration: declr.obj, fullTags: fullTags.obj, nav: "Home" }
    }, () =>
    {
        CS_Redirects.tryResSR(declr, props)
        CS_Redirects.tryResSR(fullTags, props)
        return { declaration: declr.obj, fullTags: fullTags.obj, nav: "Home" }
    })
}


export default edit
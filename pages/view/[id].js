import React, { useState } from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getClientUser, } from '../../utilsCS/_get'
import { getDeclr } from "../../utilsCS/_declr"


function view(props)                                                                           
{
    const { declaration, user } = props;

    return <DeclrView
        declaration={declaration}
        user={user}
    />
}

view.getInitialProps = async (props) =>
{
    const { id, user } = props.query;

    let declr = await getDeclr(id);

    return determRendering(props, async () =>
    {
        const user = await getClientUser();
        CS_Redirects.tryResCS(declr, window)
        return { declaration: declr.obj, user: user.obj ? user.obj : undefined }
    }, () =>
    {
        CS_Redirects.tryResSR(declr, props)
        return { declaration: declr.obj, user }
    })
}



export default view
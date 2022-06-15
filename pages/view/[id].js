import React, { useState, useEffect } from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getClientUser, } from '../../utilsCS/_get'
import { getDeclr } from "../../utilsCS/_declr"

function view(props)                                                                           
{
    const { user, declaration } = props;

    return <DeclrView
        declaration={declaration}
        user={user}
    />
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    const declaration = await getDeclr(id);
    const user = await getClientUser();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declaration, window)
        CS_Redirects.tryResCS(user, window)
        return { declaration: declaration.obj, user: user.obj, nav: "Home" }

    }, () =>
    {
        CS_Redirects.tryResSR(declaration, props)
        return { declaration: declaration.obj, user: props.query.user, nav: "Home" }
    })

}



export default view
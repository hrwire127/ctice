import React, { useState, useEffect } from 'react'
import DeclrView from '../../components/DeclrView';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getClientUser, } from '../../utilsCS/_get'
import { getDeclr } from "../../utilsCS/_declr"


function view(props)                                                                           
{
    const { id } = props;

    const [declaration, setDeclaration] = useState()
    const [user, setUser] = useState()

    useEffect(() =>
    {
        const declr = await getDeclr(id);
        const newUser = await getClientUser();
        CS_Redirects.tryResCS(declr, window)
        CS_Redirects.tryResCS(newUser, window)
        setDeclaration(declr.obj)
        setUser(newUser.obj)
    }, [])


    return <DeclrView
        declaration={declaration}
        user={user}
    />
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    // let declr = await getDeclr(id);

    // return determRendering(props, async () =>
    // {
    //     const user = await getClientUser();
    //     CS_Redirects.tryResCS(declr, window)
    //     return { declaration: declr.obj, user: user.obj ? user.obj : undefined, nav: "Home" }
    // }, () =>
    // {
    //     CS_Redirects.tryResSR(declr, props)
    //     return { id, declaration: declr.obj, user, nav: "Home" }
    // })

    return { id, nav: "Home" }
}



export default view
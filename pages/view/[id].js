import React, { useState, useEffect } from 'react'
import DeclrView from '../../components/primary/DeclrView'
import { determRendering } from '../../utilsCS/_basic'
import { getClientUser, } from '../../utilsCS/_get'
import { getDeclr } from "../../utilsCS/_declr"
import HomeNavigation from '../../components/layouts/HomeNavigation'

function view (props)                                                            
{
    const { user, declaration, setError } = props;

    return <HomeNavigation><DeclrView
        declaration={declaration}
        user={user}
        setError={setError}
    /></HomeNavigation>
}

view.getInitialProps = async (props) =>
{
    const { id } = props.query;

    const declaration = await getDeclr(id);
    const user = await getClientUser();

    return determRendering(props, () =>
    {
        if (declaration.error) return { error: declaration.error }
        if (user.error) return { error: user.error }

        return { declaration: declaration.obj, user: user.obj }

    }, () =>
    {
        if (declaration.error) return { error: declaration.error }

        return { declaration: declaration.obj, user: props.query.user }
    })

}

export default view
import React, { useState, useEffect } from 'react'
import EditForm from '../../components/primary/EditForm';
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getDeclr, } from "../../utilsCS/_declr"
import { getTags } from '../../utilsCS/_get'
import HomeNavigation from '../../components/layouts/HomeNavigation'


function edit(props)
{
    const { declaration, fullTags, setError } = props;

    const adminCtx = React.useContext(AdminContext);


    useEffect(() =>
    {
        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`)
        }
    }, [])

    return adminCtx && (<HomeNavigation>
        <EditForm
            setError={setError}
            fullTags={fullTags}
            declaration={declaration} />
    </HomeNavigation>)
}

edit.getInitialProps = async (props) =>
{
    const { id } = props.query;

    let declr = await getDeclr(id);
    const fullTags = await getTags()

    if (declr.error) return { error: declr.error }
    if (fullTags.error) return { error: fullTags.error }

    return { declaration: declr.obj, fullTags: fullTags.obj }

}


export default edit
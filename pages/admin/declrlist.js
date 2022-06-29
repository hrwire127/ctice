import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminDeclrs from '../../components/primary/AdminDeclrs'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getDeclrs } from "../../utilsCS/_declr"
import AdminLayout from "../../components/layouts/AdminLayout"

function declrlist(props)
{
    const { setError, declarations } = props
    let adminCtx = useContext(AdminContext);

    useEffect(async () =>
    {
        if (props.isAdmin)
        {
            adminCtx = props.isAdmin
        }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
        }

    }, [])

    return adminCtx ? (<AdminLayout>
        <AdminDeclrs setError={setError} declarations={declarations} />
    </AdminLayout>) : (<></>)
}

declrlist.getInitialProps = async (props) =>
{
    const declrs = await getDeclrs();
    if (declrs.error) return { error: declrs.error }

    return { noHeader: true, declarations: declrs.obj }
}

export default declrlist
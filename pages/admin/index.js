import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminIndex from '../../components/AdminIndex';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getUsers, } from '../../utilsCS/_get'
import { determRendering } from '../../utilsCS/_basic'
import { getDeclrs, } from "../../utilsCS/_declr"
import AdminLayout from "../../components/AdminLayout"

function admin(props)
{
    const { setError, declarations, users } = props

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
        <AdminIndex setError={setError} declarations={declarations} users={users} />
    </AdminLayout>) : (<></>)
}

admin.getInitialProps = async (props) =>
{
    const declarations = await getDeclrs();

    if (declarations.error) return { error: declarations.error }

    return determRendering(props, async () =>
    {
        const users = await getUsers();

        if (users.error) return { error: users.error }

        return { noHeader: true, users: users.obj, declarations: declarations.obj }
    }, () =>
    {
        const { users } = props.query

        return { noHeader: true, users, declarations: declarations.obj }
    })
}

export default admin
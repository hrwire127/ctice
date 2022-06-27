import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminUsers from '../../components/primary/AdminUsers';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getUsers } from '../../utilsCS/_get'
import AdminLayout from "../../components/layouts/AdminLayout"

function userlist(props)
{
    const { setError, users } = props

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
        <AdminUsers setError={setError} users={users} />
    </AdminLayout>) : (<></>)
}

userlist.getInitialProps = async (props) =>
{

    return determRendering(props, async () =>
    {
        const users = await getUsers();

        if (users.error) return { error: users.error }

        return { noHeader: true, users: users.obj }
    }, () =>
    {
        const { users } = props.query

        return { noHeader: true, users }
    })
}

export default userlist
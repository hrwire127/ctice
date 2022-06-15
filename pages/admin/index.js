import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminIndex from '../../components/AdminIndex';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import { getUsers, } from '../../utilsCS/_get'
import { getDeclrs, } from "../../utilsCS/_declr"
import AdminLayout from "../../components/AdminLayout"
import handleError from '../../components/custom/handleError';

const admin = (props) => handleError(props, function (props)
{
    const [users, setUsers] = useState([])
    const [declarations, setDeclarations] = useState([])

    let adminCtx = useContext(AdminContext);

    useEffect(async () =>
    {
        if (props.isAdmin)
        {
            adminCtx = props.isAdmin
        }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }

        const newUsers = await getUsers()
        const newDeclrs = await getDeclrs()
        CS_Redirects.tryResCS(newUsers, window)
        CS_Redirects.tryResCS(newDeclrs, window)
        setUsers(newUsers.obj)
        setDeclarations(newDeclrs.obj)
    }, [])


    return adminCtx ? (<AdminLayout><AdminIndex declarations={declarations} users={users} /></AdminLayout>) : (<></>)
})

admin.getInitialProps = async (props) =>
{
    return { noHeader: true }
}
export default admin
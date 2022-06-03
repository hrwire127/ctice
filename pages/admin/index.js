import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminIndex from '../../components/AdminIndex';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering } from '../../utilsCS/_basic'
import{ getUsers,} from '../../utilsCS/_get'
import { getDeclrs, } from "../../utilsCS/_declr"
import AdminLayout from "../../components/AdminLayout"

function admin(props)
{
    const { users, declarations } = props;

    let adminCtx = useContext(AdminContext);

    useEffect(() =>
    {
        if (props.isAdmin)
        {
            adminCtx = props.isAdmin
        }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
    }, [])


    return adminCtx ? (<AdminLayout><AdminIndex declarations={declarations} users={users} /></AdminLayout>) : (<></>)
}

admin.getInitialProps = async (props) =>
{
    let declrs = await getDeclrs();
    let users = await getUsers()

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declrs, window)
        CS_Redirects.tryResCS(users, window)
        return { users: users.obj, declarations: declrs.obj, noHeader: true }
    }, () =>
    {
        CS_Redirects.tryResSR(declrs, props)
        CS_Redirects.tryResSR(users, props)
        return { users: users.obj, declarations: declrs.obj, noHeader: true }
    })
}
export default admin
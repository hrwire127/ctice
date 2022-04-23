import React, { useEffect} from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminUsers from '../../components/AdminUsers';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getDeclrs, determRendering, getGlobals, getUsers } from '../../utilsCS/_client'
import AdminLayout from "../../components/AdminLayout"

function userlist(props)
{
    const { users } = props;

    let adminCtx = React.useContext(AdminContext);
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


    return adminCtx ? (<AdminLayout><AdminUsers users={users}/></AdminLayout>) : (<></>)
}
userlist.getInitialProps = async (props) =>
{
    let users = await getUsers();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(users, window)
        return { users: users.obj, noHeader: true }
    }, () =>
    {
        CS_Redirects.tryResSR(users)

        let globals = getGlobals(props)
        if (!globals.isAdmin)
        {
            CS_Redirects.Custom_SR(props.res, declrs.redirect)
        }
        return { users: users.obj, ...globals, noHeader: true }
    })
}
export default userlist
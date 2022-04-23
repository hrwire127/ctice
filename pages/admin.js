import React, { useEffect, useState } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { getDeclrs, determRendering, getGlobals, getUsers } from '../utilsCS/_client'
import AdminLayout from "../components/AdminLayout"

function admin(props)
{
    const { users, declarations } = props;

    let admin = React.useContext(AdminContext);
    useEffect(() =>
    {
        if (props.admin)
        {
            admin = props.admin
        }

        if (!admin)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
    }, [])

    return admin && (<Dashboard declarations={declarations} users={users} />) //<===
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
        CS_Redirects.tryResSR(declrs)
        CS_Redirects.tryResSR(users)

        let globals = getGlobals(props)
        if (!globals.admin)
        {
            CS_Redirects.Custom_SR(props.res, declrs.redirect)
        }
        return { users: users.obj, declarations: declrs.obj, ...globals, noHeader: true }
    })
}
export default admin
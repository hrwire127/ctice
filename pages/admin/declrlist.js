import React, { useEffect} from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminDeclrs from '../../components/AdminDeclrs';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getDeclrs, determRendering, getGlobals, getUsers } from '../../utilsCS/_client'
import AdminLayout from "../../components/AdminLayout"

function declrlist(props)
{
    const { declarations } = props;

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


    return adminCtx ? (<AdminLayout><AdminDeclrs declarations={declarations}/></AdminLayout>) : (<></>)
}
declrlist.getInitialProps = async (props) =>
{
    let declrs = await getDeclrs();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(declrs, window)
        return { declarations: declrs.obj, noHeader: true }
    }, () =>
    {
        CS_Redirects.tryResSR(declrs)

        // let globals = getGlobals(props)
        // if (!globals.isAdmin)
        // {
        //     CS_Redirects.Custom_SR(props.res, declrs.redirect)
        // }
        return { declarations: declrs.obj, noHeader: true }
    })
}
export default declrlist
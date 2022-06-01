import React, { useEffect, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminDeclrs from '../../components/AdminDeclrs';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering, timeout } from '../../utilsCS/_basic'
import { getDeclrs } from "../../utilsCS/_declr"
import AdminLayout from "../../components/AdminLayout"
import useLoading from '../../components/hooks/useLoading'

function declrlist(props)
{
    const [declarations, setDeclrs] = useState(props.declarations)

    const [loadingWhile, switchLoading] = useLoading(false)
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

    const onDelete = async (e, id) =>                                                                           
    {
        e.preventDefault();
        loadingWhile(async () =>
        {
            await timeout(500)
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(async () =>
                {
                    CS_Redirects.tryResCS(res, window)
                    const newDeclrs = await getDeclrs() //to do load more
                    CS_Redirects.tryResCS(newDeclrs, window)
                    setDeclrs(newDeclrs.obj)
                })
        })

    }

    return adminCtx ? (<AdminLayout><AdminDeclrs declarations={declarations} switchLoading={switchLoading} onDelete={onDelete} /></AdminLayout>) : (<></>)
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
        CS_Redirects.tryResSR(declrs, props)
        return { declarations: declrs.obj, noHeader: true }
    })
}
export default declrlist
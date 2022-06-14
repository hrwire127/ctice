import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminDeclrs from '../../components/AdminDeclrs';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { getDeclrs } from "../../utilsCS/_declr"
import AdminLayout from "../../components/AdminLayout"

function declrlist(props)
{
    let adminCtx = useContext(AdminContext);
    const [declarations, setDeclarations] = useState([])

    useEffect(async() =>
    {
        if (props.isAdmin)
        {
            adminCtx = props.isAdmin
        }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
        const newDeclrs = await getDeclrs()
        CS_Redirects.tryResCS(newDeclrs, window)
        setDeclarations(newDeclrs.obj)
    }, [])

    return adminCtx ? (<AdminLayout><AdminDeclrs declarations={declarations} /></AdminLayout>) : (<></>)
}
declrlist.getInitialProps = async (props) =>
{
    return { noHeader: true }
}
export default declrlist
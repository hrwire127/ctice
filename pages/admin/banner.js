import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import AdminIndex from '../../components/AdminIndex';
import CS_Redirects from '../../utilsCS/CS_Redirects'
import AdminLayout from "../../components/AdminLayout"
import DocEditor from '../../components/DocEditor.js'

function banner(props)
{
    let adminCtx = useContext(AdminContext);

    useEffect(() =>
    {
        // if (props.isAdmin)
        // {
        //     adminCtx = props.isAdmin
        // }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
        }
    }, [])


    return adminCtx ? (<AdminLayout>
        <DocEditor />
    </AdminLayout>) : (<></>)
}

banner.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default banner
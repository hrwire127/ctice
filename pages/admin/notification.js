import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import AdminLayout from "../../components/layouts/AdminLayout"
import NotifCreate from '../../components/primary/NotifCreate'

function notification (props)
{
    const { setError } = props
    let adminCtx = useContext(AdminContext);

    useEffect(() =>
    {
        // if (props.isAdmin)
        // {
        //     adminCtx = props.isAdmin
        // }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
        }
    }, [])


    return adminCtx ? (<AdminLayout>
        <NotifCreate setError={setError} />
    </AdminLayout>) : (<></>)
}

notification.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default notification
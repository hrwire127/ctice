import React, { useEffect, useContext } from 'react'
import AdminContext from '../../components/context/contextAdmin'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import AdminLayout from "../../components/AdminLayout"
import BannerCreate from '../../components/BannerCreate.js'

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
        <BannerCreate />
    </AdminLayout>) : (<></>)
}

banner.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default banner
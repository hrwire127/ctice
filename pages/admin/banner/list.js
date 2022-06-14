import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../../components/context/contextAdmin'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, timeout } from '../../../utilsCS/_basic'
import { getBanners } from "../../../utilsCS/_get"
import AdminLayout from "../../../components/AdminLayout"
import AdminBanners from "../../../components/AdminBanners"

function bannerlist(props)
{
    const [banners, setBanners] = useState([])
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

        const newBanners = await getBanners()
        CS_Redirects.tryResCS(newBanners, window)
        setBanners(newBanners.obj)
    }, [])


    return adminCtx && (<AdminLayout>
        <AdminBanners banners={banners} />
    </AdminLayout>) 
}

bannerlist.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default bannerlist
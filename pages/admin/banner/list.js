import React, { useEffect, useContext } from 'react'
import AdminContext from '../../../components/context/contextAdmin'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering, timeout } from '../../../utilsCS/_basic'
import { getBanners } from "../../../utilsCS/_get"
import AdminLayout from "../../../components/AdminLayout"
import AdminBanners from "../../../components/AdminBanners"

function bannerlist(props)
{
    const { banners } = props

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


    return adminCtx && (<AdminLayout>
        <AdminBanners banners={banners} />
    </AdminLayout>) 
}

bannerlist.getInitialProps = async (props) =>
{
    let banners = await getBanners();

    return determRendering(props, () =>
    {
        CS_Redirects.tryResCS(banners, window)
        return { banners: banners.obj, noHeader: true }
    }, () =>
    {
        CS_Redirects.tryResSR(banners, props)
        return { banners: banners.obj, noHeader: true }
    })
}

export default bannerlist
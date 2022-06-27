import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../../components/context/contextAdmin'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { getBanners } from "../../../utilsCS/_get"
import AdminLayout from "../../../components/layouts/AdminLayout"
import AdminBanners from "../../../components/primary/AdminBanners"
import Redirects_CS from '../../../utilsCS/CS_Redirects'

function bannerlist(props)
{
    const { setError, banners } = props
    let adminCtx = useContext(AdminContext);

    useEffect(async () =>
    {
        if (props.isAdmin)
        {
            adminCtx = props.isAdmin
        }

        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
        }
    }, [])


    return adminCtx && (<AdminLayout>
        <AdminBanners banners={banners} setError={setError} />
    </AdminLayout>)
}

bannerlist.getInitialProps = async (props) =>
{
    const banners = await getBanners()
    if (banners.error) return { error: banners.error }
    return { noHeader: true, banners: banners.obj }
}

export default bannerlist
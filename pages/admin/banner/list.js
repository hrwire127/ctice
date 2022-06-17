import React, { useEffect, useContext, useState } from 'react'
import AdminContext from '../../../components/context/contextAdmin'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { getBanners } from "../../../utilsCS/_get"
import AdminLayout from "../../../components/AdminLayout"
import AdminBanners from "../../../components/AdminBanners"

function bannerlist (props)
{
    const { setError } = props
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
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
        }

        const newBanners = await getBanners()
        if (newBanners.error) return setError(newBanners.error)
        else setBanners(newBanners)
    }, [])


    return adminCtx && (<AdminLayout>
        <AdminBanners banners={banners} setError={setError} />
    </AdminLayout>)
}

bannerlist.getInitialProps = async (props) =>
{
    return { noHeader: true }
}

export default bannerlist
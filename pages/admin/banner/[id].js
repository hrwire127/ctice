import React, { useState, useEffect } from 'react'
import { getBanner } from '../../../utilsCS/_get'
import AdminContext from '../../../components/context/contextAdmin'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering } from '../../../utilsCS/_basic'
import BannerEdit from '../../../components/BannerEdit'
import AdminLayout from "../../../components/AdminLayout"

function banneredit(props)
{
    const { banner } = props

    const adminCtx = React.useContext(AdminContext);

    useEffect(() =>
    {
        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }
    }, [])

    return adminCtx && (<AdminLayout><BannerEdit banner={banner} /></AdminLayout>)
}

banneredit.getInitialProps = async (props) =>
{
    return determRendering(props, async () =>
    {
        const { id } = props.query
        let banner = await getBanner(id)
        CS_Redirects.tryResCS(banner, window)
        return { banner: banner.obj, noHeader: true }
    }, () =>
    {
        const { banner } = props.query
        return { banner: banner, noHeader: true }
    })
}

export default banneredit
import React, { useState, useEffect } from 'react'
import { getBanner } from '../../../utilsCS/_get'
import AdminContext from '../../../components/context/contextAdmin'
import CS_Redirects from '../../../utilsCS/CS_Redirects'
import { determRendering } from '../../../utilsCS/_basic'
import BannerEdit from '../../../components/BannerEdit'
import AdminLayout from "../../../components/AdminLayout"
import handleError from '../../../components/custom/handleError';

const banneredit = (props) => handleError(props, function (props)
{
    const { id } = props
    const [banner, setBanner] = useState()

    const adminCtx = React.useContext(AdminContext);

    useEffect(async () =>
    {
        if (!adminCtx)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, window)
        }

        const newBanner = await getBanner(id)
        if (newBanner.error) return { error: newBanner.error }
        setBanner(newBanner.obj)
    }, [])

    return adminCtx && (<AdminLayout><BannerEdit banner={banner} /></AdminLayout>)
})

banneredit.getInitialProps = async (props) =>
{
    const { id } = props.query
    return { noHeader: true, id }
}

export default banneredit
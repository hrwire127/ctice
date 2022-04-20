import React, { useEffect } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { strfyDeclrs, parseDeclrs, getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function admin(props)
{
    const declarations = parseDeclrs(props.declarations);
    let admin = React.useContext(AdminContext);
    if (props.admin)
    {
        admin = props.admin
    }

    useEffect(() =>
    {
        if (!admin)
        {
            CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
        }
    }, [])

    return admin && (<Dashboard declarations={declarations} />)
}
admin.getInitialProps = async (props) =>
{
    let res = await getDeclrs();

    return determRendering(props, () =>
    {
        CS_Redirects.tryCS(res)
        return { declarations: strfyDeclrs(res.obj), noHeader: true }
    }, () =>
    {
        CS_Redirects.trySR(res)
        let globals = getGlobals(props)
        if (!globals.admin)
        {
            CS_Redirects.Custom_SR(props.res, res.redirect)
        }
        return { declarations: strfyDeclrs(res.obj), ...globals, noHeader: true }
    })
}
export default admin
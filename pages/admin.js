import React, { useEffect } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';
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
            window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/error` //separate admin + create
        }
    }, [])

    return admin && (<Dashboard declarations={declarations} />)
}
admin.getInitialProps = async (props) =>
{
    let res = await getDeclrs();

    let globals = []
    if (props.req)
    {
        if (res.type === "Error")
        {
            props.req.session.error = res.error;
            props.res.redirect(res.redirect) //separate client redirects
        }
        globals = getGlobals(props)
        if (!globals.admin)
        {
            props.res.redirect(res.redirect)
        }
    }
    if (res.type === "Error")
    {
        window.location = res.redirect
    }
    return { declarations: strfyDeclrs(res.obj), ...globals, noHeader: true }

    // return determRendering(props, () =>
    // {
    //     if (res.type === "Error")
    //     {
    //         window.location = res.redirect
    //     }
    //     else
    //     {
    //         return { declarations: res.obj, noHeader: true }
    //     }
    // }, () =>
    // {
    //     if (res.type === "Error")
    //     {
    //         props.req.session.error = res.error;
    //         props.res.redirect(res.redirect) //separate client redirects
    //     }
    //     else 
    //     {
    //         let globals = getGlobals(props)
    //         if(!globals.admin)
    //         {
    //             props.res.redirect(res.redirect)
    //         }
    //         return { declarations: res.obj,  ...globals, noHeader: true}
    //     }
    // })
}
export default admin
import React, { useEffect } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';
import { getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function admin(props)
{
    console.log(props)
    const { declarations } = props;
    // let admin = React.useContext(AdminContext);
    // admin = props.admin ? true : admin
    // if (props.admin)
    // {
    //     admin = props.admin
    // }

    // useEffect(() =>
    // {
    //     if (!admin)
    //     {
    //         window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/error` //separate admin + create
    //     }
    // }, [])

    return (<Dashboard declarations={declarations} />)
}
admin.getInitialProps = async (props) =>
{
    let res = await getDeclrs();
    return determRendering(props, () =>
    {
        if (res.type === "Error")
        {
            window.location = res.redirect
        }
        else
        {
            return { declarations: res.obj, noHeader: true }
        }
    }, () =>
    {
        if (res.type === "Error")
        {
            props.req.session.error = res.error;
            props.res.redirect(res.redirect) //separate client redirects
        }
        else 
        {
            let globals = getGlobals(props)
            if(!globals.admin)
            {
                props.res.redirect(res.redirect)
            }
            return { declarations: res.obj,  ...globals, noHeader: true}
        }
    })
}
export default admin
import React, { useEffect } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';
import { getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function admin(props)
{
    const { declarations } = props;
    let admin = React.useContext(AdminContext);
    if (props.admin)
    {
        admin = props.admin
    }

    useEffect(() =>
    {
        if (!admin)
        {
            window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/error`
        }
    }, [])

    return (<>
        {admin && (
            <Dashboard declarations={declarations} />
        )}
    </>)
}
admin.getInitialProps = async (props) =>
{
    const res = await getDeclrs();
    return determRendering(props, () =>
    {
        if (res.type === "Error")
        {
            window.location = res.redirect
        }
        else
        {
            return { declarations: res.obj }
        }
    }, () =>
    {
        if (res.type === "Error")
        {
            props.req.session.error = res.error;
            props.res.redirect(res.redirect)
        }
        else 
        {
            return { declarations: res.obj, ...getGlobals(props) }
        }
    })
}
export default admin
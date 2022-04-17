import React, { useEffect } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';

function admin(props)
{
    const { declarations } = props;
    let admin = React.useContext(AdminContext);
    if (props.admin)
    {
        admin = props.admin
    }
    console.log(admin)

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
    const admin = props.query.admin
    const declarations = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            if (res.type === "Error")
            {
                context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else if (res.type === "Login")
            {
                window.location = res.redirect
            }
            else 
            {
                return res.obj;
            }
        })
    if (declarations)
    {
        return { admin, noHeader: true, declarations }
    }
}
export default admin
import React, { useEffect } from 'react'
import AdminContext from '../components/context/contextAdmin'
import Dashboard from '../components/Dashboard';

function admin(props)
{
    let admin = React.useContext(AdminContext);
    if(props.admin)
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
            <Dashboard />
        )}
    </>)
}
admin.getInitialProps = (props) =>
{
    const admin = props.query.admin
    return { admin, noHeader: true }
}
export default admin
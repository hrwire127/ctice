import React, { useEffect } from 'react'
import AdminContext from '../components/context/adminContext'

function admin()
{
    const admin = React.useContext(AdminContext);
    useEffect(() =>
    {
        if (!admin)
        {
            window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/error`
        }
    }, [])

    return (<>
        {admin && (
            <div>admin!</div>
        )}
    </>)
}

export default admin
import React, { useEffect, useState, useContext } from 'react'
import CreateForm from "../components/primary/CreateForm"
import AdminContext from '../components/context/contextAdmin'
import CS_Redirects from '../utilsCS/CS_Redirects'
import useAlertMsg from '../components/hooks/useAlertMsg'
import HomeNavigation from '../components/layouts/HomeNavigation'

function create (props)
{
    const { setError } = props
    const [setAlertMsg, alert, setAlert] = useAlertMsg()

    let adminCtx = useContext(AdminContext);

    useEffect(() =>
    {
        if (!adminCtx) CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`)
    }, [])

    return adminCtx && (<HomeNavigation>
        <CreateForm
            setError={setError}
            setAlert={setAlert}
            alert={alert}
            setAlertMsg={setAlertMsg}
        />
    </HomeNavigation>)
}

export default create
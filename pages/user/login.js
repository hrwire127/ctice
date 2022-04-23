import React, { useState } from 'react'
import Login from '../../components/Login'
import CS_Redirects from '../../utilsCS/CS_Redirects'
import { determRendering, getGlobals } from '../../utilsCS/_client'


function login(props)
{
    const [alert, setAlert] = useState()

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }

    const handleSubmit = async (body) =>
    {
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/login`, {
            method: 'POST',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                CS_Redirects.tryResCS(res, window);
                if (res.err) setError(res.err.message)
            })
    };

    return (
        <Login handleSubmit={handleSubmit} alert={alert} />
    )
}

login.getInitialProps = async (props) =>
{
    return {}
}


export default login

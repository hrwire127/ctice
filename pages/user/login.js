import React, { useState } from 'react'
import Login from '../../components/Login'
// import { UserContext } from '../../components/context/contextUser'


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
                if (res.type === "Home" || res.type === "Error")
                {
                    window.location = res.redirect
                }
                else 
                {
                    setError(res.err.message)
                }
            })
    };

    return (
        <Login handleSubmit={handleSubmit} alert={alert} />
    )
}


export default login

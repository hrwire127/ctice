import React, { useState } from 'react'
import Login from '../../components/Login'
import { UserContext } from '../../components/context/currentUser'

function login(props)
{
    const [alert, setAlert] = useState()
    const { changeUser } = props;

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
                if (res.confirm === "Success")
                {
                    window.location = res.redirect
                }
                else if (res.err)
                {
                    setError(res.err.message)
                    console.log(res)
                }
            })
    };

    return (
        <Login handleSubmit={handleSubmit} alert={alert} />
    )
}


export default login
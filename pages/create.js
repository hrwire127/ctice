import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import UserContext from '../components/context/currentUser'
import { Typography } from '@mui/material'


function create(props)
{
    const user = React.useContext(UserContext);

    const [alert, setAlert] = useState()

    const setError = (msg) => 
    {
        setAlert(msg)
        setTimeout(() =>
        {
            setAlert()
        }, 9000);
    }


    useEffect(() =>
    {
        if (!user)
        {
            window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/user/login`
        }
    }, [])

    const handleSubmit = async (body) =>
    {
        await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
            method: 'POST',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                if (res.type === "Home" || res.type === "Error" || res.type === "Login")
                {
                    window.location = res.redirect
                }
                else if (res.type === "Api")
                {
                    setError(res.obj.err.message)
                }
            })
    };
    return (<>
        {user && (
            <CreateForm handleSubmit={handleSubmit} alert={alert} />
        )}
    </>)
}

export default create

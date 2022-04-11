import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import { UserContext } from '../components/context/currentUser'
import { Typography } from '@mui/material'

function create(props)
{
    const { user } = props;

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
        if(!user) {
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
                if (res.type === "Client" || res.type === "Error" || res.type === "ClientAuth")
                {
                    window.location = res.redirect
                }
                else if (res.type === "Api")
                {
                    setError(res.obj.err.message)
                }
            })
    };
    return ( 
        <UserContext.Consumer >
            {value => value && (
                <CreateForm handleSubmit={handleSubmit} alert={alert}/> 
            )}
        </UserContext.Consumer>
    )
}

export default create


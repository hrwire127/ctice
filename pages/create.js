import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import { UserContext } from '../components/context/currentUser'
import { Typography } from '@mui/material'

function create(props)
{
    const { user } = props;

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
                if (res.confirm === "Success" || res.confirm === "Error")
                {
                    window.location = res.redirect
                }
            })
    };
    return ( 
        <UserContext.Consumer >
            {value => value && (
                <CreateForm handleSubmit={handleSubmit} /> 
            )}
        </UserContext.Consumer>
    )
}

export default create


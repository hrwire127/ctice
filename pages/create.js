import React, { useEffect, useState } from 'react'
import CreateForm from "../components/CreateForm"
import Link from 'next/link'
import UserContext from '../components/context/contextUser'
import { Typography } from '@mui/material'


function create(props)
{
    let user = React.useContext(UserContext);
    if (props.user)
    {
        user = props.user
    }

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

create.getInitialProps = (props) =>
{
    const user = props.query.user
    return { user }
}

export default create

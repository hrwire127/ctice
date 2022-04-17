import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import UserContext from '../../components/context/contextUser'


function edit(props)
{
    const { declaration } = props;
    const { _id } = declaration;


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
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${_id}`, {
            method: 'PUT',
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

    return (
        <>
            {user && (
                <EditForm handleSubmit={handleSubmit} declaration={declaration} alert={alert} />
            )}
        </>
    )
}

edit.getInitialProps = async (context) =>
{
    const { id } = context.query;

    const declaration = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/edit/${id}/api`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { secret: process.env.NEXT_PUBLIC_SECRET }
        )
    }).then(response => response.json())
        .then(async res =>
        {
            if (res.type === "Error")
            {
                if (context.req) context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else if (res.type === "Login")
            {
                window.location = res.redirect
            }
            else 
            {
                return res.obj;
            }
        })
    if (declaration)
    {
        return { declaration }
    }
}


export default edit



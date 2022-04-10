import React, { useState, useEffect } from 'react'
import EditForm from '../../components/EditForm';
import {UserContext} from '../../components/context/currentUser'

function edit(props)
{
    const { user, declaration } = props;
    const { _id } = declaration;

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
                if (res.confirm === "Success" || res.confirm === "Error")
                {
                    window.location = res.redirect
                }
            })
    };

    return (
        <UserContext.Consumer >
            {value => value && (
                <EditForm handleSubmit={handleSubmit} declaration={declaration}/>
            )}
        </UserContext.Consumer>
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
            if (res.confirm === "Success")
            {
                if (context.req) context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else if (res.confirm === "Error")
            {
                window.location = res.redirect
            }
            else
            {
                return res;
            }
        })
    if (declaration)
    {
        return { declaration }
    }
}


export default edit



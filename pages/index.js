import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
// import { UserContext } from '../components/context/currentUser'

function index(props)
{
    const { declarations, flash, changeUser, isUser } = props;

    if (isUser)
    {
        useEffect(() =>
        {
            changeUser(isUser)
        }, [isUser])
    }

    return (
        <DeclrList declarations={declarations} flash={flash} />
    )
}

index.getInitialProps = async (context) =>
{
    const flash = context.res ? context.res.locals.flash[0] : undefined
    let isUser;
    if (context.res)
    {
        isUser = context.req.isAuthenticated()
    }
    if (context.res) 
    {
        context.res.locals.flash = []
    }
    const declarations = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/api`, {
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
                context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else if (res.type === "Auth")
            {
                window.location = res.redirect
            }
            else 
            {
                return res.obj;
            }
        })
    if (declarations)
    {
        return { declarations, flash, isUser }
    }
}


export default index
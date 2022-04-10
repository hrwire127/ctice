import React, { useEffect, useState, useRef } from 'react'
import DeclrList from '../components/DeclrList';
import { UserContext } from '../components/context/currentUser'

function index(props)
{
    const { declarations, flash, user, changeUser, newUser } = props;

    console.log(user)

    useEffect(() =>
    {
        console.log("NNN")
        changeUser(newUser)
    }, [newUser])

    return (
        <UserContext.Consumer >
            {value => (
                    <DeclrList declarations={declarations} flash={flash} user={value} />
                ) 
            }
        </UserContext.Consumer>
    )
}

index.getInitialProps = async (context) =>
{
    const flash = context.res ? context.res.locals.flash[0] : undefined
    let newUser = true;
    if (context.res)
    {
        newUser = context.req.isAuthenticated()
    }
    if (context.res) 
    {
        context.res.locals.flash = []
    }
    const declarations = await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/get`, {
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
                context.req.session.error = res.error;
                context.res.redirect(res.redirect)
            }
            else
            {
                return res;
            }
        })

    return { declarations, flash, newUser }
}


export default index
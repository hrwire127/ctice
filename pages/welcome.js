import React from 'react'
import Welcome from '../components/Welcome'
import { isToken, determRendering, getGlobals } from '../utilsCS/_client'

function welcome(props)
{
    const { confirmationCode } = props;

    const handleSubmit = async (body) =>
    {
        body.append("confirmationCode", confirmationCode)
        await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/user/confirm`, {
            method: 'POST',
            body: body,
        }).then(response => response.json())
            .then(async res =>
            {
                if (res.type === "Home" || res.type === "Error")
                {
                    window.location = res.redirect
                }
            })
    };
    return (
        <Welcome handleSubmit={handleSubmit} />
    )
}

welcome.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        window.location = process.env.NEXT_PUBLIC_DR_HOST
    }, () =>
    {
        const { confirmationCode } = props.query;

        return isToken(confirmationCode, () =>
        {
            return { confirmationCode, ...Object.values(getGlobals()) }
        }, props.res)
    })
}

export default welcome
import React from 'react'
import Welcome from '../components/Welcome'

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
                if (res.type === "Home" || res.type === "Error" )
                {
                    window.location = res.redirect
                }
            })
    };
    return (
        <Welcome handleSubmit={handleSubmit}/>
    )
}

welcome.getInitialProps = async (props) =>
{
    if (props.query.confirmationCode)
    {
        return { confirmationCode: props.query.confirmationCode }
    }
    else
    {
        window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/user/login`
    }
}

export default welcome
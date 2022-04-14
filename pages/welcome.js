import React from 'react'
import Welcome from '../components/Welcome'

function welcome()
{

    return (
        <Welcome />
    )
}

welcome.getInitialProps = async (ctx) =>
{
    if (ctx.req)
    {
        return { none: 0 }
    }
    else
    {
        window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/user/login`
    }
}

export default welcome
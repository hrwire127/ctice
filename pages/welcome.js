import React from 'react'
import Welcome from '../components/Welcome'

function welcome()
{

    return (
        <Welcome />
    )
}

welcome.getInitialProps = async (props) =>
{
    if (props.query.confirmationCode)
    {
        return { none: 0 }
    }
    else
    {
        window.location = `${process.env.NEXT_PUBLIC_DR_HOST}/user/login`
    }
}

export default welcome
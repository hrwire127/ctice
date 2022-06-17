import React, { useState } from 'react'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering } from '../utilsCS/_basic'
import Welcome from '../components/Welcome'
import HomeNavigation from '../components/HomeNavigation'

function welcome (props)
{
    const { confirmationCode, setError } = props;

    return <HomeNavigation>
        <Welcome confirmationCode={confirmationCode} setError={setError} />
    </HomeNavigation>
}

welcome.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(process.env.NEXT_PUBLIC_DR_HOST)
        return {}
    }, () =>
    {
        const { confirmationCode } = props.query;

        return { confirmationCode}
    })
}
export default welcome
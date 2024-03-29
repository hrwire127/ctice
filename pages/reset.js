import React, { useState } from 'react'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { timeout, determRendering } from '../utilsCS/_basic'
import Reset from '../components/primary/Reset'
import HomeNavigation from '../components/layouts/HomeNavigation'

function reset(props)
{
    const { confirmationCode, setError } = props;

    return <HomeNavigation>
        <Reset setError={setError} confirmationCode={confirmationCode} />
    </HomeNavigation>
}

reset.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(process.env.NEXT_PUBLIC_DR_HOST)
        return {}
    }, () =>
    {
        const { confirmationCode } = props.query;
        return { confirmationCode }
    })
}

export default reset
import React, { useState } from 'react'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { timeout, determRendering } from '../utilsCS/_basic'
import useLoading from '../components/hooks/useLoading'
import Reset from '../components/Reset'
import Rules from "../utilsCS/clientRules"

function reset(props)
{
    const { confirmationCode } = props;
    return switchLoading(2, () => <Reset confirmationCode={confirmationCode}/>)
}

reset.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(process.env.NEXT_PUBLIC_DR_HOST, window)
        return {}
    }, () =>
    {
        const { confirmationCode } = props.query;
        return { confirmationCode }
    })
}

export default reset
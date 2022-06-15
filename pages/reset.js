import React, { useState } from 'react'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { timeout, determRendering } from '../utilsCS/_basic'
import useLoading from '../components/hooks/useLoading'
import Reset from '../components/Reset'
import handleError from '../components/custom/handleError';

const reset = (props) => handleError(props, function (props)
{
    const { confirmationCode } = props;
    return switchLoading(2, () => <Reset confirmationCode={confirmationCode} />)
})

reset.getInitialProps = async (props) =>
{
    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(process.env.NEXT_PUBLIC_DR_HOST, window)
        return {}
    }, () =>
    {
        const { confirmationCode } = props.query;
        return { confirmationCode, nav: "Home" }
    })
}

export default reset
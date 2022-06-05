import React, { useState } from 'react'
import CS_Redirects from '../utilsCS/CS_Redirects'
import { determRendering } from '../utilsCS/_basic'
import Welcome from '../components/Welcome'

function welcome(props)
{
    const { confirmationCode } = props;

    return <Welcome confirmationCode={confirmationCode}/>
}

welcome.getInitialProps = async (props) =>
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
export default welcome
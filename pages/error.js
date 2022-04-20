import React from 'react'
import ErrorPage from '../components/ErrorPage';
import CS_Redirects from '../utilsCS/CS_Redirects'
import { strfyDeclrs, parseDeclrs, getDeclrs, determRendering, getGlobals } from '../utilsCS/_client'

function error(props)
{
    const { status, message } = props.error;

    return (
        <ErrorPage status={status} message={message} />
    )
}

error.getInitialProps = (props) =>
{
    const { error } = props.query

    return determRendering(props, () =>
    {
        CS_Redirects.Custom_CS(`${process.env.NEXT_PUBLIC_DR_HOST}/error`, window)
    }, () =>
    {
        let globals = getGlobals(props)
        return { error, ...globals}
    })
}

export default error 
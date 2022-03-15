import React from 'react'
import ErrorPage from '../components/ErrorPage';


function error(props)
{
    const { status, message } = props.error;
    return (
        <ErrorPage status={status} message={message}  />
    )
}

error.getInitialProps = (props) =>
{
    const { error } = props.query
    return { error }
}

export default error
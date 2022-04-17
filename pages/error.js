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
    let admin = false;
    if (context.res)
    {
        if(context.req.session.passport)
        {
            admin = context.req.session.passport.user === process.env.NEXT_PUBLIC_ADMIN_USERNAME
        }
    }
    return { error, admin }
}

export default error 
import React from 'react'
import ErrorPage from '../components/ErrorPage'

function custom404(props) 
{
    let globals = getGlobals(props)
    return (
        <ErrorPage status={404} message="Page Not Found" />
    )
}

export default custom404
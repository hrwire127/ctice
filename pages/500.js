import React from 'react'
import ErrorPage from '../components/ErrorPage'

function custom404(props) 
{
    return (
        <ErrorPage status={500} message="Something went wrong" />
    )
}

export default custom404